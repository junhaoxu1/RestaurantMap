import { restaurantsCol } from "../services/firebase"
import { RestaurantFormData } from "../types/restaurants.types"
import useStreamDocument from "./useStreamDocument"

const useGetData = (documentId: string) => {
    return useStreamDocument<RestaurantFormData>(restaurantsCol, documentId)
}

export default useGetData
