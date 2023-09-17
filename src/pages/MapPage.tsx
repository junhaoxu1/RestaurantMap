import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/Map";
const MYMAPSKEY: string = import.meta.env.VITE_APP_GOOGLE_KEY

const MapPage = () => {
	// Loading Google Maps by using useLoadScript hook and libary places,
	// it also used to determine when API is fully loaded.
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: MYMAPSKEY,
		libraries: ["places"],
	})

	// if it flase then display loading otherwise stop display
	if (!isLoaded) {
		return <div>loading ... </div>
	}

	return (
		<>
			<section className="map-page">
				<Map />
			</section>
		</>
	)
}

export default MapPage
