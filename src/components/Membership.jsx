import Graph from "../components/Graph"
import {ReactComponent as Belt} from "../assets/belt.svg"
import {ReactComponent as Armband} from "../assets/armband.svg"
import {ReactComponent as UserIcon} from "../assets/userIcon.svg"
import {ReactComponent as Red} from "../assets/red.svg"
import {ReactComponent as Yellow} from "../assets/yellow.svg"
import {ReactComponent as Both} from "../assets/both.svg"
import { getAuth } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { v4 } from "uuid"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import { useState } from "react"



const Membership = ({user, loggedUserId, profileUserId}) => {

    const auth = getAuth()
    const navigate = useNavigate()
    const [profilePic, setProfilePic] = useState(user.profilePic)
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

    const signOut = () => {
        auth.signOut()
        localStorage.setItem("uid", "")
        navigate("/")
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
                setProfilePic(url)
                
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

    const deleteUser = async() => {
        const userRef = doc(db, "users", profileUserId)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
            const userData = userSnap.data()
            const ids = userData.ids.filter(id=>id!==user.id)
            const memberships = userData.memberships
            delete memberships[user.id]
            await updateDoc(userRef, {ids, memberships})
        }
        
        toast.success("User deleted")
        navigate("/members")
    }

    return (
        <div className="profile">
        <div className="user-and-rank">
            <div className="user-div">
                <div className="user-pic-div">
                    {profilePic? <img className="user-pic" src={profilePic} alt="" /> : <UserIcon/>}
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
                { ((loggedUserId==="WThS4cVfqdZypO04WkgRzsZA9pz2") || (loggedUserId==="gryUf2y7DfdjiSYDS1ABZr1S8T72") || (loggedUserId==="JLZtYYmvT3UP7KTr44n9mIUbJDt2")) &&
                <div className="links desk">
                    <Link to={"/sign-up"}> Add a member </Link>
                    <Link to={"/members"}>Members</Link>
                    <Link to={"/attend"}>Attendance Pad</Link>
                    <button  className="sign-out-link desk" onClick={signOut}>Log Out</button>
                    <button  className="sign-out-link desk" onClick={deleteUser}>Delete this user</button>
                </div>
                }
            </div>
        </div>
       
        <span className="line">
            
        </span>
        <div className="calendar-div">
            <Graph id={user.id} bjjClasses={user.bjjClasses} mtClasses={user.mtClasses}/>   
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
    )
}

export default Membership