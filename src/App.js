import React,{useState,useEffect,useCallback,useRef}  from 'react';
import {BrowserRouter,Switch,Route,RouteComponentProps,useParams} from 'react-router-dom'
import PeerJs from 'peerjs'
import {v4 as uuid} from 'uuid'

import Landing from './components/landing'
import Room from './components/room'

function App() {

  const peerInstance=useRef(null)
  const [currentUserId,setCurrentUserId]=useState('');

  useEffect(()=>{
    const userId=uuid()

    const peer=new PeerJs(userId);
    peerInstance.current=peer;

    //console.log('My peer--',peer)
    peerInstance.current.on('open',(id)=>{
      setCurrentUserId(id);
      //console.log('Appjs set --- ',id)
    })

  },[]);

  
  return (
   <div>
     <BrowserRouter>

     <Route exact path="/" >
        <Landing
            currentUserId={currentUserId}
          />
        </Route>

     <Route path="/rooms/:roomId">
     <Room currentUserId={currentUserId} peerInstance={peerInstance.current}></Room>
    </Route>
    </BrowserRouter>
   </div>
  );
}

export default App;
