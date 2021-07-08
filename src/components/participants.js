import React,{useEffect} from 'react'
import './css/partcipants.css'

export default function Participants({newRaise,lowerHand,setNewRaise,setLowerHand,show}) {

    //random color array
    const background=['#ccfcef','#fce3cc','#fcfacc','#d9fccc','#ffe6fc','#f0dcfc','#dee3ff']
    const text=['#e31414','yellow','lawngreen','#02eaf2','#d103ff','#ff0379','#2d03ff']

    //map all participants
    useEffect(() => {
        if(newRaise)
        {
            const raiseDiv=document.getElementById('array')
            const newChild=document.createElement('div')
            
            //add logo of first letter of name
            const logo=document.createElement('div')
            logo.textContent=newRaise[0]
            logo.className='logo'
            logo.style.color=text[Math.floor(Math.random()*text.length)]
            
            //add username
            const name=document.createElement('div')
            name.textContent=newRaise;
            name.className='name'

            newChild.style.backgroundColor=background[Math.floor(Math.random()*background.length)]
            newChild.appendChild(logo)
            newChild.appendChild(name)
            newChild.setAttribute('id',newRaise);

            raiseDiv.appendChild(newChild)
            setNewRaise('')
        }
        
        if(lowerHand)
        {
            const raiseDiv=document.getElementById('array')
            const newChild=document.getElementById(lowerHand)
            if(newChild)
            raiseDiv.removeChild(newChild)
            setLowerHand('')
        }
    },[newRaise,lowerHand])

    return (
        <div className={show?"participant-outer":"hide-participants"}>
            <div className="raise-head">Raised Hand</div>
                <div className="participants-array" id="array">
            </div> 
        </div>
    )
}
