import { useMemo, useRef, useState } from 'react';

const MAX_FILES = 20;

export default function UploadPanel({ onUpload, uploading, progress }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  const validPreviews = useMemo(() => previews.slice(0, MAX_FILES), [previews]);

  const parseFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const mapped = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }));
    setPreviews(mapped);
  };

  return (
    <section className="panel upload-panel">
      <div
        className="drop-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          parseFiles(event.dataTransfer.files);
        }}
      >
        <p>Drag & drop photos/videos here</p>
        <button onClick={() => inputRef.current?.click()} type="button">Choose Files</button>
        <input
          ref={inputRef}
          hidden
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(event) => parseFiles(event.target.files)}
        />
      </div>

      {validPreviews.length > 0 && (
        <>
          <div className="preview-row">
            {validPreviews.map((preview) => (
              <div className="preview-card" key={preview.url}>
                {preview.type === 'image' ? (
                  <img src={preview.url} alt={preview.file.name} />
                ) : (
                  <video src={preview.url} muted />
                )}
                <span>{preview.file.name}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => onUpload(validPreviews.map((preview) => preview.file))}
          >
            {uploading ? `Uploading ${progress}%` : 'Upload to Cloud'}
          </button>
          {uploading && <progress max="100" value={progress}>{progress}%</progress>}
        </>
      )}
    </section>
  );
}
