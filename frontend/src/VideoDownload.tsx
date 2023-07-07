import React, { useState } from 'react';

const VideoDownload = () => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const encodedUrl = encodeURIComponent(url);
        window.open(`http://localhost:4000/download?url=${encodedUrl}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter YouTube video URL" required />
            <button type="submit">Download</button>
        </form>
    );
};

export default VideoDownload;

