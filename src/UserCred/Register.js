import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// importing bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import "./userCred.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {


    const [uname, setName] = useState("");
    const [uemail, setEmail] = useState("");
    const [upassword, setPassword] = useState("");
    const [useridpub, setuseridpub] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://wisdomwise.onrender.com/register", {uname, uemail, upassword, useridpub})
        .then(res => {
            console.log(res);
            navigate('/login');
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <center><h2 className='text-white mt-5'> Your welcome to Quote App   </h2></center>
            <div className="container login-container Login">
                <div className="row">
                    <div className="card col-md-6">
                        <div className="card-header text-white">
                            <h2>Register</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" className="form-control" placeholder="Full Name" 
                                name = "uname"
                                onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)}
                                name='uemail'
                                />
                            </div>
                            <div className="form-group">
                                <label>@username</label>
                                <input type="text" className="form-control" placeholder="@username" 
                                onChange={(e) => setuseridpub(e.target.value)}
                                name='useridpub'
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Password" 
                                onChange={(e) => setPassword(e.target.value)}
                                name="upassword"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mb-2">Register</button>
                             <Link to="/login"> Already Have account? Login here</Link>
                        </form>
                    </div>
                </div>
        </div>
        </div>
    );
}

export default Register;
