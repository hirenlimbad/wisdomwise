import React, { useState, useEffect } from 'react';
import ThoughtMechanism from './ThoughtMechanism';
import axios from 'axios';
import './Thoughts.css';

function ThoughtContainer({ quoteId }) {

    // setting post button disabled
    const [postDisabled, setPostDisabled] = useState(true);
    const [thoughts, setThoughts] = useState([]);

    function selectText() {
        var range = document.createRange();
        var editable = document.querySelector('.editable');
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
        var thought = document.querySelector('.editable').innerText;
        axios.post('http://localhost:3001/postThought', {thought: thought, quoteId:quoteId}, { withCredentials: true })
            .then(res => {
                console.log(  "New thought id: " ,[res.data.thoughtid]);
                setThoughts([res.data.thoughtid, ...thoughts]);
            })
            .catch(err => {});
    }

    useEffect(() => {
        // getting the thoghts
        axios.post('http://localhost:3001/getThoughts', { quoteId: quoteId }, { withCredentials: true })
            .then(res => {
                console.log("Thoughts id data is: ", res.data);
                setThoughts(res.data)
            })
            .catch(err => {});
    }, []);

    return (
        <>
            <div className="ThoughtMechanism">
                <div className="userImage">
                    <img src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png" alt="user" />
                </div>
                <div className="userThought">
                    <div className="userInfo d-flex w-100">
                        <h6>Dolar jin</h6>
                        <h6> &nbsp;  ⋅ Sare jahan se accha </h6>
                    </div>

                    <p className='text-justify'>
                        <p className="editable" contentEditable='true' onClick={selectText}>  Click here to write your thoughts </p>
                    </p>
                    <div className="post">
                        <button className='postBTN' onClick={postThought} disabled={postDisabled} >Post</button>
                    </div>
                </div>
            </div>


            {thoughts.map(id => (
                <ThoughtMechanism thoughtid={id}/>
            ))}
        </>
    );
}

function ThoughtContainerWrapper({ quoteId }) {
    const [key, setKey] = useState(0);

    useEffect(() => {
        // Increment the key to force remount
        setKey(prevKey => prevKey + 1);
    }, [quoteId]);

    return <ThoughtContainer key={quoteId} quoteId={quoteId} />;
}

export default ThoughtContainerWrapper;
