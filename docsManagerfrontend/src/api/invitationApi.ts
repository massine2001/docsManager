import axiosClient from "./axiosClient";

export type InvitationData = {
  email: string;
  poolId: number;
  message: string;
  invitationLink: string;
};

export type InvitationResponse = {
  success: boolean;
  message: string;
};

export const sendInvitation = async (data: InvitationData): Promise<InvitationResponse> => {
  try {
    const response = await axiosClient.post("/api/invitations/send", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendBulkInvitations = async (invitations: InvitationData[]): Promise<InvitationResponse> => {
  try {
    const response = await axiosClient.post("/api/invitations/send-bulk", { invitations });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateInvitationToken = async (token: string): Promise<{
  valid: boolean;
  poolId?: number;
  poolName?: string;
  email?: string;
}> => {
  try {
    const response = await axiosClient.get(`/public/invitations/validate/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptInvitation = (token: string) =>
  axiosClient.post<{ success: boolean; message: string }>(
    "/api/pool/invitations/accept",
    { token }
).then(res => res.data);


