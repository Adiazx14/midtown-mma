import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { db } from "../../firebase.config"
import {ReactComponent as Logo} from "../../assets/Logo-3C.png"

const Attend = () => {

    const [uid, setUid] = useState("")

    const onChange = (e) => {
        setUid(prevState=>{
            return prevState + e.target.value 
        })
    }
    const navigate = useNavigate()
    useEffect(()=>{
        const id = localStorage.getItem("uid")
        if (id !== "k4xQ2mPD3fdg441K1wNlufqhCys1" || id !== "4b3JDYuy6QUCugeMDMuMs56AFK63") {
            navigate("/")
        }
    })
    const attend = async(sport) => {
         
        try {
            const userRef = collection(db, "users")
            const q = query(userRef,
                where("id", "==", parseInt(uid))
                )
            const docSnap = await getDocs(q)
            const docs = docSnap.docs
            if (docs.length > 0) {
                var user = docs[0].data()
                if (!(sport==="mtClasses" && user.membership<1) && !(sport==="bjjClasses" && user.membership===1)) {
                    const classes = docs[0].data()[sport]
                    console.log(classes)
                    const timeStamp = new Date().toLocaleDateString()
                    if (!classes.includes(timeStamp)) {
                        classes.push(timeStamp)
                        await updateDoc(doc(db, "users", docs[0].id), {
                            [sport]:classes
                        })
                        toast.success("Logged in!")
                        navigate("/profile/"+docs[0].id)
                    }
                    else {
                        toast.error("You already logged in that class")
                    }
                }
                else {
                    toast.error("Your membership does not include that sport")
                }
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
            <img src={require("../../assets/Logo-3C.png")} alt="" />
            <h1>
                Enter your User Id:
            </h1>
            <div className="center">
         <form name="forms">
            <input type="text" id="display" name="display" disabled value={uid}/>
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
               <input type="button" onClick={()=>{setUid("") }} id="clear" value="C"/>
               <input type="button" onClick={(e)=>{onChange(e)}} id="zero" value="0"/>
               <input type="button" onClick={()=>{setUid((prevState)=>{return prevState.slice(0,-1)})}} id="delete" value=" "/>
               <br/>
               <div className="log-btn-div">
                <input type="button" onClick={()=>{attend("bjjClasses")}} className="log-btn" value="Jiu-Jitsu"/>
                <input type="button" onClick={()=>{attend("mtClasses")}} className="log-btn" value="Muay Thai"/>
               </div>
            </div>
         </form>
        </div>
        </div>
    )
}

export default Attend