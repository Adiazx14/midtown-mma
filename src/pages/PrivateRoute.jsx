import { Navigate, Outlet,  } from "react-router-dom"

const PrivateRoute = () => {
    const uid = localStorage.getItem("uid")

    return (
        uid ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoute