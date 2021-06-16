import React,{useCallback} from 'react'
import {useHistory} from 'react-router-dom'

import {createRoomAPI} from './api'
export default function Landing({currentUserId}) {
    //console.log(props)
    const history=useHistory()
    const createRoom=useCallback(async()=>{
        
        try
        {
            const roomInformation=await createRoomAPI(currentUserId)
            history.push(`/rooms/${roomInformation.roomId}`)
        }
        catch(err)
        {
            console.log(err)
        }

    },[currentUserId])

    return (
        <div>
             <div className="container pt-5">
                <div className="columns">
        <div className="column is-half is-offset-one-quarter has-text-centered">
          <p className="mb-5 is-size-1 has-text-centered">
            <strong className="has-text-white">Open P2P App</strong>
          </p>
          <button onClick={createRoom} className="button is-success">Create a room</button>
          <p className="mt-5 is-size-5 has-text-centered">
            
          </p>
        </div>
      </div>
    </div>
        </div>
    )
}
