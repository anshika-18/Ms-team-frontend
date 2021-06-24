import React,{useState,useEffect} from 'react'
import Chat from './chat'
import Connect from './connect'
import './css/upperButtons.css'

export default function UpperButtons(props) {

    const [connect,setConnect]=useState(false)

    return (
        <div>
        
               <div className={props.theme?"dark-upper-outer":"upper-outer"}>
                    <button onClick={()=>{props.setChat(!props.chat);setConnect(false)}} className="toggle-chat"><i class="fas fa-comment-dots"></i></button>
                    <Chat theme={props.theme} chat={props.chat}  socketInstance={props.socketInstance} exitChat={()=>props.setChat(!props.chat)}/>
                    <button className="theme-display">{props.theme?<i className="fas fa-cloud-moon"></i>:<i className="fas fa-cloud-sun"></i>}</button>
                    {
                        connect
                        ?
                        <Connect toggleConnect={()=>setConnect(!connect)} connect={connect}/>
                        :
                        null
                    }
                     <button className="connect-out-button" onClick={()=>setConnect(!connect)}><i className="fas fa-share-alt"></i></button>
                    <button className="participants-button"><i class="fas fa-users"></i></button>
               </div>
            
        </div> 
    )
} 
