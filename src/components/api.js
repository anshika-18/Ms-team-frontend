import axios from 'axios'

export const createRoomAPI=async(author)=>{
    const response=await fetch(`https://ms-team-anshika-backend.herokuapp.com/rooms`,{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        },
        body:JSON.stringify({author})
    })

    const res=await response.json()
    return res;
}

export const fetchRoomAPI=async(roomId)=>{
    const response=await fetch(`https://ms-team-anshika-backend.herokuapp.com/rooms/${roomId}`,{
        method:'GET'
    })
    const res=await response.json()
    return res;
}

export const joinRoomAPI=async(roomId,participant)=>{
    const response=await fetch(`https://ms-team-anshika-backend.herokuapp.com/rooms/${roomId}/join`,{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        },
        body:JSON.stringify({participant})
    })

    const res=response.json()
    return res;
}

export const sendMail=async(send)=>{
    const response=await fetch('https://ms-team-anshika-backend.herokuapp.com/api/send',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        },
        body:JSON.stringify(send)
    });
    const res=response.json()
    return res;
}
