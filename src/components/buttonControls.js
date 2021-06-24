import React,{useState,useEffect} from 'react'

import MeetingDetails from './meeting-details'
import './css/button.css'
const style={
    position:'fixed',
    width:'100%',
    padding:10,
    bottom:0,
    justifySelf:'center'
}

export default function BottomControls(props){
    const [time,setTime]=useState('')

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
    return(
    <div className={props.theme?"dark-outer-button":"outer-button"}  style={style}>
        <div className="time">{time}</div>
        <div className="centered">
        
        <button className={`${props.muted ? props.theme?'dark-danger':"danger" : props.theme?"dark-primary":'primary' } mr-2`} onClick={props.toggleMute}>
            <span className="icon">
                <i className={`fas ${props.muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            </span>
        </button>
        <button className={`${props.videoMuted ? props.theme?"dark-danger":'danger' : props.theme?"dark-primary": 'primary' } mr-2`} onClick={props.toggleVideoMute}>
            <span className="icon">
                <i className={`fas ${props.videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
            </span>
        </button>
        {props.mesharing
        ?
        <button className="share mr-2" onClick={props.stopSharing}>Stop</button>
        :
        <button className={props.theme?"dark-share":"share mr-2"} onClick={props.screenShare}>Share Screen</button>
        }
        <button className="leave mr-2" onClick={props.onLeave}>Leave call</button>
    </div>
    <MeetingDetails ></MeetingDetails>
    </div>
    )
}
