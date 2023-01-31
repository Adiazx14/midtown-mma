import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Calendar } from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { useParams } from "react-router-dom";
import { db } from "../firebase.config";

const Graph = ({bjjClasses, mtClasses}) => {

  const params = useParams()
  console.log(bjjClasses)
  const [editing, setEditing] = useState(false)
  const [editedDay, setEditedDay] = useState("")

  const editDay = (day)=> {
    const uid = localStorage.getItem("uid")
    if (uid === "WThS4cVfqdZypO04WkgRzsZA9pz2" || uid === "gryUf2y7DfdjiSYDS1ABZr1S8T72") {
      setEditing(true)
      setEditedDay(day.toJSON().slice(0, 10))
    }
  }

  const modifyClasses = async(classType) => {
    const userRef = doc(db, "users", params.id)
    const snapDoc = await getDoc(userRef)
    const user = snapDoc.data()
    const newBjj = [...user.bjjClasses, editedDay]
    const newMt = [...user.mtClasses, editedDay]
    const removedBjj = user.bjjClasses.filter(day=>day!==editedDay)
    const removedMt = user.mtClasses.filter(day=>day!==editedDay)
    switch (classType) {
      case "bjj":
        await updateDoc(userRef, {
          bjjClasses: newBjj
        }); break
        case "mt":

          await updateDoc(userRef, {
            mtClasses: newMt
          }); break
        case "both":
        await updateDoc(userRef, {
          bjjClasses: newBjj,
          mtClasses: newMt
        }); break
        default:
          await updateDoc(userRef, {
            bjjClasses: removedBjj,
            mtClasses: removedMt
          }); break
    }
    setEditing(false)
    window.location.reload()
  }

  return (
    <div className="graph">
    <Calendar onClickDay={(value)=>{editDay(value)}} tileClassName={({ date, view }) => {
      if(bjjClasses.includes(date.toJSON().slice(0, 10)) && mtClasses.includes(date.toJSON().slice(0, 10))){
       return  'bjj-mt'
      }
      if(bjjClasses.includes(date.toJSON().slice(0, 10))){
        return  'bjj'
      }
      if(mtClasses.includes(date.toJSON().slice(0, 10))){
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
