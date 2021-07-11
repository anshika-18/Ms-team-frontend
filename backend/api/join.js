const nodemailer=require('nodemailer')
const transporter=require('../transporter')
module.exports=(app,rooms)=>{

    //Room class
    const Room=require('../room')

    app.get('/',(req,res)=>{
        res.send('Welcome to Microsoft Teams ..!!!')
    })

    //create room for video call
    app.post('/rooms',(req,res)=>{
        //console.log(req.body)
        const newRoom=new Room(req.body)
        console.log(newRoom)
        rooms.push(newRoom)
        res.json({
            roomId:newRoom.roomId
        })
    })
    
    //get details of room (roomId)
    app.get('/rooms/:roomId',(req,res)=>{
        const room =rooms.find((existingRoom)=>existingRoom.roomId===req.params.roomId)
        res.json({...room})
    })
    
    //join room for video call (find room details using room ID and add participant)
    app.post('/rooms/:roomId/join',(req,res)=>{
        const { params, body } = req;
        const roomIndex = rooms.findIndex(existingRooms => existingRooms.roomId === params.roomId);
        let room = null;
        //console.log('roomIndex = ',roomIndex)
        //console.log(req.body)
        if (roomIndex > -1) {
            room = rooms[roomIndex]
            room.addParticipants(body.participant);
            rooms[roomIndex] = room;
            console.log(room.getInfo())
            res.json({ ...room.getInfo() })
        }

    }) 

    //join room from your teams 
    app.post('/joinRoom/:roomId',(req,res)=>{
        console.log(req.body)
        const { params, body } = req;
        const roomIndex = rooms.findIndex(existingRooms => existingRooms.roomId === params.roomId);
        let room = null;
        if(roomIndex>-1)
        {
            room = rooms[roomIndex]
            room.addParticipants(body.data);
            rooms[roomIndex] = room;
            res.json({ ...room.getInfo() })
        }
        else
        {
            const newRoom=new Room(req.body.author)
            newRoom.addParticipants(body.data);
            rooms.push(newRoom)
            res.json({
                roomId:newRoom.roomId
            })
        }
    })

    //send email to list of participants for joining the video meet
    app.post('/api/send',(req,res)=>{
    
        var to=req.body.to.split(',');
    
        //send to each one one by one
        for(var i=0;i<to.length;i++)
        {
            var options={
                to:to[i].trim(),
                subject:"Link for meeting",
                html:"<h2>"+req.body.from+"</h2><h3> sent you Joining Link for meeting </h3>"+"<h3 style='font-weight:bold'>"+req.body.url+"</h3>"
            }
            //send mail
            transporter.sendMail(options,(error,info)=>{
                if(error)
                {
                    return console.log(error)
                }
                console.log('Message sent : %s',info.messageId);
                console.log('Preview URL: %s',nodemailer.getTestMessageUrl(info));
                console.log('link sent')
            })
        }
        return res.json('Mail sent successfully')
    })
    
    //get name of user with given peer Id
    app.post('/api/getname',(req,res)=>{
        const room =rooms.find((existingRoom)=>existingRoom.roomId===req.body.roomId)
        for(let i=0;i<room.participants.length;i++)
        {
            if(room.participants[i].id===req.body.id)
                res.status(200).json(room.participants[i].name)
        }
    })
    
}