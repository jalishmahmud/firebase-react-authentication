import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import './App.css';
import firebaseInitialization from './firebase/firebase.init';

firebaseInitialization();
const googleProvider = new GoogleAuthProvider();
function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);


  const auth = getAuth();
  const handleGoogleSignUp = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const looggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(looggedInUser);
      });
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
  }
  const toggleLogin = e => {
    setIsLogin(e.target.checked)
  }
  const handleNameChange = e => {
    setName(e.target.value);
  }
  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }
  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError('Password must be at least 6 charrecter long');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password must contain 2 uppercase');
      return
    }
    isLogin ? processLogin(email, password) : registerNewUser(email, password);
  }
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('')
      })
      .catch(error => {
        setError(error.message);
      })
  }
  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        verifyEmail();
        setUserName();
      })
      .catch(error => {
        setError(error.message);
      });
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => { })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {

      })
  }




  return (
    <div className="container">

      <form onSubmit={handleRegistration}>
        <h3>Please {isLogin ? 'Login' : 'Register'}</h3>

        {!isLogin && <div className="mb-3">
          <label htmlFor="exampleName" className="form-label">Name</label>
          <input onBlur={handleNameChange} placeholder="Your Name" type="text" className="form-control" id="exampleName" aria-describedby="emailHelp" required />
        </div>}

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input onBlur={handleEmailChange} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input onBlur={handlePasswordChange} type="password" className="form-control" id="exampleInputPassword1" required />
        </div>
        <div className="mb-3 form-check">
          <input onChange={toggleLogin} type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Already Registered?</label>
        </div>
        <div className="cow mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Lgoin' : 'Register'}</button>
        <br /> <br />
        <button onClick={handleResetPassword} className="btn btn-secondary btn-sm">Reset Password</button>
      </form>
      <br /><br /><br />



      <div>--------------------------------------</div>
      <br /><br /><br />
      {!user.name ?
        <button onClick={handleGoogleSignUp}>Google Sign Up</button>
        :
        <button onClick={handleSignOut}>Sign out</button>}
      {
        user.name && <div>
          <h2>Name: {user.name}</h2>
          <p>Your email is: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
