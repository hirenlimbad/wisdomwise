
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


                <p className='h5'>Top authors </p>
                <div className="d-flex justify-content-around trending">
                    <div>
                        <p> 
                            
                        {authorTrend[0] &&
                        <img
                                src={`data:image/jpeg;base64,${authorTrend[0].profileImage}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.pngall.com/wp-content/uploads/5/Profile.png' }}
                                alt="User Profile Picture"
                                className="profile-pic"
                            />
                        }
                              {authorTrend[0] && (<> {authorTrend[0].uname} </>)} </p>
                        <p> 
                        {authorTrend[0] &&
                        <img 
                                src={`data:image/jpeg;base64,${authorTrend[1].profileImage}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.pngall.com/wp-content/uploads/5/Profile.png' }}
                                alt="User Profile Picture"
                                className="profile-pic"
                            />
                        }
                              {authorTrend[1] && (<> {authorTrend[1].uname} </>)} </p>
                    </div>
                    <div>
                        <p> 
                        {authorTrend[0] &&
                        <img
                                src={`data:image/jpeg;base64,${authorTrend[2].profileImage}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.pngall.com/wp-content/uploads/5/Profile.png' }}
                                alt="User Profile Picture"
                                className="profile-pic"
                            />
                        }
                            
                              {authorTrend[2] && (<> {authorTrend[2].uname} </>)} </p>
                        <p> {authorTrend[0] &&
                        <img
                                src={`data:image/jpeg;base64,${authorTrend[3].profileImage}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.pngall.com/wp-content/uploads/5/Profile.png' }}
                                alt="User Profile Picture"
                                className="profile-pic"
                            />
                        }  {authorTrend[3] && (<> {authorTrend[3].uname} </>)} </p>

                    </div>
                </div>
            </div>
        </>
    )
}

export default TrendingDash;
