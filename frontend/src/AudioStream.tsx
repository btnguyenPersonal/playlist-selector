import React, { useState } from 'react';

const AudioStream = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter YouTube video URL" required />
        <button type="submit">Load</button>
      </form>
      <audio controls>
        <source src={`http://localhost:4000/stream?url=${url}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioStream;

