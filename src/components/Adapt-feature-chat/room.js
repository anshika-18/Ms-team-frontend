import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { Button, OverlayTrigger, Popover, Form } from "react-bootstrap";

import "./style.css";

export default function ParticularRoom(props) {
  const [storedMessages, setStoredMessages] = useState([]);
  const location = useLocation();
  const { roomId } = useParams();
  const history = useHistory();
  const socketInstance = useRef(location.socketInstance);
  const [mess, setMess] = useState();
  const [name, setName] = useState(sessionStorage.getItem("name"));
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  const [participants, setParticipants] = useState([]);

  //fetch history of messages and room details
  useEffect(() => {
    //fetch details of all the messages of the room
    axios.get(`http://localhost:5001/allMess/${roomId}`).then((data) => {
      // console.log(data)
      if (data.data) {
        setStoredMessages(data.data.message);
      }
    });
    //fetch details of all the participants of the room
    axios
      .get(`http://localhost:5001/roomDetails/${roomId}`)
      .then((data) => {
        //console.log(data)
        setParticipants(data.data.participants);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [roomId, props.login]);

  //recieve message
  useEffect(() => {
    socketInstance.current?.off("recieve-mess").on("recieve-mess", (data) => {
      if (roomId === data.roomId) {
        const outer = document.getElementById(roomId);
        if (outer) {
          const newDiv = document.createElement("div");
          newDiv.className = "new-mess";
          const nameDiv = document.createElement("div");
          nameDiv.textContent = data.name;
          nameDiv.className = "name";
          const messDiv = document.createElement("div");
          messDiv.textContent = data.mess;
          messDiv.className = "mess";
          newDiv.appendChild(nameDiv);
          newDiv.appendChild(messDiv);
          outer.appendChild(newDiv);
        }
      }
    });
  });

  //send messsage
  const sendMess = (e) => {
    e.preventDefault();
    //socket emit
    const data = {
      roomId,
      name,
      email,
      mess,
    };
    socketInstance.current.emit("send", data);
    //post req
    axios
      .post("http://localhost:5001/newMess", data)
      .then((user) => {
        console.log("mess", user.data.message);
        const outer = document.getElementById(roomId);
        if (outer) {
          const newDiv = document.createElement("div");
          newDiv.className = "new-mess";
          const nameDiv = document.createElement("div");
          nameDiv.textContent = name;
          nameDiv.className = "name";
          const messDiv = document.createElement("div");
          messDiv.textContent = mess;
          messDiv.className = "mess";
          newDiv.appendChild(nameDiv);
          newDiv.appendChild(messDiv);
          outer.appendChild(newDiv);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //display

    setMess("");
  };

  const joinMeet = () => {
    socketInstance.current.disconnect();
    history.push(`/rooms/${roomId}`);
  };

  //copy text to clipboard
  const copy = (copyText) => {
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    console.log(copyText.value);
    document.execCommand("copy");
  };

  //team details and copy code option
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Team Code</Popover.Title>
      <Popover.Content style={{ textAlign: "center", padding: "10px" }}>
        <Form.Control type="text" id="room" value={roomId} />
        <Button
          onClick={() => {
            let copyText = document.getElementById("room");
            copy(copyText);
          }}
          style={{ marginTop: "10px" }}>
          Copy Code
        </Button>
      </Popover.Content>
    </Popover>
  );

  //list of all participants in the room
  const participantsPopover = (
    <Popover id="popover-basic" style={{ width: "200px" }}>
      <Popover.Title as="h3">Members And Guests</Popover.Title>
      {participants.map((p) => (
        <Popover.Content>{p.name}</Popover.Content>
      ))}
    </Popover>
  );

  const leaveGroup = () => {
    console.log("leave");
    const data = {
      roomId,
      email,
    };
    console.log(data);
    axios
      .put("http://localhost:5001/rooms/leave", data)
      .then((success) => {
        console.log("success");
        alert("room Left sucessfully. Reload the page..!");
        //props.setCount(1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={location.login ? "room-1-outer" : "hide-this"}>
      <div className="chat-header">
        <div className="room-name">
          <span className="roomName-logo">
            {location.roomName?.substring(0, 2)}
          </span>
          {location.roomName}
        </div>
        <div className="buttons-chat">
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={participantsPopover}>
            <Button variant="light" className="show-parti">
              Members
            </Button>
          </OverlayTrigger>
          <Button
            variant="light"
            onClick={() => joinMeet()}
            className="join-meet">
            Join Meet
          </Button>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <button variant="light" className="copy-id">
              <i class="fas fa-info-circle"></i>
            </button>
          </OverlayTrigger>
          <Button
            variant="danger"
            onClick={() => leaveGroup()}
            className="leave-group">
            Leave
          </Button>
        </div>
      </div>
      <div id={roomId} className="room-1-mess">
        {storedMessages.map((x) => (
          <div className="new-mess">
            <div className="name">{x.name}</div>
            <div className="mess">{x.mess}</div>
          </div>
        ))}
      </div>
      <form className="room-1-form">
        <input
          className="text-input"
          type="text"
          placeholder="Type message ..."
          name={props.location.key}
          value={mess}
          onChange={(e) => {
            setMess(e.target.value);
          }}></input>
        <input
          className="form-button-chat"
          type="submit"
          value="send"
          onClick={(e) => {
            sendMess(e);
          }}></input>
      </form>
    </div>
  );
}
