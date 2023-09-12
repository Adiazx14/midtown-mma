import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import { db } from "../firebase.config";
import useAuthStatus from "../hooks/useAuthStatus";
import { ReactComponent as Bjj } from "../assets/bjj.svg";
import { ReactComponent as Mt } from "../assets/mt.svg";
import { ReactComponent as Mma } from "../assets/mma.svg";
import { ReactComponent as Private } from "../assets/private.svg";

const Graph = ({ bjjClasses, mtClasses, mmaClasses, privateClasses, id }) => {
  const params = useParams();
  const [editing, setEditing] = useState(false);
  const [editedDay, setEditedDay] = useState("");
  const [addingPrivate, setAddingPrivate] = useState(false);
  const { isAdmin } = useAuthStatus();

  const editDay = (day) => {
    if (isAdmin) {
      setEditing(true);

      setEditedDay(day.toJSON().slice(0, 10));
    }
  };

  const modifyClasses = async (classType) => {
    const userRef = doc(db, "users", params.id);
    const snapDoc = await getDoc(userRef);
    const user = snapDoc.data();
    console.log(user);
    let mma = user.memberships[id].mmaClasses;
    if (!mma) {
      mma = [];
    }
    let removedPrivates = user.memberships[id].privateClasses;
    if (!removedPrivates) {
      removedPrivates = {};
    }
    removedPrivates[editedDay] = "";
    const newMma = [...mma, editedDay];
    const newBjj = [...user.memberships[id].bjjClasses, editedDay];
    const newMt = [...user.memberships[id].mtClasses, editedDay];
    const removedBjj = user.memberships[id].bjjClasses.filter(
      (day) => day !== editedDay
    );
    const removedMt = user.memberships[id].mtClasses.filter(
      (day) => day !== editedDay
    );
    const removedMmma = mma.filter((day) => day !== editedDay);
    let newMemberships = {};
    switch (classType) {
      case "bjj":
        newMemberships = {
          ...user.memberships,
          [id]: { ...user.memberships[id], bjjClasses: newBjj },
        };
        await updateDoc(userRef, {
          memberships: newMemberships,
        });
        break;
      case "mt":
        newMemberships = {
          ...user.memberships,
          [id]: { ...user.memberships[id], mtClasses: newMt },
        };
        await updateDoc(userRef, {
          memberships: newMemberships,
        });
        break;
      case "mma":
        newMemberships = {
          ...user.memberships,
          [id]: {
            ...user.memberships[id],
            mmaClasses: newMma,
          },
        };
        await updateDoc(userRef, {
          memberships: newMemberships,
        });
        break;
      default:
        newMemberships = {
          ...user.memberships,
          [id]: {
            ...user.memberships[id],
            bjjClasses: removedBjj,
            mtClasses: removedMt,
            mmaClasses: removedMmma,
            privateClasses: removedPrivates,
          },
        };
        await updateDoc(userRef, {
          memberships: newMemberships,
        });
        break;
    }
    setEditing(false);
    setAddingPrivate(false);
    window.location.reload();
  };

  const addPrivate = async (e) => {
    const userRef = doc(db, "users", params.id);
    const snapDoc = await getDoc(userRef);
    const user = snapDoc.data();
    let classes = user.memberships[id].privateClasses;
    if (!classes) {
      console.log("Didn't work")
      classes = {};
    }
    classes[editedDay] = e.target.value;
    const newMemberships = {
      ...user.memberships,
      [id]: { ...user.memberships[id], privateClasses: classes },
    };
    await updateDoc(userRef, {
      memberships: newMemberships,
    });
    setEditing(false);
    setAddingPrivate(false);
    window.location.reload();
  };

  return (
    <div className="graph">
      <Calendar
        onClickDay={(value) => {
          editDay(value);
        }}
        tileClassName={({ date, view }) => {
          const timeStamp = new Date(date.getTime()).toJSON().slice(0, 10);
          if (
            bjjClasses.includes(timeStamp) &&
            mtClasses.includes(timeStamp) &&
            mmaClasses.includes(timeStamp) &&
            privateClasses[timeStamp]
          ) {
            return "bjj-mt-mma-private";
          }
          if (
            bjjClasses.includes(timeStamp) &&
            mtClasses.includes(timeStamp) &&
            mmaClasses.includes(timeStamp)
          ) {
            return "bjj-mt-mma";
          }
          if (
            bjjClasses.includes(timeStamp) &&
            mtClasses.includes(timeStamp) &&
            privateClasses[timeStamp]
          ) {
            return "bjj-mt-private";
          }
          if (
            bjjClasses.includes(timeStamp) &&
            mmaClasses.includes(timeStamp) &&
            privateClasses[timeStamp]
          ) {
            return "bjj-mma-private";
          }
          if (bjjClasses.includes(timeStamp) && mtClasses.includes(timeStamp)) {
            console.log(privateClasses[timeStamp], privateClasses);
            return "bjj-mt";
          }
          if (
            bjjClasses.includes(timeStamp) &&
            mmaClasses.includes(timeStamp)
          ) {
            return "bjj-mma";
          }
          if (bjjClasses.includes(timeStamp) && privateClasses[timeStamp]) {
            return "bjj-private";
          }
          if (mtClasses.includes(timeStamp) && mmaClasses.includes(timeStamp)) {
            return "mt-mma";
          }
          if (bjjClasses.includes(timeStamp)) {
            return "bjj";
          }
          if (mtClasses.includes(timeStamp)) {
            return "mt";
          }
          if (mmaClasses.includes(timeStamp)) {
            return "mma";
          }
          if (privateClasses[timeStamp]) {
            return "private";
          }
        }}
      />
      <div className={`overlay ${editing ? "visible" : "hidden"}`}>
        <div className="popup">
        <div onClick={()=>{setAddingPrivate(false);setEditing(false)}} className="close">&times;</div>
          <p>Add a class</p>
          <div className="line"></div>
          <button
            onClick={async () => await modifyClasses("bjj")}
            className="popup-btn"
          >
            <Bjj />
            <span>Jiu-jitsu</span>
          </button>
          <button
            onClick={async () => await modifyClasses("mt")}
            className="popup-btn"
          >
            <Mt />
            <span>Muay Thai</span>
          </button>
          <button
            onClick={async () => await modifyClasses("mma")}
            className="popup-btn"
          >
            <Mma />
            <span>MMA</span>
          </button>
          <button
            onClick={async () => {
              setAddingPrivate(true);
            }}
            className="popup-btn"
          >
            <Private />
            <span>Private</span>
          </button>
          <select
            onChange={async (e) => await addPrivate(e)}
            className={addingPrivate ? "active" : "inactive"}
            name="instructor"
          >
            <option value="" selected disabled>
              Select Instructor
            </option>
            <option value="Professor Martinez">Professor Martinez</option>
            <option value="Professor Farias">Professor Farias</option>
            <option value="Coach Junior">Coach Junior</option>
          </select>
          <button
            id="remove-classes"
            onClick={async () => await modifyClasses("remove")}
            className="popup-btn"
          >
            <span>Remove all classes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Graph;
