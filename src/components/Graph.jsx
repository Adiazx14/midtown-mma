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

const Graph = ({ bjjClasses, mtClasses, mmaClasses, id }) => {
  const params = useParams();
  const [editing, setEditing] = useState(false);
  const [editedDay, setEditedDay] = useState("");
  const { isAdmin } = useAuthStatus();

  const editDay = (day) => {
    if (isAdmin) {
      setEditing(true);

      setEditedDay(day.toJSON().slice(0, 10));
      console.log(mmaClasses);
    }
  };

  const modifyClasses = async (classType) => {
    const userRef = doc(db, "users", params.id);
    const snapDoc = await getDoc(userRef);
    const user = snapDoc.data();
    let mma = user.memberships[id].mmaClasses;
    if (!mma) {
      mma = [];
    }
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
          },
        };
        await updateDoc(userRef, {
          memberships: newMemberships,
        });
        break;
    }
    setEditing(false);
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
            mmaClasses.includes(timeStamp)
          ) {
            return "bjj-mma-mt";
          }
          if (bjjClasses.includes(timeStamp) && mtClasses.includes(timeStamp)) {
            return "bjj-mt";
          }
          if (
            bjjClasses.includes(timeStamp) &&
            mmaClasses.includes(timeStamp)
          ) {
            return "bjj-mma";
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
        }}
      />
      <div className={`overlay ${editing ? "visible" : "hidden"}`}>
        <div className="popup">
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
            <span>Muay Thay</span>
          </button>
          <button
            onClick={async () => await modifyClasses("mma")}
            className="popup-btn"
          >
            <Mma />
            <span>MMA</span>
          </button>
          <button onClick={async () => {}} className="popup-btn">
            <Private />
            <span>Private</span>
          </button>
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
