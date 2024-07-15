import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import './SideNavigation.css'

// importing material ui components
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatshotIcon from '@mui/icons-material/Whatshot';

function SideNavigation({ setActiveComponent }) {
    let [username, setUsername] = useState(useParams().username);
    const [activeComponent, setActiveComponentState] = useState(''); // state for active component

    useEffect(() => {
        if (!username || username === 'undefined' || username === 'null' || username === 'profile') {
            axios.get('http://localhost:3001/getUserName', { withCredentials: true })
                .then(res => {
                    setUsername(res.data.useridpub);
                    // setting username in local storage
                    localStorage.setItem('uname', res.data.name);
                    localStorage.setItem('tagline', res.data.tagline);
                    localStorage.setItem('profileImage', res.data.profileImage);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [username]);

    const handleNavigationClick = (component) => {
        setActiveComponent(component);
        setActiveComponentState(component);

        // changing url
        window.history.pushState({}, '', `${component}`);
    };

    return (
        <>
            <div className="sideNav" id="sideNav">
                <ul>
                    <li onClick={() => handleNavigationClick('home')} className={activeComponent === 'home' ? 'active' : ''}>
                        <a> <HomeIcon /> Home</a>
                    </li>
                    <li onClick={() => handleNavigationClick('trending')} className={activeComponent === 'trending' ? 'active' : ''}>
                        <a> <WhatshotIcon /> Trending</a>
                    </li>
                    <li onClick={() => handleNavigationClick('search')} className={activeComponent === 'search' ? 'active' : ''}>
                        <a> <SearchIcon /> Search</a>
                    </li>
                    <li onClick={() => handleNavigationClick('addQuote')} className={activeComponent === 'addQuote' ? 'active' : ''}>
                        <a> <AddCircleOutlineIcon /> Post Quote</a>
                    </li>
                    <li onClick={() => handleNavigationClick('like')} className={activeComponent === 'like' ? 'active' : ''}>
                        <a> <FavoriteIcon /> Liked</a>
                    </li>
                    <li onClick={() => handleNavigationClick('bookmark')} className={activeComponent === 'bookmark' ? 'active' : ''}>
                        <a> <BookmarkIcon /> Bookmarked </a>
                    </li>
                    <li onClick={() => handleNavigationClick('profile')} className={activeComponent === 'profile' ? 'active' : ''}>
                        <a> <AccountCircleIcon /> Profile</a>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default SideNavigation;
