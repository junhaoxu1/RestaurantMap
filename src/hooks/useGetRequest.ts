import { restaurantRequestCol } from "../services/firebase"
import { RestaurantFormData } from "../types/restaurants.types"
import useStreamDocument from "./useStreamDocument"

const useGetData = (documentId: string) => {
    return useStreamDocument<RestaurantFormData>(restaurantRequestCol, documentId)
}

export default useGetData
