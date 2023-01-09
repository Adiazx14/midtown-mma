import { getAuth } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebase.config"
import Graph from "../Graph"
import {ReactComponent as Belt} from "../../assets/belt.svg"
import {ReactComponent as Armband} from "../../assets/armband.svg"
import {ReactComponent as UserIcon} from "../../assets/userIcon.svg"


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
                console.log(data)
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

    const getBeltColor = (rank) => {
        switch(rank.slice(2)){

            case 'Blu':
                return "#ffc"
            case 'Pur':
                return "purple"
            case 'Brw':
                return "brown"
            case 'Bla':
                return "#000"
            default:
                return "#fff"

        }
    }

    return (
        <div className="profile">
            {!loading?
                <div className="">
                    <div className="user-div">
                        <UserIcon/>
                        <div className="user-text">
                            <p>{user.name}</p>
                            <p>ID: {user.id}</p>
                            <p>Joined: {user.joinDate.toDate().toDateString().split(" ")[1]} {user.joinDate.toDate().toDateString().split(" ")[3]}</p>
                        </div>  
                    </div>
                    <div className="rank-div">
                        {user.membership !== 1 &&
                        <div className="bjj-info">
                            <p className="p-header">
                               <span>Jiu-Jitsu</span> 
                               <Belt className="belt" fill={getBeltColor(user.bjjRank)}/>
                            </p>
                            <p>Rank: {user.bjjRank}</p> 
                            <p>Days since last promotion: <span className="days">{Math.round((new Date().getTime() - user.bjjPromoted.toDate().getTime())/86400000)}</span></p>
                            <p>Classes attended since last promotion: <span className="days">{user.bjjClasses.length - user.bjjClasses.indexOf(user.bjjPromoted.toDate().toLocaleDateString())}</span></p>
                        </div>
                        }
                        {user.membership !== 0 &&
                        <div className="mt-info">
                            <p className="p-header">
                                <span>Muay Thai</span>   
                                <Armband className="armband" />
                            </p>
                            <p>Rank: {user.mtRank}</p> 
                            <p>Days since last promotion: <span className="days">{Math.round((new Date().getTime() - user.mtPromoted.toDate().getTime())/86400000)}</span></p>
                            <p>Classes attended since last promotion: <span className="days">{user.mtClasses.length - user.mtClasses.indexOf(user.mtPromoted.toDate().toLocaleDateString())}</span></p>
                        </div>
                        }
                    </div>
                    <div className="line">
                        
                    </div>
                    <Graph bjjClasses={user.bjjClasses} mtClasses={user.mtClasses}/>
                    

                    <button className="sign-out-btn" onClick={signOut}>Log Out</button>

                </div>
                : <h1>Loading</h1>
            }
        </div>
    )
}

export default Profile