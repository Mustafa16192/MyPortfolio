// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import './style.css'; // Import the CSS file

// // Component to display football/soccer videos
// const FootballSoccerVideos = ({ videos }) => (
//   <div>
//     <div className="header-container"> {/* New div for heading and paragraph */}
//       <h2 className="display-4 mb-4">Football/Soccer Videos</h2> 
//       <p>Since I'm a football player myself, I keep up to date with everything that's happening in the game. These are the highlights of some of my favorite recent football games. Hope you enjoy!</p>
//     </div>
//     <div className="thumbnail-container"> {/* Add a class to the container */}
//       <ul>
//         {videos.map(video => (
//           <li key={video.id}>
//             <a href={video.url} target="_blank" rel="noopener noreferrer">
//               <img className="thumbnail" src={video.thumbnail} alt="Thumbnail" /> {/* Add a class to the thumbnail */}
//               <span>{video.title}</span>
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );

// const APIPage = () => {
//   const [videoData, setVideoData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFootballSoccerVideos = async () => {
//       const options = {
//         method: 'GET',
//         url: 'https://free-football-soccer-videos.p.rapidapi.com/',
//         headers: {
//           'X-RapidAPI-Key': 'b87884b839msh172265c9370ed73p1e2be1jsnda5bbd3f270d',
//           'X-RapidAPI-Host': 'free-football-soccer-videos.p.rapidapi.com'
//         }
//       };

//       try {
//         const response = await axios.request(options);
//         setVideoData(response.data.slice(0, 10)); // Slice the data to get only the first 10 items
//         console.log("Video Data:", response.data); // Add this line to log the video data
//       } catch (error) {
//         console.error("Error fetching football/soccer videos:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Fetch football/soccer videos
//     fetchFootballSoccerVideos();
//   }, []);

//   return (
//     <div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <FootballSoccerVideos videos={videoData} />
//       )}
//     </div>
//   );
// };

// export default APIPage;
import React, { useState, useEffect } from "react";
import axios from 'axios';
import './style.css'; // Import the CSS file
import { Container, Row, Col } from "react-bootstrap";

// Component to display football/soccer videos
const FootballSoccerVideos = ({ videos }) => (
  <Container className="About-header">
    <Row className="mb-5 mt-3 pt-md-3">
      <Col lg="8">
        <h1 className="display-4 mb-4">Football Videos</h1>
        <hr className="t_border my-4 ml-0 text-left" />
      </Col>
    </Row>
    <div className="header-container">
      <p>Since I'm a football player myself, I keep up to date with everything that's happening in the game. These are the highlights of some of my favorite recent football games. Hope you enjoy!</p>
    </div>
    <div className="thumbnail-container"> {/* Add a class to the container */}
      <ul>
        {videos.map(video => (
          <li key={video.id}>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <img className="thumbnail" src={video.thumbnail} alt="Thumbnail" /> {/* Add a class to the thumbnail */}
              <span>{video.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </Container>
);

const APIPage = () => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFootballSoccerVideos = async () => {
      const options = {
        method: 'GET',
        url: 'https://free-football-soccer-videos.p.rapidapi.com/',
        headers: {
          'X-RapidAPI-Key': 'b87884b839msh172265c9370ed73p1e2be1jsnda5bbd3f270d',
          'X-RapidAPI-Host': 'free-football-soccer-videos.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setVideoData(response.data.slice(0, 10)); // Slice the data to get only the first 10 items
        console.log("Video Data:", response.data); // Add this line to log the video data
      } catch (error) {
        console.error("Error fetching football/soccer videos:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch football/soccer videos
    fetchFootballSoccerVideos();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <FootballSoccerVideos videos={videoData} />
      )}
    </div>
  );
};

export default APIPage;
