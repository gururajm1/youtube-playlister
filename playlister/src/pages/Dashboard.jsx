import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { PlaylistCard } from '../components/playlist-card';
import { PlaylistDetails } from '../components/playlist-details';
import { SidebarNav } from '../components/sidebar-nav';
import { TopNav } from '../components/top-nav';
import { Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function Dashboard() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Function to authenticate with YouTube
  const authenticateYouTube = () => {
    const clientId = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
    const redirectUri = 'http://localhost:3000/oauth2callback';
    const oauth2Endpoint = `https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/youtube.readonly`;
    window.location.href = oauth2Endpoint;
  };

  // Function to fetch playlist videos using access token
  const fetchPlaylistVideos = async (playlistId, access_token) => {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&access_token=${access_token}`;
  
    try {
      const response = await axios.get(url);
      const videos = response.data.items.map((video) => ({
        videoId: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: video.snippet.publishedAt,
        channelTitle: video.snippet.videoOwnerChannelTitle,
      }));
      return videos;
    } catch (error) {
      console.error('Error fetching playlist videos: ', error);
      return [];
    }
  };

  // Function to fetch playlists from YouTube
  const fetchUserPlaylists = async (access_token) => {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&access_token=${access_token}`;
  
    try {
      const response = await axios.get(url);
      const playlists = response.data.items;
  
      // Map each playlist with additional video data
      const playlistDataPromises = playlists.map(async (playlist) => {
        const videos = await fetchPlaylistVideos(playlist.id, access_token); // Fetch videos for the playlist
        return {
          id: playlist.id,
          name: playlist.snippet.title,
          videoCount: playlist.contentDetails.itemCount,
          thumbnail: playlist.snippet.thumbnails.high.url,
          videos: videos, // Include videos data in the playlist object
        };
      });
  
      const playlistData = await Promise.all(playlistDataPromises); // Wait for all playlist data to be fetched
      setPlaylists(playlistData); // Set the playlists state with detailed data
      // Store playlists in localStorage
      localStorage.setItem('playlists', JSON.stringify(playlistData));
    } catch (error) {
      setError('Error fetching playlists: ' + error.message);
    }
  };

  // Handle click on "Import from YouTube"
  const handleImportClick = () => {
    authenticateYouTube();
  };

  // Handle the "Save Layout" click
  const handleSaveLayout = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      setError('No user data found in localStorage');
      return;
    }

    const userEmail = storedUser.email; // Assuming user is an object with an email property
    if (userEmail) {
      const storedPlaylists = localStorage.getItem('playlists');
      if (storedPlaylists) {
        try {
          const playlistsData = JSON.parse(storedPlaylists);

          // Send playlists and email to the backend to update the database
          const response = await axios.post('http://localhost:5000/api/savePlaylists', {
            userEmail,
            playlists: playlistsData,
          });

          console.log(response.data.message);
          alert(response.data.message);
        } catch (error) {
          console.error('Error saving playlists:', error);
          setError('Error saving playlists to the database');
        }
      } else {
        setError('No playlists found in localStorage');
      }
    } else {
      setError('No email found in user data');
    }
  };

  // Drag-and-drop logic
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = playlists.findIndex((playlist) => playlist.id === active.id);
      const newIndex = playlists.findIndex((playlist) => playlist.id === over.id);

      const updatedPlaylists = [...playlists];
      const [movedItem] = updatedPlaylists.splice(oldIndex, 1);
      updatedPlaylists.splice(newIndex, 0, movedItem);

      setPlaylists(updatedPlaylists);
      // Update localStorage with the new order after drag-and-drop
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    }
  };

  // Function to navigate to the playlist details page
  const handleCardClick = (playlistId, playlistTitle, videoCount) => {
    // Navigate to /dashboard/playlistTitle/videoCount
    navigate(`/dashboard/${playlistTitle}/${videoCount}`);
  };

  useEffect(() => {
    // Check if playlists are already saved in localStorage
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      // Parse and set playlists state from localStorage if available
      setPlaylists(JSON.parse(savedPlaylists));
    } else {
      // Fetch playlists from YouTube if no playlists in localStorage
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        fetchUserPlaylists(access_token); // Fetch playlists if token exists
      } else {
        console.log('No access token found, redirecting to authenticate');
      }
    }
  }, []); // Empty dependency array to ensure this runs only once on mount

  return (
    <div className="min-h-screen bg-[#18181B] text-zinc-50">
      <div className="flex">
        <SidebarNav />
        <div className="flex-1">
          <TopNav />
          <main className="flex">
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-semibold">Your YouTube Playlists</h2>
              <div className="mt-8 flex items-center gap-4">
                <Button
                  className="gap-2 bg-red-500 text-white hover:bg-[#DC2626]/90 border-0"
                  onClick={handleImportClick}
                >
                  <Youtube className="h-4 w-4" />
                  Import from YouTube
                </Button>
                <Button
                  className="gap-2 bg-green-500 text-white hover:bg-[#10B981]/90 border-0"
                  onClick={handleSaveLayout}
                >
                  Save Layout
                </Button>
              </div>
              {error && <p className="mt-4 text-red-500">{error}</p>}
              <div className="mt-8">
                
              </div>
              <div className="mt-8">
                <DndContext onDragEnd={handleDragEnd}>
                  <SortableContext items={playlists.map((playlist) => playlist.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-3 gap-6">
                      {playlists.map((playlist) => (
                        <PlaylistCard
                          key={playlist.id}
                          id={playlist.id}
                          name={playlist.name}
                          videoCount={playlist.videoCount}
                          thumbnail={playlist.thumbnail}
                          handleCardClick={handleCardClick} // Pass the function to PlaylistCard
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
            <PlaylistDetails />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
