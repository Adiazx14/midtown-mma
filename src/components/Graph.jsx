import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Calendar } from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { useParams } from "react-router-dom";
import { db } from "../firebase.config";

const Graph = ({bjjClasses, mtClasses, id}) => {

  const params = useParams()
  const [editing, setEditing] = useState(false)
  const [editedDay, setEditedDay] = useState("")

  const editDay = (day)=> {
    const uid = localStorage.getItem("uid")
    if (uid === "WThS4cVfqdZypO04WkgRzsZA9pz2" || uid === "gryUf2y7DfdjiSYDS1ABZr1S8T72" || uid=== "JLZtYYmvT3UP7KTr44n9mIUbJDt2") {
      setEditing(true)
      setEditedDay(day.toJSON().slice(0, 10))
      console.log(id)
    }
  }

  const modifyClasses = async(classType) => {
    const userRef = doc(db, "users", params.id)
    const snapDoc = await getDoc(userRef)
    const user = snapDoc.data()

    const newBjj = [...user.memberships[id].bjjClasses, editedDay]
    const newMt = [...user.memberships[id].mtClasses, editedDay]
    const removedBjj = user.memberships[id].bjjClasses.filter(day=>day!==editedDay)
    const removedMt = user.memberships[id].mtClasses.filter(day=>day!==editedDay)
    let newMemberships = {}
    switch (classType) {
      case "bjj":
          newMemberships = {...user.memberships, [id]:{...user.memberships[id], bjjClasses:newBjj}}
          await updateDoc(userRef, {
          memberships: newMemberships
        }); break
        case "mt":
          newMemberships = {...user.memberships, [id]:{...user.memberships[id], mtClasses:newMt}}
          await updateDoc(userRef, {
            memberships: newMemberships
          }); break
        case "both":
          newMemberships = {...user.memberships, [id]:{...user.memberships[id], bjjClasses:newBjj, mtClasses:newMt}}
          await updateDoc(userRef, {
            memberships: newMemberships
          }); break
        default:
          newMemberships = {...user.memberships, [id]:{...user.memberships[id], bjjClasses:removedBjj, mtClasses:removedMt}}
          await updateDoc(userRef, {
            memberships: newMemberships
          }); break
    }
    setEditing(false)
    window.location.reload()
  }

  return (
    <div className="graph">
    <Calendar onClickDay={(value)=>{editDay(value)}} tileClassName={({ date, view }) => {
      const timeStamp = new Date(date.getTime()).toJSON().slice(0,10)
      if(bjjClasses.includes(timeStamp) && mtClasses.includes(timeStamp)){
       return  'bjj-mt'
      }
      if(bjjClasses.includes(timeStamp)){
        return  'bjj'
      }
      if(mtClasses.includes(timeStamp)){
        return  'mt'
      }
    }}/>
          <div className={`overlay ${editing?"visible":"hidden"}`}>
        <div className="popup">
		    <span onClick={()=>{setEditing(false) }} className="close" >&times;</span>
            <button onClick={async()=>await modifyClasses("bjj")} className="popup-btn">Add BJJ</button>
            <button onClick={async()=>await modifyClasses("mt")} className="popup-btn">Add Muay Thai</button>
            <button onClick={async()=>await modifyClasses("both")} className="popup-btn">Add Both</button>
            <button onClick={async()=>await modifyClasses("remove")} className="popup-btn">Remove classes</button>
        </div>
        </div>
  </div>
  )
}

export default Graph
