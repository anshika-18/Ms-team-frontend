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
                    <a href="#about"  className={theme?"dark-login":"login-from-landing"}>About</a>
                    <a href="#contact" className={theme?"dark-register":"register-from-landing"}>Contact</a>
                  </div>
                    <div className={theme?"dark-image1-out":"image1-out"}>
                      <div className={theme?"dark-image1-head":"image1-head"}>Create a room and stay connected</div>
                      <img className="image1" src="https://miro.medium.com/max/3200/1*U0xqOjpBt-Xxkz3i5xbs_w.png"></img>
                    </div>
                  </div>
                </div>
                
                
                <div className={theme?"dark-connect-landing":"connect-landing"}>
                  <div className={theme?"dark-connect-landing-outer":"connect-landing-outer"}>
                    <img src="https://pronto-core-cdn.prontomarketing.com/2/wp-content/uploads/sites/225/2020/03/image-microsoft-teams.jpg"></img>
                    <div className={theme?"dark-connect-main":"connect-main"}>
                      <div className={theme?"dark-connect-head-in":"connect-head-in"}>Stay Connected</div>
                    <div className={theme?"dark-connect-main-text":"connect-main-text"}>
                    Microsoft Teams is an entirely new experience that brings
                     together people, conversations and content—along with the
                      tools that teams need—so they can easily collaborate
                       to achieve more. It’s naturally integrated with the
                        familiar Office applications and is built from the
                         ground up on the Office 365 global, secure cloud. 
                         Starting today, Microsoft Teams is available in
                          preview in 181 countries and in 18 languages to 
                          commercial customers with Office 365 Enterprise
                           or Business plans, with general availability 
                           expected in the first quarter of 2017.</div>
                    </div>
                  </div>
                </div>

                <div className={theme?"dark-about-landning":"about-landing"} id="about">
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


                <div className={theme?"dark-contact-landing":"contact-landing"} id="contact">
                  <div className="contact-up">
                    <img src="https://microsoft.acehacker.com/engage2021/img/demo-content/images/email.png"></img>
                    <div className="contact-text">
                      <div className={theme?"dark-contact-text-head":"contact-text-head"}>Email Us</div>
                      <div className={theme?"dark-contact-text-main":"contact-text-main"}>Write us if you have any queries.</div>
                      <div className={theme?"dark-contact-email":"contact-email"}>anshika.microsoft@gmail.com</div>
                    </div>
                  </div>
                </div>
                <div className={theme?"dark-landing-footer":"landing-footer"}>
                  <div className={theme?"dark-footer-outer":"footer-outer"}>
                    Developed By Anshika Jain @ microsoft engage
                  </div>
                </div>
              </div>
        </div>
    )
}
