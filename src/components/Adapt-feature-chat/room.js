import React,{useState,useEffect,useRef} from 'react'
import Chat from './chat'
import {useParams,useLocation,useHistory} from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client';
import {Button} from 'react-bootstrap'

import './style.css'

export default function ParticularRoom(props) {
    
    const [storedMessages,setStoredMessages]=useState([])
    const location=useLocation()
    const {roomId}=useParams()
    const history=useHistory()
    const socketInstance=useRef(location.socketInstance)
    const [mess,setMess]=useState()
    const [name,setName]=useState(sessionStorage.getItem('name'))
    const [email,setEmail]=useState(sessionStorage.getItem('email'))


    //console.log(location.socketInstance)
    console.log(props)
    useEffect(() => {
        
        axios.get(`https://ms-team-anshika-backend.herokuapp.com/allMess/${roomId}`)
            .then(data=>{
                console.log(data)
                if(data.data)
                {
                    setStoredMessages(data.data.message)
                }
        })
    },[roomId])

    useEffect(()=>{
        socketInstance.current?.off('recieve-mess').on('recieve-mess',(data)=>{
            if(roomId===data.roomId)
            {
                const outer=document.getElementById(roomId)
                if(outer)
                {
                    const newDiv=document.createElement('div')
                    newDiv.className="new-mess"
                    const nameDiv=document.createElement('div')
                    nameDiv.textContent=data.name;
                    nameDiv.className="name"
                    const messDiv=document.createElement('div')
                    messDiv.textContent=data.mess;
                    messDiv.className="mess"
                    const timeDiv=document.createElement('div')
                    timeDiv.className="date"
                    newDiv.appendChild(nameDiv)
                    newDiv.appendChild(messDiv)
                    newDiv.appendChild(timeDiv)
                    outer.appendChild(newDiv)
                }
            }
        })
    })

    const sendMess=(e)=>{
        e.preventDefault()
        //socket emit
        const data={
            roomId,
            name,
            email,
            mess
        }
        socketInstance.current.emit('send',data)
        //post req
        axios.post('https://ms-team-anshika-backend.herokuapp.com/newMess',data)
            .then(user=>{
                console.log('mess',user.data.message)
                const outer=document.getElementById(roomId)
                if(outer)
                {
                    const newDiv=document.createElement('div')
                    newDiv.className="new-mess"
                    const nameDiv=document.createElement('div')
                    nameDiv.textContent=name;
                    nameDiv.className="name"
                    const messDiv=document.createElement('div')
                    messDiv.textContent=mess;
                    messDiv.className="mess"
                    const timeDiv=document.createElement('div')
                    if(user.data)
                    {
                        timeDiv.textContent=user.data.message[user.data.message.length-1].time.substring(11,16)
                    }
                    timeDiv.className="date"
                    newDiv.appendChild(nameDiv)
                    newDiv.appendChild(messDiv)
                    newDiv.appendChild(timeDiv)
                    outer.appendChild(newDiv)
                }
            })
            .catch(err=>{
                console.log(err)
            })

        //display
        
        setMess('')
    }

    const joinRoom=()=>{
        history.push(`/rooms/${roomId}`)
            
    }

    return (
        <div className={location.login?"room-1-outer":"hide-this"}>
            <div className="chat-header">
                <div className="room-name">{location.roomName}</div>
                <Button variant="light" onClick={()=>joinRoom()}>Join</Button>
            </div>
            <div id={roomId} className="room-1-mess">
            {
                storedMessages.map(x=>(
                    <div className="new-mess">
                        <div className="name">{x.name}</div>
                        <div className="mess">{x.mess}</div>
                        <div className="date">{x.time.substring(11,16)}</div>
                    </div>
                ))
            }
            </div>
             <form className="room-1-form">
                <input className="text-input" type="text" placeholder="Type message ..." name={props.location.key} value={mess} onChange={(e)=>{setMess(e.target.value)}}></input>
                <input className="form-button-chat" type="submit" value="send" onClick={(e)=>{sendMess(e)}} ></input>
            </form>
        </div>
    )
}
