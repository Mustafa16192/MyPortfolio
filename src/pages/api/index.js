import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Assuming this CSS is saved in style.css

const FootballSoccerVideos = ({ videos }) => (
  <div>
    <div className="header-container">
      <h2 className="display-4 mb-4">Football/Soccer Videos</h2>
      <p>Since I'm a football player myself, I keep up to date with everything that's happening in the game. These are the highlights of some of my favorite recent football games. Hope you enjoy!</p>
    </div>
    <div className="thumbnail-container">
      <ul>
        {videos.map(video => (
          <li key={video.id}>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <img className="thumbnail" src={video.thumbnail} alt="Thumbnail" />
              <span>{video.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const APIPage = () => {
  const [videoData, setVideoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFootballSoccerVideos = async () => {
      const options = {
        method: 'GET',
        url: 'https://free-football-soccer-videos.p.rapidapi.com/',
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY, // Use environment variable
          'X-RapidAPI-Host': 'free-football-soccer-videos.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setVideoData(response.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching football/soccer videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFootballSoccerVideos();
  }, []);

  const filteredVideos = videoData.filter(video =>
    searchTerm === "" || video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "80%", maxWidth: "600px", marginBottom: '1rem' }} // Adjust for wider input
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <FootballSoccerVideos videos={filteredVideos} />
      )}
    </div>
  );
};

export default APIPage;
