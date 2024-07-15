import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile_Setting.css';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, CircularProgress, Button } from '@mui/material';

const Profile_Setting = ({ userId }) => {

  const [user, setUser] = useState({
    uname: '',
    uemail: '',
    tagline: '',
    useridpub: '',
    about: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch the user data when the component mounts
    axios.get('http://localhost:3001/getUserDetails', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the user data!", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('uname', user.uname);
    formData.append('uemail', user.uemail);
    formData.append('tagline', user.tagline);
    formData.append('useridpub', user.useridpub);
    formData.append('about', user.about); 

    if (profileImage) {
      try {
        const base64 = await convertToBase64(profileImage);
        formData.append('profileImage', base64);
      } catch (error) {
        console.error("There was an error converting the image to base64!", error);
        setIsSubmitting(false);
        return;
      }
    }

    axios.post('http://localhost:3001/updateUser', formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(response => {
        console.log('User updated successfully:', response.data);
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error("There was an error updating the user data!", error);
        setSnackbarMessage('Failed to update profile. Please try again.');
        setSnackbarOpen(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate('/dashboard');
  };

  return (
    <>
      <form onSubmit={handleSubmit} >
        <h2 className='text-white'>Update Your Profile</h2>
        <div>
          <label>Your Name:</label>
          <input type="text" name="uname" value={user.uname} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="uemail" value={user.uemail} onChange={handleChange} required />
        </div>
        <div>
          <label>@username  :</label>
          <input type="text" name="useridpub" value={user.useridpub} onChange={handleChange} required />
        </div>
        <div>
          <label>Tagline:</label>
          <input type="text" name="tagline" value={user.tagline} onChange={handleChange} />
        </div>
        <div className='oldImage'>
          Old Profile Image:
          <img src={user.profileImage} alt="Profile" />
          <label>New Profile Image:</label>
          <input type="file" name="profileImage" onChange={handleFileChange} accept='image/png image/jpg' />
        </div>
        <div>
          <label>About:</label>
          <textarea name="about" value={user.about} onChange={handleChange}></textarea>
        </div>
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile_Setting;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
