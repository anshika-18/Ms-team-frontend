import React,{useCallback,useState} from 'react'
import {useHistory} from 'react-router-dom'
import './css/landing.css'


import {createRoomAPI} from './api'
export default function Landing({currentUserId,setTheme,theme}) {
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
             <div className={theme?"container-outside":"container"}>
               <div className={theme?"dark-circle":"circle"}></div>
               
                <div className={theme?"dark-landing":"columns-landing"}>
                  <div className={theme?"landing-1":"columns-landing-1"}>
                  <button className="theme-change" onClick={setTheme}>{theme?<i className="fas fa-cloud-moon"></i>:<i className="fas fa-cloud-sun"></i>}</button>
                  <div className="shift">
                  <div className={theme?"dark-text-head":"text-head"}><img className="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png"></img>Microsoft<span className={theme?"dark-change-color":"change-color"}> Teams</span></div>
                  <div className={theme?"dark-text-head":"text-head"}>Create <span className={theme?"dark-change-color":"change-color"}>Video Room</span></div>
                   <button onClick={createRoom} className={theme?"dark-join-button":"join-button"}>Join Meeting</button>
                   <div className={theme?"dark-style":"style"}>
                     <div>Chat with your friends</div>
                     <div>Enjoy unlimited Video Calling</div>
                     <div>Enjoy screen sharing</div>
                     <div>Stay Connected</div>
                   </div>
                   </div>
                  </div>
                  <div className={theme?"landing-2":"columns-landing-2"}> 
                  <div>
                    <button className={theme?"dark-login":"login-from-landing"}>Login</button>
                    <button className={theme?"dark-register":"register-from-landing"}>Register</button>
                  </div>
                    <div className={theme?"dark-image1-out":"image1-out"}>
                      <div className={theme?"dark-image1-head":"image1-head"}>Create a room and stay connected</div>
                      <img className="image1" src="https://miro.medium.com/max/3200/1*U0xqOjpBt-Xxkz3i5xbs_w.png"></img>
                    </div>
                  </div>
                </div>
                <div className={theme?"dark-contact-landing":"contact-landing"}>
                  <div className="contact-up">
                    <img src="https://microsoft.acehacker.com/engage2021/img/demo-content/images/email.png"></img>
                    <div className="contact-text">
                      <div className={theme?"dark-contact-text-head":"contact-text-head"}>Email Us</div>
                      <div className={theme?"dark-contact-text-main":"contact-text-main"}>Write us if you have any queries.</div>
                      <div className={theme?"dark-contact-email":"contact-email"}>anshika.website@gmail.com</div>
                    </div>
                  </div>
                </div>
                <div className={theme?"dark-about-landning":"about-landing"}>
                  <div className={theme?"dark-about-outer":"about-outer"}>
                      <div className="set-about">
                      <img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png"></img>
                      <div className={theme?"dark-about-head":"about-head"}>About Us</div>
                      
                      </div>
                      <div className={theme?"dark-about-main":"about-main"}>
                      <span>We believe in what people make possible.</span><br></br>
                      Our mission is to empower every person and every organization on the planet to achieve more.<br></br>
                        Microsoft Teams offers a wide range of features including video calling , text chatting , screen sharing etc.
                      </div>
                  </div>
                </div>
                <div className={theme?"dark-landing-footer":"landing-footer"}>
                  <div className={theme?"dark-footer-outer":"footer-outer"}></div>
                </div>
              </div>
        </div>
    )
}
