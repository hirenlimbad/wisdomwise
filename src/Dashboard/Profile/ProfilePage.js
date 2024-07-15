import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import NavBar from '../Navigation/NavBar';
import './ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuoteMechanism from '../QuoteMechanism';
import { Navigate, useParams, Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProfilePage() {
    const [user, setUser] = useState({});
    const [ispersonal, setispersonal] = useState(false);
    let [username, setUsername] = useState(useParams().username);
    const [follow, setFollow] = useState(false);
    const [followLoad, setFollowLoad] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!username || username === 'undefined' || username === 'null' || username === 'profile') {
            axios.get('http://localhost:3001/getUserName', { withCredentials: true })
                .then(res => {
                    console.log("user name is: ",res.data.useridpub);
                    setUsername(res.data.useridpub);
                })
                .catch(err => {});
        }
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3001/profile/${username}`, { withCredentials: true })
            .then(res => {
                setUser(res.data);
                if (res.data.showEdit) {
                    setispersonal(true);
                }
            })
            .catch(err => console.error(err));
    }, [username]);

    useEffect(() => {
        loadMoreQuotes();
    }, [username]);

    const loadMoreQuotes = () => {
        axios.get(`http://localhost:3001/quotes/${username}?page=${page}&limit=10`)
            .then(res => {
                setQuotes(prevQuotes => [...prevQuotes, ...res.data]);
                setPage(prevPage => prevPage + 1);
                if (res.data.length === 0 || res.data.length < 10) {
                    setHasMore(false);
                }
            })
            .catch(err => console.error(err));
    };

    let colorClasses = ['blue-white', 'purple-white', 'green-white', 'red-white', 'orange-white', 'yellow-white'];
    colorClasses = ['grey1', 'grey2', 'grey3', 'grey4', 'grey5', 'grey6']
    function randomColor() {
        let color = colorClasses.shift();
        colorClasses.push(color);
        return 'grey1';
    }

    function refresh() {
        window.location.href = '../'
    }

    function followPage() {
        setFollowLoad(true);
        axios.post('http://localhost:3001/follow', { username: username }, { withCredentials: true })
            .then(res => {
                if (res.data.message === 'Followed') {
                    setFollow(true);
                    setFollowLoad(false);
                } else {
                    setFollow(false);
                    setFollowLoad(false);
                }
            })
            .catch(err => console.error(err));
    }

    function checkFollow() {
        axios.post('http://localhost:3001/checkFollow', { username: username }, { withCredentials: true })
            .then(res => {
                setFollow(res.data.isFollowing);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        checkFollow();
    }, [username]);

    return (
        <div className='prof-container'>
            <div className="bg-white shadow rounded">
                <Link to="../" onClick={refresh}>
                    <div className="homeButton">
                        <ArrowBackIcon /> {user.uname}
                    </div>
                </Link>
                <div className="px-4 pt-0 pb-4 cover">
                    <div className="media align-items-end profile-head">
                        <div className="profile">
                            <div className="prof-img">
                                <img
                                    src={`${user.profileImage}`}
                                    onError={(e) => e.target.src = 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png '}
                                    alt="User Profile Picture"
                                    className="profile-page-pic"
                                />
                            </div>
                            <div className="media-body mb-5 text-white">
                                <h3 className="mt-0 mb-0 text-white">{user.uname}</h3>
                                <p className="mt-0 mb-0 text-white">@{username}</p>
                                <p className="small mb-4 text-white">
                                    {user.tagline === 'None' ? '---' : user.tagline}
                                    
                                      </p>
                                <div className="edit_profile_cls">
                                    {ispersonal && <a href="/profile_setting" className="btn btn-outline-light btn-sm btn-twitter profile_setting">Update Profile</a>}
                                    {!ispersonal && (
                                        <p className={`profile_setting ${follow ? 'following' : 'follow'}`} onClick={followPage}>
                                            {follow ? 'Unfollow' : 'Follow'}
                                            {followLoad && (
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 about">
                    <h3 className="mb-0">About</h3>
                    <p className='fw-normal word-wrap about-text'>
                        {user.about === 'None' ? '---' : user.about}
                    </p>
                </div>
                <div className="px-4 recent-post">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="mb-0">Recent posts</h5>
                    </div>
                    <InfiniteScroll
                        dataLength={quotes.length}
                        next={loadMoreQuotes}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        // adding border red
                        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px'}}
                    >
                        <div className="row qt-container">
                            {quotes.map(id => (
                                <QuoteMechanism key={id} quoteId={id} backgroundColor={randomColor()} />
                            ))}
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
            <br /><br /><br /><br />
        </div>
    );
}

export default ProfilePage;
