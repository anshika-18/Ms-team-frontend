import React, { useState } from "react";
import "./thanks.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import thanks from "../img/thanks.svg";
import ReactStars from "react-rating-stars-component";
import axios from "axios";

export default function Thanks() {
  //<img className="thanks-image" src={thanks} alt="thanks"></img>
  const [rating, setRating] = useState("0");
  const [rated, setRated] = useState(false);

  const ratingChanged = (newRating) => {
    setRating(newRating);
    console.log(newRating);
  };

  //submit feedback
  const feedback = () => {
    if (rating === "0") {
      window.alert("Please provide feedback before submitting");
    } else {
      const data = {
        rating,
        email: sessionStorage.getItem("email"),
      };
      axios
        .post("http://localhost:5001/feedback", data)
        .then((res) => {
          console.log(res);
          console.log("Thanks for providing feedback");
          setRated(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="thanks-outer">
      <div className="thanks-head">You left the Meeting</div>
      <Link to="/">
        <Button className="thanks-button" variant="primary">
          Go To Home Page
        </Button>
      </Link>
      <div className={rated ? "hidden" : null}>
        <div className="feedback-head">
          How was the Audio and Video Quality?
        </div>
        <div className="feedback">
          <ReactStars
            classNames="stars"
            className="stars"
            count={5}
            onChange={ratingChanged}
            size={50}
            emptyIcon={<i className="far fa-star"></i>}
            fullIcon={<i className="fa fa-star"></i>}
            activeColor="blue"
          />
          <Button
            className="feedback-button"
            onClick={() => {
              feedback();
            }}
            variant="success">
            Submit
          </Button>
        </div>
      </div>
      <div className={rated ? "end" : "hidden"}>
        Thanks for Your Valuable Feedback..!!
      </div>
    </div>
  );
}
