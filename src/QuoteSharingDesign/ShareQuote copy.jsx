import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import TextEditorTooltip from './TextEditorTooltip';
import './ShareQuotes.css';
import html2canvas from 'html2canvas'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

import FormatSizeIcon from '@mui/icons-material/FormatSize';

import BottomNavShare from './BottomNavShare';

function ShareQuote() {
    const [bgColor, setBgColor] = useState('white');
    const [quote, setQuote] = useState({ quote: '', author: '' });
    const [textColor, setTextColor] = useState('black');
    const [authorColor, setAuthorColor] = useState('rgba(0, 0, 0, 0.8)');
    const [showWatermark, setShowWatermark] = useState(true);
    const [showAuthor, setShowAuthor] = useState(true);
    const [fonts, setFonts] = useState('Amethysta');
    const [fontSize, setFontSize] = useState(20);
    const [postSize, setPostSize] = useState('');
    const [alignment, setAlignment] = useState('left');

    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
        }
    }, []);


    // getting quote from database
    useEffect(() => {
        // getting quoteID from the URL
        const url = window.location.href;
        const quoteId = url.split("/").pop();

        // fetching the quote from the database
        axios.post('http://localhost:3001/getQuoteById', { quoteId })
            .then(response => {
                setQuote([response.data.quote, response.data.author_name]);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);


    // code for show or hide author and watermark
    function showHideAuthor() {
        if (showAuthor) {
            setShowAuthor(false);
        } else {
            setShowAuthor(true);
        }
    }

    function showHideWatermark() {
        if (showWatermark) {
            setShowWatermark(false);
        } else {
            setShowWatermark(true);
        }
    }


    // for only tooltip
    const [selectedText, setSelectedText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const quoteRef = useRef(null);


    // for only collapse
    const [isBgColorOpen, setIsBgColorOpen] = useState(true);
    const [isTextColorOpen, setIsTextColorOpen] = useState(false);
    const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
    const [isFontOpen, setIsFontOpen] = useState(false);
    const [isAlignmentOpen, setIsAlignmentOpen] = useState(false);

    const handleMouseUp = (event) => {
        const selection = window.getSelection();
        let text = selection.toString();

        let firstSpace = "";
        if (text[0] == " ") {
            firstSpace = " ";
        }
        let lastSpace = "";
        if (text[text.length - 1] == " ") {
            lastSpace = " ";
        }

        text = text.trim()


        // Check if the selected text is a single word
        const isSingleWord = /^[^\s]+$/.test(text);

        text = firstSpace + text + lastSpace;

        if (isSingleWord) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setTooltipPosition({ x: rect.left, y: rect.top - 40 });
            setSelectedText(text);
        } else {
            setSelectedText('');
        }
    };


    const applyStyle = (style, value) => {
        if (!selectedText) return;

        const span = document.createElement('span');

        switch (style) {
            case 'increase-font':
                span.style.fontSize = 'larger';
                break;
            case 'decrease-font':
                span.style.fontSize = 'smaller';
                break;
            case 'bold':
                span.style.fontWeight = 'bold';
                break;
            case 'italic':
                span.style.fontStyle = 'italic';
                break;
            case 'underline':
                span.style.textDecoration = 'underline';
                break;
            case 'color':
                span.style.color = value;
                break;
            default:
                break;
        }

        span.textContent = selectedText;

        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);

        setSelectedText('');
    };


    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    // ending of tooltip


    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'black', 'white', 'linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(to right, #667eea 0%, #764ba2 60%)',
        'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
        'linear-gradient(to right, #8e2de2, #4a00e0)',
        'linear-gradient(to right, #FFD194, #D1913C)',
        'linear-gradient(to top, #005aa7, #fffde4)',
        'linear-gradient(to top, #a8c0ff, #3f2b96)'
    ];

    const textColors = ['#d62828', '#14213d', '#03045e', '#073b4c', '#ee9b00', 'purple', '#003566', '#293241', 'white', 'black'];


    const handleSizeClick = (size) => {
        setPostSize(size);
    };

    const getContainerStyle = () => {
        switch (postSize) {
            case 'square':
                return { width: '60%', height: '60%' };
            case 'rectangle':
                return { width: '50%', height: '87%' };
            case 'tweet-post':
                return { width: '70%', height: '43%' };
            case 'screen-size':
                return { width: '90%', height: '70%' }
            default:
                return { width: '100%', height: '65%' };
        }
    };


    const handleDownloadImage = async (postSize) => {
        const element = document.getElementById('print');

        switch (postSize) {
            case 'square':
                element.style.height = "500px";
                element.style.width = "500px";
                break;

            case 'rectangle':
                element.style.height = "1920px";
                element.style.width = "1080px";
                break;

            case 'tweet-post':
                element.style.height = "900px";
                element.style.width = "1600px";
                break;

            default:
                console.error("Invalid post size");
                return;
        }

        const canvas = await html2canvas(element); // Wait for the promise to resolve
        const data = canvas.toDataURL('image/jpg'); // Get the data URL from the canvas
        const link = document.createElement('a');

        link.href = data;
        link.download = 'downloaded-image.jpg';

        document.body.appendChild(link);
        // link.click();
        document.body.removeChild(link);
    };



    // show the printElement in the full screen
    const handleFullScreen = () => {
        const printElement = document.getElementById('print');
        if (printElement.requestFullscreen) {
            printElement.requestFullscreen();
        } else if (printElement.mozRequestFullScreen) {
            printElement.mozRequestFullScreen();
        } else if (printElement.webkitRequestFullscreen) {
            printElement.webkitRequestFullscreen();
        } else if (printElement.msRequestFullscreen) {
            printElement.msRequestFullscreen();
        }
    }


    // for bottom navigation
    useEffect(() => {
        const bottomNavigationItems = document.querySelectorAll('.BottomNavigation-item');
        bottomNavigationItems.forEach(item => {
            item.addEventListener('click', function () {
                bottomNavigationItems.forEach(item => {
                    item.classList.remove('active');
                });
                item.classList.add('active');
            });
        });
    }, []);

    const [value, setValue] = useState('recents');

    const handleNavigationClick = (component) => {
        console.log(component);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <div className='ShareQuotePage'>

            <>
                <BottomNavigation
                    className="BottomNavigation"
                    sx={{ width: 500, background: 'rgb(22 19 19)', position: "fixed", left: "33%", borderRadius: "10px", bottom: 0 }}
                    value={value}
                    onChange={handleChange}
                >
                    <BottomNavigationAction onClick={() => handleNavigationClick('bgColor')}
                        label="Background"
                        value="recents"
                        icon={<FormatColorFillIcon />}
                    />
                    <BottomNavigationAction onClick={() => handleNavigationClick('textColor')}
                        label="Color"
                        value="favorites"
                        icon={<FormatColorTextIcon />}
                    />
                    <BottomNavigationAction onClick={() => handleNavigationClick('fontAndSize')}
                        label="Fonts"
                        value="nearby"
                        icon={<FontDownloadIcon />}
                    />
                    <BottomNavigationAction onClick={() => handleNavigationClick('textAlign')}
                        label="Alignments"
                        value="folder"
                        icon={<AlignHorizontalRightIcon />}
                    />
                    <BottomNavigationAction onClick={() => handleNavigationClick('showHide')}
                        label="Show/Hide"
                        value="ShowHide"
                        icon={<VisibilityIcon />}
                    />
                    <BottomNavigationAction onClick={() => handleNavigationClick('export')}
                        label="Download"
                        value="download"
                        icon={<DownloadIcon />}
                    />
                </BottomNavigation>


            </>

            <div className="left">
                <div className="SelectSize">
                    <ul>
                        <li onClick={() => handleSizeClick('square')} className={postSize === 'square' ? 'active square-parent' : 'square-parent'}>
                            <div className="icon square"></div>
                            <div>Instagram Post</div>
                        </li>
                        <li onClick={() => handleSizeClick('rectangle')} className={postSize === 'rectangle' ? 'active' : ''}>
                            <div className="icon rectangle"></div>
                            <div>Instagram Story</div>
                        </li>
                        <li onClick={() => handleSizeClick('tweet-post')} className={postSize === 'tweet-post' ? 'active' : ''}>
                            <div className="icon tweet-post"></div>
                            <div>Card Size</div>
                        </li>
                    </ul>

                </div>
                <p className='preview'>Preview</p>
                <div
                    id='print'
                    className={`ShareQuoteContainer ${postSize}`}
                    style={{ backgroundColor: bgColor, fontFamily: fonts, background: bgColor, ...getContainerStyle() }} >

                    <div className='ShareQuote'>
                        <div className='Quote'>
                            <div className='quoteText' ref={quoteRef}>
                                <p style={{ fontSize: fontSize + 'px', color: textColor, textAlign: alignment }}
                                    data-tip
                                    data-for='textEditorTooltip'
                                >
                                    {quote[0]}
                                </p>

                                <div style={{ fontSize: fontSize + 'px', color: textColor, textAlign: alignment }}>

                                    {showAuthor && <p> - {quote[1]} </p>}

                                </div>
                            </div>
                        </div>
                    </div>

                    {bgColor === 'white' && textColor === 'black' && alignment === 'left' && showWatermark && (
                        <p className='watermark'> WisdomWise -  Signature Style <CheckCircleIcon sx={{ fontSize: 'inherit' }} /> </p>
                    )}

                    {!(bgColor === 'white' && textColor === 'black' && alignment === 'left') && showWatermark && (
                        <p className='watermark'> WisdomWise  </p>
                    )}
                    {/* for tooltip */}
                    {selectedText && (
                        <div
                            id='textEditorTooltip'
                            style={{
                                position: 'absolute',
                                top: tooltipPosition.y,
                                left: tooltipPosition.x,
                                zIndex: 1000,
                            }}
                        >
                            <TextEditorTooltip onApplyStyle={applyStyle} />
                        </div>
                    )}
                    {/* end code for tooltip */}
                </div>

                <div className="message">
                    Tip : Select any word from quote to apply more styles.
                </div>

                <div className="showHide">
                    <button onClick={() => showHideWatermark()}>
                        {showWatermark ? 'Hide' : 'Show'} Watermark
                    </button>

                    <button onClick={() => showHideAuthor()}>
                        {showAuthor ? 'Hide' : 'Show'} Author
                    </button>
                </div>

            </div>

            <div className="right">
                <div className="optionGroup">
                    <p onClick={() => setIsBgColorOpen(!isBgColorOpen)}> <FormatColorFillIcon /> {!isMobile && <>
                        Background</>} </p>
                    {isBgColorOpen && (
                        <div className='colorSelector'>
                            {colors.map(color => (
                                <button
                                    key={color}
                                    className='colorButton'
                                    style={{ background: color }}
                                    onClick={() => setBgColor(color)}
                                >
                                    {bgColor === color && <span className="checkmark">✔</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="optionGroup">
                    <p onClick={() => setIsTextColorOpen(!isTextColorOpen)}> <FormatColorTextIcon /> {!isMobile && <>
                        Text Color</>}  </p>
                    {isTextColorOpen && (
                        <div className='colorSelector'>
                            {textColors.map(color => (
                                <button
                                    key={color}
                                    className='colorButton'
                                    style={{ backgroundColor: color }}
                                    onClick={() => setTextColor(color)
                                    }
                                >
                                    {textColor === color && <span className="checkmark">✔</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>


                <div className="optionGroup">
                    <p onClick={() => setIsFontOpen(!isFontOpen)}> <FormatSizeIcon /> {!isMobile && <>  Text Style and size </>} </p>
                    {isFontOpen && (

                        <>
                            <div className='fontSizeSelector'>
                                <input className='fontSizeInput'
                                    type='range'
                                    min='10'
                                    max='50'
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                />
                            </div>
                            <div className='fontSelector'>
                                <select className='fontSelect' onChange={(e) => setFonts(e.target.value)} style={{ fontFamily: fonts }}>
                                    <option value='Amethysta' style={{ fontFamily: 'Amethysta' }}>Amethysta</option>
                                    <option value='Caveat' style={{ fontFamily: "Caveat" }}>Caveat</option>
                                    <option value='Dancing Script' style={{ fontFamily: "Dancing Script" }}>Dancing Script</option>
                                    <option value='Indie Flower' style={{ fontFamily: "Indie Flower" }}>Indie Flower</option>
                                    <option value='Lobster' style={{ fontFamily: "Lobster" }}>Lobster</option>
                                    <option value='Pacifico' style={{ fontFamily: "Pacifico" }}>Pacifico</option>
                                    <option value='Shadows Into Light' style={{ fontFamily: "Shadows Into Light" }}>Shadows Into Light</option>
                                    <option value='Tangerine' style={{ fontFamily: "Tangerine", fontSize: "30px" }}>Tangerine</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>


                <div className="optionGroup">
                    <div className="textAlignment">
                        <p onClick={() => setIsAlignmentOpen(!isAlignmentOpen)}> <AlignHorizontalRightIcon /> {!isMobile && <> Text Alignment </>} </p>
                        {isAlignmentOpen && (
                            <div className="buttons">
                                <button onClick={() => setAlignment('left')} className={alignment === 'left' ? 'active' : ''} ><FormatAlignLeftIcon /></button>
                                <button onClick={() => setAlignment('center')} className={alignment === 'center' ? 'active' : ''}><FormatAlignCenterIcon /></button>
                                <button onClick={() => setAlignment('right')} className={alignment === 'right' ? 'active' : ''}><FormatAlignRightIcon /></button>
                                <button onClick={() => setAlignment('justify')} className={alignment === 'justify' ? 'active' : ''}><FormatAlignJustifyIcon /></button>
                            </div>
                        )}
                    </div>
                </div>


                <div className="finalized">
                    <button onClick={handleFullScreen}> Full screen </button>
                    <button onClick={() => handleDownloadImage(postSize)}>Download Post</button>
                </div>

            </div>

        </div>
    );
}

function getColorValues(color) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return [data[0], data[1], data[2]]; // Return RGB values
}

export default ShareQuote;
