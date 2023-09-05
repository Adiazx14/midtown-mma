import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import Navbar from "../components/Navbar";
import { ReactComponent as Belt } from "../assets/belt.svg";
import { ReactComponent as Armband } from "../assets/armband.svg";
import { ReactComponent as Punch } from "../assets/punch.svg";
import { ReactComponent as Yes } from "../assets/check.svg";
import { ReactComponent as No } from "../assets/cross.svg";

import useAuthStatus from "../hooks/useAuthStatus";

const Attend = () => {
  const [id, setId] = useState("");
  const [sport, setSport] = useState("");
  const [user, setUser] = useState({});
  const { isAdmin, loadingAdmin } = useAuthStatus();

  const onChange = (e) => {
    setId((prevState) => {
      return prevState + e.target.value;
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingAdmin && !isAdmin) {
      navigate("/");
    }
  }, [loadingAdmin, isAdmin]);

  const log = async () => {
    if (
      !(sport === "mtClasses" && parseInt(user.membership) < 1) &&
      !(sport === "bjjClasses" && user.membership === "1")
    ) {
      let classes = user.memberships[id][sport];
      console.log(classes);
      if (!classes) {
        classes = [];
      }
      let timeStamp = new Date();
      timeStamp = new Date(timeStamp.getTime() - 21600000)
        .toJSON()
        .slice(0, 10);
      if (!classes.includes(timeStamp)) {
        classes.push(timeStamp);
        const newMemberships = {
          ...user.memberships,
          [id]: { ...user.memberships[id], [sport]: classes },
        };
        await updateDoc(doc(db, "users", user.uid), {
          memberships: newMemberships,
        });
        toast.success(
          user.memberships[id].name.split(" ")[0] + ", thanks for checking in."
        );
        setId("");
      } else {
        toast.error("You already logged in that class");
      }
    } else {
      toast.error("Your membership does not include that sport");
    }
    setUser({});
    setSport("");
    setId("");
  };
  const attend = async (sport) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("ids", "array-contains", parseInt(id)));
      const docSnap = await getDocs(q);
      const docs = docSnap.docs;

      if (docs.length > 0) {
        let user = docs[0].data();
        setUser({ ...user, uid: docs[0].id });
        setSport(sport);
      } else {
        toast.error("User Id not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="attend">
        <div className="logos">
          <img className="logo" src={require("../assets/Logo-3C.png")} alt="" />
          <img
            className="logo"
            id="six-logo"
            src={require("../assets/six-logo.png")}
            alt=""
          />
        </div>

        <div className="center">
          <form name="forms">
            <div id="pad">
              <input
                type="text"
                className="attend-text-input"
                id="display"
                name="display"
                disabled
                value={id}
              />
              <div className="buttons">
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="seven"
                  value="7"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="eight"
                  value="8"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="nine"
                  value="9"
                />
                <br />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="four"
                  value="4"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="five"
                  value="5"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="six"
                  value="6"
                />
                <br />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="one"
                  value="1"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="two"
                  value="2"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="three"
                  value="3"
                />
                <br />
                <input
                  type="button"
                  onClick={() => {
                    setId("");
                  }}
                  id="clear"
                  value="C"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    onChange(e);
                  }}
                  id="zero"
                  value="0"
                />
                <input
                  type="button"
                  onClick={() => {
                    setId((prevState) => {
                      return prevState.slice(0, -1);
                    });
                  }}
                  id="delete"
                  value=" "
                />
              </div>
            </div>
            <div className="log-btn-div">
              <button
                type="button"
                onClick={() => {
                  attend("bjjClasses");
                }}
                className="log-btn"
              >
                <Belt className="icon" />
                <p>Jiu-Jitsu</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  attend("mtClasses");
                }}
                className="log-btn"
              >
                <Armband className="icon" />
                <p>Muay Thai</p>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  attend("mmaClasses");
                }}
                className="log-btn"
              >
                <Punch id="punch" className="icon" />
                <p>MMA</p>
              </button>
            </div>
          </form>
          <div className={`overlay ${user.memberships ? "visible" : "hidden"}`}>
            <div className="popup">
              <p>{user.memberships && user.memberships[id].name}?</p>
              <div className="verify-btns">
                <button id="yes" type="button" onClick={log}>
                  <Yes />
                  <span>Yes</span>
                </button>
                <button
                  id="no"
                  type="button"
                  onClick={() => {
                    setUser({});
                    setId("");
                  }}
                >
                  <No />
                  <span>No</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attend;
