import React, { useEffect, useRef, useCallback, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { getUserMediaPromise } from "./media";
import { fetchRoomAPI, joinRoomAPI } from "./api";
import { useParams, useHistory } from "react-router-dom";
import RemoteUserVideo from "./remotevideo";
import LowerButtons from "./Buttons/lowerButtons";
import "./css/room.css";
import { Alert } from "react-bootstrap";
import Login from "./auth/login";
import Register from "./auth/register";
import UpperButtons from "./Buttons/upperButtons";

export default function Room({ peerInstance, currentUserId, theme, setTheme }) {
  //state to store media
  const currentMediaStream = useRef(null);
  const currentUserVideoRef = useRef(null);
  const socketInstance = useRef(null); //socket instance
  const [chat, setChat] = useState(false); //state of chat box open or close
  const [raised, setRaised] = useState(false); //state of raised hand box open or not
  const [newRaise, setNewRaise] = useState(""); //name of person who raised hand
  const [lowerHand, setLowerHand] = useState(""); //name of person who lowered hand
  //screen share
  const screenStream = useRef(null); //actual stream
  const screen = useRef(null); //scr object of stream
  const [shared, isShared] = useState(false);
  const [mesharing, setMesharing] = useState(false);
  let temp = false;
  const [muted, setMuted] = useState(false); //audio toggle
  const [videoMuted, setVideoMuted] = useState(false); //video toggle
  const [participants, setParticipants] = useState([]); //all participants in room excluding me
  const [name, setName] = useState(""); //my name
  const [login, setLogin] = useState(false); //login or register state
  const history = useHistory(); //use history
  const { roomId } = useParams(); // get roomId from params
  //notification states
  const [alertName, setAlertName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setAlert] = useState(false);
  const [alertRaise, setAlertRaise] = useState(false);
  const [raiseName, setRaiseName] = useState("");
  const [token, setToken] = useState("");
  const [users, setUsers] = useState(false); //state for participant button toggle
  /*
    useEffect(()=>{
      console.log('unmount bhr')
      return()=>{
        console.log('return unmmount')
          leave()
      }
    },[])
  */
  //get user from session storage if already logined
  useEffect(() => {
    if (sessionStorage.getItem("email") && sessionStorage.getItem("name")) {
      setName(sessionStorage.getItem("name"));
      setToken(sessionStorage.getItem("email"));
    }
  }, []);

  //initialization of setting video
  useEffect(() => {
    if (token) {
      setMyVideo();
      // const socket = io.connect("http://localhost:5001");
      const socket = io.connect("http://localhost:5001", {
        transports: ["websocket", "polling"],
      });
      socketInstance.current = socket;
      socketInstance.current.on("get:peerId", () => {
        socketInstance?.current?.emit("send:peerId", currentUserId);
      });
    }
  }, [token]);

  //someone left the meeting
  useEffect(() => {
    //remove user who left from participants state array
    const userLeft = (peerId) => {
      const filteredParticipants = participants.filter(
        (participant) => participant.userId !== peerId
      );
      setParticipants(filteredParticipants);
    };
    socketInstance?.current?.on("user:left", userLeft);
    return () => {
      socketInstance?.current?.off("user:left", userLeft);
    };
  }, [participants]);

  //answer call
  useEffect(() => {
    if (!peerInstance) return;
    const incomingCallListener = async (incoming) => {
      if (!currentMediaStream.current) return;

      incoming.answer(currentMediaStream.current);
      console.log(incoming.peer);
      incoming.on("stream", function (remoteStream) {
        //user video
        if (remoteStream.getTracks()[0].kind === "audio") {
          const data = {
            roomId,
            id: incoming.peer,
          };
          //get name of user who called
          axios.post("http://localhost:5001/api/getname", data).then((res) => {
            //console.log('here is response from axios request',res);
            const newParticipant = {
              userId: incoming.peer,
              mediaStream: remoteStream,
              name: res.data,
            };
            setParticipants(participants.concat(newParticipant));
          });
        }
        //user's screen
        else {
          console.log("lets play video");
          isShared(true);
          screen.current.srcObject = remoteStream;
          screen.current.play();
        }
      });
    };
    peerInstance.on("call", incomingCallListener);
    return () => peerInstance.off("call", incomingCallListener);
  }, [peerInstance, participants]);

  //video toggle
  useEffect(() => {
    if (!currentMediaStream.current) return;
    const videoTracks = currentMediaStream.current.getVideoTracks();
    console.log("video - ", videoTracks);
    if (videoTracks[0]) {
      videoTracks[0].enabled = !videoMuted;
    }
  }, [videoMuted]);

  //audio toggle
  useEffect(() => {
    if (!currentMediaStream.current) return;
    const audioTracks = currentMediaStream.current.getAudioTracks();
    if (audioTracks[0]) {
      audioTracks[0].enabled = !muted;
    }
  }, [muted]);

  //set my video--- called in initialization useEffect
  const setMyVideo = useCallback(async () => {
    if (!currentUserVideoRef.current || !currentUserId) return;

    try {
      const mediaStream = await getUserMediaPromise({
        video: true,
        audio: true,
      });
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
      currentMediaStream.current = mediaStream;
      const participant = {
        id: currentUserId,
        name: name,
      };
      await joinRoomAPI(roomId, participant);
      await callEveryoneInTheRoom(roomId);
    } catch (error) {
      console.error(error);
    }
  }, [roomId, currentUserId, token]);

  // Call function to call the person with given userId
  const call = useCallback(
    (participant) => {
      if (!peerInstance || !currentMediaStream.current)
        return Promise.resolve(null);

      const outgoing = peerInstance.call(
        participant.id,
        currentMediaStream.current
      );
      return new Promise((resolve) => {
        const streamListener = (remoteStream) => {
          const newParticipant = {
            userId: participant.id,
            name: participant.name,
            mediaStream: remoteStream,
          };
          outgoing.off("stream", streamListener);
          resolve(newParticipant);
          console.log(participants);
        };
        outgoing.on("stream", streamListener);
      });
    },
    [participants]
  );

  //call everyone one by one
  const callEveryoneInTheRoom = useCallback(
    async (roomId) => {
      try {
        const roomInformation = await fetchRoomAPI(roomId);
        const { participants } = roomInformation;
        console.log(participants);
        if (participants.length) {
          const participantCalls = ([] = participants
            .filter((participant) => participant.id !== currentUserId)
            .map((participant) => call(participant)));

          Promise.all(participantCalls).then((values = []) => {
            const validParticipants = values.filter((value) => value);
            setParticipants(validParticipants);
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [currentUserId, call]
  );

  //share my screen with person userid
  const share = useCallback((stream, userId) => {
    if (!peerInstance || !screen.current) return;
    peerInstance.call(userId, stream);
  });

  //stop screen sharing
  function stopSharing() {
    isShared(false);
    setMesharing(false);
    socketInstance.current.emit("stopping-screen-share", roomId);
  }

  //if sharer stopped screen sharing
  socketInstance.current?.off("stop-sharing").on("stop-sharing", (roomI) => {
    if (roomId === roomI) isShared(false);
  });

  //share screen
  function screenShare() {
    if (shared === true) {
      alert("Someone is already sharing");
    } else {
      console.log("lets display screen share ", participants);
      navigator.mediaDevices.getDisplayMedia().then((stream) => {
        let videoTracks = stream.getVideoTracks()[0];
        videoTracks.onended = () => {
          stopSharing();
        };
        screenStream.current = stream;
        setMesharing(true);
        temp = true;
        isShared(true);
        screen.current.srcObject = stream;
        screen.current.play();
        participants.map((participant) => share(stream, participant.userId));
      });
    }
  }

  //if someone join after the screen has already been shared
  useEffect(() => {
    if (mesharing && participants[participants.length - 1]) {
      //console.log('peer id for new person - ',participants[participants.length-1].userId)
      share(screenStream.current, participants[participants.length - 1].userId);
    }
  }, [participants]);

  //message notification
  useEffect(() => {
    var d = document.getElementById("alert-outer");
    if (d) {
      setTimeout(() => {
        setAlert(false);
      }, 10000);
    }
  }, [alertName, alertMessage]);

  //raise hand notification
  useEffect(() => {
    if (alertRaise) {
      var d = document.getElementById("alert-outer-raise");
      if (d) {
        setTimeout(() => {
          setAlertRaise(false);
        }, 5000);
      }
    }
  }, [alertRaise]);

  //change class Name to style acc. to no. of users in room
  useEffect(() => {
    const map = document.getElementById("map");
    const video = document.getElementById("video");
    //console.log(video)
    if (video) {
      if (!chat && !theme) {
        if (participants.length === 0) map.className = "single columns";
        else if (participants.length === 1) map.className = "double columns";
        else if (participants.length === 2) map.className = "triple columns";
        else map.className = "columns";
      } else if (chat && !theme) {
        if (participants.length === 0) map.className = "single columns-open";
        else if (participants.length === 1)
          map.className = "double-open columns-open";
        else map.className = "columns-open";
      } else if (!chat && theme) {
        if (participants.length === 0) map.className = "single dark-columns";
        else if (participants.length === 1)
          map.className = "double dark-columns";
        else if (participants.length === 2) map.className = "triple columns";
        else map.className = "dark-columns";
      } else {
        if (participants.length === 0)
          map.className = "single dark-columns-open";
        else if (participants.length === 1)
          map.className = "double-open dark-columns-open";
        else map.className = "dark-columns-open";
      }
    }
  });

  //leave call
  const leave = () => {
    const videoTracks = currentMediaStream.current.getVideoTracks();
    videoTracks[0].stop();
    socketInstance?.current?.disconnect(roomId);
    history.push(`/thanks`);
  };

  return (
    <div>
      {token ? (
        <div className={theme ? "dark-Room" : "Room"}>
          <div className={theme ? "dark-room-container" : "room-container"}>
            <div id="map" className="first">
              {shared ? (
                <div>
                  <video
                    className={
                      theme
                        ? chat
                          ? "dark-screen-open"
                          : "dark-screen"
                        : chat
                        ? "screen-open"
                        : "screen"
                    }
                    ref={screen}
                    muted></video>
                </div>
              ) : null}
              <div className="column">
                <video
                  id="video"
                  className={theme ? "dark-video" : "video"}
                  ref={currentUserVideoRef}
                  muted
                />
                <div className="video-name">You</div>
              </div>
              {participants.map((participant) => (
                <RemoteUserVideo
                  theme={theme}
                  key={participant.userId}
                  remoteStream={participant.mediaStream}
                  name={participant.name}
                />
              ))}
            </div>
            <LowerButtons
              onLeave={() => {
                leave();
              }}
              toggleMute={() => setMuted(!muted)}
              toggleVideoMute={() => setVideoMuted(!videoMuted)}
              muted={muted}
              videoMuted={videoMuted}
              screenShare={() => screenShare()}
              mesharing={mesharing}
              stopSharing={() => {
                stopSharing();
              }}
              theme={theme}
              socketInstance={socketInstance.current}
              name={name}
              raised={raised}
              newRaise={newRaise}
              setRaised={(value) => setRaised(value)}
              setNewRaise={(value) => setNewRaise(value)}
              setLowerHand={(value) => setLowerHand(value)}
              setAlertRaise={(value) => setAlertRaise(value)}
              setRaiseName={(value) => setRaiseName(value)}
            />
            <div>
              <UpperButtons
                setNewRaise={(value) => setNewRaise(value)}
                setLowerHand={(value) => setLowerHand(value)}
                newRaise={newRaise}
                lowerHand={lowerHand}
                name={name}
                socketInstance={socketInstance.current}
                theme={theme}
                chat={chat}
                setChat={setChat}
                setAlert={(value) => setAlert(value)}
                setAlertMessage={(value) => setAlertMessage(value)}
                setAlertName={(value) => setAlertName(value)}
                users={users}
                setUsers={setUsers}
              />
            </div>
            <div className={users ? "show-users" : "hide-users"}>
              <div className="users-head">Participants</div>
              <ul className="users">
                {users && participants.length > 0 ? (
                  participants.map((user) => (
                    <li className="user-outer">
                      <div className="user-logo">
                        {user.name.substring(0, 1)}
                      </div>
                      <div className="user-name">{user.name}</div>
                    </li>
                  ))
                ) : (
                  <div className="no-user">No participants</div>
                )}
              </ul>
            </div>

            <div
              id="alert-outer"
              className={showAlert ? "alert-outer" : "hide"}>
              <Alert variant="danger">
                <Alert.Heading>
                  {" "}
                  <i class="far fa-comment-dots"></i> New Message{" "}
                </Alert.Heading>
                <hr />
                <p>{alertName}</p>
              </Alert>
            </div>

            <div
              id="alert-outer-raise"
              className={alertRaise ? "alert-outer-raise" : "hide"}>
              <div>
                <i class="fas fa-user"></i> {raiseName} raised hand
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {login ? (
            <Register
              setLogin={() => setLogin(!login)}
              token={token}
              setToken={setToken}
              setName={setName}
              theme={theme}
              setTheme={setTheme}></Register>
          ) : (
            <Login
              setLogin={() => setLogin(!login)}
              token={token}
              setToken={setToken}
              setName={setName}
              theme={theme}
              setTheme={setTheme}></Login>
          )}
        </div>
      )}
    </div>
  );
}
