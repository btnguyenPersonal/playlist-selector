import React from 'react';
import logo from './logo.svg';
import './App.css';
import VideoDownload from './VideoDownload';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <VideoDownload />
            </header>
        </div>
    );
}

export default App;
