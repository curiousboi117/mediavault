import { useCallback, useEffect, useState } from 'react';
import { createShareLink, fetchMedia, uploadMediaWithProgress } from '../services/api';

export function useMediaLibrary(filters) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = useCallback(async (nextPage = 1, append = false) => {
    setLoading(true);
    try {
      const data = await fetchMedia({ page: nextPage, ...filters });
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load(1, false);
  }, [load]);

  const loadNext = useCallback(() => {
    if (loading || !hasMore) return;
    load(page + 1, true);
  }, [hasMore, load, loading, page]);

  const refresh = useCallback(() => load(1, false), [load]);

  const uploadFiles = useCallback(async (files) => {
    if (!files.length) return;
    setUploading(true);
    setProgress(0);

    try {
      await uploadMediaWithProgress(files, setProgress);
      await refresh();
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [refresh]);

  return {
    items,
    hasMore,
    loading,
    uploading,
    progress,
    loadNext,
    refresh,
    uploadFiles,
    createShareLink
  };
}
