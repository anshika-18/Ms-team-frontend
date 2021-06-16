import React,{useEffect,useState,useRef,useCallback} from 'react'
import io from 'socket.io-client'
import {useParams} from 'react-router-dom'

import { joinRoomAPI,fetchRoomAPI } from './api'
import RemoteStreamVideo from './remotevideo'
import BottomControls from './buttonControls'

const socket=io.connect('https://ms-team-anshika-backend.herokuapp.com')

export default function Room(props) {

    const {roomId}=useParams()
    
    const [currentUserId,setCurrentUser]=useState()
    const currentMediaStream=useRef(null)
    const currentUserVideoRef=useRef(null)
    const [participants,setParticipants]=useState([])
    const peerInstance=useRef(null)
    const [count,setCount]=useState(1)

    const [muted,setMuted]=useState(false)
    const [videoMuted,setVideoMuted]=useState(false)

    useEffect(() => {
        peerInstance.current=props.peerInstance
        setCurrentUser(props.currentUserId)

    },[props.peerInstance,props.currentUserId])

    console.log('welcome to Room page')
   
    useEffect(() => {
        //console.log('first..')
        setCurrentUserVideo();

        socket.on('get:peerId',()=>{
            socket.emit('send:peerId',currentUserId)
        })

    }, [currentUserId])


    //when someone left the meeting    
    useEffect(() => {
        const userLeftListner=(peerId)=>{
            const filteredParticipants=participants.filter(
                participant=>participant.userId!=peerId
            )
            setParticipants(filteredParticipants)
        }

        socket.on('user:left',userLeftListner)
        
        return()=>{
            socket.off('user:left',userLeftListner)
        }

    }, [participants])

    useEffect(() => {
        if(!currentMediaStream.current)
        {
            return;
        }
        const videoTracks=currentMediaStream.current.getVideoTracks()

        if(videoTracks[0])
        {
            videoTracks[0].enabled=!videoMuted
        }
        
    }, [videoMuted])
    
    useEffect(() => {
        if (!currentMediaStream.current) {
          return;
        }
    
        const audioTracks = currentMediaStream.current.getAudioTracks();
    
        if (audioTracks[0]) {
          audioTracks[0].enabled = !muted
        }
    
      }, [muted])


    const setCurrentUserVideo=useCallback(async()=>{
        if(!currentUserVideoRef.current)
        {
            return;
        }
        if(!currentUserId)
        {
            return;
        }
        try
        {
           // console.log('set current user vedio//')
            await navigator.getUserMedia({video:true,audio:true},async(mediaStream)=>{
                
                currentUserVideoRef.current.srcObject=mediaStream
                currentUserVideoRef.current.play();
                currentMediaStream.current=mediaStream
                //console.log("stream set")
                await joinRoomAPI(roomId,currentUserId)
             //   console.log('room joined..')
                await callEveryoneInTheRoom(roomId)
               // console.log('calling done...')
            })
        }
        catch(error)
        {
            console.log(error)
        }
    },[roomId,currentUserId])

    
    const call=(userId)=>{

        if(!currentMediaStream.current)
        {
            console.log('returning')
            return;
        }
        
        const outgoingCall=peerInstance.current.call(userId,currentMediaStream.current)
        
            outgoingCall.on('stream',(remoteStream)=>{
                //console.log('here we go with stream on ioutgoing call')
                const newParticipant={
                    userId: outgoingCall.peer,
                    mediaStream: remoteStream
                  }
                 // console.log(participants.length)
                  //console.log('off anshika calling')
                  participants.push(newParticipant)
                  setParticipants(participants);
                  setCount(count+1)
                  //console.log(participants)
            })

        }

    const callEveryoneInTheRoom=useCallback(async(roomId)=>{
        try
        {
            const roomInformation=await fetchRoomAPI(roomId)
            const {participants}=roomInformation

            //console.log('here are participants to call--',participants)
            
            if(participants.length)
            {
                //console.log("calling everyone-- ",participants)
                const participantCall=participants.filter(
                    
                    (participant)=>participant!==currentUserId)
                    .map((participant)=>call(participant))
            }

        }
        catch(error)
        {
            //console.log('oooppsss error')
            console.log(error)
        }

    },[currentUserId,call])

    useEffect(() => {
        console.log('answer call --')
        if(!peerInstance.current) {
            console.log('peerInstance not found')
            return;
        }        
        const incomingCallListener =(incomingCall) => {
          if (!currentMediaStream.current) {
              console.log('currentMediaStream not found')
            return;
          }
          //console.log('going to incoming call')
          incomingCall.answer(currentMediaStream.current)
    
          //console.log('call is being answered')
          incomingCall.on('stream',async(remoteStream)=> {
         // console.log('remote stream is recieved')
            const newParticipant={
              userId: incomingCall.peer,
              mediaStream: remoteStream
            }
            console.log("before setting--",participants)
            participants.push(newParticipant)
             setParticipants(participants)
             setCount(count+1)
            console.log("after setting--",participants)
          });
        }
    
        peerInstance.current.on('call', incomingCallListener);
    
      //  return () =>peerInstance.current.off('call', incomingCallListener)
      },[participants,peerInstance])

   
    console.log('so lets return')

    return (
        <div>
            <div className="Room">
      <div className="container has-text-centered	">
        <p className="mb-5 mt-5">
          <strong>RoomId: {roomId}</strong>
          
        </p>
        <div className="columns">
          <div className="column">
            <video ref={currentUserVideoRef} muted/>
          </div>
         <div id="help">
             {
                 participants.length>0?
                 <div>{
                    participants.map(
                        participant=>(
                            <RemoteStreamVideo key={participant.userId} remoteStream={participant.mediaStream}></RemoteStreamVideo>   
                        )
                    )
                 }</div>
                 :
                <div>No participant</div>
                
             }
             
         </div>
        </div>
      </div>
     
    </div>
    <BottomControls 
        toggleMute={()=>setMuted(!muted)}
        toggleVideoMute={()=>setVideoMuted(!videoMuted)} 
        muted={muted} 
        videoMuted={videoMuted} >
     </BottomControls>
        </div>
    )
}
