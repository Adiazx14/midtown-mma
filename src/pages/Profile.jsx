import { getAuth } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase.config"
import Graph from "../components/Graph"
import {ReactComponent as Belt} from "../assets/belt.svg"
import {ReactComponent as Armband} from "../assets/armband.svg"
import {ReactComponent as UserIcon} from "../assets/userIcon.svg"
import {ReactComponent as Red} from "../assets/red.svg"
import {ReactComponent as Yellow} from "../assets/yellow.svg"
import {ReactComponent as Both} from "../assets/both.svg"
import { toast } from "react-toastify"
import { v4 } from "uuid"


const Profile = () => {
    const auth = getAuth()
    const [user, setUser] = useState(auth.currentUser)
    const [loading, setLoading] = useState(true)
    const [userPic, setUserPic] = useState(null)

    const navigate = useNavigate()
    const params = useParams()
    useEffect(()=>{
        const uid = localStorage.getItem("uid")
        if ((uid!==params.id && uid!=="WThS4cVfqdZypO04WkgRzsZA9pz2") && uid!=="gryUf2y7DfdjiSYDS1ABZr1S8T72") {
            toast.error("You are not authorized to access that page")
            navigate("/")
        }
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

    const getBeltColor = (rank) => {

        if (rank.includes("Blue")) {
            return "#00c"
        }
        if (rank.includes("Purple")) {
            return "purple"
        }
        if (rank.includes("Brown")) {
            return "#964B00"
        }
        if (rank.includes("Black")) {
            return "#222"
        }
        
        return "#fff"
    }

    const updatePic = async(image)=> {
        try {
            if (image) {
                const storage = getStorage()
                const imageRef = ref(storage, `images/${image.name + v4()}`)
                const snapShot = await uploadBytes(imageRef, image)
                const url = await getDownloadURL(snapShot.ref)
                const userRef = doc(db, "users", auth.currentUser.uid)
                await updateDoc(userRef, {
                    profilePic: url
                })
                setUser(prevState=>{return {...prevState, profilePic: url}})
                
                toast.success("Uploaded succesfully")
            }
            else {
                toast.error("No image selected")
            }

        }
        catch(err) {
            console.log(err)
            toast.error("Error")
        }

    }

    return (
        <div className="">
            {!loading?
                <div className="profile">
                    <div className="user-and-rank">
                        <div className="user-div">
                            <div className="user-pic-div">
                                {user.profilePic? <img className="user-pic" src={user.profilePic} alt="" /> : <UserIcon/>}
                                <input id="update-pic-btn" className="update-pic-btn" style={{display:"None"}} onChange={(e)=>{updatePic(e.target.files[0])}} type="file" name="update profile" />
                                <button id="actual-btn" onClick={()=>{document.getElementById("update-pic-btn").click()}}>Update Pic</button>
                            </div>

                            <div className="user-text">
                                <p>{user.name}</p>
                                <p><a href={"mailto:" +user.email}>{user.email}</a></p>
                                <p>ID: {user.id}</p>
                                <p>Joined: {user.joinDate}</p>
                            </div>  
                        </div>
                        <div className={user.membership=== "2"?"rank-div-double":"rank-div"}>
                            {user.membership !== "1" &&
                            <div className="bjj-info">
                                <p className="p-header">
                                <span>Jiu-Jitsu</span> 
                                <Belt className="belt" fill={getBeltColor(user.bjjRank)}/>
                                </p>
                                <p>Rank: {user.bjjRank}</p> 
                                <p>Last promotion: {user.bjjPromoted}</p>
                            </div>
                            }
                            {user.membership !== "0" &&
                            <div className="mt-info">
                                <p className="p-header">
                                    <span>Muay Thai</span>   
                                    <Armband className="armband" />
                                </p>
                                <p>Rank: {user.mtRank}</p> 
                                <p>Last promotion: {user.mtPromoted}</p>
                            </div>
                            }
                            { (user.id === 6 || user.id===2) &&
                            <div className="links desk">
                                <Link to={"/"}> Sign-In Page </Link>
                                <Link to={"/members"}>Members</Link>
                                <Link to={"/attend"}>Attendance Pad</Link>
                                <button  className="sign-out-link desk" onClick={signOut}>Log Out</button>
                            </div>
                            }
                        </div>
                    </div>
                   
                    <span className="line">
                        
                    </span>
                    <div className="calendar-div">
                        <Graph bjjClasses={user.bjjClasses} mtClasses={user.mtClasses}/>   
                        <div className="legend">
                            <div className="legend-icon-div">
                                <Red/>
                                <p>Jiu-Jitsu</p>
                            </div>
                            <div className="legend-icon-div">
                                <Yellow/>
                                <p>Muay Thai</p>
                            </div>
                            <div className="legend-icon-div">
                                <Both/>
                                <p>Both</p>
                            </div>
                        </div>                         
                    </div>

                    
                </div>
                : <h1>Loading</h1>
            }
        </div>
    )
}

export default Profile