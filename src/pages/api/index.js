import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Make sure this path correctly points to your CSS file

const APIPage = () => {
  const [footballVideos, setFootballVideos] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFootballVideos = async () => {
      try {
        const response = await axios.request({
          method: 'GET',
          url: 'https://free-football-soccer-videos.p.rapidapi.com/',
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'free-football-soccer-videos.p.rapidapi.com'
          }
        });
        setFootballVideos(response.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching football videos:", error);
        setError('Failed to load football videos.');
      }
    };

    const fetchYoutubeVideos = async () => {
      try {
        const response = await axios.request({
          method: 'GET',
          url: 'https://youtube-v31.p.rapidapi.com/search',
          params: {
            channelId: 'UCd84KUlhKQYXrMHsOPfyxcw', // Example channel ID
            part: 'snippet,id',
            order: 'date',
            maxResults: '10'
          },
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
          }
        });
        setYoutubeVideos(response.data.items);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        setError('Failed to load YouTube videos.');
      }
    };

    Promise.all([fetchFootballVideos(), fetchYoutubeVideos()]).finally(() => setLoading(false));
  }, []);

  const filteredFootballVideos = footballVideos.filter(video =>
    searchTerm === "" || video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredYoutubeVideos = youtubeVideos.filter(video =>
    searchTerm === "" || video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="videos-container" style={{ textAlign: 'center' }}>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "80%", maxWidth: "600px", marginBottom: '1rem' }}
      />

      <section className="football-videos">
        <hr className="t_border my-4 ml-0 text-left" />
        <h2 className="display-4 mb-4">Football/Soccer Videos</h2>
        <p style={{ fontSize: 'larger' }}>Since I'm a football player myself, I keep up to date with everything that's happening in the game. These are the highlights of some of my favorite recent football games. Hope you enjoy!</p>
        <hr className="t_border my-4 ml-0 text-left" />
        <div className="thumbnail-container">
          {filteredFootballVideos.map((video, index) => (
            <div key={index} className="video-item">
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <img className="thumbnail" src={video.thumbnail} alt="Thumbnail" />
                <span>{video.title}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="youtube-videos">
        <hr className="t_border my-4 ml-0 text-left" />
        <h2 className="display-4 mb-4">Ronaldo YouTube Channel Videos</h2>
        <p style={{ fontSize: 'larger' }}>These are the latest videos of my Youtube Channel!</p>
        <hr className="t_border my-4 ml-0 text-left" />
        <div className="thumbnail-container">
          {filteredYoutubeVideos.map((video, index) => (
            <div key={index} className="video-item">
              <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="thumbnail" />
                <span>{video.snippet.title}</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default APIPage;
