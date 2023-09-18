import { Container } from 'react-bootstrap'
import './assets/scss/App.scss'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import Navigation from './pages/partials/Navigation'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

const App = () => {

	return (
		<div id='App'>
			<Navigation />
			<Container>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/food-map" element={<MapPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</Container>
		</div>
	)
}

export default App
