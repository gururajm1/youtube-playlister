import { PlaySquare } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';

export function PlaylistCard({
  id,
  name,
  videoCount,
  thumbnail,
}) {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handle click on the card to navigate to the playlist details page
  const handleClick = () => {
    navigate(`/dashboard/${name}/${videoCount}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
      onClick={handleClick} // Add the onClick handler here
    >
      <div className="overflow-hidden rounded-lg border border-neutral-200 border-zinc-800 bg-zinc-950 dark:border-neutral-800">
        <div className="aspect-video bg-zinc-900 flex items-center justify-center">
          <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#3B82F6]" />
            <h3 className="font-medium text-zinc-50">{name}</h3>
          </div>
          <div className="mt-2 text-sm text-zinc-400">
            <p className="flex items-center gap-2">
              <PlaySquare className="h-4 w-4" />
              {videoCount} Videos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
