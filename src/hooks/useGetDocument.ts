import { CollectionReference, doc, getDoc } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

const useGetDocument = <T>(colRef: CollectionReference<T>, documentId: string) => {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    // Get todo
    const getData = useCallback(async () => {
        setError(false)
        setLoading(true)

        // get a ref to a single document in `restaurants` collection
        const docRef = doc(colRef, documentId)
        const docSnap = await getDoc(docRef)

        // if snapshot doesn't exist, update states and return
        if (!docSnap.exists()) {
            setData(null)
            setError(true)
            setLoading(false)
            return
        }

        // construct the data
        const data: T = {
            ...docSnap.data(),
            _id: docSnap.id,
        }

        // update states once data is constructed
        setData(data)
        setLoading(false)
    }, [colRef, documentId])

    // Fetch data once component mounts
    useEffect(() => {
        getData()
    }, [getData])

    // returns getData function, data and states
    return {
        data,
        error,
        getData,
        loading,
    }
}

export default useGetDocument