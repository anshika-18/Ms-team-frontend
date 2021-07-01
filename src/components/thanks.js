import React from 'react'
import './css/thanks.css'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import thanks from './img/thanks.svg'
export default function Thanks() {
    return (
        <div className="thanks-outer">
            <div className="thanks-head">You left the Meeting</div>
            <img className="thanks-image" src={thanks} alt="thanks"></img>
            <Link to="/"><Button className="thanks-button" variant="primary">Go To Home Page</Button></Link>
        </div>
    )
}
