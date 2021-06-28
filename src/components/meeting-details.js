import React,{useState} from 'react'
import './css/meeting-details.css'
import {useParams} from 'react-router-dom'

export default function MeetingDetails() {
    const [open,setOpen]=useState(false)
    const {roomId}=useParams()

    const myFunction=()=> {
        console.log('called+')
        var copyText = document.getElementById("myInput");
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        console.log(copyText.value)
        document.execCommand("copy");
        alert("Copied the text: " + copyText.value);
      }

    return (
        <div className="meeting-details">
            <button className="meeting-button" onClick={()=>setOpen(!open)}>Meeting Details<i class="fas fa-info-circle"></i></button>
            <div className={open?"meeting-expand":"meeting-hide"}>
                <div className="meeting-head">Meeting Details-</div>
                <div className="meeting-id"><span>Meeting Id- </span>{roomId}</div>
                <input className="copy-text-input" type="text" value={window.location.href} id="myInput"></input>
                    <button className="copy-text-button" onClick={()=>myFunction()}>Copy Link</button>
            </div>
        </div>
    )
}
