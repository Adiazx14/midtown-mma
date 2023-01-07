import { useEffect, useRef, useState } from "react"
import {getAuth, onAuthStateChanged} from "firebase/auth"

const useAuthStatus = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const isMounted = useRef(true)
    
    
    useEffect(()=>{

        if (isMounted){
            const auth = getAuth()
            onAuthStateChanged(auth, (user)=>{
                console.log(user)
                if (user) {
                    setIsLoggedIn(true)
                }
                setLoading(false)
            })
        }

        return ()=> {isMounted.current = false}

    }, [isMounted])

    return {isLoggedIn, loading}

}

export default useAuthStatus
