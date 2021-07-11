const {v4}=require('uuid')

class Room {
    participants=[]
    roomId=null
    author=null
    sharer=null

    //initialization
    constructor(body)
    {
        if(body.roomId)
            this.roomId=body.roomId
        else
            this.roomId=v4();
        this.author=body.author
    }

    //add a participant
    addParticipants=(participant)=>{
        this.participants.push(participant)
    }

    //remove participant on disconnect
    removeParticipants=(participantId)=>{
        console.log('remove')
        let i=this.participants.findIndex(
            (existingParticipantId)=>existingParticipantId.id===participantId
        )
        if(i>-1)
            this.participants.splice(i,1)
    }

    //get details of room
    getInfo = () => ({
        participants: this.participants,
        roomId: this.roomId,
        author: this.author
    })
}

module.exports=Room;
