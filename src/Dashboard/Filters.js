
import axios from "axios";
import React, { useState, useEffect } from 'react';
import './Filters.css';

function Filters() {
    return (
        <div className="filters demand">
             {/* <h1> Demand </h1>  */}
            {/* <div className="search-box">
                <input type="text" placeholder="Search Quotes, Authors, User" />
                <i class="fa-solid fa-magnifying-glass"></i>
            </div> */}

            <div className="demandbox">
                <h2>I want <i> Quotes </i> from <i>Marcus Aurlisus</i> </h2>
            </div>
            {/* <div className="child">
                <div className="categories">
                    <ul>
                        <li>Anger</li>
                        <li className="active">happiness</li>
                        <li>Anxiety</li>
                        <li>Regret</li>
                        <li>Pain</li>
                    </ul>
                </div>
            </div> */}
            <div className="child p-response">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque pariatur eveniet ratione corrupti excepturi aliquam cupiditate tempore molestias magnam fugit? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum dignissimos, earum aut qui dolores adipisci ut pariatur doloribus eveniet debitis molestiae officia delectus iusto tempora, corrupti cumque tempore quas inventore tenetur accusamus repudiandae. Sed error inventore alias. Nam labore et numquam mollitia autem adipisci rem, consequuntur cumque culpa odit praesentium sit molestias voluptates architecto nisi, laboriosam quidem harum repudiandae non, enim excepturi magnam atque? Ab optio impedit eum, hic placeat quas accusamus dicta dignissimos. Quia eaque magni, obcaecati ipsa perferendis numquam iusto voluptatem consequuntur nam modi illo commodi quos est! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id pariatur corporis rem dolorum maiores! Fugiat at corrupti accusantium iusto esse! Voluptatem possimus vitae quidem in velit distinctio, delectus esse quibusdam eos soluta sit reprehenderit incidunt aperiam? Sed repellendus reprehenderit soluta. </p>
            </div>
        </div>
    );
}

export default Filters;