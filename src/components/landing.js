import React,{useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import './css/landing.css'

import {createRoomAPI} from './api'
export default function Landing({currentUserId}) {
    //console.log(props)
    const history=useHistory()
    const createRoom=useCallback(async()=>{
        
        try
        {
            const roomInformation=await createRoomAPI(currentUserId)
            history.push(`/rooms/${roomInformation.roomId}`)
        }
        catch(err)
        {
            console.log(err)
        }

    },[currentUserId])

    return (
        <div>
             <div className="container pt-5">
               <div className="circle"></div>
                <div className="columns-landing">
                  <div className="columns-landing-1">
                  <div className="text-head">Here We Got <span className="change-color">Something</span></div>
                  <div className="text-head">For <span className="change-color">Everyone.</span></div>
                   <div className="smaller-text">Create Video Room. Stay Connected for unlimited duration</div>
                   <button onClick={createRoom} className="join-button">Join Meeting</button>
                  </div>
                  <div className="columns-landing-2"> 
                  <div>
                    <button className="login-from-landing">Login</button>
                    <button className="register-from-landing">Register</button>
                  </div>
                    <div className="image1-out">
                      <div className="image1-head">Create a room and stay connected</div>
                      <img className="image1" src="https://miro.medium.com/max/3200/1*U0xqOjpBt-Xxkz3i5xbs_w.png"></img>
                    </div>
                  </div>
                </div>
                
              </div>
        </div>
    )
}
