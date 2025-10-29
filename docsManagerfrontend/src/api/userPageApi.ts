import axiosClient from './axiosClient';
import type { User, Pool } from '../types/models';

export const fetchAllUsers = () => 
  axiosClient.get<User[]>('/api/users/').then(res => res.data);

export const fetchUserById = (id: number) =>
  axiosClient.get<User>(`/api/users/${id}`).then(res => res.data);

export const createUser = (user: Omit<User, 'id'>) =>
  axiosClient.post<User>('/api/users/', user).then(res => res.data);

export const updateUser = (id: number, user: Partial<User>) =>
  axiosClient.put<User>(`/api/users/${id}`, user).then(res => res.data);

export const deleteUser = (id: number) =>
  axiosClient.delete(`/api/users/${id}`);

export const fetchPoolsFromUser = (userId: number) =>
  axiosClient.get<Pool[]>(`/api/users/pools/${userId}`).then(res => res.data);
