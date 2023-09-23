import { Marker } from "@react-google-maps/api"
import React, { useState } from "react"
import usePlaceAutoComplete, { LatLng, getGeocode, getLatLng } from "use-places-autocomplete"
import { FaSearch } from "react-icons/fa"
import { useSearchParams } from "react-router-dom"

type Props = {
    setPlace: (latLng: LatLng) => void
}

const PlacesAutoComplete: React.FC<Props> = ({ setPlace }) => {
    const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [_searchParams, setSearchParams] = useSearchParams({
        lat: "",
        lng: "",
    })

    const { ready, value, setValue, suggestions, clearSuggestions } = usePlaceAutoComplete()

    const handleSelect = async (place_id: string, place: string) => {
        setValue(place, false)
        clearSuggestions()

        const results = await getGeocode({ placeId: place_id })
        const { lat, lng } = getLatLng(results[0])
        setSelected({ lat, lng })
        setPlace({ lat, lng })

        setSearchParams({ lat: String(lat), lng: String(lng) })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setNotFound(false)

        try {
            const results = await getGeocode({ address: value })
            const { lat, lng } = getLatLng(results[0])

            setSelected({ lat, lng })
            setPlace({ lat, lng })

            setSearchParams({ lat: String(lat), lng: String(lng) })
        } catch (err) {
            setNotFound(true)
            setSearchParams({ lat: "", lng: "" })
        }
        // clear list of suggestions once submitted
        clearSuggestions()
    }

    return (
        <>
            {/* Input field for searching places */}
            <div className="search-form-container">
                <form className="search-form" onSubmit={handleSubmit}>
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={!ready}
                        placeholder="Search Address"
                        className="search-input px-2"
                    />
                    <button className="search-form-submit">
                        <FaSearch />
                    </button>
                </form>

                {selected && <Marker position={selected} />}

                {suggestions.status === "OK" && (
                    <ul className="suggestions-list px-2 mt-1">
                        {suggestions.data.slice(0, 5).map((suggestion) => (
                            <li
                                style={{ listStyle: "none" }}
                                className="mb-1"
                                key={suggestion.place_id}
                                value={suggestion.description}
                                onClick={() => handleSelect(suggestion.place_id, suggestion.description)}
                            >
                                {suggestion.description}
                                <hr className="my-1" />
                            </li>
                        ))}
                    </ul>
                )}

                {notFound && (
                    <p style={{ fontSize: ".75rem", color: "crimson", textAlign: "center" }} className="my-2">
                        No matching results found for "{value}"
                    </p>
                )}
            </div>
        </>
    )
}

export default PlacesAutoComplete
