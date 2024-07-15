import React, { useState, useRef, useEffect } from 'react';
import './SearchSec.css';
import axios from 'axios';

function SearchSec() {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [caretPosition, setCaretPosition] = useState(0);
    const inputRef = useRef(null);

    const authors = ['marcus_aurelius', 'gandhiji', 'swami_vivekananda'];
    const emotions = ['happy', 'sad', 'excited'];

    const handleChange = (e) => {
        const value = e.target.value;
        const caretPos = e.target.selectionStart;
        setInputValue(value);
        setCaretPosition(caretPos);

        if (value.includes('@')) {
            const query = value.substring(value.lastIndexOf('@') + 1, caretPos);
            setSuggestions(authors.filter(author => author.includes(query)));
        } else if (value.includes('#')) {
            const query = value.substring(value.lastIndexOf('#') + 1, caretPos);
            setSuggestions(emotions.filter(emotion => emotion.includes(query)));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const value = inputValue;
        const startPos = value.lastIndexOf(value.includes('@') ? '@' : '#', caretPosition - 1);
        const endPos = caretPosition;
        const newValue = `${value.substring(0, startPos)}${value[startPos]}${suggestion} ${value.substring(endPos)}`;
        setInputValue(newValue);
        setSuggestions([]);
        setCaretPosition(startPos + suggestion.length + 2);
    };

    const handleExampleClick = (example) => {
        setInputValue(example);
        setSuggestions([]);
        inputRef.current.focus();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setSelectionRange(caretPosition, caretPosition);
            inputRef.current.focus();
        }
    }, [caretPosition]);

    useEffect(() => {
        // only focus on search-container when the component mounts
        document.querySelector('.search-container').focus();
        document.querySelector('body').blur();
        
    }, []);

    const examples = [
        'Give me quotes from marcus aurelius.',
        'Happy quotes from marcus aurelius and swami vivekananda.',
        'Give me quotes from Shreemad Bhagavad Gita, told by Shree krishna to arjun.'
    ];

    useEffect(() => {
        let searchcontainer = document.getElementsByClassName('search-container')[0];
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                searchcontainer.style.display = 'none';
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    return (
        <div className="search-container">
            <div className="main">
                <div className="search-box">
                    <textarea
                        type="text"
                        className="search-input"
                        placeholder="Ask something..."
                        value={inputValue}
                        onChange={handleChange}
                        ref={inputRef}
                    />
                    <button className="search-button">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
                {suggestions.length > 0 && (
                    <ul className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="second">
                <p className='font-weight-bold'> Examples
                </p>
                <div className="questions">
                       {examples.map((example, index) => (
                        <div 
                            key={index} 
                            className="question" 
                            onClick={() => handleExampleClick(example)}
                        >
                            {example}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchSec;
