import React,{useState,useEffect,useCallback} from 'react'
import {useParams} from 'react-router-dom'
import './css/chat.css'

export default function Chat(props) {

    const [data,setData]=useState("")
    const {roomId}=useParams()
    
    const send=useCallback(()=>{
        props.socketInstance?.emit('send-message',data,roomId)
        const outer=document.getElementById('chatbox')
            const newmess=document.createElement('div')
            newmess.textContent=data
            newmess.className="my-text";
            outer.append(newmess)
        setData("");   
    })
    useEffect(()=>{
        props.socketInstance?.off('recieve-message').on('recieve-message',(message,room)=>{
            if(room===roomId)
            {
                console.log(message)
                const outer=document.getElementById('chatbox')
                const newmess=document.createElement('div')
                newmess.textContent=message
                newmess.className="new-text";
                outer.append(newmess)
                console.log(outer.scrollHeight)
                console.log(outer.clientHeight)
                console.log(outer.scrollTop)

            }
        })
    })
    //console.log(props.socketInstance)

    return (
        <div className="chat">
            <div className="heading-chat"><span>Let's Chat</span></div>
           <div id="chatbox" className="chatbox">

           </div>
           <div className="bottom-box">
                <input type="text" className="form-input" value={data} name="inputdata" onChange={(e)=>{setData(e.target.value)}} placeholder="Type message here...."></input>
                <button className="form-button" onClick={()=>{send()}}><i className="fas fa-arrow-circle-right"></i></button>
                
           </div>
        </div>
    )
}
