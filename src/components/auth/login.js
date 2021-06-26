import React,{useState} from 'react'
import '../css/login.css'
import axios from 'axios'

import Log from '../img/log.svg'
import Profile from '../img/profile.svg'
export default function Login(props) {

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    //console.log(props)
    const onSubmit=async (e)=> {
        e.preventDefault();
        
        const data={
            email:email,
            password:password
        }
        await axios.post('https://ms-team-anshika-backend.herokuapp.com/api/auth/login',(data))
            .then((res)=>{
                console.log(res)
                props.setName(res.data.user.name);
                props.setToken(res.data.token)
                console.log(res.data.user.name);
                sessionStorage.setItem('token',res.data.token)
            })
            .catch(err=>{
                console.log(err)
            })
    }
    return (
        <div className="login">
             <div className="forms-container">
             <img src={Log} className="login-image"></img>
                 <form  className="sign-in-form">
                     <img className="login-profile" src={Profile}></img>
                    <h2 className="title">Login
                    <button className="theme-change" onClick={props.setTheme}>{props.theme?<i className="fas fa-cloud-moon"></i>:<i className="fas fa-cloud-sun"></i>}</button>
                        </h2>
                        <div className="input-login">
                            <i class="fas fa-user"></i>
                            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
                        </div>
                        <div className="input-login">
                            <i class="fas fa-lock"></i>
                            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
                        </div>
                        <button className="new-user" onClick={props.setLogin}>Do not have an Account?</button>
                        <input className="submit-login" type="submit" value="Login" onClick={(e)=>{onSubmit(e)}} />
                        
                 </form>
                
          </div>
        </div>
    )
}

