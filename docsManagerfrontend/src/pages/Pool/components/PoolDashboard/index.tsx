import { useState, useEffect } from "react";
import type { Pool } from "../../../../types/models";
import InfoTab from "../InfoTab";

import EmptyState from "./EmptyState";
import "./style.css";
import FilesTab from "../FilesTab";
import FileEditionTab from "../FileEditionTab";
import MembersTab from "../MembersTab";
import InvitationTab from "../invitation";

type TabType = "info" | "members" | "invitations" | "documents" | "edit";

const PoolDashboard = ({ 
  pool, 
  onPoolDeleted, 
  onPoolUpdated, 
  isPublicView = false 
}: { 
  pool: Pool | null; 
  onPoolDeleted?: () => void; 
  onPoolUpdated?: () => void;
  isPublicView?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(isPublicView ? "documents" : "documents");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPoolId, setCurrentPoolId] = useState<number | null>(pool?.id ?? null);

  useEffect(() => {

    
    if (pool?.id !== currentPoolId) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentPoolId(pool?.id ?? null);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pool?.id, currentPoolId]);

  if (!pool) {
    return <EmptyState />;
  }

  return (
    <div className="pool-dashboard">
      <header className="pool-dashboard__header">
        <h1 className="pool-dashboard__title">Espace {pool.name}</h1>
      </header>

      <nav className="pool-dashboard__tabs">
        <button
          className={`pool-dashboard__tab ${activeTab === "documents" ? "pool-dashboard__tab--active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>
        <button
          className={`pool-dashboard__tab ${activeTab === "edit" ? "pool-dashboard__tab--active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          Edition d'un document
        </button>
        <button
          className={`pool-dashboard__tab ${activeTab === "info" ? "pool-dashboard__tab--active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Informations
        </button>
        <button
          className={`pool-dashboard__tab ${activeTab === "members" ? "pool-dashboard__tab--active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          Membres
        </button>
        <button
          className={`pool-dashboard__tab ${activeTab === "invitations" ? "pool-dashboard__tab--active" : ""}`}
          onClick={() => setActiveTab("invitations")}
        >
          Invitations
        </button>
      </nav>

      <div className="pool-dashboard__content">
        {isTransitioning ? (
          <div className="pool-dashboard__transition">
            <div className="pool-dashboard__transition-spinner" />
            <p>Chargement de l'espace {pool.name}...</p>
          </div>
        ) : (
          <>
            {activeTab === "documents" && <FilesTab poolId={pool.id} isPublicView={isPublicView} />}
            {activeTab === "info" && <InfoTab poolId={pool.id} onPoolDeleted={onPoolDeleted} onPoolUpdated={onPoolUpdated} isPublicView={isPublicView} />}
            {activeTab === "edit" && <FileEditionTab poolId={pool.id} isPublicView={isPublicView} />}
            {activeTab === "members" && <MembersTab poolId={pool.id} isPublicView={isPublicView} />}
            {activeTab === "invitations" && <InvitationTab poolId={pool.id} poolName={pool.name} currentUserName={'massine'} isPublicView={isPublicView} />}
          </>
        )}
      </div>
    </div>
  );
};

export default PoolDashboard;