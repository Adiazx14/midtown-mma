import { getAuth } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebase.config"
import Graph from "../Graph"

const Profile = () => {
    const auth = getAuth()
    const [user, setUser] = useState(auth.currentUser   )
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const params = useParams()
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                const userRef = doc(db, "users", params.id)
                const docSnap = await getDoc(userRef)
                const data = docSnap.data()
                setUser(data)
                setLoading(false)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchUser()
    },[])

    const signOut = () => {
        auth.signOut()
        localStorage.setItem("uid", "")
        navigate("/")
    }
    return (
        <div className="profile">
            {!loading?
                <div className="">
                    <h2>{user.name}</h2>
                    <h2>ID: {user.id}</h2>
                    <h2>Joined {user.joinDate.toDate().toDateString().split(" ")[1]} {user.joinDate.toDate().toDateString().split(" ")[3]}</h2>
                    <h2>BJJ Rank: {user.bjjRank}</h2>
                    <h2>BJJ Days since last promotion: {parseInt((new Date().getTime() - user.bjjPromoted.toDate().getTime())/86400000)}</h2>
                    <h2>BJJ Classes attended since last promotion: {user.bjjClasses.length - user.bjjClasses.indexOf(user.bjjPromoted.toDate().toLocaleDateString())}</h2>
                    <button onClick={signOut}>Log Out</button>
                    {user.bjjClasses.length>0 &&
                    <Graph classes={user.bjjClasses}/>
                    }
                    {user.mtClasses.length>0 &&
                    <Graph classes={user.mtClasses}/>
                    }
                </div>
                : <h1>Loading</h1>
            }
        </div>
    )
}

export default Profile