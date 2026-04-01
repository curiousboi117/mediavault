import { useMemo, useState } from 'react';
import UploadPanel from './components/UploadPanel';
import Toolbar from './components/Toolbar';
import GalleryGrid from './components/GalleryGrid';
import MediaViewer from './components/MediaViewer';
import { useMediaLibrary } from './hooks/useMediaLibrary';

const defaultFilters = { search: '', from: '', to: '' };

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const {
    items,
    hasMore,
    loading,
    uploading,
    progress,
    loadNext,
    refresh,
    uploadFiles,
    createShareLink
  } = useMediaLibrary(filters);

  const filteredCount = useMemo(() => items.length, [items.length]);

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>MediaVault</h1>
        <p>A modern cloud-style gallery for photos and videos.</p>
      </header>

      <Toolbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        filters={filters}
        onChangeFilters={setFilters}
        total={filteredCount}
      />

      <UploadPanel onUpload={uploadFiles} uploading={uploading} progress={progress} />

      <GalleryGrid
        items={items}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadNext}
        onOpen={setSelectedMedia}
        onShare={createShareLink}
      />

      <MediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} onRefresh={refresh} />
    </div>
  );
}
