import "./assets/scss/App.scss"
import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MapPage from "./pages/MapPage"
import RestaurantsPage from "./pages/RestaurantsPage"
import RestaurantPage from "./pages/RestaurantPage"
import Navigation from "./pages/partials/Navigation"
import SignupPage from "./pages/SignupPage"
import { ToastContainer } from "react-toastify"
import AddNewRestaurantPage from "./pages/AddNewRestaurantPage"

const App = () => {
    return (
        <div id="App">
            <Navigation />
            <>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/food-map" element={<MapPage />} />

                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurants/:id" element={<RestaurantPage />} />
                    <Route path="/restaurants/add" element={<AddNewRestaurantPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
                <ToastContainer theme="colored" position="top-right" autoClose={1500} />
            </>
        </div>
    )
}

export default App
