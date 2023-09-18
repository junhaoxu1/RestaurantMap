import { CollectionReference, getDocs } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

const useGetCollection = <T>(colRef: CollectionReference<T>) => {
    const [data, setData] = useState<T[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string|null>(null)

    const getData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // get query snapshot of collection
            const snapshot = await getDocs(colRef)
    
            // loop over all docs
            const data: T[] = snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    _id: doc.id,
                }
            })
            setData(data)
            
        } catch (err: any) {
            setError(err.message)
        }

        setLoading(false)
    }, [colRef])

    // Get data on component mount
    useEffect(() => {
        getData()
    }, [getData])

    // return getData function and states
    return {
        getData,
        data,
        error,
        loading
    }
}

export default useGetCollection