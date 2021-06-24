import React,{useState} from 'react'
import './css/meeting-details.css'
import {useParams} from 'react-router-dom'

export default function MeetingDetails() {
    const [open,setOpen]=useState(false)
    const {roomId}=useParams()
    return (
        <div className="meeting-details">
            <button onClick={()=>setOpen(!open)}>Meeting Details<i class="fas fa-info-circle"></i></button>
            <div className={open?"meeting-expand":"meeting-hide"}>
                <div className="meeting-head">Meeting Details-</div>
                <div className="meeting-id"><span>Meeting Id- </span>{roomId}</div>
            </div>
        </div>
    )
}
