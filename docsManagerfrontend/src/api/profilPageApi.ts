import axiosClient from './axiosClient';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = (data: ChangePasswordRequest) =>
  axiosClient.put('/users/change-password', data).then(res => res.data);
