import React,{useState,useEffect,useRef} from 'react'
import {Tooltip,OverlayTrigger,Popover} from 'react-bootstrap'
import MeetingDetails from '../meeting-details/meeting-details'
import './button.css'
import {useParams} from 'react-router-dom'

const style={
    position:'fixed',
    width:'100%',
    padding:10,
    bottom:0,
    justifySelf:'center'
}

export default function BottomControls(props){
    const [duration,setDuration]=useState('')
    const [time,setTime]=useState(0)
    const {roomId}=useParams()

    //set video duration (update it after each 1000ms)
    useEffect(() => {
        const set=setInterval(()=>{
            setTime(time+1)
            let s=time%60;
            let m=Math.floor((time/60));
            let h=Math.floor((time/3600));
            if(m<10)
                m='0'+m;
            if(h<10)
                h='0'+h;
            if(s<10)
                s='0'+s;
            setDuration(h+" : "+m+" : "+s)
        },1000)
        
       return()=>clearInterval(set) 
    },[time])

    //raise hand
    const raiseHand=()=>{
        props.socketInstance?.emit('raise-hand',props.name,roomId)
        props.setRaised(true)
    }

    //someone else raised hand
    useEffect(()=>{
        props.socketInstance?.off('hand-raised').on('hand-raised',(name,room)=>{
           if(roomId===room)
           {
            props.setNewRaise(name)
            console.log(props.newRaise+" shared hand")
            props.setRaiseName(name)
            props.setAlertRaise(true)
           }
        })

        props.socketInstance?.off('hand-lowered').on('hand-lowered',(name,room)=>{
            if(roomId===room)
            {
                console.log(name+" lowered hand")
                props.setLowerHand(name)
            }
        })

    })

    //lower hand
    const lowerHand=()=>{
        props.socketInstance?.emit('lower-hand',props.name,roomId)
        props.setRaised(false)
    }
    

    return(
    <div className={props.theme?"dark-outer-button":"outer-button"}  style={style}>
        <div>
            <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Duration</Popover.Title></Popover>}>
                <div className="time">--{duration}--</div>
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
            <button className="leave mr-2" onClick={props.onLeave}>Leave <i class="fas fa-phone"></i></button>
        </OverlayTrigger>
        <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Raise Hand</Popover.Title></Popover>}>
                {props.raised?<button className="raise-hand" onClick={()=>lowerHand()}>
                    <i class="fas fa-hand-point-up"></i></button>:<button className="raise-hand" onClick={()=>raiseHand()}><i class="fas fa-hand-paper"></i></button>}
        </OverlayTrigger>
    </div>
    <MeetingDetails ></MeetingDetails>
    </div>
    )
}
