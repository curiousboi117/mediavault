import { useState } from 'react';
import { fileUrl } from '../services/api';

export default function MediaViewer({ media, onClose }) {
  const [zoom, setZoom] = useState(1);

  if (!media) return null;

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose}>Close</button>
        {media.type === 'image' ? (
          <>
            <img
              src={fileUrl(media.url)}
              alt={media.name}
              style={{ transform: `scale(${zoom})` }}
            />
            <input
              type="range"
              min="1"
              max="4"
              step="0.1"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </>
        ) : (
          <video src={fileUrl(media.url)} controls autoPlay />
        )}
      </div>
    </div>
  );
}
