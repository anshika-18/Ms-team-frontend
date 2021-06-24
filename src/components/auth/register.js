import React from 'react'
import '../css/register.css'

import Reg from '../img/register2.svg'
import Profile from '../img/profile.svg'
export default function Register(props) {

    console.log(props)
    const onSubmit=(e)=> {
        e.preventDefault();
        
        sessionStorage.setItem('token','helloo')
        props.setToken('helloo')
        //console.log('hello')
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
                            <input type="text" placeholder="Username" />
                        </div>
                        <div className="input-register">
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>
                        <input className="submit-register" type="submit" value="Register" onClick={(e)=>{onSubmit(e)}} />

                 </form>
          </div>
        </div>
    )
}

