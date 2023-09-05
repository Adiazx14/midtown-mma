import Graph from "../components/Graph";
import { ReactComponent as Belt } from "../assets/belt.svg";
import { ReactComponent as Armband } from "../assets/armband.svg";
import { ReactComponent as UserIcon } from "../assets/userIcon.svg";
import { ReactComponent as Red } from "../assets/red.svg";
import { ReactComponent as Yellow } from "../assets/yellow.svg";
import { ReactComponent as Both } from "../assets/both.svg";
import { ReactComponent as Logout } from "../assets/logout.svg";
import { ReactComponent as Camera } from "../assets/camera.svg";
import { ReactComponent as Trash } from "../assets/trash.svg";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useState } from "react";
import useAuthStatus from "../hooks/useAuthStatus";

const Membership = ({ user, profileUserId, email }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const { isAdmin } = useAuthStatus();
  const getBeltColor = (rank) => {
    if (rank.includes("Blue")) {
      return "#00c";
    }
    if (rank.includes("Purple")) {
      return "purple";
    }
    if (rank.includes("Brown")) {
      return "#964B00";
    }
    if (rank.includes("Black")) {
      return "#222";
    }

    return "#fff";
  };

  const signOut = () => {
    auth.signOut();
    localStorage.setItem("uid", "");
    navigate("/");
  };

  const updatePic = async (image) => {
    try {
      if (image) {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${image.name + v4()}`);
        const snapShot = await uploadBytes(imageRef, image);
        const url = await getDownloadURL(snapShot.ref);
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          profilePic: url,
        });
        setProfilePic(url);

        toast.success("Uploaded succesfully");
      } else {
        toast.error("No image selected");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error");
    }
  };

  const deleteUser = async () => {
    const userRef = doc(db, "users", profileUserId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const ids = userData.ids.filter((id) => id !== user.id);
      const memberships = userData.memberships;
      delete memberships[user.id];
      await updateDoc(userRef, { ids, memberships });
    }

    toast.success("User deleted");
    navigate("/members");
  };

  return (
    <div className="profile">
      <div className="user-and-rank">
        <div className="user-div">
          <div className="user-pic-div">
            {profilePic ? (
              <img className="user-pic" src={profilePic} alt="" />
            ) : (
              <UserIcon />
            )}
          </div>
          <div className="user-icon-text">
            <div className="user-text">
              <p>
                <span className="username-span">{user.name}</span>{" "}
                <span className="id-span">ID: {user.id}</span>
              </p>
              <p>
                <a className="user-email" href={"mailto:" + email}>
                  {email}
                </a>
              </p>
              <p className="user-joinDate">Joined: {user.joinDate}</p>
            </div>
            <div className="user-buttons">
              <input
                id="update-pic-btn"
                className="update-pic-btn"
                style={{ display: "None" }}
                onChange={(e) => {
                  updatePic(e.target.files[0]);
                }}
                type="file"
                name="update profile"
              />
              <button
                className="user-button"
                id="actual-btn"
                onClick={() => {
                  document.getElementById("update-pic-btn").click();
                }}
              >
                <Camera />
                <span>Update Pic</span>
              </button>
              <button className="user-button" id="actual-btn" onClick={signOut}>
                <Logout />
                <span>Log Out</span>
              </button>
            </div>
            {isAdmin && (
              <button
                onClick={deleteUser}
                id="delete-button"
                className="user-button"
              >
                <Trash className="trash" />
                <span>Delete user</span>
              </button>
            )}
          </div>
        </div>
        <div
          className={user.membership === "2" ? "rank-div-double" : "rank-div"}
        >
          {user.membership !== "1" && (
            <div className="bjj-info rank-div">
              <Belt className="belt" fill={getBeltColor(user.bjjRank)} />
              <p>Rank: {user.bjjRank}</p>
              <p>Last promotion: {user.bjjPromoted}</p>
            </div>
          )}
          {user.membership !== "0" && (
            <div className="mt-info rank-div">
              <Armband className="armband" />
              <p>Rank: {user.mtRank}</p>
              <p>Last promotion: {user.mtPromoted}</p>
            </div>
          )}
        </div>
      </div>

      <span className="line"></span>
      <div className="calendar-div">
        <Graph
          id={user.id}
          bjjClasses={user.bjjClasses}
          mtClasses={user.mtClasses}
        />
        <div className="legend">
          <div className="legend-icon-div">
            <Red />
            <p>Jiu-Jitsu</p>
          </div>
          <div className="legend-icon-div">
            <Yellow />
            <p>Muay Thai</p>
          </div>
          <div className="legend-icon-div">
            <Both />
            <p>Both</p>
          </div>
        </div>
      </div>
      <button className="sign-out-btn" onClick={signOut}>
        Log Out
      </button>
    </div>
  );
};

export default Membership;
