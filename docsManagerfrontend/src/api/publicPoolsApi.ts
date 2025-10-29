import axiosClient from './axiosClient';
import type { Pool, File, PoolStats } from '../types/models';


export const fetchPublicPools = async (): Promise<Pool[]> => {
  try {
    const response = await axiosClient.get<Pool[]>('/public/pools', {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    
    return [];
  }
};

export const fetchPublicPoolById = async (poolId: number): Promise<Pool | null> => {
  try {
    const response = await axiosClient.get<Pool>(`/public/pools/${poolId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchDemoPoolStats = async () =>
  {
    try {const response = await axiosClient.get<PoolStats>(`/public/demopoolstats`, {
      withCredentials: true
    });
    return response.data;}
    catch (error) {
      return null;
    }
  }



export const fetchPublicPoolFiles = async (poolId: number): Promise<File[]> => {
  try {
    const response = await axiosClient.get<File[]>(`/public/files/pool/${poolId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const downloadPublicFile = async (fileId: number, fileName: string) => {
  try {
    const response = await axiosClient.get(`/public/files/download/${fileId}`, {
      responseType: 'blob',
      withCredentials: true
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

export const previewPublicFile = async (fileId: number) => {
  try {
    const response = await axiosClient.get(`/public/files/preview/${fileId}`, {
      responseType: 'blob',
      withCredentials: true
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    
    return { success: true, url, contentType };
  } catch (error) {
    return { success: false, error };
  }
};
