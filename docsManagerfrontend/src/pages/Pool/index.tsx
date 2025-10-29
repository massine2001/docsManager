import { useCallback, useMemo, useState, useEffect } from "react";
import { DataList } from "../../components/DataList";
import { fetchPoolsByUserId } from "../../api/poolPageApi";
import { fetchPublicPools } from "../../api/publicPoolsApi";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { Toast } from "../../components/Toast";
import type { Pool } from "../../types/models";
import PoolDashboard from "./components/PoolDashboard";
import CreatePoolModal from "../Home/components/CreatePoolModal";
import './style.css'
import { useMediaQuery } from "../../hooks/useMediaQuery";

const PoolPage = () => {
  const { user, loading: authLoading } = useAuth();
  const fetcher = useCallback(() => {
    if (!user?.id) return fetchPublicPools();
    return fetchPoolsByUserId(user.id);
  }, [user?.id]);
  const { data: pools = [], loading, error, refetch } = useFetch<Pool[]>(fetcher);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast, hideToast } = useToast();

  useEffect(() => {
    if (user !== undefined) { 
      refetch();
    }
  }, [user?.id, refetch]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const poolsArray = Array.isArray(pools) ? pools : [];
  
  const selectedPool: Pool | null = useMemo(
    () => {
      if (!selectedId || poolsArray.length === 0) return null;
      const found = poolsArray.find(p => p.id === selectedId) ?? null;
      return found;
    },
    [poolsArray, selectedId]
  );

  useEffect(() => {
    if (selectedId && poolsArray.length > 0 && !selectedPool) {
      setSelectedId(null);
    }
  }, [selectedId, poolsArray, selectedPool]);

  const handlePoolDeleted = () => {
    setSelectedId(null);
    refetch();
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  // Éviter le rendu pendant le loading initial pour éviter les pages blanches
  if (authLoading || (loading && poolsArray.length === 0)) {
    return (
      <div className={isDesktop ? 'dcontainer pool-loading' : 'mcontainer pool-loading'}>
        <div className="pool-loading-content">
          <div className="pool-loading-spinner" />
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className={isDesktop ? 'dcontainer' : 'mcontainer'}>
      <DataList
        items={poolsArray}
        loading={loading}
        error={error}
        selectedId={selectedId}
        onSelect={setSelectedId}
        config={{
          title: user ? "Liste des Pools" : "Pools Publics",
          searchPlaceholder: "Cliquez pour afficher les pools",
          actionButtonText: user ? "Créer une Pool" : undefined,
          onActionClick: user ? () => setIsCreateModalOpen(true) : undefined,
          getSearchText: (pool) => pool.name,
          getDisplayText: (pool) => pool.name,
        }}
      />
      <PoolDashboard 
        pool={selectedPool} 
        onPoolDeleted={handlePoolDeleted} 
        onPoolUpdated={refetch} 
        isPublicView={!user}
      />

      <CreatePoolModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}

export default PoolPage;
