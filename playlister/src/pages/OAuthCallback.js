import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthCallback({ setUser }) {
  const navigate = useNavigate();

  // Function to fetch playlist details with videos
  const fetchPlaylistDetailsWithVideos = async (access_token) => {
    try {
      const playlistResponse = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!playlistResponse.ok) {
        const errorDetails = await playlistResponse.json();
        throw new Error(`Error fetching playlists: ${errorDetails.error.message}`);
      }

      const playlistData = await playlistResponse.json();
      
      const playlists = [];

      if (playlistData.items && playlistData.items.length > 0) {
        // Loop through each playlist
        for (const playlist of playlistData.items) {
          const playlistId = playlist.id;
          const playlistTitle = playlist.snippet.title;
          const playlistThumbnail = playlist.snippet.thumbnails.high.url;

          console.log(`Fetching details for Playlist: ${playlistTitle}`);

          // Fetch videos in the playlist
          const videos = await fetchAllVideosInPlaylist(playlistId, access_token);
          
          // Prepare playlist object with videos data
          const playlistWithVideos = {
            playlistId,
            playlistTitle,    // Playlist name (title)
            playlistThumbnail,
            videos,  // Array of video objects with detailed data
          };

          playlists.push(playlistWithVideos);
        }

        console.log('Fetched Playlists with Videos:', playlists);
      } else {
        console.log('No playlists found.');
      }

      return playlists; // Return the structured playlists object
    } catch (error) {
      console.error('Error fetching playlist details:', error.message);
    }
  };

  // Function to fetch all videos from a playlist
  const fetchAllVideosInPlaylist = async (playlistId, access_token) => {
    const videos = [];
    let nextPageToken = '';
    
    // Fetch videos in batches
    do {
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      
      const videoData = await videoResponse.json();
      
      if (videoData.items) {
        videoData.items.forEach(item => {
          const video = {
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt,  // Date posted here
          };
          videos.push(video);
        });
      }
      
      nextPageToken = videoData.nextPageToken;
    } while (nextPageToken);

    // Fetch additional details for each video (views, channel name)
    const videosWithDetails = await Promise.all(videos.map(async (video) => {
      const videoDetails = await fetchVideoDetails(video.videoId, access_token);
      return { ...video, ...videoDetails }; // Merge video details with video data
    }));

    return videosWithDetails;
  };

  // Fetch video details (views, posted date, channel name)
  const fetchVideoDetails = async (videoId, access_token) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          views: video.statistics.viewCount,
          channelTitle: video.snippet.channelTitle,
        };
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
    }

    return { views: 0, channelTitle: '' }; // Default values if error occurs
  };

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    const access_token = params.get('access_token');
  
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      navigate('/dashboard');  // Redirect to dashboard after saving token
    } else {
      console.error('No access token found!');
      navigate('/login');  // Redirect to login if no token is found
    }
  }, [navigate]);
  

  return <div>Loading playlists...</div>;
}

export default OAuthCallback;
