import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { ReactComponent as EditIcon } from "../assets/edit_icon.svg";
import { ReactComponent as ReloadIcon } from "../assets/reloadIcon.svg";
import { bjjRanks, mtRanks } from "../ranks";
import { CSVLink } from "react-csv";
import Navbar from "../components/Navbar";
import useAuthStatus from "../hooks/useAuthStatus";

const Members = () => {
  const navigate = useNavigate();
  const [bjjOrder, setBjjOrder] = useState("alph");
  const [mtOrder, setMtOrder] = useState("alph");
  const [bjjMembers, setBjjMembers] = useState([]);
  const [bjjMembersActual, setBjjMembersActual] = useState([]);
  const [mtMembers, setMtMembers] = useState([]);
  const [mtMembersActual, setMtMembersActual] = useState([]);
  const [editing, setEditing] = useState(false);
  const [fieldEdit, setFieldEdit] = useState(0);
  const [editedMember, setEditedMember] = useState({});
  const [bjjAttendace, setBjjAttendance] = useState([]);
  const [mtAttendace, setMtAttendance] = useState([]);
  const { isAdmin, loadingAdmin } = useAuthStatus();

  const orderByNameAsc = async (sport) => {
    if (sport === "bjj") {
      const arr = [...bjjMembers];
      arr.sort((a, b) => (a.name > b.name ? 1 : -1));
      setBjjMembers(arr);
      setBjjOrder("alph");
    } else {
      const arr = [...mtMembers];
      arr.sort((a, b) => (a.name > b.name ? 1 : -1));
      setMtMembers(arr);
      setMtOrder("alph");
    }
  };

  const fetchMembers = async () => {
    const docSnap = await getDocs(query(collection(db, "users")));
    const bjjMembersData = [];
    const mtMembersData = [];
    docSnap.forEach(async (member) => {
      const memberData = member.data();
      Object.values(memberData.memberships).forEach((membership) => {
        if (membership.membership !== "1") {
          bjjMembersData.push({ ...membership, uid: member.id });
        }
        if (parseInt(membership.membership) >= 1) {
          mtMembersData.push({ ...membership, uid: member.id });
        }
      });
    });

    setBjjMembers(bjjMembersData);
    setBjjMembersActual(bjjMembersData);
    setMtMembers(mtMembersData);
    setMtMembersActual(mtMembersData);
    /*         setBjjAttendance((prev)=>{ return prev.splice(0,0, lastThirtyDates)})
     */
  };

  useEffect(() => {
    console.log(isAdmin);
    if (!isAdmin && !loadingAdmin) {
      toast.error("You are not authorized to access that page");
      navigate("/");
    }
    fetchMembers();
  }, [isAdmin, loadingAdmin]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      { includeMetadataChanges: true },
      (docSnap) => {
        const bjjMembersData = [];
        const mtMembersData = [];
        docSnap.forEach(async (member) => {
          const memberData = member.data();
          Object.values(memberData.memberships).forEach((membership) => {
            if (membership.membership !== "1") {
              bjjMembersData.push({ ...membership, uid: member.id });
            }
            if (parseInt(membership.membership) >= 1) {
              mtMembersData.push({ ...membership, uid: member.id });
            }
          });
        });

        if (bjjOrder === "alph") {
          bjjMembersData.sort((a, b) => (a.name > b.name ? 1 : -1));
        }
        if (mtOrder === "alph") {
          mtMembersData.sort((a, b) => (a.name > b.name ? 1 : -1));
        }
        setBjjMembers(bjjMembersData);
        setBjjMembersActual(bjjMembersData);
        setMtMembers(mtMembersData);
        setMtMembersActual(mtMembersData);
      }
    );

    return unsub;
  }, []);

  const generateCSV = (month) => {
    var date = new Date();
    const dates = [];
    const start = new Date(date.getFullYear(), month, 1);
    const end = new Date(date.getFullYear(), month + 1, 0);
    while (start <= end) {
      dates.push(start.toJSON().slice(0, 10));
      start.setDate(start.getDate() + 1);
    }
    const bjjAttendaceTemp = [];
    bjjMembers.forEach((member) => {
      if (member.status === "Active") {
        const bjjAtt = [member.name, member.id];
        dates.forEach((day) => {
          if (member.bjjClasses.includes(day)) {
            bjjAtt.push(1);
          } else {
            bjjAtt.push(0);
          }
        });
        bjjAttendaceTemp.push(bjjAtt);
      }
    });
    const mtAttendaceTemp = [];
    mtMembers.forEach((member) => {
      if (member.status === "Active") {
        const mtAtt = [member.name, member.id];
        dates.forEach((day) => {
          if (member.mtClasses.includes(day)) {
            mtAtt.push(1);
          } else {
            mtAtt.push(0);
          }
        });
        mtAttendaceTemp.push(mtAtt);
      }
    });

    dates.splice(0, 0, "Name");
    dates.splice(1, 0, "ID");
    bjjAttendaceTemp.splice(0, 0, dates);
    mtAttendaceTemp.splice(0, 0, dates);
    setBjjAttendance(bjjAttendaceTemp);
    setMtAttendance(mtAttendaceTemp);
    setEditing(false);
  };

  const membershipText = (membershipNumber) => {
    if (membershipNumber === "0") {
      return "Jiu-Jitsu";
    }
    if (membershipNumber === "1") {
      return "Muay Thai";
    }
    if (membershipNumber === "2") {
      return "Jiu-Jitsu & Muay Thai";
    }
  };

  const edit = (field, member) => {
    setFieldEdit(field);
    setEditedMember(member);
    console.log(member);
    setEditing(true);
  };

  const onChange = async (e, field) => {
    console.log(e, field);
    const userRef = doc(db, "users", editedMember.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const user = userSnap.data();
      const newMemberships = {
        ...user.memberships,
        [editedMember.id]: {
          ...user.memberships[editedMember.id],
          [field]: e.target.value,
        },
      };
      await updateDoc(userRef, {
        memberships: newMemberships,
      });
      setEditedMember({});
      setEditing(false);

      /*  await fetchMembers()
            if (bjjOrder === "alph") {
                orderByNameAsc("bjj")
            }
            if (mtOrder === "alph") {
                orderByNameAsc("mt")
            } */
    }
  };

  const chooseMonth = () => {
    setEditing(true);
    setFieldEdit("csv");
  };

  const [showInactive, setShowInactive] = useState(true);

  const toggleActiveUsers = () => {
    if (showInactive) {
      setShowInactive(false);
      setBjjMembers(
        bjjMembersActual.filter((member) => member.status === "Active")
      );
      console.log(bjjMembersActual);
    } else {
      setShowInactive(true);
      setBjjMembers(bjjMembersActual);
    }
  };

  return (
    <>
      <Navbar />
      <div className="tables-div">
        {bjjMembers.length > 0 && (
          <div className="bjj-table">
            <div className="table-heading">
              <h1>BJJ Members</h1>
              <ReloadIcon
                onClick={() => {
                  window.location.reload();
                }}
                className="reload-icon"
              />
              <p
                onClick={() => {
                  chooseMonth();
                }}
                className="generate-btn"
              >
                Generate Excel Table
              </p>
              <p
                onClick={() => {
                  toggleActiveUsers();
                }}
                className="generate-btn toggler"
              >
                {showInactive ? "Hide" : "Show"} Inactive
              </p>
              {bjjAttendace.length > 0 && (
                <CSVLink
                  className="generate-btn"
                  filename="BJJ Attendance"
                  data={bjjAttendace}
                >
                  Download Table
                </CSVLink>
              )}
            </div>

            <div className="container">
              <div className="table">
                <div className="table-header">
                  <div
                    onClick={() => {
                      orderByNameAsc("bjj");
                    }}
                    className="header__item"
                  >
                    Name
                  </div>
                  <div className="header__item">Join Date</div>
                  <div className="header__item">Membership Type</div>
                  <div className="header__item">Membership Status</div>
                  <div className="header__item">Rank</div>
                  <div className="header__item">Last Promotion Date</div>
                </div>
                <div className="table-content">
                  {bjjMembers.map((member) => (
                    <div className="table-row">
                      <div className="table-data">
                        <Link to={"/profile/" + member.uid}>{member.name}</Link>
                      </div>
                      <div className="table-data">
                        {member.joinDate}
                        <EditIcon
                          onClick={() => {
                            edit("joinDate", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {membershipText(member.membership)}
                        <EditIcon
                          onClick={() => {
                            edit("membership", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {member.status}
                        <EditIcon
                          onClick={() => {
                            edit("status", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {member.bjjRank}
                        <EditIcon
                          onClick={() => {
                            edit("bjjRank", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {member.bjjPromoted}
                        <EditIcon
                          onClick={() => {
                            edit("bjjPromoted", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {mtMembers.length > 0 && (
          <div className="mt-table">
            <div className="table-heading">
              <h1>Muay Thai Members</h1>
              <ReloadIcon
                onClick={() => {
                  window.location.reload();
                }}
                className="reload-icon"
              />
              <p
                onClick={() => {
                  chooseMonth();
                }}
                className="generate-btn"
              >
                Generate Excel Table
              </p>
              {mtAttendace.length > 0 && (
                <CSVLink
                  className="generate-btn"
                  filename="Muay Thai Attendance"
                  data={mtAttendace}
                >
                  Download Table
                </CSVLink>
              )}
            </div>
            <div className="container">
              <div className="table">
                <div className="table-header">
                  <div
                    onClick={() => {
                      orderByNameAsc("mt");
                    }}
                    className="header__item"
                  >
                    Name
                  </div>
                  <div className="header__item">Join Date</div>
                  <div className="header__item">Membership Type</div>
                  <div className="header__item">Membership Status</div>
                  <div className="header__item">Rank</div>
                  <div className="header__item">Last Promotion Date</div>
                </div>
                <div className="table-content">
                  {mtMembers.map((member) => (
                    <div className="table-row">
                      <div className="table-data">
                        <Link to={"/profile/" + member.uid}>{member.name}</Link>
                      </div>
                      <div className="table-data">
                        {member.joinDate}
                        <EditIcon
                          onClick={() => {
                            edit("joinDate", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {membershipText(member.membership)}
                        <EditIcon
                          onClick={() => {
                            edit("membership", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {member.status}
                        <EditIcon
                          onClick={() => {
                            edit("status", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {member.mtRank}
                        <EditIcon
                          onClick={() => {
                            edit("mtRank", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                      <div className="table-data">
                        {member.mtPromoted}
                        <EditIcon
                          onClick={() => {
                            edit("mtPromoted", member);
                          }}
                          className="edit-icon"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`overlay ${editing ? "visible" : "hidden"}`}>
          <div className="popup">
            <div
              onClick={() => {
                setEditing(false);
              }}
              className="close"
            >
              &times;
            </div>
            {(fieldEdit === "joinDate" ||
              fieldEdit === "bjjPromoted" ||
              fieldEdit === "mtPromoted") && (
              <div className="edit-form">
                <label htmlFor={fieldEdit}>Date:</label>
                <input
                  type="date"
                  className="formInput"
                  id={fieldEdit}
                  defaultValue={editedMember[fieldEdit]}
                  onChange={async (e) => await onChange(e, fieldEdit)}
                />
              </div>
            )}
            {fieldEdit === "membership" && (
              <div className="edit-form">
                <label htmlFor={fieldEdit}>Membership Type</label>
                <select
                  className="formInput"
                  id={fieldEdit}
                  defaultValue={editedMember[fieldEdit]}
                  onChange={async (e) => await onChange(e, fieldEdit)}
                >
                  <option value={0}>Jiu-Jitsu</option>
                  <option value={1}>Muay Thai</option>
                  <option value={2}>Jiu-Jitsu & Muay Thai</option>
                </select>
              </div>
            )}
            {fieldEdit === "status" && (
              <div className="edit-form">
                <label htmlFor={fieldEdit}>Membership Status</label>
                <select
                  className="formInput"
                  id={fieldEdit}
                  defaultValue={editedMember[fieldEdit]}
                  onChange={async (e) => await onChange(e, fieldEdit)}
                >
                  <option value={"Active"}>Active</option>
                  <option value={"Inactive"}>Inactive</option>
                </select>
              </div>
            )}
            {fieldEdit === "bjjRank" && (
              <div className="edit-form">
                <label htmlFor={fieldEdit}>BJJ Rank</label>
                <select
                  className="formInput"
                  id={fieldEdit}
                  defaultValue={editedMember[fieldEdit]}
                  onChange={async (e) => await onChange(e, fieldEdit)}
                >
                  {bjjRanks.map((rank) => (
                    <option value={rank}>{rank}</option>
                  ))}
                </select>
              </div>
            )}
            {fieldEdit === "mtRank" && (
              <div className="edit-form">
                <label htmlFor={fieldEdit}>Muay Thai Rank</label>
                <select
                  className="formInput"
                  id={fieldEdit}
                  defaultValue={editedMember[fieldEdit]}
                  onChange={async (e) => await onChange(e, fieldEdit)}
                >
                  {mtRanks.map((rank) => (
                    <option value={rank}>{rank}</option>
                  ))}
                </select>
              </div>
            )}
            {fieldEdit === "csv" && (
              <div className="edit-form">
                <label htmlFor={fieldEdit}>Choose a month</label>
                <select
                  className="formInput"
                  id={fieldEdit}
                  value={editedMember[fieldEdit]}
                  onChange={(e) => generateCSV(parseInt(e.target.value))}
                >
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Members;

/*                             {bjjMembers.map(member=> member.memberships.map((member)=>{return <div className="table-row">		
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
                            </div>}))} */
