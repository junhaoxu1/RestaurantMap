import { useMemo } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import { Button } from "react-bootstrap"
import SearchPlaceComp from "./SearchPlaceComp"
import { useSearchParams } from "react-router-dom"
import React from "react"
import { RestaurantFormData, Restaurants } from "../types/restaurants.types"
import RestaurantIcon from "../assets/images/restauranticon.webp"

type MapOptions = google.maps.MapOptions

type MarkerLocationProps = {
    restaurants: Restaurants
}

const Map: React.FC<MarkerLocationProps> = ({ restaurants }) => {
    // it remember to locationen by setting latitude and longitude
    const center = useMemo(() => ({ lat: 55.6053, lng: 13.0041 }), [])

    const [gCurrentPos, setGCurrentPos] = React.useState<google.maps.LatLngLiteral>({} as google.maps.LatLngLiteral)
    const [_disabled, setDisabled] = React.useState(false)
    const [selectedClickMarker, setSelectedClickMarker] = React.useState<RestaurantFormData>({} as RestaurantFormData)

    //removing googleMaps zoom in&out button and other button inside MapOptions.
    const options = useMemo<MapOptions>(
        () => ({
            disableDefaultUI: true,
            clickableIcons: false,
        }),
        []
    )

    const [_searchParams, setSearchParams] = useSearchParams({
        query: "",
    })

    const handlePlaceForm = async (query: string) => {
        //set input value as query in searchParams and while getting result
        setSearchParams({ query })
    }

    // mapReference can either be reference to google maps or null
    const mapReference = React.useRef<google.maps.Map | null>(null)

    // getting current position on the google maps by updating state variable getCurrentPos while clicking the icon button
    const gCurrentPosition = (position: google.maps.LatLngLiteral) => {
        if (mapReference.current) {
            mapReference.current.panTo({ lat: position.lat, lng: position.lng })
            mapReference.current.setZoom(18)
            setGCurrentPos(position)
        }
    }

    // return updated reference with current map for interacting with google maps
    const onMapLoadInstance = (map: google.maps.Map): void => {
        mapReference.current = map
    }

    const onUnMount = (): void => {
        mapReference.current = null
    }

    // show location where you click on the map
    const ShowMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) {
            return
        }
        setGCurrentPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        setSelectedClickMarker({} as RestaurantFormData)
    }

    const ShowMarkerClick = (marker: RestaurantFormData) => setSelectedClickMarker(marker)

    return (
        <div className="cBox">
            <Button
                onClick={() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                        // Click the button when geolocation has finished loaded
                        setDisabled(false)
                        // get the callback function for your position
                        gCurrentPosition({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        })
                    })
                }}
                style={{ color: "grey", background: "black", position: "absolute", zIndex: "2", left: "19em" }}
            >
                <i className="fa-solid fa-location-crosshairs"></i>
            </Button>
            <div className="map">
                <GoogleMap
                    zoom={12}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onMapLoadInstance}
                    onClick={ShowMapClick}
                    onUnmount={onUnMount}
                >
                    {gCurrentPos.lat ? <Marker position={gCurrentPos} /> : null}
                    {gCurrentPos.lat
                        ? restaurants.map((marker) => (
                              <Marker
                                  key={marker._id}
                                  position={marker.geolocation}
                                  onClick={() => ShowMarkerClick(marker)}
                                  icon={{
                                      url: RestaurantIcon,
                                      origin: new window.google.maps.Point(0, 0),
                                      anchor: new window.google.maps.Point(15, 15),
                                      scaledSize: new window.google.maps.Size(45, 45),
                                  }}
                              ></Marker>
                          ))
                        : null}

                    {selectedClickMarker.geolocation && (
                        <InfoWindow position={selectedClickMarker.geolocation} onCloseClick={() => setSelectedClickMarker({} as RestaurantFormData)}>
                            <div>
                                <h4>{selectedClickMarker.name}</h4>
                                <p>
                                    {selectedClickMarker.city} {selectedClickMarker.address}
                                </p>
                                <p>{selectedClickMarker.description}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
                <SearchPlaceComp onSearchPlace={handlePlaceForm} />
            </div>
        </div>
    )
}

export default Map
