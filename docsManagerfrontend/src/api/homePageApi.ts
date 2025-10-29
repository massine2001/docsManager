import axiosClient from './axiosClient';

export const fetchPoolsCount = () => axiosClient.get('/api/pool/count').then(res => res.data);
export const fetchUsersCount = () => axiosClient.get('/api/users/count').then(res => res.data);
export const fetchFilesCount = () => axiosClient.get('/api/files/count').then(res => res.data);

export const fetchAccessById = (id: number) =>
  axiosClient.get(`/api/access/${id}`).then(res => res.data);

