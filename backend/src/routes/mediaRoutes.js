import { Router } from 'express';
import { addMedia, createShare, getByShareToken, listMedia } from '../services/mediaService.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/media', async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 24);
  const search = String(req.query.search || '');
  const from = String(req.query.from || '');
  const to = String(req.query.to || '');

  const data = await listMedia({ page, limit, search, from, to });
  res.json(data);
});

router.post('/upload', upload.array('files', 20), async (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: 'No files uploaded' });

  const created = await addMedia(files);
  return res.status(201).json({ items: created });
});

router.post('/share/:id', async (req, res) => {
  const media = await createShare(req.params.id);
  if (!media) return res.status(404).json({ message: 'Media not found' });

  const origin = `${req.protocol}://${req.get('host')}`;
  return res.json({ token: media.shareToken, url: `${origin}/api/share/${media.shareToken}` });
});

router.get('/share/:token', async (req, res) => {
  const media = await getByShareToken(req.params.token);
  if (!media) return res.status(404).json({ message: 'Invalid share token' });

  return res.json(media);
});

export default router;
