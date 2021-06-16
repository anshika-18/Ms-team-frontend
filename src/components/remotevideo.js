import React,{useEffect,useRef} from 'react'

export default function RemoteUserVideo(props) {

    const userVideoRef = useRef()
    console.log('remote video stream function')
    console.log(props)
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
            <video width={640} height={480} ref={userVideoRef} id="video" />
        </div>
    )
}
