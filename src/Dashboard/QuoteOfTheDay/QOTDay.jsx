
import React from 'react';
import './QOTDay.css';
import TrendingDash from '../Trendings/TrendingDash';
import { useEffect } from 'react';
import axios from 'axios';
function QOTDay() {


    return (
        <>
            <div className="parent QOTDay">
                <div className="child top">
                    <h3>Quote of the day</h3>
                    <p>Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.</p>
                    <p> - Unknown</p>
                </div>

                <div className="child trending">
                    <TrendingDash />
                </div>
            </div>
        </>
    );
}

export default QOTDay;