    import React, { useState, useEffect } from 'react';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Register from './UserCred/Register';
    import Login from './UserCred/Login';
    import Quote from './quotes';
    import QuoteMechanism from './Dashboard/QuoteMechanism';
    import QT_Container from './Dashboard/QT_Container';
    import ShareQuote from './QuoteSharingDesign/ShareQuote';
    import AddQuote from './Dashboard/AddQuote';
    import Dashboard from './Dashboard/Dashboard';
    import ProfilePage from './Dashboard/Profile/ProfilePage';
    import Profile_Setting from './Dashboard/Profile/Profile_Setting';
    import SingleQuote from './Dashboard/SingleQuote/SingleQuote';
    import LoadingScreen from './Dashboard/Loader/LoadingScreen';

    function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoadingScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quotes" element={<Quote />} />
            <Route path="/qtmechanism" element={<QuoteMechanism quoteId={"6636e9454e4a1892826893f3"} />} />
            <Route path="/qtcontainer" element={<QT_Container />} />
            <Route path="/AddQuote" element={<AddQuote />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:username" element={ <ProfilePage />} />
            <Route path="/quote/:quoteId" element={<ShareQuote />} />
            <Route path="/profile_setting" element={<Profile_Setting />} />
        </Routes>
        </BrowserRouter>
    );
    }

    export default App;
