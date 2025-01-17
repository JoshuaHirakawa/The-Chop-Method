// ? This file will serve as the entry point for the React App
import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App.js';
import './style.css';

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<App />);
