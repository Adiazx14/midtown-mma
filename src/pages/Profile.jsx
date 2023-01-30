import { getAuth } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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
        if (!(uid===params.id || uid==="WThS4cVfqdZypO04WkgRzsZA9pz2") || uid==="kKdGy0N1GyZfMpZAarkugPcuDu33") {
            navigate("/")
        }
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
        console.log(rank)
        console.log(rank.includes("Blue"))
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
                                <p>Days since last promotion: <span className="days">{Math.round((new Date().getTime() - Date.parse(user.bjjPromoted))/86400000)}</span></p>
                                <p>Classes attended since last promotion: <span className="days">{user.bjjClasses.length - user.bjjClasses.indexOf(user.bjjPromoted)}</span></p>
                            </div>
                            }
                            {user.membership !== "0" &&
                            <div className="mt-info">
                                <p className="p-header">
                                    <span>Muay Thai</span>   
                                    <Armband className="armband" />
                                </p>
                                <p>Rank: {user.mtRank}</p> 
                                <p>Days since last promotion: <span className="days">{Math.round((new Date().getTime() - Date.parse(user.mtPromoted))/86400000)}</span></p>
                                <p>Classes attended since last promotion: <span className="days">{user.mtClasses.length - user.mtClasses.indexOf(user.mtPromoted)}</span></p>
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

                    

                    <button className="sign-out-btn" onClick={signOut}>Log Out</button>

                </div>
                : <h1>Loading</h1>
            }
        </div>
    )
}

export default Profile