
import React, { useState, useEffect } from 'react';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './trending.css';
import axios from 'axios';

function TrendingDash() {

    const [topTrending, setTopTrending] = React.useState([]);
    const [authorTrend, setAuthorTrend] = React.useState([]);
    useEffect(() => {
        axios.get('https://wisdomwise.onrender.com/getTopTrending')
            .then(res => {
                console.log("quoteof of the dayy.....", res.data);
                setTopTrending(res.data.topTrending[0]);
                setAuthorTrend(res.data.topAuthorsDetails);
                console.log(res.data.topAuthorsDetails[0].uname)
            })
            .catch(err => {
                console.error(err);
            });
    }, []);
    return (
        <>
            <h2>Trending <WhatshotIcon /> </h2>

            <div>
                <p className='text-capitalize'> {topTrending.quote} </p>
                <p> - {topTrending.author_name} </p>
            </div>
        </>
    )
}

export default TrendingDash;
