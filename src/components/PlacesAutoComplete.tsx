import { Marker } from "@react-google-maps/api"
import React, { useState } from "react"
import usePlaceAutoComplete, { LatLng, getGeocode, getLatLng } from "use-places-autocomplete"

type Props = {
    setPlace: (latLng: LatLng) => void
}

const PlacesAutoComplete: React.FC<Props> = ({ setPlace }) => {
    const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null)

    const { ready, value, setValue, suggestions, clearSuggestions } = usePlaceAutoComplete()

    const handleSelect = async (place_id: string, place: string) => {
        setValue(place, false)
        clearSuggestions()

        const results = await getGeocode({ placeId: place_id })
        const { lat, lng } = await getLatLng(results[0])
        setSelected({ lat, lng })
        setPlace({ lat, lng })

        console.log(suggestions.data)

        console.log(results)
    }

    return (
        <>
            {/* Input field for searching places */}
            <div>
                <input value={value} onChange={(e) => setValue(e.target.value)} disabled={!ready} placeholder="Search Address" />

                {selected && <Marker position={selected} />}

                <ul className="suggestions-list">
                    {suggestions.status === "OK" &&
                        suggestions.data.map((suggestion) => (
                            <li
                                key={suggestion.place_id}
                                value={suggestion.description}
                                onClick={() => handleSelect(suggestion.place_id, suggestion.description)}
                            >
                                {suggestion.description}
                            </li>
                        ))}
                </ul>
            </div>
        </>
    )
}

export default PlacesAutoComplete
