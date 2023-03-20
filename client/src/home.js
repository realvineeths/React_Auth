import React, { useEffect,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './context/userContext';

function Home() {

  const [userContext,setContext]=useContext(UserContext);
  const navigate=useNavigate();
  useEffect(()=>{
    navigate('/');
  },[]);

 const logout=()=>{
    localStorage.removeItem("userstore");
    setContext(oldvalues=>{
      return {...oldvalues,token:null}
    });
    console.log('logout');
 }
  return (
    <div>
       <h1> Welcome home</h1>
      <button><Link to='/aboutus'>Click here for  About us</Link></button>
      <button onClick={logout} >Logout</button>
    </div>
  )
}

export default Home