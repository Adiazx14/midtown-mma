import {ReactComponent as GoogleIcon} from "../../assets/googleIcon.svg"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase.config"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const SignIn = () => {
    const navigate = useNavigate()

    const signIn = async() => {

        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const creds = await signInWithPopup(auth, provider)
    
            const userRef = doc(db, "users", creds.user.uid)
            const docSnap = await getDoc(userRef)
            if (!docSnap.exists()) {
                
                const userCountRef = doc(db, "userCount", "MlJ9crFv8QgUurfFxFE5")
                await updateDoc(userCountRef, {
                    count: increment(1)
                })
                const count = await getDoc(userCountRef)
               
                await setDoc(userRef, {
                    name: creds.user.displayName,
                    email: creds.user.email,
                    id: count.data().count,
                    joinDate: serverTimestamp(),
                    membership: 0,
                    bjjClasses: [],
                    mtClasses: [],
                    bjjRank: "White Belt",
                    bjjPromoted: serverTimestamp()
                })
                
            }
            toast.success("Yay!!")
            localStorage.setItem("uid", creds.user.uid)
            navigate("/profile/"+creds.user.uid)
        }
        catch(err) {
            console.log(err)
            toast.error("Error logging in")
        }

    }
    return (
        <div className="sign-in">
            <h1>Midtowm MMA Houston</h1>
            <h1 className="blue">Sign in with</h1>
            
            <GoogleIcon onClick = {signIn} className="google-icon"/>
        </div>
    )
}

export default SignIn