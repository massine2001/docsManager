import { useEffect } from "react";
import axiosClient from "../api/axiosClient";

export function useConsumeInviteAfterLogin() {
  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("INVITE_TOKEN");
      if (!token) return;

      try {
        await axiosClient.get("/api/me");

        await axiosClient.post("/api/pool/invitations/accept", { token });

        localStorage.removeItem("INVITE_TOKEN");
      } catch (e) {
       
      }
    };
    run();
  }, []);
}
