import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Label } from './ui/label'; // Ensure that Label is imported correctly
import { RadioGroup, RadioGroupItem } from './ui/radio-group'; // Ensure RadioGroup and RadioGroupItem are imported correctly
import axios from 'axios';

export function PlaylistDetails() {
  const [selectedValue, setSelectedValue] = useState('private');
  const [userEmail, setUserEmail] = useState(null);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [videoNumber, setVideoNumber] = useState(null);
  const [videos, setVideos] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email) {
      setUserEmail(storedUser.email);
    }

    const path = location.pathname;
    const regex = /\/dashboard\/([^\/]+)\/(\d+)/;
    const match = path.match(regex);

    if (match) {
      const title = decodeURIComponent(match[1].replace(/%20/g, ' '));
      const videoNumber = match[2];

      setPlaylistTitle(title);
      setVideoNumber(videoNumber);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (userEmail) {
      // Fetch user data from the backend
      axios.get(`https://youtube-playlister-server-1.onrender.com/api/users/${userEmail}`)
        .then(response => {
          const user = response.data;
          const playlists = user.playlists;
          
          const matchingPlaylist = playlists.find(playlist => playlist.playlistTitle === playlistTitle);
          if (matchingPlaylist) {
            setVideos(matchingPlaylist.videos);
          }
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userEmail, playlistTitle]);

  const handleVideoClick = (videoId) => {
    // Navigate to the YouTube video in a new tab
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="w-[400px] border-l border-zinc-800 bg-zinc-950 p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-zinc-400">Video status</Label>
          <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="private" value="private" />
              <Label htmlFor="private" className="text-zinc-300">Private</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="public" value="public" disabled />
              <Label htmlFor="public" className="text-zinc-300">Public</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-4">
          <Label className="text-zinc-400">Video List</Label>
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleVideoClick(video.videoId)} // Add onClick handler
              >
                <img src={video.thumbnail} alt={video.title} className="h-12 w-12 rounded bg-zinc-800" />
                <div className="flex-1">
                  <div className="font-medium text-zinc-100">{video.title}</div>
                  <div className="text-sm text-zinc-500">Channel Name: {video.channelTitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
