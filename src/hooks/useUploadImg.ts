import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { UploadTaskSnapshot, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { imagesCol, storage } from '../services/firebase'
import useAuth from './useAuth'

const useUploadImg = () => {
	const { currentUser } = useAuth()

	const [stateUploading, setStateUploading] = useState<{
		err: string | null,
		IError: boolean | null,
		ISuccess: boolean | null,
		IUploading: boolean | null,
		IProgressbar: number | null,
	}>({
		err: null,
		IError: null,
		ISuccess: null,
		IUploading: null,
		IProgressbar: null,
	})

	// updating upload progress function
	const progressUploadingFile = (snapshot: UploadTaskSnapshot) => {
		const progressBarUP = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 1000) /10

		setStateUploading((prevS) => ({...prevS, progressBarUP}))
	}

	// handle the error while uploading
	const handlerErrStateUpload = (err: Error) => {
		setStateUploading({
			err: err instanceof Error ? err.message : "Something went wrong",
			IError: true,
			ISuccess: false,
			IUploading: false,
			IProgressbar: null
		})
	}

	// handle the success upload
	const handlerSuccessStateUpload = () => {
		setStateUploading({
			err: null,
			IError: false,
			ISuccess: true,
			IUploading: false,
			IProgressbar: null
		})
	}


	const uploadingFiles = async (image: File) => {
		// reset internal state
		setStateUploading({
			err: null,
			IError: null,
			ISuccess: null,
			IUploading: true,
			IProgressbar: null,
		})

		try {
			// generate a uuid for the file
			const uuid = uuidv4()

			// find file extension
			const extensionF = image.name.substring( image.name.lastIndexOf(".") + 1 )

			// construct filename to save image as
			const SFilename = `${uuid}.${extensionF}`

			// create reference to the file in storage
			const storageReference = ref(storage, `uploadImg/${SFilename}`)

			// start upload of image
			const uploadTask = uploadBytesResumable(storageReference, image)

			// attach upload observer
			uploadTask.on("state_changed", progressUploadingFile)

			// wait for upload to complete
			await uploadTask.then()

			// get download url to uploaded image
			const url = await getDownloadURL(storageReference)

			// create document in db-collection "imagescol"
			const docRef = doc(imagesCol)

			// create document in db for the uploaded image
			await setDoc(docRef, {
				_id: docRef.id,
				created: serverTimestamp(),
				name: image.name,
				path: storageReference.fullPath,
				size: image.size,
				type: image.type,
				uid: currentUser?.uid,
				url: url,
			})

			// handle success upload
			handlerSuccessStateUpload()

		} catch (err: any) {
			// handle error upload
			handlerErrStateUpload(err)

		}
	}

	return {
		...stateUploading,
		uploadingFiles,
	}
}

export default useUploadImg
