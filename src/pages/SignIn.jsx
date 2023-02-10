import {ReactComponent as GoogleIcon} from "../assets/googleIcon.svg"
import { getAuth, signInWithEmailAndPassword, } from "firebase/auth"
import { doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { Link, useNavigate } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from '../assets/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/visibilityIcon.svg'
import { useState } from "react"
import { toast } from "react-toastify"

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    })
    const { email, password } = formData
  
    const navigate = useNavigate()
  
    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
    }
  
    const onSubmit = async (e) => {
      e.preventDefault()
  
      try {
        const auth = getAuth()
  
        const creds = await signInWithEmailAndPassword(
          auth,
          email,
          password
        )
  
        if (creds.user.uid) {
            localStorage.setItem("uid", creds.user.uid)
            navigate("/profile/"+creds.user.uid)
        }
      } catch (error) {
        toast.error('Bad User Credentials')
      }
    }

    return (
        <div className="sign-in">
            <img className="logo" src={require("../assets/Logo-3C.png")} alt="" />

            <form className="sign-form" onSubmit={onSubmit}>
          <input
            type='email'
            className='formInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='formInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link>

          <div className='signInBar'>
            <p className='signInText'>Sign In</p>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
        </div>
    )
}

export default SignIn