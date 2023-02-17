import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { useState } from "react"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { db } from "../firebase.config"
import {ReactComponent as EditIcon} from "../assets/edit_icon.svg"
import {ReactComponent as ReloadIcon} from "../assets/reloadIcon.svg"
import { bjjRanks, mtRanks } from "../ranks"
import { CSVLink } from "react-csv"

const Members = ()=> {

    const navigate = useNavigate()
    const [bjjMembers, setBjjMembers] = useState([])
    const [mtMembers, setmMtMembers] = useState([])
    const [editing, setEditing] = useState(false)
    const [fieldEdit, setFieldEdit] = useState(0)
    const [editedMember, setEditedMember] = useState({})
    const [lastThirtyDates, setLastThirtyDays] = useState([])
    const [bjjAttendace, setBjjAttendance] = useState([])
    const [mtAttendace, setMtAttendance] = useState([])


    const fetchMembers = async()=>{
        const docSnap = await getDocs(query(collection(db,"users")))
        const bjjMembersData = []
        const mtMembersData = []
        docSnap.forEach(member=>{
            const memberData = member.data()
            if (memberData.membership!=="1") {
                bjjMembersData.push({...memberData, uid:member.id})
            }
            if (parseInt(memberData.membership)>=1) {
                mtMembersData.push({...memberData, uid:member.id})
            }
            const bjjAtt = [memberData.name]
            const mtAtt = [memberData.name]
            lastThirtyDates.forEach(day=>{
                if (memberData.bjjClasses.includes(day)) {
                    bjjAtt.push("YES")
                }
                else {
                    bjjAtt.push("NO")
                }
                if (memberData.mtClasses.includes(day)) {
                    bjjAtt.push("YES")
                }
                else {
                    mtAtt.push("NO")
                }
            })
            if (bjjAtt.includes("YES")) {
                setBjjAttendance(["adasd"])
                console.log(bjjAttendace)

            }
            if (mtAtt.includes("YES")) {
                setMtAttendance(prev=>[...prev, mtAtt])
            }
            
            
        })
        setBjjMembers(bjjMembersData)
        setmMtMembers(mtMembersData)
        setBjjAttendance(prev=>prev.splice(0,0, lastThirtyDates))
    }

    useEffect(()=>{
        const uid = localStorage.getItem("uid")
        if ((uid!=="WThS4cVfqdZypO04WkgRzsZA9pz2") && uid !== "gryUf2y7DfdjiSYDS1ABZr1S8T72" && uid !== "1joF1n0hmQSdiztegU0uZmy5I3e2") {
            toast.error("You are not authorized to access that page")
            navigate("/")
        }
        const date = new Date()
        const dates = []
        for (let i = 0; i<30; i++) {
            if (date.getDay()!== 6) {
                dates.push(date.toJSON().slice(0,10))
            }
            date.setDate(date.getDate()-1)
        }
        dates.splice(0, 0, "Name")
        setLastThirtyDays(dates)
        fetchMembers()


    },[])

    const membershipText = (membershipNumber) => {
        if (membershipNumber==="0") {
            return "Jiu-Jitsu"
        }
        if (membershipNumber==="1") {
            return "Muay Thai"
        }
        if (membershipNumber==="2") {
            return "Jiu-Jitsu & Muay Thai"
        }
    }

    const edit = (field, member) => {
        setEditing(true)
        setFieldEdit(field)
        setEditedMember(member)
    }

    const onChange = async(e, field) => {
        console.log(field)
        const userRef = doc(db, "users", editedMember.uid)
        console.log(userRef)
        await updateDoc(userRef, {
            [field]:e.target.value
        })
        setEditing(false)
        fetchMembers()
    }


    return (
        <div className="tables-div">
            {bjjMembers.length>0 && 
            <div className="bjj-table">
                <div className="table-heading">
                <h1>BJJ Members</h1>
                <ReloadIcon onClick={()=>{window.location.reload()}} className="reload-icon"/>
                <CSVLink data={bjjAttendace}>Download Excel</CSVLink>
                </div>


                <div className="container">
	                <div className="table">
                        <div className="table-header">
                            <div className="header__item">Name</div>
                            <div className="header__item">Join Date</div>
                            <div className="header__item">Membership Type</div>
                            <div className="header__item">Rank</div>
                            <div className="header__item">Last Promotion Date</div>
                            </div>
                        <div className="table-content">
                            {bjjMembers.map(member=><div className="table-row">		
                                <div className="table-data">
                                    <Link to={"/profile/"+member.uid}>
                                        {member.name}
                                    </Link>
                                </div>
                                <div className="table-data">{member.joinDate}
                                   <EditIcon onClick={()=>{edit("joinDate", member)}} className="edit-icon"/>
                                </div>
                                <div className="table-data">{membershipText(member.membership)}
                                   <EditIcon onClick={()=>{edit("membership", member)}} className="edit-icon"/>
                                </div>
                                <div className="table-data">{member.bjjRank}
                                   <EditIcon onClick={()=>{edit("bjjRank",  member)}} className="edit-icon"/>
                                </div>
                                <div className="table-data">{member.bjjPromoted}
                                   <EditIcon onClick={()=>{edit("bjjPromoted",  member)}} className="edit-icon"/>
                                </div>
                            </div>)}
                        </div>	
                    </div>
                </div>
            </div>

                            }
            {mtMembers.length>0 &&
                <div className="mt-table">
                    <div className="table-heading">
                        <h1>Muay Thai Members</h1>
                        <ReloadIcon onClick={()=>{window.location.reload()}} className="reload-icon"/>
                    </div>
                    <div className="container">
                    
                    <div className="table">
                    <div className="table-header">
                        <div className="header__item">Name</div>
                        <div className="header__item">Join Date</div>
                        <div className="header__item">Membership Type</div>
                        <div className="header__item">Rank</div>
                        <div className="header__item">Last Promotion Date</div>
                        </div>
                        <div className="table-content">	
                            {mtMembers.map(member=><div className="table-row">		
                                <div className="table-data">
                                    <Link to={"/profile/"+member.uid}>
                                        {member.name}
                                    </Link>
                                </div>
                                <div className="table-data">{member.joinDate}
                                   <EditIcon onClick={()=>{edit("joinDate", member)}} className="edit-icon"/>
                                </div>
                                <div className="table-data">{membershipText(member.membership)}
                                   <EditIcon onClick={()=>{edit("membership", member)}} className="edit-icon"/>
                                </div>
                                <div className="table-data">{member.mtRank}
                                   <EditIcon onClick={()=>{edit("mtRank",  member)}} className="edit-icon"/>
                                </div>
                                <div className="table-data">{member.mtPromoted}
                                   <EditIcon onClick={()=>{edit("mtPromoted",  member)}} className="edit-icon"/>
                                </div>
                            </div>)}
                        </div>		
</div>
            </div>
                </div>

            }
        <div className={`overlay ${editing?"visible":"hidden"}`}>
        <div className="popup">
		    <span onClick={()=>{setEditing(false) }} className="close" >&times;</span>
            {(fieldEdit==="joinDate" || fieldEdit==="bjjPromoted" || fieldEdit==="mtPromoted") &&
            <div className="edit-form">
                <label htmlFor={fieldEdit}>Date:</label>
                <input
                    type='date'
                    className='formInput'
                    id={fieldEdit}
                    value={editedMember[fieldEdit]}
                    onChange={async(e)=>await onChange(e, fieldEdit)}
                />
            </div>
            }
            {fieldEdit==="membership" &&   <div className="edit-form">
                <label htmlFor={fieldEdit}>Membership Type</label>
                <select
                    className='formInput'
                    id={fieldEdit}
                    value={editedMember[fieldEdit]}
                    onChange={async(e)=>await onChange(e, fieldEdit)}
                >
            <option value={0}>Jiu-Jitsu</option>
            <option value={1}>Muay Thai</option>
            <option value={2}>Jiu-Jitsu & Muay Thai</option>
                </select>
            </div> 
            }
            {fieldEdit==="bjjRank" &&   <div className="edit-form">
                <label htmlFor={fieldEdit}>BJJ Rank</label>
                <select
                    className='formInput'
                    id={fieldEdit}
                    value={editedMember[fieldEdit]}
                    onChange={async(e)=>await onChange(e, fieldEdit)}
                >
              {bjjRanks.map(rank=><option value={rank}>{rank}</option>)}

                </select>
            </div> 
            }
            {fieldEdit==="mtRank" &&   <div className="edit-form">
                <label htmlFor={fieldEdit}>Muay Thai Rank</label>
                <select
                    className='formInput'
                    id={fieldEdit}
                    value={editedMember[fieldEdit]}
                    onChange={async(e)=>await onChange(e, fieldEdit)}
                >
              {mtRanks.map(rank=><option value={rank}>{rank}</option>)}

                </select>
            </div> 
            }

            
            
        </div>
        </div>
        </div>
    )
}

export default Members