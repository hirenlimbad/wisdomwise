import React, { useEffect, useState } from 'react';
import './BottomNavigationBar.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BottomNavigationBar({ setActiveComponent }) {
    let [username, setUsername] = useState(useParams().username);

    useEffect(() => {
        if (!username || username === 'undefined' || username === 'null' || username === 'profile') {
            axios.get('http://localhost:3001/getUserName', { withCredentials: true })
                .then(res => {
                    setUsername(res.data.useridpub);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [username]);

    const handleNavigationClick = (component) => {
        setActiveComponent(component);
    };

    useEffect(() => {
        const bottomNavigationItems = document.querySelectorAll('.BottomNavigation-item');
        bottomNavigationItems.forEach(item => {
            item.addEventListener('click', function () {
                bottomNavigationItems.forEach(item => {
                    item.classList.remove('active');
                });
                item.classList.add('active');
            });
        });
    }, []);

    const [value, setValue] = useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <BottomNavigation
                className="BottomNavigation"
                sx={{ width: 500, background: '#292837', position: "fixed", left: "33%", borderRadius: "10px 10px 0px 0px", bottom: 0 }}
                value={value}
                onChange={handleChange}
            >
                <BottomNavigationAction onClick={() => handleNavigationClick('home')}
                    label="Home"
                    value="recents"
                    icon={<HomeOutlinedIcon />}
                />
                <BottomNavigationAction  onClick={() => handleNavigationClick('search')}
                    label="Search"
                    value="favorites"
                    icon={<SearchOutlinedIcon />}
                />
                <BottomNavigationAction onClick={() => handleNavigationClick('addQuote')}
                    label="Post"
                    value="nearby"
                    icon={<AddCircleOutlineOutlinedIcon />}
                />
                <BottomNavigationAction onClick={() => handleNavigationClick('profile')}
                    label="Account"
                    value="folder"
                    icon={<AccountCircleOutlinedIcon />}
                />
            </BottomNavigation> 
        </>
    );
}

export default BottomNavigationBar;
