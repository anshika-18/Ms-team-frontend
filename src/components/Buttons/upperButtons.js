import {OverlayTrigger,Popover} from 'react-bootstrap'
import React,{useState} from 'react'
import Chat from '../chat/chat'
import Connect from '../connect'
import './upperButtons.css'
import Participants from '../participants'


export default function UpperButtons(props) {

    const [connect,setConnect]=useState(false)
    const [show,setShow]=useState(false)

    return (
        <div>
            <div className={props.theme?"dark-upper-outer":"upper-outer"}>
               <OverlayTrigger
                placement="left"
                overlay={<Popover id="popover-basic"><Popover.Title as="h3">Chat</Popover.Title></Popover>}>
                    <button onClick={()=>{props.setChat(!props.chat);setConnect(false)}} className="toggle-chat">
                    <i class="fas fa-comment-dots"></i>
                    </button>
                </OverlayTrigger>
            
                <Chat name={props.name} className="chat" theme={props.theme} chat={props.chat} 
                    socketInstance={props.socketInstance} 
                    exitChat={()=>props.setChat(!props.chat)}
                    setAlert={props.setAlert}
                    setAlertMessage={props.setAlertMessage}
                    setAlertName={props.setAlertName}
                    />

                <OverlayTrigger
                placement="left"
                overlay={<Popover id="popover-basic"><Popover.Title as="h3">theme</Popover.Title></Popover>}>
                    <button className="theme-display">
                        {
                            props.theme
                            ?
                            <i className="fas fa-cloud-moon"></i>
                            :
                            <i className="fas fa-cloud-sun"></i>
                        }
                    </button>
                </OverlayTrigger>

                {
                    connect
                    ?
                    <Connect toggleConnect={(value)=>setConnect(value)}  connect={connect}/>
                    :
                    null
                }
                
                <OverlayTrigger
                placement="left"
                overlay={<Popover id="popover-basic"><Popover.Title as="h3">Invite</Popover.Title></Popover>}>
                    <button className="connect-out-button" onClick={()=>{setConnect(!connect); setShow(false);props.setUsers(false);} }>
                         <i className="fas fa-share-alt"></i>
                    </button>
                </OverlayTrigger>

               <Participants show={show} setNewRaise={props.setNewRaise} 
                    setLowerHand={props.setLowerHand} newRaise={props.newRaise} lowerHand={props.lowerHand}></Participants>
                
                <OverlayTrigger
                placement="left"
                overlay={<Popover id="popover-basic"><Popover.Title as="h3">Hand Raised</Popover.Title></Popover>}>
                    <button className="participants-button" onClick={()=>{setShow(!show); setConnect(false);props.setUsers(false);}}>
                        <i class="fas fa-users"></i>
                    </button>
                </OverlayTrigger>
                <OverlayTrigger
                placement="left"
                overlay={<Popover id="popover-basic"><Popover.Title as="h3">Participants</Popover.Title></Popover>}>
                    <button className="participants-button" onClick={()=>{props.setUsers(!props.users); setShow(false); setConnect(false)}}>
                        <i class="far fa-address-book"></i>
                    </button>
                </OverlayTrigger>
                
                
            </div> 
        </div> 
    )
} 
