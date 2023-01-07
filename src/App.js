import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './components/pages/SignIn';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import Profile from './components/pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Attend from './components/pages/Attend';



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignIn/>}/>
          <Route path='/profile/:id' element={<PrivateRoute/>}>
            <Route path='/profile/:id' element={<Profile/>}/>
          </Route>
          <Route path='/attend' element={<Attend/>}/>
        </Routes>
      </Router>
      <ToastContainer/>
    </>

  );
}

export default App;
