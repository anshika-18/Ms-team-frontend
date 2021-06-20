import React from 'react'

import './css/button.css'
const style={
    position:'fixed',
    width:'100%',
    padding:10,
    bottom:0,
    justifySelf:'center'
}

export default function BottomControls(props){
    return(
    <div className="outer-button"  style={style}>
        <div className="centered">
        
        <button className={`${props.muted ? 'danger' : 'primary' } mr-2`} onClick={props.toggleMute}>
            <span className="icon">
                <i className={`fas ${props.muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            </span>
        </button>
        <button className={`${props.videoMuted ? 'danger' : 'primary' } mr-2`} onClick={props.toggleVideoMute}>
            <span className="icon">
                <i className={`fas ${props.videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
            </span>
        </button>
        <button className="share mr-2" onClick={props.screenShare}>Share Screen</button>
        <button className="leave mr-2" onClick={props.onLeave}>Leave call</button>
    </div>
    </div>
    )
}
