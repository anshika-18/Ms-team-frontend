import React, { useState } from "react";
import "./register.css";
import axios from "axios";
import { Alert } from "react-bootstrap";
import Reg from "../img/register2.svg";
import Profile from "../img/profile.svg";

export default function Register(props) {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentotp, setSentotp] = useState(false);

  console.log(props);

  //send otp
  const sendOtp = (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setMsg("please enter all details");
      setShow(true);
      return;
    }
    const data = {
      email,
    };
    axios
      .post("http://localhost:5001/sendOtp", data)
      .then((res) => {
        setSentotp(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //register
  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: username,
      email,
      password,
      otp,
    };

    axios
      .post("http://localhost:5001/api/auth/register", data)
      .then((res) => {
        console.log(res);
        props.setName(res.data.user.name);
        props.setToken(res.data.user.email);
        sessionStorage.setItem("email", res.data.user.email);
        console.log(res.data.user.name);
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.response.data.msg);
        setShow(true);
      });
  };

  //resend otp
  const resend = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5001/resend")
      .then((res) => {
        alert("otp sent successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //error message
  function AlertDismissibleExample() {
    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <p>{msg}</p>
        </Alert>
      );
    }
    return null;
  }

  return (
    <div className="register">
      <div className="forms-container">
        <img src={Reg} className="register-image" alt="register"></img>
        <div className="forms-container-div">
          <form className={sentotp ? "hide-form" : "sign-in-form"}>
            <AlertDismissibleExample />
            <img
              className="login-profile"
              src={Profile}
              alt="profile-girl"></img>
            <h2 className="title">Register</h2>
            <div className="input-register">
              <i class="fas fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-register">
              <i class="fas fa-user"></i>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-register">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="old-user" onClick={props.setLogin}>
              Already have an Account?
            </button>
            <input
              className="submit-register"
              type="submit"
              value="Send OTP"
              onClick={(e) => {
                sendOtp(e);
              }}></input>
          </form>

          <form className={sentotp ? "verify" : "hide-verify"}>
            <AlertDismissibleExample />
            <h2 className="title">Verify OTP</h2>
            <input
              type="test"
              value={otp}
              name="otp"
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter otp"></input>
            <input
              className="submit-register"
              type="submit"
              value="Register"
              onClick={(e) => {
                onSubmit(e);
              }}
            />
            <input
              className="submit-register"
              type="submit"
              value="Resend OTP"
              onClick={(e) => {
                resend(e);
              }}
            />
            <h6>
              *Please check your mail for OTP. Also check your spam folder.
            </h6>
            <button className="old-user" onClick={props.setLogin}>
              Already have an Account?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
