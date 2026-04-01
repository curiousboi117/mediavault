import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fileUrl } from '../services/api';

export default function GalleryGrid({ items, loading, hasMore, onLoadMore, onOpen, onShare }) {
  const observerRef = useRef(null);

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <section className="gallery">
      {items.map((item) => (
        <motion.article
          key={item.id}
          className="media-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button type="button" className="unstyled" onClick={() => onOpen(item)}>
            {item.type === 'image' ? (
              <img loading="lazy" src={fileUrl(item.url)} alt={item.name} />
            ) : (
              <video loading="lazy" src={fileUrl(item.url)} muted />
            )}
          </button>
          <div className="card-meta">
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            <button
              type="button"
              onClick={async () => {
                const response = await onShare(item.id);
                await navigator.clipboard.writeText(response.url);
                alert('Share link copied!');
              }}
            >
              Share
            </button>
          </div>
        </motion.article>
      ))}
      <div ref={observerRef} className="load-sentinel">{loading ? 'Loading…' : hasMore ? 'Scroll for more' : 'End of gallery'}</div>
    </section>
  );
}
