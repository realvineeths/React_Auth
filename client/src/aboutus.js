import React ,{useContext,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './context/userContext';

function Aboutus() {
    const [userContext,setContext]=useContext(UserContext);
    const navigate=useNavigate();

    useEffect(()=>{
        // const id=localStorage.getItem("user");
        // setContext(oldValues=>{
        //   return {...oldValues,token:id}
        // })
        navigate('/aboutus');
      },[]);

    const logout=()=>{
        localStorage.removeItem("userstore");
        setContext(oldvalues=>{
            return {...oldvalues,token:null}
        });
        console.log('logout');
    }

  return (
    <>
        <h4>About us..</h4>
        <button><Link to='/'>Click here for home page</Link></button>
        <button onClick={logout}>Logout</button>
    </>
)
}

export default Aboutus