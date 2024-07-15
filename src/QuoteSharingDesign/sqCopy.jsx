import React, { useState, useRef, useEffect } from 'react';
import TextEditorTooltip from './TextEditorTooltip';
import './ShareQuotes.css';
import html2canvas from 'html2canvas'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import GoogleIcon from '@mui/icons-material/Google';

function ShareQuote() {
    const [bgColor, setBgColor] = useState('white');
    const [textColor, setTextColor] = useState('rgba(0, 0, 0, 1)');
    const [authorColor, setAuthorColor] = useState('rgba(0, 0, 0, 0.8)');
    const [fonts, setFonts] = useState('Amethysta');
    const [fontSize, setFontSize] = useState(20);
    const [postSize, setPostSize] = useState('square');
    const [alignment, setAlignment] = useState('center');

    // for only tooltip
    const [selectedText, setSelectedText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const quoteRef = useRef(null);

    const handleMouseUp = (event) => {
        const selection = window.getSelection();
        const text = selection.toString();
        if (text) {
            const range = selection.getRangeAt(0).getBoundingClientRect();
            setTooltipPosition({ x: range.left, y: range.top - 40 });
            setSelectedText(text);
        } else {
            setSelectedText('');
        }
    };

    const applyStyle = (style) => {
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

    const sampleQuote = {
        quote: "You have power over your mind not outside events. Realize this, and you will find strength.",
        author: "Marcus Aurelius",
        image: "https://images.squarespace-cdn.com/content/v1/6310b9584a80996cbe9c5d35/3dca99f9-eeb9-4010-9ca6-92a74ea9baa7/Marcus_Aurelius_pink_and_blue_highlights.png"
    };

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'black', 'white'];
    const gradients = [
        'linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(to right, #667eea 0%, #764ba2 60%)',
        'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
        'linear-gradient(to right, #89f7fe 0%, #66a6ff 100%)',
        'linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)',
        'linear-gradient(to right, #fddb92 0%, #d1fdff 100%)',
        'linear-gradient(to right, #fbc2eb 0%, #a6c1ee 100%)'
    ];


    const handleSizeClick = (size) => {
        setPostSize(size);
    };

    const getContainerStyle = () => {
        switch (postSize) {
            case 'square':
                return { width: '500px', height: '500px' };
            case 'rectangle':
                return { width: '500px', height: '800px' };
            case 'tweet-post':
                return { width: '500px', height: '300px' };
            default:
                return { width: '500px', height: '500px' };
        }
    };

    const handleDownloadImage = () => {
        const printElement = document.getElementById('print');
        html2canvas(printElement).then((canvas) => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = sampleQuote.quote + "png";
            link.click();
        });
    };

    const shareOnX = () => {
        const printElement = document.getElementById('print');
        html2canvas(printElement).then((canvas) => {
            const image = canvas.toDataURL('image/png');
            const encodedImage = encodeURIComponent(image);
            const tweetText = encodeURIComponent('Check out this awesome quote!');
            const twitterUrl = `https://x.com/intent/tweet?text=${tweetText}&url=${encodedImage}`;
            window.open(twitterUrl, '_blank');
        });
    };


    return (
        <div className='ShareQuotePage'>
            <div className="left">
                <div className="SelectSize">
                    <ul>
                        <li onClick={() => handleSizeClick('square')}>
                            <div className="icon square"></div>
                            <div>Instagram Post</div>
                        </li>
                        <li onClick={() => handleSizeClick('rectangle')}>
                            <div className="icon rectangle"></div>
                            <div>Instagram Story</div>
                        </li>
                        <li onClick={() => handleSizeClick('tweet-post')}>
                            <div className="icon tweet-post"></div>
                            <div>Twitter Post</div>
                        </li>
                    </ul>
                </div>
                <div
                    id='print'
                    className={`ShareQuoteContainer ${postSize}`}
                    style={{ backgroundColor: bgColor, fontFamily: fonts, background: bgColor, ...getContainerStyle() }}
                >

                    <div className='ShareQuote'>
                        <div className='Quote'>
                            <div className='quoteText' ref={quoteRef}>
                                <p style={{ fontSize: fontSize + 'px', color: textColor, textAlign: alignment }}
                                    data-tip
                                    data-for='textEditorTooltip'
                                >
                                    {sampleQuote.quote}
                                </p>
                                <p style={{ fontSize: fontSize + 'px', color: authorColor, textAlign: alignment }} className='authorName'
                                    data-tip
                                    data-for='textEditorTooltip'
                                >- {sampleQuote.author} </p>
                            </div>
                        </div>
                    </div>
                    <p className='watermark'> WaterMark </p>
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
            </div>

            <div className="right">
                <div className='colorSelector'>
                    <p>Background Color:</p>
                    {colors.map(color => (
                        <button
                            key={color}
                            className='colorButton'
                            style={{ backgroundColor: color }}
                            onClick={() => setBgColor(color)}
                        >
                            {bgColor === color && <span className="checkmark">✔</span>}
                        </button>
                    ))}
                </div>

                <div className='colorSelector'>
                    <p>Gradient Background:</p>
                    {gradients.map(gradient => (
                        <button
                            key={gradient}
                            className='colorButton'
                            style={{ background: gradient }}
                            onClick={() => setBgColor(gradient)}
                        >
                            {bgColor === gradient && <span className="checkmark">✔</span>}
                        </button>
                    ))}
                </div>

                <div className='colorSelector'>
                    <p>Text Color:</p>
                    {colors.map(color => (
                        <button
                            key={color}
                            className='colorButton'
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                setTextColor(`rgba(${getColorValues(color)},1)`);
                                setAuthorColor(`rgba(${getColorValues(color)},0.8)`);
                            }}
                        >
                            {textColor === color && <span className="checkmark">✔</span>}
                        </button>
                    ))}
                </div>

                <div className='fontSizeSelector'>
                    <p>Quote Text Size:</p>
                    <input className='fontSizeInput'
                        type='range'
                        min='10'
                        max='50'
                        value={fontSize} // Use the numeric value
                        onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    />
                </div>

                <div className='fontSelector'>
                    <p>Select Font : </p>
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

                <div className="textAlignment">
                    <p>Quote Alignment:</p>

                    <div className="buttons">
                        <button onClick={() => setAlignment('left')}><FormatAlignLeftIcon /></button>
                        <button onClick={() => setAlignment('center')}><FormatAlignCenterIcon /></button>
                        <button onClick={() => setAlignment('right')}><FormatAlignRightIcon /></button>
                        <button onClick={() => setAlignment('justify')}><FormatAlignJustifyIcon /></button>
                    </div>
                </div>

                <div className="finalized" >
                    <button onClick={handleDownloadImage}>Download Post</button>
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
