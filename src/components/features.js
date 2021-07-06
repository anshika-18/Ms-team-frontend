import React from 'react'
import './css/features.css'
import {Link} from "react-router-dom"
import Light from './img-features/light.jpeg'
import Dark from './img-features/dark.jpeg'
import chat from './img-features/chat.jpeg'
import raise1 from './img-features/raise1.jpeg'
import raise2 from './img-features/raise2.jpeg'
import send from './img-features/send.jpeg'
import video from './img-features/video.jpg'
import screen from './img-features/screen.jpeg'

export default function Features() {
        return (
                <div className="features">
                        <div className="features-head">
                                <div>
                                
                                <img className="logo" alt="ms-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png"></img>
                                </div>
                                <div className="features-heading">Features</div>
                                <Link to="/" className="home">Home</Link>
                        </div>
                        <div className="features-main">
                                <div className="features-1">
                                       <div className="f-1 feature"><a href="#video"><i class="fas fa-video"></i></a><div>Video call</div></div>
                                       <div className="f-2 feature"><a href="#invite"><i class="fas fa-envelope"></i></a><div>Invite</div> </div>
                                       <div className="f-3 feature"><a href="#share"><i class="fas fa-desktop"></i></a><div>Screen Share</div></div>
                                       <div className="f-4 feature"><a href="#chat"><i class="fas fa-comments"></i></a><div>Chat</div></div>
                                       <div className="f-5 feature"><a href="#raised"><i class="fas fa-hand-paper"></i></a><div>Raise Hand</div></div>
                                       <div className="f-6 feature"><a href="#theme"><i class="fas fa-cloud-moon-rain"></i></a><div>Toggle theme</div></div>
                                </div>
                        </div>
                        <div className="feature-grid">
                                <div className="outer-one" id="video">
                                        <div className="heading">Video Call</div>
                                        <div>
                                                <img src={video}></img>
                                        </div>
                                        <div className="feature-text">
                                                Instantly go to video conference with the touch of a button.
                                                Toggle Your audio and video and enjoy free meetings.
                                                Connect with any number of People.
                                        </div>

                                </div>
                                <div className="outer-one" id="chat">
                                        <div  className="heading">Chat</div>
                                        <div>
                                                <img src={chat}></img>
                                        </div>
                                        <div className="feature-text">
                                                Share your opinion and have fun with your team. 
                                                Enjoy group chatting while having a video conference. 
                                        </div>
                                </div>
                                <div className="outer-one" id="invite">
                                        <div className="heading">Invite</div>
                                        <div>
                                                <img src={send}></img>
                                        </div>
                                        <div className="feature-text">
                                                Invite people by mailing the invitation link. 
                                                Can Also copy the link on just click of button and share with anyone.
                                        </div>
                                </div>
                                <div className="outer-one" id="share">
                                        <div className="heading">Screen Share</div>
                                        <div>
                                                <img src={screen}></img>
                                        </div>
                                        <div className="feature-text">
                                        Enhance meetings and boost productivity by sharing your screen in Microsoft Teams.
                                                Present Your screen to everyone in the meeting 
                                                and enjoy group meetings.
                                        </div>
                                </div>
                               
                                
                        </div>
                        
                        <div className="toggle-outer" id="theme">
                                        <div className="heading-dark">Toggle Theme</div>
                                        <div className="feature-toggle">
                                                <img src={Light}></img>
                                                <img src={Dark}></img>   
                                        </div>
                                        <div className="feature-text text-dark">
                                                You can switch the app over to a dark theme if you are looking for something different.<br/>
                                                To get started, Just tap the button on home page or during login.
                                                Dark or Light as you like.<br/>
                                                Have fun..!!
                                        </div>
                        </div>
                        <div className="raise-outer" id="raised">
                                <div className="heading-dark">Raised Hand</div>
                                <div className="feature-toggle">
                                        <img src={raise2}></img>
                                        <img src={raise1}></img>
                                </div>
                                <div className="feature-text text-dark">
                                A participant can use the Raise your hand option to get the speaker's and moderator's attention.<br/>
                                A raised hand is visible to all meeting participants and indicated by a hand icon.<br></br>
                                The raised hand is visible as a notification on bottom left and a box in upper right icons.
                                </div>
                        </div>
                        <div className="landing-footer">
                                <div className="footer-outer">
                                Developed By Anshika Jain @ microsoft engage
                                </div>
                        </div>
              
                        
         </div>
        )
}
