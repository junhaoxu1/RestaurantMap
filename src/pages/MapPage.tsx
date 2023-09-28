import { useLoadScript } from "@react-google-maps/api"
import Map from "../components/Map"
import useGetCollection from "../hooks/useGetCollection"
import { Restaurant } from "../types/restaurants.types"
import { restaurantsCol } from "../services/firebase"
import { useEffect, useMemo, useRef, useState } from "react"
import RestaurantListItem from "../components/RestaurantListItem"
import PlacesAutoComplete from "../components/PlacesAutoComplete"
import RestaurantsFilter from "../components/RestaurantsFilter"
import { useSearchParams } from "react-router-dom"
import { getLocationWithLatLng } from "../services/Geocode"
import { LatLng } from "use-places-autocomplete"
import { getDistanceFromLatLngInKm } from "../helpers/getDistance"
import useGetFilteredData from "../hooks/useGetFilteredData"
import { update } from "firebase/database"
const MYMAPSKEY = import.meta.env.VITE_APP_GOOGLE_KEY

const MapPage = () => {
    // where map will be centered around on reload
    const center = useMemo(() => ({ lat: 55.6053, lng: 13.0041 }), [])

    const mapReference = useRef<google.maps.Map | null>(null)

    const {
        data: restaurants,
        error: restaurantsError,
        loading: restaurantsLoading,
        getData: getRestaurants,
    } = useGetCollection<Restaurant>(restaurantsCol)
    const [filteredData, setFilteredData] = useState<Restaurant[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [coordinates, setCoordinates] = useState({} as { lat: number; lng: number })
    const [currentCity, setCurrentCity] = useState<string | null>(null)
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>({} as Restaurant)
    const [filterType, setFilterType] = useState("")
    const [filter, setFilter] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [searchParams, setSearchParams] = useSearchParams({})

    // extract data from url
    const selectedCoords = { lat: Number(searchParams.get("lat")), lng: Number(searchParams.get("lng")) }
    const selectedCity = searchParams.get("city")
    const selectedFilter = searchParams.get("filter")
    const selectedFilterType = searchParams.get("filter_type")
    const selectedSort = searchParams.get("sort")
    const {
        data: filteredRestaurants,
        getData: getFilteredRestaurants,
        setData: setFilteredRestaurants,
        loading: filteredRestaurantsLoading,
    } = useGetFilteredData<Restaurant>(restaurantsCol, selectedFilterType ?? "", selectedFilter ?? "")

    // Loading Google Maps by using useLoadScript hook and libary places,
    // it also used to determine when API is fully loaded.
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MYMAPSKEY,
        libraries: ["places"],
    })

    // return updated reference with current map for interacting with google maps
    const onMapLoadInstance = (map: google.maps.Map): void => {
        mapReference.current = map
    }

    const onUnMount = (): void => {
        mapReference.current = null
    }

    // When a marker is clicked, show information about the restaurant
    const showRestaurantsInfo = (marker: Restaurant) => setSelectedRestaurant(marker)

    // Shows information about the restaurant if list item is clicked
    const displayOnMap = (restaurant: Restaurant) => {
        if (!mapReference.current) return
        showRestaurantsInfo(restaurant)
        mapReference.current.panTo({ lat: restaurant.geolocation.lat, lng: restaurant.geolocation.lng })
    }

    const getTownName = async (coordinates: LatLng) => {
        setError(null)
        try {
            const location = await getLocationWithLatLng(coordinates)

            // find which index has type "postal_town"
            const index = location.results.map((location) => location.types).findIndex((result) => result.includes("postal_town"))

            const city = location.results[index].address_components[0].long_name
            return city
        } catch (err: any) {
            setError(err.message)
        }
    }

    // converts coordinates to a town name
    const setUrlParams = async (coordinates: LatLng, filter_type: string = "", filter: string = "", sort: string = "") => {
        setError(null)
        try {
            const city = await getTownName(coordinates)
            if (!city) return
            setSearchParams({ lat: String(coordinates.lat), lng: String(coordinates.lng), city: city, filter, filter_type, sort })
            setCurrentCity(city)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const onSearch = async (city: string) => {
        setError(null)
        try {
            // update states, get town name and look for restaurants in the same town
            setFilterType("city")
            setFilter(city ?? "")
            setError(null)
            // call function to get data according to current filters
            await getFilteredRestaurants(selectedFilterType ?? "", selectedFilter ?? "")

            // if (!restaurantsInArea) return
            setFilteredData(filteredRestaurants ?? restaurants)
        } catch (err: any) {
            setError(err.message)
        }
    }

    // function for togglePosition
    const togglePosition = async (coordinates: LatLng) => {
        setCoordinates(coordinates)
        if (selectedFilter === selectedCity) {
            // reset states and return
            setFilter("")
            setFilterType("")
            setError(null)
            await getRestaurants()
            setFilteredRestaurants(null)
            return
        }

        try {
            // update states, get town name and look for restaurants in the same town
            setFilterType("city")
            setFilter(selectedCity ?? "")
            setError(null)
            // call function to get data according to current filters
            await getFilteredRestaurants(selectedFilterType ?? "", selectedFilter ?? "")

            // if (!restaurantsInArea) return
            setFilteredData(filteredRestaurants ?? restaurants)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const toggleCategory = async (field: string, value: string) => {
        setError(null)
        // if filter is already selected, unset filter and show all
        if (selectedFilter === value) {
            // reset filter and filter type
            setFilter("")
            setFilterType("")
            // get all restaurants
            await getRestaurants()
            // set filtered data to null, since we don't have any
            setFilteredRestaurants(null)
            return
        }

        try {
            setFilterType(field)
            setFilter(value)
            await getFilteredRestaurants(field ?? "", value ?? "")
            console.log("field:", field)
            console.log("value:", value)

            setFilteredData(filteredRestaurants)
            console.log("filtered data:", filteredData)
        } catch (err: any) {
            console.log("caught error", err.message)
        }

        // if (sortBy === "distance") {
        //     const updatedData = filteredRestaurants.map((restaurant) => {
        //         return {
        //             ...restaurant,
        //             distance: getDistanceFromLatLngInKm(restaurant.geolocation.lat, restaurant.geolocation.lng, coordinates.lat, coordinates.lng),
        //         }
        //     })

        //     const sortedData = updatedData.sort(function (a, b) {
        //         if (a.distance < b.distance) {
        //             return -1
        //         }
        //         if (a.distance > b.distance) {
        //             return 1
        //         }
        //         return 0
        //     })
        //     setFilteredData(sortedData)
        //     setFilter(category)
        //     return
        // }

        // if (sortBy === "name_asc") {
        //     const sortedData = filteredRestaurants.sort(function (a, b) {
        //         if (a.name < b.name) {
        //             return -1
        //         }
        //         if (a.name > b.name) {
        //             return 1
        //         }
        //         return 0
        //     })
        //     setFilteredData(sortedData)
        //     setFilter(category)
        //     setCurrentData(sortedData)
        //     return
        // }

        // if (sortBy === "name_dsc") {
        //     const sortedData = filteredRestaurants.sort(function (a, b) {
        //         if (a.name > b.name) {
        //             return -1
        //         }
        //         if (a.name < b.name) {
        //             return 1
        //         }
        //         return 0
        //     })
        //     setFilteredData(sortedData)
        //     setFilter(category)
        //     setCurrentData(sortedData)
        //     return
        // }
    }

    // sorts the data and returns it in the chosen order
    const toggleSortByName = (sort: string) => {
        setError(null)
        // decide on which data to sort
        const dataToSort = filteredData ? filteredData : data
        // return if data is null
        if (!dataToSort) return setError("Could not sort restaurants by name...")

        // create a deep copy of the array before being sorted, so when "undoing" the sorting
        // we can set it back to right as it was
        const deepCopy = JSON.parse(JSON.stringify(dataToSort))

        if (sortBy === sort) {
            setSortBy("")
            console.log("supposed to set original array")
            setFilteredData(deepCopy)
            return
        }

        if (sort === "name_dsc") {
            const sortedData = dataToSort.sort(function (a, b) {
                if (a.name > b.name) {
                    return -1
                }
                if (a.name < b.name) {
                    return 1
                }
                return 0
            })
            setFilteredData(sortedData)
            setSortBy("name_dsc")
            return
        }

        if (sort === "name_asc") {
            const sortedData = dataToSort.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1
                }
                if (a.name > b.name) {
                    return 1
                }
                return 0
            })
            setFilteredData(sortedData)
            setSortBy("name_asc")
            return
        }
    }

    const toggleSortByDistance = (sort: string) => {
        setError(null)

        const dataToSort = filteredData ? filteredData : data

        console.log("sort:", sort)
        console.log("sortBy:", sortBy)

        if (sortBy === sort) {
            setSortBy("")
            setFilteredData(dataToSort)
            return
        }

        if (!dataToSort) return setError("Could not filter by distance")

        const updatedData = dataToSort.map((restaurant) => {
            return {
                ...restaurant,
                distance: Number(
                    getDistanceFromLatLngInKm(restaurant.geolocation.lat, restaurant.geolocation.lng, coordinates.lat, coordinates.lng)
                ).toFixed(2),
            }
        })

        const sortedData = updatedData.sort(function (a, b) {
            // convert strings to numbers before comparasion
            const distanceA = parseFloat(a.distance)
            const distanceB = parseFloat(b.distance)

            if (distanceA < distanceB) {
                return -1
            }
            if (distanceA > distanceB) {
                return 1
            }
            return 0
        })

        if (!sortedData) return setError("Could not filter by distance")

        setSortBy("distance")
        setFilteredData(sortedData)
    }

    const updateData = async () => {
        setFilteredData(null)
        try {
            setFilterType(selectedFilterType ?? "")
            setFilter(selectedFilter ?? "")
            await getFilteredRestaurants(filterType ?? "", filter ?? "")
            setFilteredData(filteredRestaurants)
        } catch (err: any) {
            console.log("could not update data...")
        }
    }

    // get the users location on render
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude })
            setUrlParams({ lat: latitude, lng: longitude })
            return
        })
        // if user doesn't share position, default to school
        setCoordinates({ lat: 55.606972, lng: 13.02106 })
        setSearchParams({ lat: String(55.606972), lng: String(13.02106) })
    }, [])

    // sets updated states in search params
    useEffect(() => {
        setUrlParams(coordinates, filterType, filter, sortBy)
    }, [coordinates, filter, filterType, sortBy])

    // moves map according to latlng from search params
    useEffect(() => {
        if (!mapReference.current) return

        mapReference.current.panTo(selectedCoords)
    }, [selectedCoords])

    useEffect(() => {
        if (selectedFilter !== "" && selectedFilterType !== "") {
            updateData()
        } else {
            getRestaurants()
            setFilteredData(null)
        }
    }, [selectedFilter, selectedFilterType])

    if (!restaurants) return

    return (
        <>
            <div className="map-page-container">
                <div className="mt-3 filter-list-container">
                    {restaurantsLoading && <p>Loading data...</p>}
                    <PlacesAutoComplete onSearch={onSearch} setCoordinates={setCoordinates} />

                    <RestaurantsFilter
                        toggleSortByDistance={toggleSortByDistance}
                        toggleSortByName={toggleSortByName}
                        filter={filter}
                        togglePosition={() => {
                            navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
                                setCoordinates({ lat: latitude, lng: longitude })
                                togglePosition({ lat: latitude, lng: longitude } ?? "")
                            })
                        }}
                        toggleCategory={toggleCategory}
                    />

                    {filteredData?.length !== undefined && filteredData?.length > 0 && filter === "near_me" && (
                        <p>Showing restaurants in your area!</p>
                    )}
                    {filteredData?.length !== undefined && filteredData?.length > 0 && filter && filter !== "near_me" && (
                        <p>
                            Showing {filter ? <span style={{ fontWeight: "bold" }}>{selectedFilter}s</span> : "Showing all restaurants"} in:{" "}
                            {currentCity}
                        </p>
                    )}
                    {restaurants.length > 0 && !filteredData && <p>Showing all restaurants</p>}
                    {filteredData?.length === 0 && <p>No restaurants matching current filter</p>}
                    {!restaurantsLoading && !filteredRestaurantsLoading && (
                        <RestaurantListItem coordinates={coordinates} displayOnMap={displayOnMap} restaurants={filteredRestaurants ?? restaurants} />
                    )}
                </div>
                <section className="map-page">
                    <Map
                        onMapLoadInstance={onMapLoadInstance}
                        onUnMount={onUnMount}
                        center={center}
                        coordinates={selectedCoords}
                        setCoordinates={setCoordinates}
                        restaurants={filteredRestaurants ?? restaurants}
                        showRestaurantsInfo={showRestaurantsInfo}
                        selectedRestautant={selectedRestaurant}
                        setSelectedRestaurant={setSelectedRestaurant}
                    />
                </section>
            </div>

            {restaurantsError && <p>Something went wrong: {restaurantsError}</p>}
            {error && <p>{error}</p>}
        </>
    )
}

export default MapPage
