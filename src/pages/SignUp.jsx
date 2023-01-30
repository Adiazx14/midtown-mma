import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp, updateDoc, increment, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../assets/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/visibilityIcon.svg'
import { useEffect } from 'react'
import { bjjRanks, mtRanks } from '../ranks'

function SignUp() {

  const navigate = useNavigate()

  useEffect(()=>{
    const uid = localStorage.getItem("uid")
    if (uid) {
      navigate("/profile/"+uid)
    }
  },[])

  const [showPassword, setShowPassword] = useState(false)
  const today = new Date().toJSON().slice(0, 10)
  const [formData, setFormData] = useState({
    name: '',
    email: "",
    joinDate: today,
    membership: "0",
    bjjClasses: [today],
    mtClasses: [today],
    bjjRank: "White Belt",
    mtRank: "White Armband",
    bjjPromoted: "2023-01-12",
    mtPromoted: "2023-01-13"
  })
  const { name, email, password, joinDate, membership, bjjPromoted, mtPromoted } = formData

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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user
      
      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const userCountRef = doc(db, "userCount", "MlJ9crFv8QgUurfFxFE5")
      await updateDoc(userCountRef, {
          count: increment(1)
      })
      const count = await getDoc(userCountRef)

      const formDataCopy = { ...formData, id: count.data().count}
      delete formDataCopy.password
      if (parseInt(membership)<1) {
        formDataCopy.mtPromoted= ""
        formDataCopy.mtRank= ""
        formDataCopy.mtClasses = []
      }
      if (parseInt(membership)===1) {
        formDataCopy.bjjPromoted= ""
        formDataCopy.bjjRank= ""
        formDataCopy.bjjClasses = []
      }
      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/profile/'+ user.uid)
    } catch (error) {
      toast.error('Something went wrong with registration')
    }
  }

  return (
    <>
      <div className='pageContainer'>

        <form className='sign-form' onSubmit={onSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type='text'
            className='formInput'
            id='name'
            value={name}
            required
            onChange={onChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type='email'
            required
            className='formInput'
            id='email'
            value={email}
            onChange={onChange}
          />

          <label htmlFor="joinDate">Join Date:</label>
          <input
            type='date'
            className='formInput'
            placeholder='Email'
            id='joinDate'
            value={joinDate}
            onChange={onChange}
          />

          <label htmlFor="membership">Membership Type:</label>
          <select 
            id='membership'
            onChange={onChange}
            className="formInput"
          >
            <option value={0}>Jiu-Jitsu</option>
            <option value={1}>Muay Thai</option>
            <option value={2}>Jiu-Jitsu & Muay Thai</option>
          </select>

          {membership !== "1" &&
            <div className="bjj-input-div">
              <label htmlFor="BJJRank">BJJ Rank:</label>
              <select 
              id='bjjRank'
              onChange={onChange}
              className="formInput"
            >
              {bjjRanks.map(rank=><option value={rank}>{rank}</option>)}
            </select>
            <label htmlFor="bjjPromoted">Last BJJ Promotion:</label>
            <input
            type='date'
            className='formInput'
            placeholder='Email'
            id='bjjPromoted'
            value={bjjPromoted}
            onChange={onChange}
          />
            </div>
          }
                    {membership !== "0" &&
            <div className="mt-input-div">
              <label htmlFor="mtRank">Muay Thai Rank:</label>
              <select 
              id='mtRank'
              onChange={onChange}
              className="formInput"
            >
              {mtRanks.map(rank=><option value={rank}>{rank}</option>)}
            </select>
            <label htmlFor="mtPromoted">Last Muay Thai Promotion:</label>
            <input
            type='date'
            className='formInput'
            placeholder='Email'
            id='mtPromoted'
            value={mtPromoted}
            onChange={onChange}
          />
            </div>
          }

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='formInput'
              placeholder='Password'
              required
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

          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>
            <button className='signUpButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
        <Link to='/' className='registerLink'>
          Sign In Instead
        </Link>
      </div>
    </>
  )
}

export default SignUp
