import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ThoughtMechanism({ thoughtid }) {
    const [thought, setThought] = useState({});
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        axios.post('http://localhost:3001/getThought', {thoughtid: thoughtid} ,{ withCredentials: true })
            .then(res => {
                setThought(res.data.thought);
                setLiked(res.data.thought.isLiked);
                setLikes(res.data.thought.likes);
                setLiked(res.data.thought.isLiked);
            })
            .catch(err => {
                console.error(err);
            });
    }, [thoughtid]);

    const handleLikeClick = () => {
        const updatedLiked = !liked;
        setLiked(updatedLiked);
        setLikes(updatedLiked ? likes + 1 : likes - 1);

        axios.post('http://localhost:3001/likeThought', { thoughtid: thoughtid, liked: updatedLiked }, { withCredentials: true })
            .catch(err => {
                console.error(err);
                setLiked(!updatedLiked);
                setLikes(updatedLiked ? likes - 1 : likes + 1);
            });
    };

    return (
        <div className="ThoughtMechanism">
            <div className="userImage">
                <img
                    src={`data:image/jpeg;base64,${thought.userImage}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.pngall.com/wp-content/uploads/5/Profile.png' }}
                    alt="User Profile Picture"
                    className="profile-pic"
                />
                <div className="userImageChild text-white" onClick={handleLikeClick}>
                    <i className={liked ? "fas fa-heart" : "far fa-heart"}></i>
                    <p>{likes}</p>
                </div>
            </div>
            <div className="userThought text-white">
                <div className="userInfo d-flex w-100">
                    <h6>{thought.username}</h6>
                    <h6> &nbsp;  ⋅ {thought.tagline} </h6>
                </div>
                <p className='text-justify text-white'>{thought.thought}</p>
            </div>
        </div>
    );
}

export default ThoughtMechanism;
