    import React, { useState, useEffect } from 'react';
    import axios from 'axios';


    function ShowUserDetails() {

        let userName = "Welcome to the user details page";

        const [userDetails, setUserDetails] = useState([])
        useEffect(() => {
            axios.get('https://wisdomwise.onrender.com/getUserName', { withCredentials: true }, { headers: { 'Content-Type': 'application/json' } })
                .then(res => {
                    console.log("User data.")
                    console.log(res.data)
                    userName = res.data.userName
                    document.getElementById("uname").innerHTML = "Hello, " + userName + "👋"
                })
                .catch(err => {
                    console.log(err)
                })

        }, [])

        return (
            <div>
                <h2 id="uname"> hii {userName}</h2>
            </div>
        )
    }


    export default ShowUserDetails;