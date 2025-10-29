import axiosClient from './axiosClient';
import type { File } from '../types/models';

export const fetchAllFiles = () =>
  axiosClient.get<File[]>('/api/files').then(res => res.data);

export const uploadFile = (
  file: globalThis.File, 
  poolId: number,
  name?: string,
  description?: string,
  expirationDate?: string,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('poolId', poolId.toString());
  if (name) formData.append('name', name);
  if (description) formData.append('description', description);
  if (expirationDate) formData.append('expirationDate', expirationDate);
  
return axiosClient.post('/api/files/upload', formData, {
  onUploadProgress: (progressEvent) => {
    if (onProgress && progressEvent.total) {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percent);
    }
  }
});

};

export const updateFile = (
  fileId: number, 
  newFile?: globalThis.File,
  name?: string,
  description?: string,
  expirationDate?: string,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  if (newFile) formData.append('file', newFile);
  if (name) formData.append('name', name);
  if (description) formData.append('description', description);
  if (expirationDate) formData.append('expirationDate', expirationDate);

return axiosClient.put(`/api/files/${fileId}`, formData, {
  onUploadProgress: (progressEvent) => {
    if (onProgress && progressEvent.total) {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percent);
    }
  }
});

};

export const deleteFile = (fileId: number) => {
  return axiosClient.delete(`/api/files/${fileId}`);
};

export const downloadFile = async (fileId: number, fileName: string) => {
  try {
    const response = await axiosClient.get(`/api/files/download/${fileId}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const previewFile = async (fileId: number) => {
  try {
    const response = await axiosClient.get(`/api/files/preview/${fileId}`, {
      responseType: 'blob',
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    
    return { success: true, url, contentType };
  } catch (error) {
    return { success: false, error };
  }
};
