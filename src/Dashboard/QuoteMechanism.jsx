import './quotes.css';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Comments from './Comments/Comments';
import ThoughtMechanism from './Comments/ThoughtMechanism';

function QuoteMechanism({ quoteId, backgroundColor, onClick }) {
    const [quote, setQuote] = useState({});
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [loggedUserProfileImage, setLoggedUserProfileImage] = useState(null);
    const [thoughts, setThoughts] = useState([]);
    const [visibleThoughts, setVisibleThoughts] = useState(2);

    const getNewQuote = useCallback(() => {
        setLoggedUserProfileImage(localStorage.getItem('profileImage'));
        console.log("getting quote")
        axios.post('https://wisdomwise.onrender.com/getNewQuote', { quoteId }, { withCredentials: true })
            .then(response => {
                setQuote(response.data);
                setLiked(response.data.isLiked);
                setBookmarked(response.data.isBookmarked);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [quoteId]);

    const getProfileImage = useCallback(() => {
        if (quote.useridpub) {
            axios.post('https://wisdomwise.onrender.com/getProfileImage', { params: { userid: quote.useridpub } })
                .then(response => {
                    setProfileImage(response.data.profileImage)
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [quote.useridpub]);

    useEffect(() => {
        getNewQuote();
    }, [getNewQuote]);

    useEffect(() => {
        getProfileImage();
    }, [getProfileImage]);

    const copyQuote = () => {
        navigator.clipboard.writeText(quote.quote + " - " + quote.author_name);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);

        axios.post('https://wisdomwise.onrender.com/copyQuote', { quoteId: quote.quoteId }, { withCredentials: true })
            .catch(err => {
                console.log("Error in likeQuote");
                console.log(err);
            });
    };

    const shareQuote = () => {
        setShared(true);
        setTimeout(() => {
            setShared(false);
        }, 3000);
        axios.post('https://wisdomwise.onrender.com/shareQuote', { quoteId: quote.quoteId }, { withCredentials: true })
            .catch(err => {
                console.log("Error in likeQuote");
                console.log(err);
            });
    };

    const likeQuote = () => {
        const updatedLiked = !liked;
        setLiked(updatedLiked);
        const updatedQuote = { ...quote, like_count: updatedLiked ? quote.like_count + 1 : quote.like_count - 1 };
        setQuote(updatedQuote);
        axios.post('https://wisdomwise.onrender.com/updateLikeCount', { quoteId: quote.quoteId }, { withCredentials: true })
            .catch(err => {
                console.log("Error in likeQuote");
                console.log(err);
                if (err.response.status === 401) {
                    window.location.href = '/login';
                }
            });
    };

    const bookmarkQuote = () => {
        const updatedBookmarked = !bookmarked;
        setBookmarked(updatedBookmarked);
        const updatedQuote = { ...quote, bookmark_count: updatedBookmarked ? quote.bookmark_count + 1 : quote.bookmark_count - 1 };
        setQuote(updatedQuote);
        axios.post('https://wisdomwise.onrender.com/updateBookmarkCount', { quoteId: quote.quoteId }, { withCredentials: true })
            .catch(err => {
                console.log("Error in bookmarkQuote");
                console.log(err);
                if (err.response.status === 401) {
                    window.location.href = '/login';
                }
            });
    };

    const handleClick = () => {
        if (showComments){
            setShowComments(false);
            return;
        }
        setShowComments(true);
        loadThoughts();
    };

    const loadThoughts = () => {
        axios.post('https://wisdomwise.onrender.com/getThoughts', { quoteId: quoteId }, { withCredentials: true })
            .then(res => {
                console.log("Thoughts id data is: ", res.data);
                setThoughts(res.data);
            })
            .catch(err => { });
    };

    const [postDisabled, setPostDisabled] = useState(true);

    function selectText() {
        var range = document.createRange();
        var editable = document.getElementsByClassName(quoteId)[0];
        editable.style.color = 'white';
        editable.style.border = '1px solid white';
        range.selectNodeContents(editable);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        editable.addEventListener('input', function () {
            if (editable.innerText.length > 0) {
                setPostDisabled(false);
            } else {
                setPostDisabled(true);
            }
        });
    }

    function postThought() {
        var thought = document.getElementsByClassName(quoteId)[0];
        axios.post('https://wisdomwise.onrender.com/postThought', { thought: thought.innerText, quoteId: quoteId }, { withCredentials: true })
            .then(res => {
                console.log("New thought id: ", [res.data.thoughtid]);
                setThoughts([res.data.thoughtid, ...thoughts]);
                thought.innerText = "";
                // Update comment count
                setQuote(prevQuote => ({ ...prevQuote, comment_count: prevQuote.comment_count + 1 }));
                setVisibleThoughts(prevVisibleThoughts => prevVisibleThoughts + 1);
            })
            .catch(err => { });
    }

    const loadMoreThoughts = () => {
        setVisibleThoughts(prevVisibleThoughts => prevVisibleThoughts + 2);
    };

    return (
        <>
            <div className={`card grey1`}>
                <div className="card-header">
                    <div className="user-info">
                        {loading ? (
                            <Skeleton variant="circular" width={40} height={40} />
                        ) : (
                            <img
                                src={`data:image/jpeg;base64,${profileImage}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.pngall.com/wp-content/uploads/5/Profile.png' }}
                                alt="User Profile Picture"
                                className="profile-pic"
                            />
                        )}
                        {loading ? (
                            <Box sx={{ ml: 2 }}>
                                <Skeleton variant="text" width={140}/>
                                <Skeleton variant="text" width={60} />
                            </Box>
                        ) : (
                            <Link to={`../profile/${quote.useridpub}`}>
                                <div className="middle">
                                    <div className="username">{quote.uname}</div>
                                    <div className="tagline">{quote.tagline}</div>
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className="right">
                        <div className="copy-button" onClick={copyQuote}>
                            <i className={copied ? "fas fa-check" : "far fa-copy"}></i>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <Box sx={{ width: '100%' }}>
                            <Skeleton variant="text" width="100%" />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="60%" />
                        </Box>
                    ) : (
                        <div className="quote-container">
                            <div className="quote">
                                {quote.quote}
                            </div>
                            <div className="author">
                                - {quote.author_name}
                            </div>
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <div className="left">
                        <div className="like-button l-child" onClick={likeQuote}>
                            <i className={liked ? "fas fa-heart" : "far fa-heart"}></i>
                            <span className="like-count"> {quote.like_count} </span>
                        </div>
                        <div className="bookmark l-child" onClick={bookmarkQuote}>
                            <i className={bookmarked ? "fas fa-bookmark" : "far fa-bookmark"}></i>
                            <span className="bookmark-count"> {quote.bookmark_count} </span>
                        </div>
                        <div className="bookmark l-child" onClick={handleClick}>
                            <i className={showComments ? "fas fa-comment" : "far fa-comment"}></i>
                            <span className="comment-count"> {quote.comment_count} </span>
                        </div>
                    </div>
                    <div className="right">
                        <Link to={`../quote/${quote.quoteId}`}>
                            <div className="share-button" onClick={shareQuote}>
                                <span className={shared ? "fas fa-check" : "fas fa-image"}></span>
                            </div>
                        </Link>
                    </div>
                </div>
                {showComments && (
                    <div>
                        <div className="ThoughtMechanism">
                            <div className="userImage">
                                <img src={loggedUserProfileImage || "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"} alt="user" />
                            </div>
                            <div className="userThought">
                                <div className="userInfo d-flex w-100">
                                    <h6>{localStorage.getItem('uname') || 'Login Pls'}</h6>
                                    <h6> &nbsp;  ⋅  {localStorage.getItem('tagline') || '___'}</h6>
                                </div>

                                <p className='text-justify'>
                                    <p className={`editable ${quoteId}`} contentEditable='true' onClick={selectText}>  Click here to write your thoughts </p>
                                </p>
                                <div className="post">
                                    <button className='postBTN' onClick={postThought} disabled={postDisabled} >Post</button>
                                </div>
                            </div>
                        </div>
                        {thoughts.slice(0, visibleThoughts).map(id => <ThoughtMechanism key={id} thoughtid={id} />)}
                        {visibleThoughts < thoughts.length && (
                            <div className="load-more">
                                <button onClick={loadMoreThoughts}>Load More</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default QuoteMechanism;
