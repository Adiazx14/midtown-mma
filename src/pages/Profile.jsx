import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Membership from "../components/Membership";
import Navbar from "../components/Navbar";
import useAuthStatus from "../hooks/useAuthStatus";

const Profile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState("");
  const [profileUserId, setProfileUserId] = useState("");
  const { isAdmin, loadingAdmin } = useAuthStatus();

  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid !== params.id && !isAdmin && !loadingAdmin) {
      toast.error("You are not authorized to access that page");
      navigate("/");
    } else setLoggedUserId(uid);
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", params.id);

        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);

          setProfileUserId(docSnap.id);
          setLoading(false);
        } else {
          alert("No user found with that ID");
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="">
      <Navbar />
      {!loading ? (
        Object.values(user.memberships).map((membership) => (
          <Membership
            loggedUserId={loggedUserId}
            profileUserId={profileUserId}
            id={membership.id}
            user={membership}
            email={user.email}
          />
        ))
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
};

export default Profile;
