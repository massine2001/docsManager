import { useState, useEffect } from "react";
import { fetchPoolsByUserId, fetchPoolStats } from "../../api/poolPageApi";
import { fetchPublicPools } from "../../api/publicPoolsApi";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import { Toast } from "../../components/Toast";
import Description from "./components/Description";
import QuickData from "./components/QuickData";
import PoolList from "./components/PoolList";
import PoolsEmptyState from "./components/PoolsEmptyState";
import CreatePoolModal from "./components/CreatePoolModal";
import type { Pool, PoolStats } from "../../types/models";
import './style.css';

interface PoolWithStats extends Pool {
  memberCount?: number;
  fileCount?: number;
  userRole?: string;
}

const Home = () => {
  const { toast, hideToast } = useToast();
  const { user } = useAuth();
  const [pools, setPools] = useState<PoolWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadPools = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        const publicPools = await fetchPublicPools();
        if (!Array.isArray(publicPools)) {
          setPools([]);
          return;
        }
        const poolsWithStats = publicPools.map(pool => ({
          ...pool,
          memberCount: 0,
          fileCount: pool.fileCount || 0,
          userRole: undefined, 
        }));
        setPools(poolsWithStats);
        return;
      }

      const userPools = await fetchPoolsByUserId(user.id);
      if (!Array.isArray(userPools)) {
        setPools([]);
        return;
      }

      const poolsWithStats = await Promise.all(
        userPools.map(async (pool) => {
          try {
            const stats: PoolStats = await fetchPoolStats(pool.id);
            return {
              ...pool,
              memberCount: stats.membersCount,
              fileCount: stats.filesCount,
              userRole: stats.accesses.find(
                (access) => access.user.id === user.id
              )?.role || "member",
            };
          } catch (error) {
            return {
              ...pool,
              memberCount: 0,
              fileCount: 0,
              userRole: "member",
            };
          }
        })
      );

      setPools(poolsWithStats);
    } catch (error) {
      setPools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPools(); 
  }, [user?.id]);

  const handleCreateSuccess = () => {
    loadPools();
  };

  return (
    <div className="home">
      <div className="home-first-row">
        <Description />
        {user && <QuickData />}
      </div>

      <div className="home-pools-section">
        {!user && pools.length > 0 && (
          <div className="home-demo-banner">
            <div className="home-demo-content">
              <div className="home-demo-text">
                <h3>🎯 Vous consultez les pools en mode démo</h3>
                <p>Créez un compte gratuit pour créer vos propres pools et partager vos documents en toute sécurité !</p>
              </div>
              <button
                className="home-demo-cta"
                onClick={() => window.location.href = '/login'}
              >
                Se connecter / S'inscrire
              </button>
            </div>
          </div>
        )}

        <div className="home-pools-header">
          <div>
            <h2 className="home-pools-title">
              {user ? "Mes Pools" : "Pools Publics"}
            </h2>
            <p className="home-pools-subtitle">
              {user 
                ? "Gérez vos espaces de collaboration" 
                : "Découvrez les fonctionnalités en mode démo"}
            </p>
          </div>
          {user && pools.length > 0 && !loading && (
            <button
              className="home-create-pool-button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              ✨ Créer une pool
            </button>
          )}
        </div>

        {loading ? (
          <PoolList pools={[]} loading={true} />
        ) : pools.length === 0 ? (
          user ? (
            <PoolsEmptyState onCreatePool={() => setIsCreateModalOpen(true)} />
          ) : (
            <div className="home-no-public-pools">
              <p>Aucun pool public disponible pour le moment.</p>
              <button onClick={() => window.location.href = '/login'}>
                Se connecter pour créer vos pools
              </button>
            </div>
          )
        ) : (
          <PoolList pools={pools} isPublicView={!user} />
        )}
      </div>

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
  );
}

export default Home;
