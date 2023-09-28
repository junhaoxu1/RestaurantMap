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
import LoginPage from "./pages/LoginPage"
import LogoutPage from "./pages/LogoutPage"
import UpdateUserPage from "./pages/UpdateUserPage"
import AdminPage from "./pages/AdminPage"
import AdminUpdatePage from "./pages/EditRequestPage"
import NotFoundPage from "./pages/NotFoundPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import UserRequestsPage from "./pages/UserRequestsPage"
import AllRestaurantsPage from "./pages/AllRestaurantsPage"
import EditRestaurantPage from "./pages/EditRestaurantPage"
import PhotoRequestPage from "./pages/PhotoRequestPage"
import EditPhotoRequestPage from "./pages/EditPhotoRequestPage"

const App = () => {
    return (
        <div id="App">
            <Navigation />
            <>
                <Routes>
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/" element={<MapPage />} />

                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurants/:id" element={<RestaurantPage />} />
                    <Route path="/restaurants/add" element={<AddNewRestaurantPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    <Route path="/update-user" element={<UpdateUserPage />} />
                    <Route path="/users-request" element={<UserRequestsPage />} />
                    <Route path="/users-request/:id" element={<AdminUpdatePage />} />
                    <Route path="/photos-request" element={<PhotoRequestPage />} />
                    <Route path="/photos-request/:id" element={<EditPhotoRequestPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/:documentId" element={<AdminUpdatePage />} />
                    <Route path="/admin-restaurants" element={<AllRestaurantsPage />} />
                    <Route path="/admin-restaurants/:id" element={<EditRestaurantPage />} />
                </Routes>
                <ToastContainer theme="colored" position="top-right" autoClose={1500} />
            </>
        </div>
    )
}

export default App
