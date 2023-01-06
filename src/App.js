import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './components/pages/SignIn';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import Profile from './components/pages/Profile';
import PrivateRoute from './components/PrivateRoute';



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignIn/>}/>
          <Route path='/profile' element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile/>}/>
          </Route>
        </Routes>
      </Router>
      <ToastContainer/>
    </>

  );
}

export default App;
