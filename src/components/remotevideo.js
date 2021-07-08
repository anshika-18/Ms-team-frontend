import React,{useEffect,useRef} from 'react'

export default function RemoteUserVideo(props) {

    const userVideoRef = useRef()
    //play video of each user
    useEffect(() => {
        if (userVideoRef.current && props.remoteStream) {
            userVideoRef.current.srcObject = props.remoteStream
            userVideoRef.current.pause()
            userVideoRef.current.play().then(_ => {
                
              })
              .catch(e => {
                console.log(e)
              });
        }
    }, [props.remoteStream])

    return (
        <div className="column">
            <video id="video" className={props.theme?"dark-video":"video"}  ref={userVideoRef} />
            <div className="video-name">{props.name}</div>
        </div>
    )
}
