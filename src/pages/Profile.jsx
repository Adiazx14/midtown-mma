import { getAuth } from "firebase/auth"
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Membership from "../components/Membership"


const Profile = () => {
    const auth = getAuth()
    const [user, setUser] = useState(auth.currentUser)
    const [loading, setLoading] = useState(true)
    const [loggedUserId, setLoggedUserId] = useState("")
    const [profileUserId, setProfileUserId] = useState("")


    const navigate = useNavigate()
    const params = useParams()
    useEffect(()=>{
        
        const uid = localStorage.getItem("uid")
        if ((uid!==params.id && uid!=="WThS4cVfqdZypO04WkgRzsZA9pz2") && uid!=="gryUf2y7DfdjiSYDS1ABZr1S8T72" && uid!=="JLZtYYmvT3UP7KTr44n9mIUbJDt2") {
            toast.error("You are not authorized to access that page")
            navigate("/")
        }
        else setLoggedUserId(uid)
        const fetchUser = async () => {
            try {
                const userRef = doc(db, "users", params.id)
                
                const docSnap = await getDoc(userRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    console.log(data)
                    setUser(data)
                    /* const memberships = []
                    const updatedUser = {...data}
                    delete updatedUser["email"]
                    memberships.push(updatedUser)
                    console.log(memberships) 
                    const updateRef = {memberships, email:data.email}
                    console.log(updateRef)
                    await setDoc(userRef, updateRef) 
                    */
/*                    const ships =  Object.entries(data.memberships[0])
                   console.log(ships) */
                    setProfileUserId(docSnap.id)
                    console.log(Object.entries(data.memberships))
                    setLoading(false)
                }

                else {
                    alert("No user found with that ID")
                    navigate("/")
                }

            }
            catch(err){
                console.log(err)
            }
        }
        fetchUser()
        console.log(user)



    },[])




    return (
        <div className="">
            {!loading? Object.values(user.memberships).map((membership)=><Membership loggedUserId={loggedUserId} profileUserId={profileUserId} id={membership.id} user={membership}/>)

                : <h1>Loading</h1>
            }
        </div>
    )
}

export default Profile