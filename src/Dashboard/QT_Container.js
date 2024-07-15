import React, { useState, useEffect, memo, useCallback } from 'react';
import axios from "axios";
import QuoteMechanism from "./QuoteMechanism";
import CircularProgress from '@mui/material/CircularProgress';
import Comments from './Comments/Comments';
import './quotes.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const QT_Container = memo(function QT_Container(quoteid_predefined) {
    const [quoteIds, setQuoteIds] = useState([]);
    const [followingQuotes, setFollowingQuotes] = useState([]);
    const [activeTab, setActiveTab] = useState('Feed');
    const [messageBx, setMessageBx] = useState('');
    const [page, setPage] = useState(1); // Track the current page
    const [loading, setLoading] = useState(false); // Track loading state
    const [limit, setLimit] = useState(5); // Number of quotes to fetch per page
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [allowRequest, setAllowRequest] = useState(true);

    const fetchQuotes = useCallback(async (pageNumber) => {
        if (!allowRequest) {
            setLoading(false);
            return
        };
        setLoading(true);
        try {
            const res = await axios.get(`https://wisdomwise.onrender.com/getQuotes?page=${pageNumber}&limit=${limit}`, { withCredentials: true });
            const ids = res.data.map(quote => quote._id);
            console.log(ids);
            setQuoteIds(prevIds => [...new Set([...prevIds, ...ids])]);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }, [limit]);

    useEffect(() => {
        const handleScroll = () => {
            if (!allowRequest) return;
            if (!activeTab == 'Feed') return;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 500) {
                setPage(prevPage => prevPage + 1);
                setLimit(5)
            }
            setLastScrollTop(scrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchQuotes(page);
    }, [fetchQuotes, page]);



    // if the user are bottom of following-q-collection then send again request for more quotes of following posts
    useEffect(() => {
        const handleScroll = () => {
            if (!allowRequest) return;
            if (!activeTab == 'Following') return;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 500) {
                axios.post('https://wisdomwise.onrender.com/getFollowedPosts', { following: true }, { withCredentials: true })
                    .then(res => {
                        if (res.data.length === 0) {
                            setMessageBx('Follow More Users to see their new quotes');
                        }
                        followingQuotes.push(...res.data)
                        followingQuotes = [...new Set(followingQuotes)]
                        console.log("data", followingQuotes)
                    })
                    .catch(err => console.error(err));
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const randomColor = () => {
        const colorClasses = ['grey1'];
        let color = colorClasses.shift();
        colorClasses.push(color);
        return color;
    };


    const showFeed = () => {
        setActiveTab('Feed');
        let following = document.querySelector('.following');
        let feed = document.querySelector('.feed-class');
        feed.style.display = 'block';
        following.style.display = 'none';
    }

    const showFollowedPosts = () => {
        setActiveTab('Following');
        let following = document.querySelector('.following');
        let feed = document.querySelector('.feed-class');

        feed.style.display = 'none';
        following.style.display = 'block';

        if (following.style.display === 'block') {
            axios.post('https://wisdomwise.onrender.com/getFollowedPosts', { following: true }, { withCredentials: true })
                .then(res => {
                    if (res.data.length === 0) {
                        setMessageBx('  Follow more users to see there new quotes.');
                    }
                    setFollowingQuotes(res.data);
                })
                .catch(err => console.error(err));
        }
    }

    // making state of post comment id
    const [postId, setPostId] = useState('');



    const handlePostClick = (postId) => {
        console.log("may clicked", postId);
        setPostId(postId);
        let comments = document.querySelector('.comments-dashboard');
        comments.style.display = 'block';
        // window.history.pushState(null, null, `/comments/${postId}`);
        // stopping for scrllling
        // document.body.style.overflowY = 'hidden';
    };

    const handlePostBackClick = () =>{
        let comments = document.querySelector('.comments-dashboard');
        comments.style.display = 'none';
        window.history.pushState(null, null, `/`);
        // document.body.style.overflowY = 'scroll';
    }

    return (
        <div>


            <div className="contNav">
                <ul className="navs">
                    <li className={`feed ${activeTab === 'Feed' ? 'active' : ''}`} onClick={showFeed}>Feed</li>
                    <li className={`${activeTab === 'Following' ? 'active' : ''}`} onClick={showFollowedPosts}>Following</li>
                </ul>
            </div>

            <div className="feed-class">
                <div className="comments-dashboard hide">
                    <ArrowBackIosNewIcon onClick={() => handlePostBackClick()}/> Back To quotes
                </div>
                <div className="q-collection show">
                    {quoteIds.map(id => (
                        <QuoteMechanism key={id} quoteId={id} backgroundColor={randomColor()} onClick={() => handlePostClick(id)} />
                    ))}
                    {loading && <CircularProgress />}
                    <h2 className='text-white'>{messageBx}</h2>
                </div>
            </div>
            <div className="following">
                <div className="q-collection following-q-collection">
                    {followingQuotes.map(id => (
                        <QuoteMechanism key={id} quoteId={id} backgroundColor={randomColor()} />
                    ))}
                    {loading && <CircularProgress />}
                    <h2 className='text-white'> <br /> {messageBx}</h2>
                </div>

            </div>
        </div>
    );
});

export default QT_Container;
