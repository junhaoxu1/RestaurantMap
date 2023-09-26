import { orderBy } from "firebase/firestore"
import { imagesCol } from "../services/firebase"
import { TImg } from "../types/Img.types"
import useStreamCollection from "./useStreamCollection"

const useImg = () => {
	return useStreamCollection<TImg>(imagesCol, orderBy("created"))
}

export default useImg
