import React, { useEffect, useRef, useCallback, useState } from 'react';
import io from 'socket.io-client';

import { getUserMediaPromise } from './media';
import { fetchRoomAPI, joinRoomAPI } from './api';
import {useParams,useHistory} from 'react-router-dom'

import RemoteUserVideo from './remotevideo';
import BottomControls from './buttonControls';

function Room ({peerInstance,currentUserId}) {

  const currentMediaStream = useRef(null);
  const currentUserVideoRef = useRef(null);
  const socketInstance = useRef(null);

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
    const userLeftListener = (peerId) => {
      const filteredParticipants = participants.filter(
        participant => participant.userId !== peerId
      )

      setParticipants(filteredParticipants)
    }

    socketInstance?.current?.on('user:left', userLeftListener)

    return () => {
      socketInstance?.current?.off('user:left', userLeftListener)
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

      incomingCall.answer(currentMediaStream.current)

      incomingCall.on('stream', function(remoteStream) {
        const newParticipant= {
          userId: incomingCall.peer,
          mediaStream: remoteStream
        }

        setParticipants(participants.concat(newParticipant));
      });
    }

    peerInstance.on('call', incomingCallListener);

    return () => peerInstance.off('call', incomingCallListener)
  }, [peerInstance, participants])


  useEffect(() => {
    if (!currentMediaStream.current) {
      return;
    }

    const videoTracks = currentMediaStream.current.getVideoTracks();

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


  function screenShare(){
      console.log('lets display screen share ',participants)
      navigator.mediaDevices.getDisplayMedia({cursor:true}).then(stream=>{
          const screenTrack=stream.getTracks()[0]
          //const selected=participants.find(sender=>sender.kind==='video')
          //console.log(screenTrack)
          
          //currentUserVideoRef.current.replaceTrack(screenTrack)
          currentUserVideoRef.current.srcObject=stream
          currentUserVideoRef.current.play()
          currentMediaStream.current=stream
      })
  }

  return (
    <div className="Room">
      <div className="container has-text-centered	">
        <p className="mb-5 mt-5">
          <strong>RoomId: {roomId}</strong>
        </p>
        <div className="columns">
          <div className="column">
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
      />
      <button onClick={screenShare}>Share Screen</button>
    </div>
  );
}

export default Room;
