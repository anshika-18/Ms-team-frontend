const Room=require('./roomSchema')
const Participant=require('./userSchema')

module.exports=(app)=>{

    //create new room
    app.post('/createRoom',(req,res)=>{
        const {email,roomId,roomname,name}=req.body;
        //create new Room
        const user=new Room({
            roomId,
            name:roomname,
            participants:[{
                    email,
                    name
                }]
        })
        user.save()
            .then(data=>{
                //check if participant who created this room is a new one
                Participant.findOne({email})
                        .then((user)=>{
                            if(user)
                            {
                                user.rooms.push({
                                    roomId,
                                    name:roomname
                                })
                                user.save()
                                    .then((success)=>{
                                        return res.status(200).json({
                                            success,
                                            data
                                        })
                                    })
                                    .catch(err=>{
                                        return res.status(400).json(err)
                                    })
                            }
                            else
                            {
                                 //if new then add this user to participant array
                                const newUser=new Participant({
                                    name,
                                    email,
                                    rooms:[{
                                            roomId,
                                            name:roomname
                                        }]
                                })
                                newUser.save()
                                        .then(success=>{
                                            return res.status(200).json(success)
                                        })
                                        .catch(err=>{
                                            return res.status(400).json(err)
                                        })
                            }
                        })
                        .catch(err=>{
                            return res.status(404).json(err)
                        })
               // return res.status(200).json(data)
            })
            .catch(err=>{
                res.status(404).json(err)
            })
    })

    // Join room 
    app.post('/join/newRoom',(req,res)=>{
        //console.log(req.body)
        const {name,email,roomId}=req.body;

        //find room
        Room.findOne({roomId})
            .then(room=>{
                const roomname=room.name;
                //find participant 
                Participant.findOne({email})
                    .then(user=>{
                        if(user)
                        {
                            //just push new participant
                            user.rooms.push({
                                roomId,
                                name:roomname
                            })
                            user.save()
                                .then(data=>{
                                    room.participants.push({
                                        email,
                                        name
                                    })
                                    room.save()
                                        .then(success=>{
                                            return res.status(200).json({
                                                data,
                                                success
                                            })
                                        })
                                        .catch(err=>{
                                            return res.status(400).json(err)
                                        })
                                })
                                .catch(err=>{
                                    return res.status(400).json(err)
                                })
                        }  
                        else
                        {
                            const data=new Participant({
                                name,
                                email,
                                rooms:[
                                    {
                                        roomId,
                                        name:roomname
                                    }
                                ]
                            })

                            data.save()
                                .then(participant=>{
                                    room.participants.push({
                                        email,
                                        name
                                    })
                                    room.save()
                                        .then(success=>{
                                            return res.status(200).json({
                                                participant,
                                                success
                                            })
                                        })
                                        .catch(err=>{
                                            return res.status(400).json(err)
                                        })
                                    return res.status(200).json(participant)
                                })
                                .catch(err=>{
                                    return res.status(500).json(err)
                                })
                        }
                    })
                    .catch(err=>{
                        return res.status(400).json(err)
                    })
            })
            .catch(err=>{
                return res.status(400).json({msg:"no room found"})
            })
    })

    //fetch which the user is part of
    app.get('/personDetails/:email',(req,res)=>{
        const {email}=req.params
        Participant.findOne({email})
            .then(data=>{
                return res.status(200).json(data)
            })
            .catch(err=>{
                res.status(400).json(err)
            })
    })

    //fetch the details of room
    app.get('/roomDetails/:roomId',(req,res)=>{
        const {roomId}=req.params
        Room.findOne({roomId}) 
            .then(data=>{
                return res.status(200).json(data)
            })
            .catch(err=>{
                res.status(400).json(err)
            })
    })

    app.put('/rooms/leave',(req,res)=>{
        const {roomId,email}=req.body;
        Room.findOne({roomId})
            .then(room=>{
                if(room)
                {
                    const RoomIndex=room.participants.findIndex(current=>current.email===email);
                    if(RoomIndex>-1)
                    {
                        room.participants.splice(RoomIndex,1);
                        Participant.findOne({email})
                                .then(user=>{
                                    if(user)
                                    {
                                        const userRoom=user.rooms.findIndex(current=>current.roomId===roomId)
                                        if(userRoom>-1)
                                        {
                                            user.rooms.splice(userRoom,1);
                                            user.save()
                                                .then(success1=>{
                                                    room.save()
                                                        .then(success2=>{
                                                            return res.status(200).json({msg:"successfully left"})
                                                        })
                                                        .catch(err=>{
                                                            return res.status(400).json(err)
                                                        })

                                                })
                                                .catch(err=>{
                                                    return res.status(400).json(err)
                                                })

                                        }
                                    }
                                })
                                .catch(err=>{
                                    console.log("participant not found")
                                    return res.status(400).json(err)
                                })
                    }
                }
            })
            .catch(err=>{
                console.log("room not found with roomId")
                return res.status(400).json(err)
            })
    })

}

