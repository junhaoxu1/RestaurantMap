import { Autocomplete, Marker } from "@react-google-maps/api"
import React, { useState } from "react"
import usePlaceAutoComplete, { LatLng, getGeocode, getLatLng } from "use-places-autocomplete"
import { FaSearch } from "react-icons/fa"
import { useSearchParams } from "react-router-dom"

type Props = {
    setCoordinates: (latLng: LatLng) => void
    onSearch: (city: string) => void
}

const PlacesAutoComplete: React.FC<Props> = ({ setCoordinates, onSearch }) => {
    const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [_searchParams, setSearchParams] = useSearchParams({
        lat: "",
        lng: "",
    })

    const { ready, value, setValue, clearSuggestions } = usePlaceAutoComplete()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setNotFound(false)

        try {
            const results = await getGeocode({ address: value })
            const { lat, lng } = getLatLng(results[0])

            setSelected({ lat, lng })
            setCoordinates({ lat, lng })
            onSearch(value)

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
            <div className="search-form-container w-75">
                <Autocomplete>
                    <form className="search-form" onSubmit={handleSubmit} onSelect={(e: any) => setValue(e.target.value)}>
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
                </Autocomplete>

                {selected && <Marker position={selected} />}

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
