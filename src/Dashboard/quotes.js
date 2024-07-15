import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import './App.css';
// import './quotes.css';
import "./post_styles.css";
import UserDetails from "./showUserDetails"
import '@fortawesome/fontawesome-free/css/all.min.css';


function Quotes() {

    const [quotes, setQuote] = useState([])

    useEffect(() => {
        axios.get('https://wisdomwise.onrender.com/getQuotes')
            .then(res => {
                setQuote(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [])

    const [liked, setLiked] = useState(false);
    useEffect(() => {
        // Fetch whether the post is liked or not when the component mounts
        fetchLikedStatus();
    }, []);
    const fetchLikedStatus = () => {
        const quoteId = quotes._id;
        axios.post('https://wisdomwise.onrender.com/isLiked', { quoteId }, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                setLiked(res.data.isLiked);
            })
            .catch(err => {
                console.log(err);
            });
    };

    let colorClasses = ['blue-white', 'purple-white', 'green-white', 'red-white', 'orange-white', 'yellow-white'];

    function randomColor() {
        let color = colorClasses.shift();
        colorClasses.push(color);
        return color;
    }

    function handleLike(quoteId) {
        // Find the index of the quote in the quotes array
        const quoteIndex = quotes.findIndex(quote => quote._id === quoteId);

        // Send a POST request to the server to update the like count in the database
        axios.post('https://wisdomwise.onrender.com/updateLikeCount', { quoteId }, { withCredentials: true })
            .then(res => {
                console.log(res.data);

                if (res.data.status === 'Like decreased') {
                    const updatedQuotes = [...quotes];
                    updatedQuotes[quoteIndex] = {
                        ...updatedQuotes[quoteIndex],
                        like_count: updatedQuotes[quoteIndex].like_count - 1
                    };
                    setQuote(updatedQuotes);
                }

                if (res.data.status === "Like increased") {
                    const updatedQuotes = [...quotes];
                    updatedQuotes[quoteIndex] = {
                        ...updatedQuotes[quoteIndex],
                        like_count: updatedQuotes[quoteIndex].like_count + 1
                    };
                    setQuote(updatedQuotes);
                }

            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 401) {
                    window.location.href = '/login';
                }
            });

    }

    function handleShare(quoteId) {
        // Handle share button click event here
        console.log('Shared Quote ID:', quoteId);
    }

    function handleBookmark(quoteId) {

        const bookmrkIndex = quotes.findIndex(quote => quote._id === quoteId);

        axios.post('https://wisdomwise.onrender.com/updateBookmarkCount', { quoteId }, { withCredentials: true })
            .then(res => {
                
            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 401) {
                    window.location.href = '/login';
                }
            });


    }

    function handleCopy(quoteId) {
        const quoteIndex = quotes.findIndex(quote => quote._id === quoteId);
        if (quoteIndex !== -1) {
            // Copy the quote to the clipboard
            const quote = quotes[quoteIndex];
            navigator.clipboard.writeText(`${quote.quote} - ${quote.author_name}`);

            // Update the state to indicate that the quote has been copied
            const updatedQuotes = [...quotes];
            updatedQuotes[quoteIndex] = {
                ...updatedQuotes[quoteIndex],
                copied: true
            };
            setQuote(updatedQuotes);
            setTimeout(() => {
                const updatedQuotes = [...quotes];
                updatedQuotes[quoteIndex] = {
                    ...updatedQuotes[quoteIndex],
                    copied: false
                };
                setQuote(updatedQuotes);
            }, 2000);
        }
    }

    return (
        <>
            <UserDetails />
            <div className="q-collection">
                {quotes.map((quote, index) => (
                    <div key={quote._id} className={`card ${randomColor()}`}>
                        <div className="card-header">
                            <div className="user-info">
                                <img src="https://hirenlimbad.github.io/Portfolio/images/avatar.jpg" alt="User Profile Picture" className="profile-pic" />
                                <div className="middle">
                                    <div className="username">hirenlimbad</div>
                                    <div className="tagline">stoicism</div>
                                </div>
                            </div>
                            <div className="right">
                                {!quote.copied && (
                                    <div className="copy-button" onClick={() => handleCopy(quote._id)}>
                                        <i className="far fa-copy"></i>
                                    </div>
                                )}
                                {quote.copied && (
                                    <div className="copy-button copied">
                                        <i className="fas fa-check"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="quote-container">
                                <div className="quote">
                                    {quote.quote}
                                </div>
                                <div className="author">
                                    - {quote.author_name}
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="left">
                                <div className="like-button l-child" onClick={() => handleLike(quote._id)}>
                                    <i className={quote.liked ? "fas fa-heart" : "far fa-heart"}></i>
                                    <span className="like-count">{quote.like_count}</span>
                                </div>
                                <div className="bookmark l-child" onClick={() => handleBookmark(quote._id)}>
                                    <i className="far fa-bookmark"></i>
                                    <span className="bookmark-count"> {quote.bookmark_count} </span>
                                </div>
                            </div>
                            <div className="right">
                                <div className="share-button" onClick={() => handleShare(quote._id)}>
                                    <i className="fas fa-share"></i>
                                    <span className="share-count"> {quote.share_count} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Quotes;
