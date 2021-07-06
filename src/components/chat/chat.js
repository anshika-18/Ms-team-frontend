import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Link,useParams,useHistory} from 'react-router-dom'
import io from 'socket.io-client';
import Login from './login'
import Register from './register'
import {Button,Modal,Form} from 'react-bootstrap'
import {v4 as uuid} from 'uuid'

import './style.css'

export default function Chat(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showJoin,setShowJoin]=useState(false);
    const close=()=>setShowJoin(false)

    const history=useHistory()
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [login,setLogin]=useState(false)
    const [room,setRoom]=useState([])
    const [currentRoom,setCurrentRoom]=useState('')
    const {roomId}=useParams()
    const socketInstance=useRef()
    const [roomname,setroomName]=useState('')
    const [count,setCount]=useState(0)
    const [regorlog,setregorlog]=useState(false)

    console.log(props)
    useEffect(()=>{
        console.log("new socket created")
        socketInstance.current=io('https://ms-team-anshika-backend.herokuapp.com');
        socketInstance.current.emit('join-room',roomId);
        
    },[])

    useEffect(() => {
            console.log('useEffect count',count)
            axios.get(`https://ms-team-anshika-backend.herokuapp.com/personDetails/${email}`)
            .then(data=>{
                if(data.data)
                {
                    console.log(data.data.rooms)
                    setRoom(data.data.rooms)
                }
                sessionStorage.setItem('name',name)
                sessionStorage.setItem('email',email)
            })
        
        
    }, [login,count])

    const create=(e)=>{
        e.preventDefault()
        const id=uuid();
        const data={
            roomname,
            name,
            email,
            roomId:id
        }
        axios.post('https://ms-team-anshika-backend.herokuapp.com/createRoom',data)
            .then(res=>{
                const nw={
                    author:props.currentUserId,
                    roomId:id
                }
                console.log(props.currentUserId);
                axios.post('https://ms-team-anshika-backend.herokuapp.com/rooms',nw)
                    .then(re=>{
                        console.log('room created')
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                console.log(res);
                setShow(false)
                setCount(count+1)
                setroomName('')
            })
            .catch(err=>{
                console.log(err)
            })

    }

    const join=(e)=>{
        e.preventDefault()

        for(let i=0;i<room.length;i++)
        {
            if(roomname===room[i].roomId)
            {
                setShowJoin(false)
                alert('already a part of this team')
                return;
            }
        }
        const data={
            name,
            email,
            roomId:roomname
        }
        axios.post('https://ms-team-anshika-backend.herokuapp.com/join/newRoom',data)
            .then(res=>{
                console.log(res)
                setShowJoin(false)
                setCount(count+1);
                setroomName('')
            })
            .catch(err=>{
                console.log(err)
            })

    }

    console.log(roomId)
    


    return (
        <div >
            {
                login
                ? 
                <div className="root-chat">  
                <div className="team-head">Teams</div>
                    <div className="chat-sidebar">
                    <div>
                        <Button variant="secondary" onClick={handleShow}>
                            Create Team
                        </Button>

                        <Modal show={show} onHide={handleClose}>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Team Name</Form.Label>
                                    <Form.Control type="text" value={roomname} onChange={(e)=>setroomName(e.target.value)} placeholder="Enter Team Name" />
                                </Form.Group>
                                <Modal.Footer>
                                <Button variant="primary" type="submit" onClick={(e)=>{create(e)}}>
                                    Create
                                </Button>
                                <Button variant="primary" onClick={handleClose}>
                                    Close
                                </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                    <div>
                        <Button variant="secondary" onClick={()=>{setShowJoin(true)}}>
                            Join Team
                        </Button>

                        <Modal show={showJoin} onHide={close}>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Team Id</Form.Label>
                                    <Form.Control type="text" value={roomname} onChange={(e)=>setroomName(e.target.value)} placeholder="Team Id"  />
                                </Form.Group>
                                
                                <Button variant="primary" type="submit" onClick={(e)=>{join(e)}}>
                                    Join
                                </Button>
                            </Form>
                        </Modal>
                    </div>
                    </div>
                    <div className="all-rooms">
                    <div className="team-list">
                    {
                    room.map(r=>(
                        <Link key={r.roomId} to={{pathname:"/chat/"+r.roomId,key:roomId,socketInstance:socketInstance.current,roomName:r.name,login:login}}><div>{r.name}</div></Link>
                    ))
                    }
                    </div>
                    </div>
                </div>
                :
                <div>
                    {
                        regorlog
                        ?
                        <Register setLogin={setLogin} setName={setName} setEmail={setEmail} setregorlog={setregorlog}></Register>
                        :
                        <Login setLogin={setLogin} setName={setName} setEmail={setEmail} setregorlog={setregorlog}></Login>

                    }
                </div>
            }    
        </div>
    )
}