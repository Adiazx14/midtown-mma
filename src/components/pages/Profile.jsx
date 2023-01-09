import { getAuth } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebase.config"
import Graph from "../Graph"
import {ReactComponent as Belt} from "../../assets/belt.svg"
import {ReactComponent as Armband} from "../../assets/armband.svg"
import {ReactComponent as UserIcon} from "../../assets/userIcon.svg"
import {ReactComponent as Red} from "../../assets/red.svg"
import {ReactComponent as Yellow} from "../../assets/yellow.svg"
import {ReactComponent as Both} from "../../assets/both.svg"
import {v4} from "uuid"
import { toast } from "react-toastify"


const Profile = () => {
    const auth = getAuth()
    const [user, setUser] = useState(auth.currentUser)
    const [loading, setLoading] = useState(true)
    const [userPic, setUserPic] = useState(null)

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
        <div className="profile">
            {!loading?
                <div className="">
                    <div className="user-div">
                        <div className="user-pic-div">
                            {user.profilePic? <img className="user-pic" src={user.profilePic} alt="" /> : <UserIcon/>}
                            {/*                              <button onClick={updatePic} className="update-profile-pic">Update Profile pic</button>
*/}
                            <input id="update-pic-btn" className="update-pic-btn" style={{display:"None"}} onChange={(e)=>{updatePic(e.target.files[0])}} type="file" name="update profile" />
                            <button id="actual-btn" onClick={()=>{document.getElementById("update-pic-btn").click()}}>Update Pic</button>
                        </div>

                        <div className="user-text">
                            <p>{user.name}</p>
                            <p>ID: {user.id}</p>
                            <p>Joined: {user.joinDate.toDate().toDateString().split(" ")[1]} {user.joinDate.toDate().toDateString().split(" ")[3]}</p>
                        </div>  
                    </div>
                    <div className={user.membership===2?"rank-div-double":"rank-div"}>
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