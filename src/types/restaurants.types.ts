export type Restaurant = {
    _id: string
    address: string
    category: string[]
    city: string
    description: string
    email?: string
    facebook?: string
    instagram?: string
    name: string
    phone: string
    supply: string[]
    webpage: string
}

export type Restaurants = Restaurant[]