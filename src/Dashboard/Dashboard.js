import React, { useState, lazy, Suspense } from 'react';
import './quotes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BottomNavigationBar from './Navigation/BottomNavigationBar';
import SideNavigation from './SideNavigation/SideNavigation';
import QOTDay from './QuoteOfTheDay/QOTDay';
import './dashboard.css';
import DesiredQuote from './DesiredQuote/DesiredQuote';
import { useEffect } from 'react';


// Home page
const QT_Container = lazy(() => import('./QT_Container'));

// Add quote page
const AddQuote = lazy(() => import('./AddQuote'));

// Search page
const SearchSec = lazy(() => import('./SearchSection/SearchSec'));

// profile page
const ProfilePage = lazy(() => import('./Profile/ProfilePage'));


function Dashboard() {
    const [activeComponent, setActiveComponent] = useState('home');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'home':
                return (<>
                    <Suspense fallback={<div>Loading chat...</div>}>
                        <QT_Container />
                    </Suspense> </>);

            case 'addQuote':
                return (<>
                    <Suspense fallback={<div>Loading...</div>}>
                        <QT_Container />  <AddQuote />
                    </Suspense>
                </>);
            
            case 'trending':
                return (<>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DesiredQuote desire={'trending'} />
                    </Suspense>
                </>);

            case 'search':
                return (<>
                    <Suspense fallback={<div>Loading...</div>}>
                        <QT_Container /> <SearchSec />
                    </Suspense>
                </>);
            case 'profile':
                return (<>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ProfilePage />
                    </Suspense>
                </>);
            case 'like':
                return (<>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DesiredQuote desire={'liked'} />    
                    </Suspense>
                </>);
            
            case 'bookmark':
                return (<>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DesiredQuote desire={'bookmarked'} />
                    </Suspense>
                </>);
            
        }
    };


    // as per the url rendering the component
    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/') {
            setActiveComponent('home');
        } else if (path === '/new') {
            setActiveComponent('addQuote');
        } else if (path === '/home') {
            setActiveComponent('home');
        } 
        else if (path === '/addQuote') {
            setActiveComponent('addQuote');
        }
        else if (path === '/trending') {
            setActiveComponent('trending');
        } else if (path === '/search') {
            setActiveComponent('search');
        } else if (path === '/profile') {
            setActiveComponent('profile');
        } else if (path === '/like') {
            setActiveComponent('like');
        } else if (path === '/bookmark') {
            setActiveComponent('bookmark');
        }
    }, []);

    return (
        <div className="dashcontainer">
            <div className='child sideNavParent'>
                <SideNavigation setActiveComponent={setActiveComponent} />
            </div>

            <div className="dynamic child">
                {renderComponent()}
            </div>

            <div className='qot child'>
                <QOTDay />
            </div>
        </div>
    );
}

export default Dashboard;