import React,{useState,useEffect,useCallback,useRef}  from 'react';
import {BrowserRouter,Switch,Route,RouteComponentProps,useParams} from 'react-router-dom'
import PeerJs from 'peerjs'
import {v4 as uuid} from 'uuid'

import Landing from './components/landing'
import Room from './components/room'

import './App.css'
function App() {

  const peerInstance=useRef(null)
  const [currentUserId,setCurrentUserId]=useState('');

  useEffect(()=>{
    const userId=uuid()

    const peer=new PeerJs(userId);
    peerInstance.current=peer;

    peerInstance.current.on('open',(id)=>{
      setCurrentUserId(id);
    })

  },[]);

  
  return (
   <div>
      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={(props) => <Landing
            {...props}
            currentUserId={currentUserId}
          />
        }>
        </Route>
        <Route exact path="/rooms/:roomId" component={(props) => <Room
            {...props}
            currentUserId={currentUserId}
            peerInstance={peerInstance.current}
          />
        }>
        </Route>
      </Switch>
    </BrowserRouter>
   </div>
  );
}

export default App;
