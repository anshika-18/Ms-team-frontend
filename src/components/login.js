import React from 'react'
import './css/login.css'
import {Redirect,useHistory} from 'react-router-dom'

export default function Login(props) {

    const history=useHistory()
    console.log(props)
    const onSubmit=(e)=> {
        e.preventDefault();
        
        localStorage.setItem('token','helloo')
        props.setToken('helloo')
        //console.log('hello')
    }
    return (
        <div className="login">
            <div className="login_wrapper">
                <h2>Login</h2>
                <form>
                    <div className="input_field">
                        <input type="text" name="" required></input>
                        <label>Name</label>
                    </div>
                    <div className="input_field">
                        <input type="email" name="" required></input>
                        <label>Email</label>
                    </div>
                    <div className="input_field">
                        <input type="password" name="" required></input>
                        <label>Password</label>
                    </div>
                    <input type="submit" name="" value="Login" onClick={(e)=>{onSubmit(e)}} className="login_btn"></input>
                    <div className="not_login">Don't have an Account<a href="">Click Here</a></div>
                </form>
            </div>
            <div className="login_text">MICROSOFT TEAMS</div>
        </div>
    )
}

