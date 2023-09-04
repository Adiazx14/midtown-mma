import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import Profile from './pages/Profile';
import PrivateRoute from './pages/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword'
import Attend from './pages/Attend';
import SignUp from './pages/SignUp';
import Members from './pages/Members';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignIn/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/profile/:id' element={<PrivateRoute/>}>
            <Route path='/profile/:id' element={<Profile/>}/>
          </Route>
          <Route path='/attend' element={<Attend/>}/>
          <Route path='/members' element={<Members/>}/>
        </Routes>
      </Router>
      <ToastContainer/>
    </>

  );
}

export default App;
