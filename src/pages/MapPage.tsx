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
const MYMAPSKEY = import.meta.env.VITE_APP_GOOGLE_KEY

const MapPage = () => {
    // where map will be centered around on reload
    const center = useMemo(() => ({ lat: 55.6053, lng: 13.0041 }), [])

    const mapReference = useRef<google.maps.Map | null>(null)

    const { data, error: dataError, loading } = useGetCollection<Restaurant>(restaurantsCol)
    const [error, setError] = useState<string | null>(null)
    const [coordinates, setCoordinates] = useState({} as { lat: number; lng: number })
    const [currentCity, setCurrentCity] = useState<string | null>(null)
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>({} as Restaurant)
    const [filter, setFilter] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("")
    const [filteredData, setFilteredData] = useState<Restaurant[] | null>(null)
    const [searchParams, setSearchParams] = useSearchParams({
        lat: "",
        lng: "",
    })

    // extract data from url
    // const selectedLatlng = { lat: Number(searchParams.get("lat")), lng: Number(searchParams.get("lng")) }
    // const selectedCity = searchParams.get("city")
    // const selectedFilter = searchParams.get("filter")
    // const selectedSort = searchParams.get("sort")

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
    const setUrlParams = async (coordinates: LatLng, filter: string, sort: string = "") => {
        setError(null)
        try {
            const city = await getTownName(coordinates)
            if (!city) return
            setSearchParams({ lat: String(coordinates.lat), lng: String(coordinates.lng), city: city, filter: filter, sort })
            setCurrentCity(city)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const onSearch = (city: string) => {
        setError(null)
        setFilter("")
        // filter only the restaurants that is located in the selected city
        const restaurantsInArea = data?.filter((restaurant) => restaurant.city.toLowerCase() === city.toLowerCase())
        console.log("restaurants in area:", restaurantsInArea)

        // if no restaurants matches filter, return
        if (!restaurantsInArea) return setError("Could not find restaurants for searched location")

        setFilteredData(restaurantsInArea)
    }

    // function for togglePosition
    const togglePosition = async (coordinates: LatLng) => {
        if (filter === "near_me") {
            // reset states and return
            setFilter("")
            setError(null)
            setFilteredData(null)
            return
        }

        // update states, get town name and look for restaurants in the same town
        setFilter("near_me")
        setError(null)
        try {
            const city = await getTownName(coordinates)
            if (!city) return
            const restaurantsInArea = data?.filter((restaurant) => restaurant.city.toLowerCase() === city.toLowerCase())

            if (!restaurantsInArea) return
            setFilteredData(restaurantsInArea)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const toggleCategory = async (category: string) => {
        setError(null)
        if (filter === category) {
            // if filter is already selected, unset filter and show all
            setFilter("")
            setFilteredData(null)
            return
        }

        // filter only the restaurants that matches the selected filter
        const filteredRestaurants = data?.filter((restaurant) => restaurant.category.toLowerCase() === category.toLowerCase())

        if (!filteredRestaurants) return setError("Could not filter restaurants")

        if (sortBy === "distance") {
            const updatedData = filteredRestaurants.map((restaurant) => {
                return {
                    ...restaurant,
                    distance: getDistanceFromLatLngInKm(restaurant.geolocation.lat, restaurant.geolocation.lng, coordinates.lat, coordinates.lng),
                }
            })

            const sortedData = updatedData.sort(function (a, b) {
                if (a.distance < b.distance) {
                    return -1
                }
                if (a.distance > b.distance) {
                    return 1
                }
                return 0
            })
            setFilteredData(sortedData)
            setFilter(category)
            return
        }

        if (sortBy === "name_asc") {
            const sortedData = filteredRestaurants.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1
                }
                if (a.name > b.name) {
                    return 1
                }
                return 0
            })
            setFilteredData(sortedData)
            setFilter(category)
            return
        }

        if (sortBy === "name_dsc") {
            const sortedData = filteredRestaurants.sort(function (a, b) {
                if (a.name > b.name) {
                    return -1
                }
                if (a.name < b.name) {
                    return 1
                }
                return 0
            })
            setFilteredData(sortedData)
            setFilter(category)
            return
        }

        setFilteredData(filteredRestaurants)

        console.log("filtered Rest:", filteredRestaurants)

        // if no restautants matches filter, return
        if (!filteredRestaurants) return setError("Could not find restaurants for selected filter")

        setFilteredData(filteredRestaurants)
        setFilter(category)
    }

    const toggleSupply = (supply: string) => {
        setError(null)
        if (filter === supply) {
            // if filter is already selected, unset filter and show all
            setFilter("")
            setFilteredData(null)
            return
        }
        // filter only the restaurants that matches the selected filter
        const filteredRestaurants = data?.filter((restaurant) => restaurant.supply.toLowerCase() === supply.toLowerCase())

        // if no restautants matches filter, return
        if (!filteredRestaurants) return setError("Could not find restaurants for selected filter")

        setFilter(supply)
        setFilteredData(filteredRestaurants)
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
                distance: getDistanceFromLatLngInKm(restaurant.geolocation.lat, restaurant.geolocation.lng, coordinates.lat, coordinates.lng),
            }
        })

        const sortedData = updatedData.sort(function (a, b) {
            if (a.distance < b.distance) {
                return -1
            }
            if (a.distance > b.distance) {
                return 1
            }
            return 0
        })

        if (!sortedData) return setError("Could not filter by distance")

        setSortBy("distance")
        setFilteredData(sortedData)
    }

    // get the users location on render
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude })
            setUrlParams({ lat: latitude, lng: longitude }, filter)
        })
    }, [])

    useEffect(() => {
        if (!mapReference.current) {
            return
        }

        mapReference.current.panTo(coordinates)

        console.log("filtered data", filteredData)

        setUrlParams(coordinates, filter, sortBy)
    }, [coordinates, filter, filteredData, sortBy])

    if (!data) return

    return (
        <>
            <div className="map-page-container">
                <div className="mt-3 filter-list-container">
                    {loading && <p>Loading data...</p>}
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
                        toggleSupply={toggleSupply}
                    />

                    {filteredData?.length !== undefined && filteredData?.length > 0 && filter === "near_me" && (
                        <p>Showing restaurants in your area!</p>
                    )}
                    {filteredData?.length !== undefined && filteredData?.length > 0 && filter && filter !== "near_me" && (
                        <p>
                            Showing {filter ? <span style={{ fontWeight: "bold" }}>{filter}s</span> : "Showing all restaurants"} in: {currentCity}
                        </p>
                    )}
                    {data.length > 0 && !filteredData && <p>Showing all restaurants</p>}
                    {filteredData?.length === 0 && <p>No restaurants matching current filter</p>}
                    <RestaurantListItem coordinates={coordinates} displayOnMap={displayOnMap} restaurants={filteredData ?? data} />
                </div>
                <section className="map-page">
                    <Map
                        onMapLoadInstance={onMapLoadInstance}
                        onUnMount={onUnMount}
                        center={center}
                        coordinates={coordinates}
                        setCoordinates={setCoordinates}
                        restaurants={filteredData ?? data}
                        showRestaurantsInfo={showRestaurantsInfo}
                        selectedRestautant={selectedRestaurant}
                        setSelectedRestaurant={setSelectedRestaurant}
                    />
                </section>
            </div>

            {dataError && <p>Something went wrong: {dataError}</p>}
            {error && <p>{error}</p>}
        </>
    )
}

export default MapPage
