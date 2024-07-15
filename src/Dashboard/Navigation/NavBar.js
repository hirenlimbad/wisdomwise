import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NavBar.css';
import { Link } from 'react-router-dom';


function NavBar() {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [useridpub, setUseridpub] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3001/getUserName', { withCredentials: true })
            .then((response) => {
                if (response.data.name.includes("Please Log in")) {
                    setName("Login here");
                    setUseridpub("../login");
                } else {
                    setName(response.data.name);
                    setUseridpub(`../Profile/${response.data.useridpub}`);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the user name!", error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/getUserProfileImage', { withCredentials: true })
            .then((response) => {
                if (!response.data.profileImage.includes("Profile Image not found")) {
                    setImage(response.data.profileImage);
                } else {
                    setImage('https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg');
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the user profile image!", error);
            });
    }, []);

    return (
        <div className='navbar'>
            <nav>
                <img
                    src={image}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/Resources/images/default_img.png'; }}
                    alt="User Profile"
                    className="profile-pic"
                />
            </nav>
            <Link to={useridpub} className='username'>
                {name}
            </Link>
        </div>
    );
}

export default NavBar;
    