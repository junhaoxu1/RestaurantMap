import { CollectionReference, getDocs, query, where } from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"

const useGetFilteredData = <T>(colRef: CollectionReference<T>, field: string, value: string) => {
    const [data, setData] = useState<T[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getData = useCallback(
        async (field: string, value: string) => {
            setLoading(true)
            setError(null)

            try {
                // query database
                const q = query(colRef, where(field, "==", value))

                // get query snapshot of collection
                const snapshot = await getDocs(q)

                // loop over all docs
                const data: T[] = snapshot.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        _id: doc.id,
                    }
                })
                setData(data)
                console.log("querying for:", field, value)
            } catch (err: any) {
                setError(err.message)
            }

            setLoading(false)
        },
        [colRef]
    )

    // Get data on component mount
    useEffect(() => {
        getData(field, value)
    }, [getData])

    // return getData function and states
    return {
        getData,
        data,
        setData,
        error,
        loading,
    }
}

export default useGetFilteredData
