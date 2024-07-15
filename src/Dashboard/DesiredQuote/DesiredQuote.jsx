import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuoteMechanism from "../QuoteMechanism";

function DesiredQuote({ desire }) {
    const [quoteIds, setQuoteIds] = useState([]);

    useEffect(() => {
        if (desire === 'liked') {
            const getLikedQuotes = async () => {
                console.log('requesting liked quotes');
                try {
                    const ids = await axios.get('http://localhost:3001/getLikes', { withCredentials: true });
                    console.log(ids.data);
                    setQuoteIds(ids.data);
                } catch (err) {
                    console.log(err);
                }
            };

            getLikedQuotes();
        }

        if (desire === 'bookmarked') {
            const getBookmarkedQuotes = async () => {
                console.log('requesting bookmarked quotes');
                try {
                    const ids = await axios.get('http://localhost:3001/getBookmarks', { withCredentials: true });
                    console.log(ids.data);
                    setQuoteIds(ids.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getBookmarkedQuotes();
        }

        if (desire == 'trending'){
            const getTrendingQuotes = async () => {
                console.log('requesting trending quotes');
                try {
                    const ids = await axios.get('http://localhost:3001/getTrending', { withCredentials: true });
                    console.log(ids.data);
                    setQuoteIds(ids.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getTrendingQuotes();
        }
    }, [desire]);

    return (
        <>
            <div className="quote-container">
                <p className='text-capitalize text-white position-fixed text-center'>  {desire} quotes </p>
                <br />
                {quoteIds.map((quoteId, index) => (
                    <QuoteMechanism key={index} quoteId={quoteId} />
                ))}
            </div>
        </>
    );
}

export default DesiredQuote;
