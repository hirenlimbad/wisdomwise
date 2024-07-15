import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './userCred.css';


function Login() {
    const [uemail, setEmail] = useState("");
    const [upassword, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://wisdomwise.onrender.com/login", { uemail, upassword }, {
                withCredentials: true // Include cookies in the request
            });
            if (response.data.message === 'Success') {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="">
            <center><h2 className='text-white mt-4' >Welcome back</h2></center>
            <div className="container login-container Login">
                <div className="row">
                    <div>
                        <div className="card cards">
                            <div className="card-header">
                                Login
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Useid or Email</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="uemail"
                                            value={uemail}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='username'
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="upassword"
                                            value={upassword}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder='password@123'
                                        />
                                    </div>
                                <br></br>
        
                                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                                </form>
                                <br></br>
                                <Link to="/register">Don't have an account? Register here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
