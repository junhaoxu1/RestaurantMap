import { CollectionReference, OrderByDirection, getDocs, orderBy, query } from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"

const useGetSortedData = <T>(colRef: CollectionReference<T>, order: OrderByDirection) => {
    const [data, setData] = useState<T[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getData = useCallback(
        async (order: OrderByDirection) => {
            setLoading(true)
            setError(null)

            try {
                // query database
                const q = query(colRef, orderBy("name", order))

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
            } catch (err: any) {
                setError(err.message)
            }

            setLoading(false)
        },
        [colRef]
    )

    // Get data on component mount
    useEffect(() => {
        getData(order)
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

export default useGetSortedData
