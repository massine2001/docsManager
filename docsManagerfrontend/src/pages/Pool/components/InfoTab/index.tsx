import { useCallback, useState } from "react";
import { useFetch } from "../../../../hooks/useFetch";
import { fetchPoolStats } from "../../../../api/poolPageApi";
import { useToast } from "../../../../hooks/useToast";
import { Toast } from "../../../../components/Toast";
import { useAuth } from "../../../../hooks/useAuth";
import type { PoolStats } from "../../../../types/models";
import EditPoolModal from "./components/EditPoolModal";
import DeletePoolModal from "./components/DeletePoolModal";
import "./style.css";

const InfoTab = ({ poolId, onPoolDeleted, onPoolUpdated, isPublicView = false }: { poolId: number; onPoolDeleted?: () => void; onPoolUpdated?: () => void; isPublicView?: boolean }) => {
  const fetcher = useCallback(() => fetchPoolStats(poolId), [poolId]);
  const { data: stats, loading, error, refetch } = useFetch<PoolStats>(fetcher);
  const { toast, hideToast } = useToast();
  const { user } = useAuth();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const userAccess = stats?.accesses.find(access => access.user.id === user?.id);
  const canEdit = !isPublicView && (userAccess?.role === "admin" || userAccess?.role === "owner");
  const canDelete = !isPublicView && (userAccess?.role === "admin" || userAccess?.role === "owner");

  const handleEditSuccess = () => {
    refetch();
    if (onPoolUpdated) {
      onPoolUpdated();
    }
  };

  const handleDeleteSuccess = () => {
    if (onPoolDeleted) {
      onPoolDeleted();
    }
  };

  if (loading) {
    return (
      <div className="info-tab__loading">
        <span className="info-tab__spinner" />
        Chargement...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="info-tab__error">
        Erreur de chargement
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    member: 'Membre',
    viewer: 'Visiteur',
  };

  const userRoleLabels: Record<string, string> = {
    admin: 'Administrateur',
    user: 'Utilisateur',
  };

  return (
    <div className="info-tab">
      {isPublicView && (
        <div className="info-tab__public-banner">
          <span className="info-tab__public-icon">🎯</span>
          <div>
            <strong>Mode démonstration</strong>
            <p>Vous consultez les statistiques d'un pool public. Les boutons d'action sont désactivés.</p>
          </div>
        </div>
      )}

      {(canEdit || canDelete) && (
        <div className="info-tab__actions">
          {canEdit && (
            <button
              className="info-tab__action-button info-tab__action-button--edit"
              onClick={() => setIsEditModalOpen(true)}
            >
              Modifier
            </button>
          )}
          {canDelete && (
            <button
              className="info-tab__action-button info-tab__action-button--delete"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Supprimer
            </button>
          )}
        </div>
      )}

      <div className="info-tab__quick-stats">
        <div className="info-tab__stat">
          <span className="info-tab__stat-value">{stats.membersCount}</span>
          <span className="info-tab__stat-label">Membres</span>
        </div>
        <div className="info-tab__stat">
          <span className="info-tab__stat-value">{stats.filesCount}</span>
          <span className="info-tab__stat-label">Fichiers</span>
        </div>
        <div className="info-tab__stat">
          <span className="info-tab__stat-value">{stats.activityRate}%</span>
          <span className="info-tab__stat-label">Activité</span>
        </div>
        <div className="info-tab__stat">
          <span className="info-tab__stat-value">{stats.avgFilesPerMember.toFixed(1)}</span>
          <span className="info-tab__stat-label">Moy/membre</span>
        </div>
        <div className="info-tab__stat">
          <span className="info-tab__stat-value">{stats.poolAgeInDays}</span>
          <span className="info-tab__stat-label">Jours</span>
        </div>
        {stats.inactiveMembersCount > 0 && (
          <div className="info-tab__stat">
            <span className="info-tab__stat-value">{stats.inactiveMembersCount}</span>
            <span className="info-tab__stat-label">Inactifs</span>
          </div>
        )}
      </div>

      <div className="info-tab__grid">
        <section className="info-tab__section">
          <h3 className="info-tab__section-title">Rôles dans la pool</h3>
          <div className="info-tab__compact-list">
            {Object.entries(stats.roleDistribution).map(([role, count]) => (
              <div key={role} className="info-tab__compact-item">
                <span>{roleLabels[role] || role}</span>
                <strong>{count} membre{count > 1 ? 's' : ''}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="info-tab__section">
          <h3 className="info-tab__section-title">Rôles système</h3>
          <div className="info-tab__compact-list">
            {Object.entries(stats.userRoleDistribution).map(([role, count]) => (
              <div key={role} className="info-tab__compact-item">
                <span>{userRoleLabels[role] || role}</span>
                <strong>{count} utilisateur{count > 1 ? 's' : ''}</strong>
              </div>
            ))}
          </div>
        </section>

        {stats.topUploaders.length > 0 && (
          <section className="info-tab__section">
            <h3 className="info-tab__section-title">Meilleurs contributeurs</h3>
            <div className="info-tab__compact-list">
              {stats.topUploaders.slice(0, 3).map((entry) => (
                <div key={entry.user?.id} className="info-tab__compact-item">
                  <span>{entry.user?.firstName} {entry.user?.lastName}</span>
                  <strong>{entry.count} fichier{entry.count > 1 ? 's' : ''}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {Object.keys(stats.fileExtensions).length > 0 && (
          <section className="info-tab__section">
            <h3 className="info-tab__section-title">Types de fichiers</h3>
            <div className="info-tab__compact-list">
              {Object.entries(stats.fileExtensions)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 4)
                .map(([ext, count]) => (
                  <div key={ext} className="info-tab__compact-item">
                    <span>{ext}</span>
                    <strong>{count} fichier{count > 1 ? 's' : ''}</strong>
                  </div>
                ))}
            </div>
          </section>
        )}

        {Object.keys(stats.filesPerDay).length > 0 && (
          <section className="info-tab__section">
            <h3 className="info-tab__section-title">Activité récente</h3>
            <div className="info-tab__compact-list">
              {Object.entries(stats.filesPerDay)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                .slice(0, 4)
                .map(([date, count]) => (
                  <div key={date} className="info-tab__compact-item">
                    <span>{new Date(date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long' 
                    })}</span>
                    <strong>{count} fichier{count > 1 ? 's' : ''}</strong>
                  </div>
                ))}
            </div>
          </section>
        )}

        {stats.inactiveMembers.length > 0 && (
          <section className="info-tab__section">
            <h3 className="info-tab__section-title">Membres inactifs</h3>
            <div className="info-tab__compact-list">
              {stats.inactiveMembers.slice(0, 3).map((user) => (
                <div key={user?.id} className="info-tab__compact-item info-tab__compact-item--inactive">
                  <span>{user.firstName} {user.lastName}</span>
                  <strong>Aucune contribution</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="info-tab__timeline-section">
        <h3 className="info-tab__section-title">Chronologie</h3>
        <div className="info-tab__timeline-grid">
          <div className="info-tab__timeline-item">
            <span className="info-tab__timeline-label">Date de création</span>
            <strong>{new Date(stats.poolCreatedAt).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</strong>
          </div>
          {stats.creator && (
            <div className="info-tab__timeline-item">
              <span className="info-tab__timeline-label">Créateur</span>
              <strong>{stats.creator.firstName} {stats.creator.lastName}</strong>
            </div>
          )}
          {stats.newestMember && (
            <div className="info-tab__timeline-item">
              <span className="info-tab__timeline-label">Dernier membre</span>
              <strong>{stats.newestMember.firstName} {stats.newestMember.lastName}</strong>
            </div>
          )}
          {stats.lastFile && (
            <div className="info-tab__timeline-item">
              <span className="info-tab__timeline-label">Dernier fichier</span>
              <strong>{stats.lastFile.name.length > 20 ? stats.lastFile.name.slice(0, 20) + '...' : stats.lastFile.name}</strong>
            </div>
          )}
        </div>
      </section>

      {stats && (
        <>
          <EditPoolModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            pool={stats.pool}
            onSuccess={handleEditSuccess}
          />

          <DeletePoolModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            pool={stats.pool}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default InfoTab;