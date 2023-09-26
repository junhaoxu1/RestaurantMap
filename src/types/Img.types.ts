import { Timestamp } from "firebase/firestore"

export type TImg = {
	create: Timestamp
	_id?: string
	name: string
	type: string
	path: string
	size: number
	uid: string
	url: string
}
