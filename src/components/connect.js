import React,{useState} from 'react'
import './css/connect.css'
import { sendMail } from './api'

export default function Connect({toggleConnect}) {
    //console.log(window.location.href)

    const [from,setFrom]=useState('')
    const [to,setTo]=useState('')

    //send email
    const submit=async(e)=>{
        e.preventDefault();
        const send={
            from:from,
            to:to,
            url:window.location.href
        }
        const response=sendMail(send)
        toggleConnect();
    }

    return (
        <div>
            <div className="connect">
                <div className="connect-head">Add People</div>
                <form className="connect-form">
                    <label>From</label>
                    <input  className="connect-input"type="email" placeholder="From(Your Name)" value={from} onChange={(e)=>setFrom(e.target.value)}></input>
                    <label>To</label>
                    <input  className="connect-input" type="text" placeholder="To" value={to} onChange={(e)=>setTo(e.target.value)}></input>
                    <input className="send-connect" type="submit" onClick={(e)=>{submit(e)}} value="SEND"></input>
                </form>
            </div>
        </div>
    )
}
