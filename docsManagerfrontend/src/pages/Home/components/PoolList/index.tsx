import { useState } from "react";
import type { Pool } from "../../../../types/models";
import PoolCard from "../PoolCard";
import "./style.css";

interface PoolWithStats extends Pool {
  memberCount?: number;
  fileCount?: number;
  userRole?: string;
}

interface PoolListProps {
  pools: PoolWithStats[];
  loading?: boolean;
  isPublicView?: boolean; 
}

const PoolList = ({ pools, loading = false, isPublicView = false }: PoolListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPools = pools.filter((pool) =>
    pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pool.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pool-list">
        <div className="pool-list__loading">
          <span className="pool-list__spinner" />
          <p>Chargement de vos pools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pool-list">
      <div className="pool-list__header">
        <div className="pool-list__search">
          <span className="pool-list__search-icon">🔍</span>
          <input
            type="text"
            className="pool-list__search-input"
            placeholder="Rechercher une pool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="pool-list__search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
        <div className="pool-list__count">
          {filteredPools.length} pool{filteredPools.length > 1 ? "s" : ""}
        </div>
      </div>

      {filteredPools.length === 0 ? (
        <div className="pool-list__no-results">
          <span className="pool-list__no-results-icon">🔍</span>
          <p>Aucune pool ne correspond à votre recherche</p>
          <button
            className="pool-list__clear-button"
            onClick={() => setSearchQuery("")}
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="pool-list__grid">
          {filteredPools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              memberCount={pool.memberCount}
              fileCount={pool.fileCount}
              role={pool.userRole}
              isPublicView={isPublicView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PoolList;
