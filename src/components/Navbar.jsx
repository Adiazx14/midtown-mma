import { useEffect } from "react";
import useAuthStatus from "../hooks/useAuthStatus";

const Navbar = () => {

    const {isAdmin} = useAuthStatus()

    useEffect(() => {
        console.log(isAdmin)
    }, [isAdmin]);

    return ( 
    <div className={`navbar${isAdmin?"":" hidden"}`}>
asda
    </div> );
}
 
export default Navbar;