# MediaVault (Google Photos-style Media Platform)

MediaVault is a modern, responsive cloud-style web app to upload, manage, search, view, and share photos/videos.

## Stack
- **Frontend:** React + Vite + Framer Motion
- **Backend:** Node.js + Express + Multer
- **Storage:** Local storage simulation (ready to be swapped to GitHub API or external object storage)
- **Deploy Targets:** GitHub + Vercel/Netlify (frontend) + Render/Railway/Vercel functions (backend)

## Project Structure

```text
mediavault/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   ├── index.html
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── data/media.json
│   └── uploads/
├── package.json
└── README.md
```

## Features Implemented

1. **Upload System**
   - Drag-and-drop upload.
   - Upload preview for images and videos.
   - Live upload progress bar.

2. **Gallery View**
   - Masonry-like responsive grid.
   - Smooth entry animation (Framer Motion).
   - Infinite scroll (IntersectionObserver).

3. **Media Viewer**
   - Fullscreen modal viewer.
   - Zoom slider for images.
   - Native video playback.

4. **Organization**
   - Automatic date sorting (newest first).
   - Search by file name.
   - Date-range filtering.

5. **Sharing**
   - One-click share link generation.
   - Public token endpoint for viewing shared media metadata.

6. **Performance**
   - Lazy image loading.
   - Paginated fetching.
   - Small static payloads.

7. **UI/UX**
   - Minimal Google-Photos-inspired layout.
   - Dark/Light theme switch.
   - Mobile responsive.

8. **Basic Security**
   - File type allow-list validation.
   - Max file size + file count limits.
   - Basic upload rate limiting.

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Run frontend + backend

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API Endpoints

- `POST /api/upload` → upload files (`multipart/form-data`, key = `files`)
- `GET /api/media?page=1&limit=24&search=&from=&to=` → paginated media list
- `POST /api/share/:id` → generate share link
- `GET /api/share/:token` → fetch public shared media metadata
- `GET /uploads/:filename` → static file delivery

## Deployment Guide

### Option A (Recommended): Frontend on Netlify/Vercel + Backend on Render/Railway

1. Push this repo to GitHub.
2. Deploy `backend/` as a Node service on Render/Railway.
3. Deploy `frontend/` on Netlify/Vercel.
4. Add frontend env var:
   - `VITE_API_URL=https://your-backend-domain/api`
5. Rebuild frontend.

### Option B: GitHub Pages (Frontend only demo)

GitHub Pages is static-only. For full upload functionality, connect a hosted backend (Option A step 2).

## GitHub-based Storage (Optional Next Step)

To store files in GitHub instead of local disk, replace `backend/src/services/mediaService.js` + upload middleware with a GitHub API adapter that:
1. Uploads file blobs to a target repo path via GitHub Contents API.
2. Stores metadata in a JSON index file committed back to the repo.
3. Serves CDN-friendly URLs from raw.githubusercontent.com (or GitHub release assets).

> For production-scale media, prefer S3/R2/Cloudinary for bandwidth/performance.
