import React, { useEffect, useState } from 'react';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './BottomNavShare.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BottomNavShare() {


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

    const handleNavigationClick = (component) => {
        console.log(component);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <BottomNavigation
                className="BottomNavigation"
                sx={{ width: 300, background: 'rgb(22 19 19)', position: "fixed", left: "33%", borderRadius: "10px", bottom: 0}}
                value={value}
                onChange={handleChange}
            >
                <BottomNavigationAction onClick={() => handleNavigationClick('bgColor')}
                    label="Background"
                    value="recents"
                    icon={<FormatColorFillIcon />}
                />
                <BottomNavigationAction  onClick={() => handleNavigationClick('textColor')}
                    label="Color"
                    value="favorites"
                    icon={<FormatColorTextIcon />}
                />
                <BottomNavigationAction onClick={() => handleNavigationClick('fontAndSize')}
                    label="Fonts"
                    value="nearby"
                    icon={<FontDownloadIcon />}
                />
                <BottomNavigationAction onClick={() => handleNavigationClick('textAlign')}
                    label="Alignments"
                    value="folder"
                    icon={<AlignHorizontalRightIcon />}
                />
                <BottomNavigationAction onClick={() => handleNavigationClick('showHide')}
                    label="Show/Hide"
                    value="ShowHide"
                    icon={<VisibilityIcon />}
                />
                <BottomNavigationAction onClick={() => handleNavigationClick('export')}
                    label="Download"
                    value="download"
                    icon={<DownloadIcon />}
                />
            </BottomNavigation> 

            
        </>
    );
}

export default BottomNavShare;
