const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const FILE_BASE_URL = API_URL.replace('/api', '');

export function fileUrl(path) {
  if (!path) return '';
  return `${FILE_BASE_URL}${path}`;
}

export async function fetchMedia({ page = 1, limit = 24, search = '', from = '', to = '' }) {
  const params = new URLSearchParams({ page, limit, search, from, to });
  const response = await fetch(`${API_URL}/media?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch media');
  return response.json();
}

export async function uploadMedia(files) {
  const data = new FormData();
  files.forEach((file) => data.append('files', file));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/upload`);

    xhr.upload.onprogress = (event) => {
      const percent = event.lengthComputable ? Math.round((event.loaded / event.total) * 100) : 0;
      resolve({ progressOnly: true, percent, xhr });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText || 'Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(data);
  });
}

export async function uploadMediaWithProgress(files, onProgress) {
  const data = new FormData();
  files.forEach((file) => data.append('files', file));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/upload`);

    xhr.upload.onprogress = (event) => {
      const percent = event.lengthComputable ? Math.round((event.loaded / event.total) * 100) : 0;
      onProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText || 'Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(data);
  });
}

export async function createShareLink(id) {
  const response = await fetch(`${API_URL}/share/${id}`, { method: 'POST' });
  if (!response.ok) throw new Error('Could not generate link');
  return response.json();
}
