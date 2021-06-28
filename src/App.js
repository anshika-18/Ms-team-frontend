import 'bootstrap/dist/css/bootstrap.min.css';
import React,{useState,useEffect,useRef}  from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import PeerJs from 'peerjs'
import {v4 as uuid} from 'uuid'

import Landing from './components/landing'
import Room from './components/room'
import Login from './components/auth/login'
import Thanks from './components/thanks'

import './App.css'
function App() {

  const peerInstance=useRef(null)
  const [currentUserId,setCurrentUserId]=useState('');
  const [theme,setTheme]=useState(false)


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
        <Route exact path="/" component={(props)=> <Landing
            {...props}
            theme={theme} setTheme={()=>setTheme(!theme)}
            currentUserId={currentUserId}
          />
        }>
        </Route>
        <Route exact path="/rooms/:roomId" component={(props) => <Room
            {...props}
            currentUserId={currentUserId}
            theme={theme} setTheme={()=>setTheme(!theme)}
            peerInstance={peerInstance.current}
          />
        }>
        </Route>
        <Route exact path="/login" component={(props)=><Login></Login>}></Route>
        <Route exact path="/thanks" component={Thanks}></Route>
      </Switch>
    </BrowserRouter>
   </div>
  );
}

export default App;
