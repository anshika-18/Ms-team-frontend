import React, { useEffect, useRef, useCallback, useState } from 'react';
import io from 'socket.io-client';

import { getUserMediaPromise } from './media';
import { fetchRoomAPI, joinRoomAPI } from './api';
import {useParams,useHistory} from 'react-router-dom'

import RemoteUserVideo from './remotevideo';
import BottomControls from './buttonControls';
import './css/room.css'

import Login from './login'
import Chat from './chat'


function Room ({peerInstance,currentUserId}) {

  const currentMediaStream = useRef(null);
  const currentUserVideoRef = useRef(null);
  const socketInstance = useRef(null);
  const screen=useRef(null)
  const [shared,isShared]=useState(false)
  const [muted, setMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [participants, setParticipants] = useState([]);

  const history=useHistory()
  const { roomId } = useParams();


  useEffect(() => {
    setCurrentUserVideo();
    
    const socket=io.connect('https://ms-team-anshika-backend.herokuapp.com')
    socketInstance.current=socket;

    socketInstance.current.on('get:peerId', () => {
       // console.log('lets send')
      socketInstance?.current?.emit('send:peerId', currentUserId)

    })
  }, [currentUserId])

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


  useEffect(() => {
    if (!peerInstance) {
      return;
    }

    const incomingCallListener = async (incomingCall) => {
      if (!currentMediaStream.current) {
        return;
      }

     // console.log('incoming call is ',incomingCall)      
      incomingCall.answer(currentMediaStream.current)

      incomingCall.on('stream', function(remoteStream) {
        console.log('-------------------------------------------------')
        console.log('lets check what the stream is ',remoteStream.getTracks()[0])
        if(remoteStream.getTracks()[0].kind==='audio')
        {
          const newParticipant= {
            userId: incomingCall.peer,
            mediaStream: remoteStream
          }
          //console.log('m pehle vala hu')
          setParticipants(participants.concat(newParticipant));
        }
        else
        {
          isShared(true)
          screen.current.srcObject=remoteStream;
          screen.current.play();
        }
        
      })
    }

    peerInstance.on('call', incomingCallListener);

    return () => peerInstance.off('call', incomingCallListener)
  }, [peerInstance, participants])


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


  useEffect(() => {
    if (!currentMediaStream.current) {
      return;
    }

    const audioTracks = currentMediaStream.current.getAudioTracks();

    if (audioTracks[0]) {
      audioTracks[0].enabled = !muted
    }

  }, [muted])


  const setCurrentUserVideo = useCallback(async () => {
    if (!currentUserVideoRef.current) {
      return;
    }

    if (!currentUserId) {
      return;
    }

    try {
      const mediaStream = await getUserMediaPromise({ video: true, audio: true });
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      currentMediaStream.current = mediaStream;

      await joinRoomAPI(roomId, currentUserId)
      await callEveryoneInTheRoom(roomId)
    } catch (error) {
      console.error(error)
    }
  }, [roomId, currentUserId])


  const call = useCallback((userId)=> {
    if (!peerInstance || !currentMediaStream.current) {
      return Promise.resolve(null);
    }

    //currentMediaStream.current.data="video";
    const outgoingCall = peerInstance.call(userId, currentMediaStream.current)

    return new Promise((resolve) => {
      const streamListener = (remoteStream) => {
        const newParticipant= {
          userId,
          mediaStream: remoteStream
        }

        outgoingCall.off('stream', streamListener);
        resolve(newParticipant);
        console.log(participants)
      }

      outgoingCall.on('stream', streamListener);
    })
}, [participants]);


  const callEveryoneInTheRoom = useCallback(async (roomId) => {
    try 
    {

      const roomInformation = await fetchRoomAPI(roomId)
      const { participants } = roomInformation;

      if (participants.length) {
        const participantCalls=[] = participants
          .filter((participant) => participant !== currentUserId)
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


const share=useCallback((stream,userId)=>{

  if(!peerInstance||!screen.current)
  {
    return;
  }
  //console.log(stream.constructor.name)
  //console.log(stream)
  peerInstance.call(userId,stream)

})

function screenShare(){
      console.log('lets display screen share ',participants)
      navigator.mediaDevices.getDisplayMedia().then(stream=>{
          isShared(true);
         // const screenTrack=stream.getTracks()[0]
          screen.current.srcObject=stream
          screen.current.play();

          //console.log('lets check screen ',screenTrack)
          //console.log('0 are -- -',participants)
          
          participants.map((participant)=>share(stream,participant.userId))

      })
  }

  return (
    <div className="Room">
        
      <div className="room-container">
        <div className="columns">
          {shared
          ?
          <div>
          <video className="screen" ref={screen}></video>
        </div>
        :
        null
        }
          <div className="column-video">
            <video ref={currentUserVideoRef} muted/>
          </div>
          {
            participants.map(
              participant => (
                <RemoteUserVideo
                  key={participant.userId}
                  remoteStream={participant.mediaStream}
                />
              )
            )
          }
        </div>
        <div>
          <Chat socketInstance={socketInstance.current} />
      </div>
      </div>
      
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
      />
      
    </div>
  );
}

export default Room;
