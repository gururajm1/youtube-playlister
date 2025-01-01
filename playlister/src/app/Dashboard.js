import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PlaylistCard } from '../components/playlist-card';
import { PlaylistDetails } from '../components/playlist-details';
import { SidebarNav } from '../components/sidebar-nav';
import { TopNav } from '../components/top-nav';
import { Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

const initialPlaylists = [
  { id: '1', name: 'Product Playlists Name', videoCount: 5 },
  { id: '2', name: 'Product Playlists Name', videoCount: 5 },
  { id: '3', name: 'Product Playlists Name', videoCount: 5 },
  { id: '4', name: 'Product Playlists Name', videoCount: 5 },
  { id: '5', name: 'Product Playlists Name', videoCount: 5 },
  { id: '6', name: 'Product Playlists Name', videoCount: 5 },
];

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [playlistLink, setPlaylistLink] = useState('');
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchPlaylistData = async (playlistId) => {
    const apiKey = 'AIzaSyCq9LQ59WzzwAz2Us1Y298l_rop9wnQoZY';
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const fetchedPlaylists = await Promise.all(response.data.items.map(async (item) => {
        const videoId = item.snippet.resourceId.videoId;
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
        
        const videoDetailsResponse = await axios.get(videoDetailsUrl);
        const videoDetails = videoDetailsResponse.data.items[0];

        return {
          id: videoId,
          name: item.snippet.title,
          videoCount: item.contentDetails.itemCount,
          thumbnail: item.snippet.thumbnails.high.url,
          channelName: item.snippet.channelTitle,
          views: videoDetails.statistics.viewCount,
          yearPosted: videoDetails.snippet.publishedAt.split('-')[0],
        };
      }));
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      setError('Error fetching YouTube playlist: ' + error.message);
      console.error('Error fetching YouTube playlist: ', error);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPlaylists((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleImportClick = () => {
    const playlistId = playlistLink.split('list=')[1];
    if (playlistId) {
      fetchPlaylistData(playlistId);
    } else {
      setError('Invalid YouTube playlist link');
    }
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-zinc-50">
      <div className="flex">
        <SidebarNav />
        <div className="flex-1">
          <TopNav />
          <main className="flex">
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-semibold">Product Playlists</h2>
              <div className="mt-8 flex items-center gap-4">
                <Input
                  className="max-w-lg flex-1 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-400"
                  placeholder="Enter YouTube playlist link"
                  value={playlistLink}
                  onChange={(e) => setPlaylistLink(e.target.value)}
                />
                <Button 
                  className="gap-2 bg-red-500 text-white hover:bg-[#DC2626]/90 border-0"
                  onClick={handleImportClick}
                >
                  <Youtube className="h-4 w-4"/>
                  Import from YouTube
                </Button>
              </div>
              {error && <p className="mt-4 text-red-500">{error}</p>}
              <div className="mt-8">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={playlists}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-3 gap-6">
                      {playlists.map((playlist) => (
                        <PlaylistCard
                          key={playlist.id}
                          id={playlist.id}
                          name={playlist.name}
                          videoCount={playlist.videoCount}
                          thumbnail={playlist.thumbnail}
                          channelName={playlist.channelName}
                          views={playlist.views}
                          yearPosted={playlist.yearPosted}
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
