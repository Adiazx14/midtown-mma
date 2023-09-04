import { useEffect } from "react";
import useAuthStatus from "../hooks/useAuthStatus";
import { Link } from "react-router-dom";
import { ReactComponent as Green } from "../assets/green.svg";

const Navbar = () => {
  const { isAdmin, uid } = useAuthStatus();

  useEffect(() => {
    console.log(isAdmin);
  }, [isAdmin]);

  return (
    <div className={`navbar${isAdmin ? "" : " hidden"}`}>
      <div className="links-div">
        <div className="greens-div">
          <Green className="green" />
          <Green className="green" />
          <br />
          <Green className="green" />
          <Green className="green" />
        </div>
        <Link to={"/attend"}>Attendance Pad</Link>
        <Link to={"/sign-up"}> Add a member </Link>
        <Link to={"/members"}>Members List</Link>
        <Link to={"/profile/" + uid}>My Profile</Link>
      </div>
    </div>
  );
};

export default Navbar;
