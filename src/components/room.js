import React, { useEffect, useRef, useCallback, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios'

import { getUserMediaPromise } from './media';
import { fetchRoomAPI, joinRoomAPI } from './api';
import {useParams,useHistory} from 'react-router-dom'

import RemoteUserVideo from './remotevideo';
import BottomControls from './buttonControls';
import './css/room.css'

import Login from './auth/login'
import Register from './auth/register';
import UpperButtons from './upperButtons';


function Room ({peerInstance,currentUserId,theme,setTheme}) {

  const currentMediaStream = useRef(null);
  const currentUserVideoRef = useRef(null);
  const socketInstance = useRef(null);
  const [chat,setChat]=useState(false)

  const screen=useRef(null)
  const [shared,isShared]=useState(false)
  const [mesharing,setMesharing]=useState(false);
  let temp=false;

  const [muted, setMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [participants, setParticipants] = useState([]);

  const [name,setName]=useState('')

  const history=useHistory()
  const { roomId } = useParams();

  const [token,setToken]=useState(sessionStorage.getItem('token'))
  
  //initialization of setting vido
  useEffect(() => {
    
    if(token)
    {
      console.log('if token is valid -----',name)
      setCurrentUserVideo();
      const socket=io.connect('https://ms-team-anshika-backend.herokuapp.com')
      socketInstance.current=socket;

      socketInstance.current.on('get:peerId', () => {
       // console.log('lets send')
      socketInstance?.current?.emit('send:peerId', currentUserId)
    })
    }
  }, [token])

  //someone left the meeting 
  useEffect(() => {
    const userLeft = (peerId) => {
      const filteredParticipants = participants.filter(
        participant => participant.userId !== peerId
      )
      setParticipants(filteredParticipants)
    }

    socketInstance?.current?.on('user:left', userLeft)
    return () => {
      socketInstance?.current?.off('user:left', userLeft)
    }
    
  }, [participants])

  //answer call 
  useEffect(() => {
    if (!peerInstance) {
      return;
    }

    const incomingCallListener = async (incomingCall) => {
      if (!currentMediaStream.current) {
        return;
      }

      incomingCall.answer(currentMediaStream.current)

      console.log(incomingCall.peer)
      
      incomingCall.on('stream', function(remoteStream) {
        console.log('-------------------------------------------------')
        console.log('lets check what the stream is ',remoteStream.getTracks()[0])

        if(remoteStream.getTracks()[0].kind==='audio')
        {
          const data={
            roomId,
            id:incomingCall.peer
          }
          axios.post('https://ms-team-anshika-backend.herokuapp.com/api/getname',data)
              .then(res=>{
                console.log('here is response from axios request',res);
                const newParticipant= {
                  userId: incomingCall.peer,
                  mediaStream: remoteStream,
                  name:res.data
                }
                setParticipants(participants.concat(newParticipant));
                
              })
        }
        else
        {
          console.log('lets play video')
          isShared(true);
          screen.current.srcObject=remoteStream;
          screen.current.play();
        }
        
      })
    }

    peerInstance.on('call', incomingCallListener);

    return () => peerInstance.off('call', incomingCallListener)
  }, [peerInstance, participants])

  //video toggle
  useEffect(() => {
    if (!currentMediaStream.current) {
      return;
    }

    const videoTracks = currentMediaStream.current.getVideoTracks();

    console.log("video - ",videoTracks)
    if (videoTracks[0]) {
      videoTracks[0].enabled = !videoMuted
    }

  }, [videoMuted])

  //audio toggle
  useEffect(() => {
    if (!currentMediaStream.current) {
      return;
    }

    const audioTracks = currentMediaStream.current.getAudioTracks();

    if (audioTracks[0]) {
      audioTracks[0].enabled = !muted
    }

  }, [muted])

  //set my video--- called in initialization useEffect
  const setCurrentUserVideo = useCallback(async () => {
    if (!currentUserVideoRef.current) {
      return;
    }

    if (!currentUserId) {
      return;
    }

    try {
      //console.log('set current user name -- ',name)
      const mediaStream = await getUserMediaPromise({ video: true, audio: true });
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      currentMediaStream.current = mediaStream;
      const participant={
        id:currentUserId,
        name:name
      }
      await joinRoomAPI(roomId,participant)
      await callEveryoneInTheRoom(roomId)
    } catch (error) {
      console.error(error)
    }
  }, [roomId, currentUserId,token])

  // Call function to call the person with given userId
  const call = useCallback((participant)=> {
    if (!peerInstance || !currentMediaStream.current) {
      return Promise.resolve(null);
    }

    //currentMediaStream.current.data="video";
    const outgoingCall = peerInstance.call(participant.id, currentMediaStream.current)

    return new Promise((resolve) => {
      const streamListener = (remoteStream) => {
        const newParticipant= {
          userId:participant.id,
          name:participant.name,
          mediaStream: remoteStream
        }

        outgoingCall.off('stream', streamListener);
        resolve(newParticipant);
        console.log(participants)
      }

      outgoingCall.on('stream', streamListener);
    })
}, [participants]);

//call everyone one by one
  const callEveryoneInTheRoom = useCallback(async (roomId) => {
    try 
    {

      const roomInformation = await fetchRoomAPI(roomId)
      const { participants } = roomInformation;

      console.log(participants)
      if (participants.length) {
        const participantCalls=[] = participants
          .filter((participant) => participant.id !== currentUserId)
          .map((participant) => call(participant))

        Promise.all(participantCalls)
          .then((values=[]) => {
            const validParticipants = values.filter(value => value)
            setParticipants(validParticipants)

          })
      }
    } catch (error) {
      console.error(error)
    }
  }, [currentUserId, call])

//share my screen with person userid
const share=useCallback((stream,userId)=>{

  console.log('calling --- ',userId)
  if(!peerInstance||!screen.current)
  {
    return;
  }
  //console.log(stream.constructor.name)
  //console.log(stream)
  peerInstance.call(userId,stream)

})

//stop screen sharing
function stopSharing(){
  isShared(false)
  setMesharing(false)
  socketInstance.current.emit('stopping-screen-share',roomId)
}

socketInstance.current?.off('stop-sharing').on('stop-sharing',(roomI)=>{
  if(roomId===roomI)
  {
    isShared(false)
  }
})

//share screen 
function screenShare(){
      console.log('lets display screen share ',participants)
      navigator.mediaDevices.getDisplayMedia().then(stream=>{
        let videoTracks=stream.getVideoTracks()[0]
          videoTracks.onended=()=>{
            stopSharing();
          }
          setMesharing(true)
          temp=true
          isShared(true);
          screen.current.srcObject=stream
          screen.current.play();

          //console.log('0 are -- -',participants)
          
          participants.map((participant)=>share(stream,participant.userId))

      })
  }


return (
  <div>
   {
     token?
     <div className={theme?"dark-Room":"Room"}>
        <BottomControls
       onLeave={() => {
         socketInstance?.current?.disconnect()
         history.push(`/`)
       }}
       toggleMute={() => setMuted(!muted)}
       toggleVideoMute={() => setVideoMuted(!videoMuted)}
       muted={muted}
       videoMuted={videoMuted}
       screenShare={()=>screenShare()}
       mesharing={mesharing}
       stopSharing={()=>{stopSharing()}}
       theme={theme}
     />
     <div className={theme?"dark-room-container":"room-container"}>
       <div className={theme?chat?"dark-columns-open":"dark-columns":chat?"columns-open":"columns"}>
         {shared
         ?
         <div >
         <video className={theme?"dark-screen":"screen"} ref={screen} muted></video>
       </div>
       :
       null
       }
         <div className="column">
           <video className={theme?"dark-video":"video"} ref={currentUserVideoRef} muted/>
           <div className="video-name">You</div>
         </div>
         {
           participants.map(
             participant => (
               <RemoteUserVideo theme={theme}
                 key={participant.userId}
                 remoteStream={participant.mediaStream}
                 name={participant.name}
               />
             )
           )
         }
       </div>
       <div>
         <UpperButtons theme={theme} socketInstance={socketInstance.current} chat={chat} setChat={setChat} />
     </div>
     </div>
    
     
   </div>
   :
   <div>
   { 
      <Login token={token} setToken={setToken} setName={setName} theme={theme} setTheme={setTheme}></Login>
   }
   </div>
   } 
   </div>
  );
}

export default Room;
