import { useMemo } from "react";
import { GoogleMap } from "@react-google-maps/api";

const Map = () => {
	// it remember to locationen by setting latitude and longitude
	const center = useMemo(() => ({lat: 55, lng: 13}), [])

	return (
		<div className="cBox">
			<div className="map">
				<GoogleMap
					zoom={10}
					center={center}
					mapContainerClassName="map-container"
				>
				</GoogleMap>
			</div>
		</div>
	)
}

export default Map
