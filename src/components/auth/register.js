import React,{useState} from 'react'
import '../css/register.css'
import axios from 'axios'

import Reg from '../img/register2.svg'
import Profile from '../img/profile.svg'
export default function Register(props) {
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    console.log(props)
    const onSubmit=(e)=> {
        e.preventDefault();
        
        const data={
        name,
        email,
        password
        }
        axios.post('https://ms-team-anshika-backend.herokuapp.com/api/auth/register',data)
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
        <div className="register">
             <div className="forms-container">
             <img src={Reg} className="register-image"></img>
                 <form  className="sign-in-form">
                 <img className="login-profile" src={Profile}></img>
                    <h2 className="title">Register</h2>
                        <div className="input-register">
                            <i class="fas fa-user"></i>
                            <input type="text" placeholder="Username" value={name} onChange={(e)=>setName(e.target.value)}/>
                        </div>
                        <div className="input-register">
                            <i class="fas fa-user"></i>
                            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                        </div>
                        <div className="input-register">
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}  />
                        </div>
                        <button className="old-user" onClick={props.setLogin}>Already have an Account?</button>
                        <input className="submit-register" type="submit" value="Register" onClick={(e)=>{onSubmit(e)}} />
                       
                 </form>
          </div>
        </div>
    )
}

