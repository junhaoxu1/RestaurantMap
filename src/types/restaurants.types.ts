export type Restaurant = {
    _id: string
    address: string
    category: string
    city: string
    description: string
    email?: string
    facebook?: string
    instagram?: string
    name: string
    phone: string
    supply: string
    webpage: string
    geolocation: {
        lat: number,
        lng: number
    }
}

export type Restaurants = Restaurant[]

export type RestaurantFormData = Omit<Restaurant, "_id">