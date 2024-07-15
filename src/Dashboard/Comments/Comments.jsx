import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Comments.css';

import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// importing quotemechanism
import QuoteMechanism from '../QuoteMechanism';
import ThoughtContainer from './ThoughtContainer';

function Comments({quoteId}){
    
    useEffect(() => {

    }, []);

    function refresh(){
        window.location.href = '../'
    }
    return (
        <div>
            <Link to="../" onClick={refresh}>
                <div className="homeButton" style={{marginLeft: '20px' }}>
                    <ArrowBackIosNewIcon /> Home
                </div>
            </Link>


            <div className="commentContainer">
                <h4 className='text-white'>Thoughts</h4>
                    <ThoughtContainer  quoteId={quoteId} />
            </div>
        </div>
    );
}

export default Comments;