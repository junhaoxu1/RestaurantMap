import { Container } from 'react-bootstrap'
import './assets/scss/App.scss'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import RestaurantsPage from './pages/RestaurantsPage'
import RestaurantPage from './pages/RestaurantPage'

const App = () => {

	return (
		<div id='App'>
			<Container>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/food-map" element={<MapPage />} />

					<Route path='/restaurants' element={<RestaurantsPage />} />
					<Route path='/restaurants/:id' element={<RestaurantPage />} />
				</Routes>
			</Container>
		</div>
	)
}

export default App
