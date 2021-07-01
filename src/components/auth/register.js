import React,{useState} from 'react'
import '../css/register.css'
import axios from 'axios'
import {Alert} from 'react-bootstrap'
import Reg from '../img/register2.svg'
import Profile from '../img/profile.svg'


export default function Register(props) 
{
    const [username,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [msg,setMsg]=useState('')
    const [show, setShow] = useState(false);

    console.log(props)
    const onSubmit=(e)=> {
        e.preventDefault();
        
        const data={
          name:username,
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
                setMsg(err.response.data.msg)
                setShow(true)
            })
        
    }

    function AlertDismissibleExample() {
      
        if (show) {
          return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
              <p>
                {msg}
              </p>
            </Alert>
          );
        }
        return null;
      }


    return (
        <div className="register">
             <div className="forms-container">
             
             <img src={Reg} className="register-image" alt="register"></img>
                 <form  className="sign-in-form">
                 <AlertDismissibleExample />
                 <img className="login-profile" src={Profile} alt="profile-girl"></img>
                    <h2 className="title">Register</h2>
                        <div className="input-register">
                            <i class="fas fa-user"></i>
                            <input type="text" placeholder="Username" value={username} onChange={(e)=>setName(e.target.value)}/>
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

