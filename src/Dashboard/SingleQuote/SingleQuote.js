import axios from 'axios';
import React, { useState, useEffect } from 'react';
import QuoteMechanism from '../QuoteMechanism';
import './SingleQuote.css';
function SingleQuote() {

    const [quote, setquote] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3001/getNewQuote', { withCredentials: true })
            .then(response => {
                setquote(response.data);
                console.log(response.data.quote + " " + response.data.isBookmarked)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div className='SingleQuoteContainer'>
            <QuoteMechanism quoteId={quote.quoteId} backgroundColor={'grey3'} />
        </div>
    )
}

export default SingleQuote;