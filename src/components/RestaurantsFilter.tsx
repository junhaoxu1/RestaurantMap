import React from "react"
import { useSearchParams } from "react-router-dom"

type Props = {
    togglePosition: (city: string) => void
    toggleCategory: (field: string, value: string) => void
    toggleSortByName: (sortBy: string) => void
    toggleSortByDistance: (sortBy: string) => void
    filter: string
}

const RestaurantsFilter: React.FC<Props> = ({ toggleCategory, togglePosition, toggleSortByName, toggleSortByDistance, filter }) => {
    //retrieve filter to toggle classnames for buttons dynamically
    const [searchParams, _setSearchParams] = useSearchParams()
    const selectedFilter = searchParams.get("filter")
    const selectedCity = searchParams.get("city")
    const selectedSort = searchParams.get("sort")
    const coordinates = { lat: searchParams.get("lat"), lng: searchParams.get("lng") }
    return (
        <div className="filter-button-container d-flex gap-1 flex-wrap my-2">
            <div className="filter-position">
                <button
                    className={selectedFilter === selectedCity ? "button-selected" : "button-not-selected"}
                    onClick={() => togglePosition(filter)}
                >
                    Near Me
                </button>
            </div>

            <div className="filter-category">
                <p className="mb-0">Choose Category</p>
                <div className="button-wrapper d-flex gap-1 flex-wrap">
                    <button
                        className={selectedFilter === "café" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("category", "café")}
                    >
                        Café
                    </button>
                    <button
                        className={selectedFilter === "restaurant" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("category", "restaurant")}
                    >
                        Restaurant
                    </button>
                    <button
                        className={selectedFilter === "fast food" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("category", "fast food")}
                    >
                        Fast Food
                    </button>
                    <button
                        className={selectedFilter === "kiosk/grill" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("category", "kiosk/grill")}
                    >
                        Kiosk/Grill
                    </button>
                    <button
                        className={selectedFilter === "foodtruck" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("category", "foodtruck")}
                    >
                        Foodtruck
                    </button>
                </div>
            </div>

            <div className="filter-occation">
                <p className="mb-0">Choose Occation</p>
                <div className="button-wrapper d-flex gap-1 flex-wrap">
                    <button
                        className={selectedFilter === "lunch" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("supply", "lunch")}
                    >
                        Lunch
                    </button>
                    <button
                        className={selectedFilter === "dinner" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("supply", "dinner")}
                    >
                        Dinner/Á la carte
                    </button>
                    <button
                        className={selectedFilter === "after work" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("supply", "after work")}
                    >
                        After Work
                    </button>
                </div>
            </div>

            <div className="restaurants-sort">
                <p className="mb-0">Sort</p>
                <div className="button-wrapper d-flex gap-1 flex-wrap">
                    <button
                        className={selectedSort === "name_dsc" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleSortByName("name_dsc")}
                    >
                        Sort Descending
                    </button>
                    <button
                        className={selectedSort === "name_asc" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleSortByName("name_asc")}
                    >
                        Sort Ascending
                    </button>
                    {coordinates.lat !== null && (
                        <button
                            className={selectedSort === "distance" ? "button-selected" : "button-not-selected"}
                            onClick={() => toggleSortByDistance("distance")}
                        >
                            Sort By Distance
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantsFilter
