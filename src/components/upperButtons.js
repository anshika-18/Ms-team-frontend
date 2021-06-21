import React,{useState,useEffect} from 'react'
import Chat from './chat'
import Connect from './connect'
import './css/upperButtons.css'

export default function UpperButtons(props) {

    const [chat,setChat]=useState(false)
    const [time,setTime]=useState('')
    const [connect,setConnect]=useState(false)

    useEffect(() => {
        const set=setInterval(()=>{
            const temp=new Date()
            const x=temp.toLocaleString('en-us',{hour:'numeric',hour12:'true'})
            let min=temp.getMinutes()
            if(min<10)
            {
                min="0"+min;
            }
            let hours=temp.getHours()%12;
            if(hours<10)
            {
                hours="0"+hours
            }
            setTime(hours+" : "+min+" "+x[x.length-2]+x[x.length-1])
        },1000)
        
       return()=>clearInterval(set) 
    },[])

    return (
        <div>
        
               <div className={props.theme?"dark-upper-outer":"upper-outer"}>
                    <button onClick={()=>{setChat(!chat);setConnect(false)}} className="toggle-chat"><i class="fas fa-comment-dots"></i></button>
                    <Chat theme={props.theme} chat={chat}  socketInstance={props.socketInstance} exitChat={()=>setChat(!chat)}/>
                    <button className="theme-display">{props.theme?<i className="fas fa-cloud-moon"></i>:<i className="fas fa-cloud-sun"></i>}</button>
                    {
                        connect
                        ?
                        <Connect toggleConnect={()=>setConnect(!connect)} connect={connect}/>
                        :
                        null
                    }
                     <button className="connect-out-button" onClick={()=>setConnect(!connect)}><i class="fas fa-share-alt"></i></button>
                    <div className="time">{time}</div>
                    
               </div>
            
        </div> 
    )
} 
