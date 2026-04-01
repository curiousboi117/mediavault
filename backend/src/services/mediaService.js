import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '../utils/fileDb.js';

export async function listMedia({ search = '', from = '', to = '', page = 1, limit = 24 }) {
  const all = await readDb();
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  const filtered = all
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => {
      const created = new Date(item.createdAt);
      if (fromDate && created < fromDate) return false;
      if (toDate && created > toDate) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return { items, hasMore: start + limit < filtered.length };
}

export async function addMedia(files) {
  const all = await readDb();
  const createdItems = files.map((file) => ({
    id: uuidv4(),
    shareToken: null,
    name: file.originalname,
    type: file.mimetype.startsWith('video') ? 'video' : 'image',
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
    createdAt: new Date().toISOString(),
    tags: [],
    album: 'All Media'
  }));

  await writeDb([...createdItems, ...all]);
  return createdItems;
}

export async function createShare(id) {
  const all = await readDb();
  const index = all.findIndex((item) => item.id === id);
  if (index < 0) return null;

  all[index].shareToken = all[index].shareToken || uuidv4();
  await writeDb(all);
  return all[index];
}

export async function getByShareToken(token) {
  const all = await readDb();
  return all.find((item) => item.shareToken === token) || null;
}
