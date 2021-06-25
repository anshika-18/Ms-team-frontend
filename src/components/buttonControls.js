import React,{useState,useEffect} from 'react'
import {Tooltip,OverlayTrigger,Popover} from 'react-bootstrap'
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
        <div>
            <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Time</Popover.Title></Popover>}>
                <div className="time">{time}</div>
            </OverlayTrigger>
        </div>

        <div className="centered">
            <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Turn On/Off Audio</Popover.Title></Popover>}>
                <button className={`${props.muted ? props.theme?'dark-danger':"danger" : props.theme?"dark-primary":'primary' }`} onClick={props.toggleMute}>
                <span className="icon">
                <i className={`fas ${props.muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                </span>
            </button>
            </OverlayTrigger>
            <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Turn On/Off Video</Popover.Title></Popover>}>
                <button className={`${props.videoMuted ? props.theme?"dark-danger":'danger' : props.theme?"dark-primary": 'primary' }`} onClick={props.toggleVideoMute}>
                <span className="icon">
                <i className={`fas ${props.videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
                </span>
                </button>
            </OverlayTrigger>
        {props.mesharing
        ?
        <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Stop sharing</Popover.Title></Popover>}>
            <button className="share" onClick={props.stopSharing}>Stop</button>
        </OverlayTrigger>
        :
        <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Share screen</Popover.Title></Popover>}>
            <button className={props.theme?"dark-share":"share"} onClick={props.screenShare}>Share Screen</button></OverlayTrigger>
        }
        <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Leave Call</Popover.Title></Popover>}>
            <button className="leave mr-2" onClick={props.onLeave}>Leave call</button>
        </OverlayTrigger>
    </div>
    <MeetingDetails ></MeetingDetails>
    </div>
    )
}
