import React, { useState } from 'react';
import './tooltip.css';

const TextEditorTooltip = ({ onApplyStyle }) => {

  return (
    <div className='ToolTip'>
      <button onClick={() => onApplyStyle('increase-font')}> + </button>
      <button onClick={() => onApplyStyle('decrease-font')}> - </button>
      <button onClick={() => onApplyStyle('bold')}> Bold </button>
      <button onClick={() => onApplyStyle('underline')}> Underline </button>
    </div>
  );
};

export default TextEditorTooltip;
