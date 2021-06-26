import React,{useState,useEffect,useCallback} from 'react'
import {useParams} from 'react-router-dom'
import './css/chat.css'

export default function Chat(props) {

    const [data,setData]=useState("")
    const {roomId}=useParams()
    const hex=['#ffff00','#ff0000','#cc0066','#99ff33','#ff0066','#0033cc','#ff3399','#ff6600'];

    function getRandomNumber(){
        return Math.floor(Math.random()*hex.length)
    }

    //send message
    const send=useCallback(()=>{
        props.socketInstance?.emit('send-message',data,roomId,props.name)
        const outer=document.getElementById('chatbox')
            const newmess=document.createElement('div')
            const nameDiv=document.createElement('div')
            nameDiv.textContent="You";
            nameDiv.className="name-div"
            
            nameDiv.style.color=hex[getRandomNumber()]
            newmess.append(nameDiv)
            const dataDiv=document.createElement('div')
            dataDiv.textContent=data;
            newmess.append(dataDiv)
            const smallSpan=document.createElement('div')
            const date=new Date();
            const x=date.toLocaleString('en-us',{hour:'numeric',hour12:'true'})
            const time=date.getHours()%12+" : "+date.getMinutes() +" "+x[x.length-2]+x[x.length-1]
            smallSpan.textContent=time;
            smallSpan.className="smallspan"
            newmess.append(smallSpan)
            newmess.className="my-text";
            outer.append(newmess)
        setData("");   
    })

    //recieve message
    useEffect(()=>{
        console.log('chat js')
        props.socketInstance?.off('recieve-message').on('recieve-message',(message,room,name)=>{
            if(room===roomId)
            {
                console.log(message)
                const outer=document.getElementById('chatbox')
                const newmess=document.createElement('div')
                const nameDiv=document.createElement('div')
                nameDiv.textContent=name;
                nameDiv.className="name-div"
            
                nameDiv.style.color=hex[getRandomNumber()]
                newmess.append(nameDiv)
                const dataDiv=document.createElement('div')
                dataDiv.textContent=message;
                newmess.append(dataDiv)

                const smallSpan=document.createElement('div')
                const date=new Date();
                const x=date.toLocaleString('en-us',{hour:'numeric',hour12:'true'})
                const time=date.getHours()%12+" : "+date.getMinutes() +" "+x[x.length-2]+x[x.length-1]
                smallSpan.textContent=time;
                smallSpan.className="smallspan"
                newmess.append(smallSpan)

                newmess.className="new-text";
                outer.append(newmess)
            }
        })
    })
    //console.log(props.socketInstance)

    return (
        <div className={props.chat? props.theme?"dark-chat":"chat":"hide-chat"}>
            <div className={props.theme?"dark-heading-chat":"heading-chat"}><span>Let's Chat</span><button className="exit-chat" onClick={props.exitChat}><i class="fas fa-times"></i></button></div>
           <div id="chatbox" className={props.theme?"dark-chatbox":"chatbox"}>

           </div>
           <div className="bottom-box">
                <input  type="text" className="form-input" value={data} name="inputdata" onChange={(e)=>{setData(e.target.value)}} placeholder="Type message here...."></input>
                <button className={props.theme?"dark-form-button":"form-button"} onClick={()=>{send()}}><i className="fas fa-arrow-circle-right"></i></button>
                
           </div>
        </div>
    )
}
