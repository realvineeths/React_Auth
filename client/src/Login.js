import React, { useEffect, useState ,useContext} from "react";
import {useNavigate} from 'react-router-dom';
import Axios from 'axios';
import './App.css';
import { UserContext } from "./context/userContext";

function Login() {
 const [usernameReg, setUernameReg] = useState("");
 const [passwordReg, setPasswordReg] = useState ("");
 const [userContext,setUserContext]=useContext(UserContext);
 const [username, setUername] = useState("");
 const [password, setPassword] = useState ("");
 const [loginStatus, setLoginStatus] = useState("");
 const navigate = useNavigate();

 Axios.defaults.withCredentials = true;
 const register = () => {
    console.log();
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });
 };
 const genericErrorMessage = "Something went wrong! Please try again later.";
  const login = () => {
    // console.log(username,password);
  Axios.post("http://localhost:8880/login", {
      username: username,
      password: password,
  })
  .then(async response => {

    // setIsSubmitting(false)

      console.log('no error');
      if(response.status==200)
      {
        console.log(response);
        // console.log(response.data.user_id);
        setUserContext(oldValues => {
          return { ...oldValues, token: response.data }

        })

        try {
          localStorage.setItem("userstore", JSON.stringify(response.data));
        } catch (error) {
          console.log(error);
        }

      }
    }

  )
  .catch(error => {

      if(error.response)
      if (error.response.status === 400) {

        // setError("Please fill all the fields correctly!")
        console.log("Please fill all the fields correctly!")

      } else if (error.response.status === 401) {

        console.log("Invalid email and password combination.")

      } else {

        console.log(genericErrorMessage)

    }
    // console.log('error',error);
    // setIsSubmitting(false)

    // setError(genericErrorMessage)

  })
  };
// useEffect(() => {
//     Axios.get("http://localhost:3001/login").then((response) => {
//       if (response.data.loggedIn == true) {
//         setRole(response.data.user[0].role);
//       }
//     });
//   }, []);

  useEffect(() => {
    return () => {
      console.log('redirect..');
      console.log(userContext.token);
      console.log('local-> ',localStorage.getItem("userstore"));
      const id=localStorage.getItem("userstore");
      console.log('id-> ',id);
      setUserContext(oldValues=>{
        return {...oldValues,token:id}
      })
      navigate('/');
    }
  }, [])

  return (
    <div className="App">
    <div className="registration">
      <h1>Registration</h1>
      <label>Username</label>
      <input
          type="text"
          onChange={(e) => {
            setUernameReg(e.target.value);
          }}
      /><br/>
      <label>password</label>
      <input 
        type="text"
        onChange={(e) =>{
            setPasswordReg(e.target.value);
        }}
      /> <br />
      <button onClick={register} > Register</button>
    </div>

    <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username…"
          onChange = { (e) => {
              setUername (e.target.value);
          }}
          /> <br/>
        <input
          type="password"
          placeholder="Password…"
          onChange = { (e) => {
              setPassword (e.target.value);
          }}
        />
        <button onClick={login}>Login</button>
    </div>
    <h1> {loginStatus}</h1>
    </div>

  );
}

export default Login;
