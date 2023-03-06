import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { db } from "../firebase.config"

const Attend = () => {

    const [id, setId] = useState("")
    const [sport, setSport] = useState("")
    const [user, setUser] = useState({})

    const onChange = (e) => {
        setId(prevState=>{
            return prevState + e.target.value 
        })
    }

    const navigate = useNavigate()

    useEffect(()=>{
        const uid = localStorage.getItem("uid")
        if (uid !== "WThS4cVfqdZypO04WkgRzsZA9pz2" && uid !== "JLZtYYmvT3UP7KTr44n9mIUbJDt2" && uid !== "gryUf2y7DfdjiSYDS1ABZr1S8T72") {
            navigate("/")
        }
    })

    const log = async() => {
        if (!(sport==="mtClasses" && parseInt(user.membership)<1) && !(sport==="bjjClasses" && user.membership==="1")) {
            const classes = user.memberships[id][sport]
            var timeStamp = new Date()
            console.log(timeStamp.toJSON())
            timeStamp = new Date(timeStamp.getTime()-21600000).toJSON().slice(0,10)
            if (!classes.includes(timeStamp)) {
                classes.push(timeStamp)
                const newMemberships = {...user.memberships, [id]:{...user.memberships[id], [sport]:classes}}                
                await updateDoc(doc(db, "users", user.uid), {
                    memberships: newMemberships
                })
                toast.success(user.memberships[id].name.split(" ")[0] + ", thanks for checking in.")
                setId("")
            }
            else {
                toast.error("You already logged in that class")
            }
        }
        else {
            toast.error("Your membership does not include that sport")
            
        }
        setUser({})
        setSport("")
        setId("")
    }
    const attend = async(sport) => {

         
        try {
            const userRef = collection(db, "users")
            console.log(id)
            const q = query(userRef,
                where("ids", "array-contains", parseInt(id))
                )
            const docSnap = await getDocs(q)
            const docs = docSnap.docs

            if (docs.length > 0) {
                var user = docs[0].data()
                setUser({...user, uid:docs[0].id})
                setSport(sport)
            }
            else {
                toast.error("User Id not found")
            }
 

        }
        catch(err) {
            console.log(err)
        }
    }

    return (
        <div className="attend">
            <img className="logo" src={require("../assets/Logo-3C.png")} alt="" />
            <h1>
                Enter your User Id:
            </h1>
            <div className="center">
         <form name="forms">
            <input type="text" className="attend-text-input" id="display" name="display" disabled value={id}/>
            <div className="buttons">
               <input type="button" onClick={(e)=>{onChange(e)}} id="seven" value="7"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="eight" value="8"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="nine" value="9"/>
               <br/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="four" value="4"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="five" value="5"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="six" value="6"/>
               <br/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="one" value="1"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="two" value="2"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="three" value="3"/>
               <br/>
               <input type="button" onClick={()=>{setId("") }} id="clear" value="C"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="zero" value="0"/>
               <input type="button" onClick={()=>{setId((prevState)=>{return prevState.slice(0,-1)})}} id="delete" value=" "/>
               <br/>
               <div className="log-btn-div">
                <input type="button" onClick={()=>{attend("bjjClasses")}} className="log-btn" value="Jiu-Jitsu"/>
                <input type="button" onClick={()=>{attend("mtClasses")}} className="log-btn" value="Muay Thai"/>
               </div>
            </div>
         </form>
         <div className={`overlay ${user.memberships?"visible":"hidden"}`} >
            <div className="popup">
                <p>{user.memberships && user.memberships[id].name}?</p>
            <div className="verify-btns">
                <input type="button" onClick={log} value="Yes"/>
                <input type="button" onClick={()=>{setUser({}); setId("")}} value="No"/>

               </div>
            </div>
         </div>
        </div>
        </div>
    )
}

export default Attend