import axiosClient from './axiosClient';
import type { Pool, User, PoolStats, File, Access } from '../types/models';

export const fetchAllPools = () =>
  axiosClient.get<Pool[]>('/api/pool/').then(res => res.data);

export const fetchPoolById = (id: number) =>
  axiosClient.get<Pool>(`/api/pool/${id}`).then(res => res.data);

export const createPool = (pool: Omit<Pool, 'id' | 'createdAt'> & { createdBy: number }) =>
  axiosClient.post<Pool>('/api/pool/', pool).then(res => res.data);

export const updatePool = (id: number, pool: Partial<Pool>) =>
  axiosClient.put<Pool>(`/api/pool/${id}`, pool).then(res => res.data);

export const deletePool = (id: number) =>
  axiosClient.delete(`/api/pool/${id}`).then(res => res.status === 204 ? null : res.data);

export const fetchUsersFromPool = (poolId: number) =>
  axiosClient.get<User[]>(`/api/pool/users/${poolId}`).then(res => res.data);

export const fetchPoolsByUserId = (userId: number) =>
  axiosClient.get<Pool[]>(`/api/pool/user/${userId}`)
    .then(res => {
      if (!Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    })
    .catch(error => {
      if (error.response?.status === 403 || error.response?.status === 404) {
      }
      return [];
    });

export const fetchPoolStats = (poolId: number) =>
  axiosClient.get<PoolStats>(`/api/pool/stats/${poolId}`).then(res => res.data);

export const fetchDemoPoolStats = () =>
  axiosClient.get<PoolStats>(`/public/demopoolstats`).then(res => res.data);

export const fetchFilesByPoolId = (poolId: number) =>
  axiosClient.get<File[]>(`/api/pool/files/${poolId}`).then(res => res.data);

export const addMemberToPool = (poolId: number, userId: number, role: string) => {
  const pool = { id: poolId };
  const user = { id: userId };
  return axiosClient.post<Access>('/api/access/', { pool, user, role });
};

export const removeMemberFromPool = (accessId: number) => {
  return axiosClient.delete(`/api/access/${accessId}`);
};

export const updateMemberRole = (accessId: number, newRole: string) => {
  return axiosClient.put(`/api/access/${accessId}`, { role: newRole });
};

export const generateInvitationToken = (poolId: number, email: string) =>
  axiosClient.post<{ success: boolean; token: string; expiresAt: string }>(
    '/api/pool/invitations/generate-token',
    { poolId, email }
  ).then(res => res.data);

export const validateInvitationToken = (token: string) =>
  axiosClient.get<{
    valid: boolean;
    email?: string;
    poolId?: number;
    poolName?: string;
    expiresAt?: string;
    message?: string;
  }>(`/public/invitations/validate/${token}`).then(res => res.data);

export const acceptInvitation = (token: string) =>
  axiosClient
    .post<{
      success: boolean;
      message: string;
      poolId?: number;
      poolName?: string;
    }>('/public/invitations/accept', { token })
    .then(res => res.data);
