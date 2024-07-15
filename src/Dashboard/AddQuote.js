import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import './AddQuote.css';
import React, { useState, useEffect } from 'react';

function AddQuote() {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(false);
    
    // on esc key pressed it should hide
    useEffect(() => {
        let addquoteContainer = document.getElementById('addquoteContainer');
        addquoteContainer.style.display = 'block';
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                addquoteContainer.style.display = 'none';
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);


    const addQT = async (e) => {
        e.preventDefault();
        setLoading(true);

        let quote = e.target.quote.value;
        let author = e.target.author.value;

        if (quote === "") {
            alert("Please Enter Quote");
            setLoading(false);
            return;
        }

        if (author === "") {
            author = "Unknown";
        }

        try {
            const response = await axios.post("http://localhost:3001/addQuote", { quote, author }, { withCredentials: true });
            if (response.data.message === 'Success') {
                setSnackbarMessage('Quote added successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 401) {
                window.location.href = "/login";
            } else {
                setSnackbarMessage('Failed to add quote. Please try again.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="container addContainer">
            <div className="col-md-4 offset-md-4" id="addquoteContainer">
                <div className="parent-add-qtc">
                    <div className="card-body">
                        <form onSubmit={addQT}>
                            <div className="form-group">
                                <label>Post Quote</label>
                                <textarea
                                    className="form-control"
                                    name="quote"
                                    placeholder="Write quote here..."
                                    rows="4"
                                />
                            </div>
                            <div className="form-group">
                                <label>Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="author"
                                    placeholder="Unknown"
                                />
                            </div>
                            <div className="last-child">
                                <div className="first">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                        {loading ? <CircularProgress size={24} /> : 'Post'}
                                    </button>
                                </div>
                                <div className="second">
                                    Don't worry about the author, we will take care of it.
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AddQuote;
