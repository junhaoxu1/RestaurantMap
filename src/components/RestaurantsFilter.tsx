import React from "react"
import { useSearchParams } from "react-router-dom"

type Props = {
    togglePosition: (city: string) => void
    toggleCategory: (category: string) => void
    toggleSupply: (supply: string) => void
    filter: string
}

const RestaurantsFilter: React.FC<Props> = ({ toggleCategory, togglePosition, toggleSupply, filter }) => {
    //retrieve filter to toggle classnames for buttons dynamically
    const [searchParams, _setSearchParams] = useSearchParams()
    const selectedFilter = searchParams.get("filter")
    return (
        <div className="filter-button-container d-flex gap-1 flex-wrap my-2">
            <div className="filter-position">
                <button className={selectedFilter === "near_me" ? "button-selected" : "button-not-selected"} onClick={() => togglePosition(filter)}>
                    Near Me
                </button>
            </div>

            <div className="filter-category">
                <p className="mb-0">Choose Category</p>
                <div className="button-wrapper d-flex gap-1 flex-wrap">
                    <button className={selectedFilter === "café" ? "button-selected" : "button-not-selected"} onClick={() => toggleCategory("café")}>
                        Café
                    </button>
                    <button
                        className={selectedFilter === "restaurant" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("restaurant")}
                    >
                        Restaurant
                    </button>
                    <button
                        className={selectedFilter === "fast food" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("fast food")}
                    >
                        Fast Food
                    </button>
                    <button
                        className={selectedFilter === "kiosk/grill" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("kiosk/grill")}
                    >
                        Kiosk/Grill
                    </button>
                    <button
                        className={selectedFilter === "foodtruck" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleCategory("foodtruck")}
                    >
                        Foodtruck
                    </button>
                </div>
            </div>

            <div className="filter-occation">
                <p className="mb-0">Choose Occation</p>
                <div className="button-wrapper d-flex gap-1 flex-wrap">
                    <button className={selectedFilter === "lunch" ? "button-selected" : "button-not-selected"} onClick={() => toggleSupply("lunch")}>
                        Lunch
                    </button>
                    <button
                        className={selectedFilter === "dinner" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleSupply("dinner")}
                    >
                        Dinner/Á la carte
                    </button>
                    <button
                        className={selectedFilter === "after work" ? "button-selected" : "button-not-selected"}
                        onClick={() => toggleSupply("after work")}
                    >
                        After Work
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RestaurantsFilter
