import { useState, useCallback, useEffect } from "react";
import { useFetch } from "../../../../hooks/useFetch";
import { useMutation } from "../../../../hooks/useMutation";
import { useToast } from "../../../../hooks/useToast";
import { fetchPoolStats } from "../../../../api/poolPageApi";
import { addMemberToPool, removeMemberFromPool, updateMemberRole } from "../../../../api/poolPageApi";
import type { User } from "../../../../types/models";
import { Toast } from "../../../../components/Toast";
import { HeaderBar } from "./components/HeaderBar";
import { MemberRow } from "./components/MemberRow";
import { MemberDetailsModal } from "./components/MemberDetailsModal";
import { ChangeRoleModal } from "./components/ChangeRoleModal";
import { RemoveMemberModal } from "./components/RemoveMemberModal";
import { useFilteredMembers } from "./hooks/useFilteredMembers";
import "./style.css";

type Props = {
  poolId: number;
  isPublicView?: boolean;
};

const MembersTab = ({ poolId, isPublicView = false }: Props) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [refreshKey, setRefreshKey] = useState(0);
  
  const fetcherStats = useCallback(() => fetchPoolStats(poolId), [poolId, refreshKey]);
  const { data: poolStats, loading: loadingStats, error: errorStats } = useFetch(fetcherStats);


  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");

  const [selectedMember, setSelectedMember] = useState<{ user: User; role: string; accessId: number } | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const addMutation = useMutation((data: { userId: number; role: string }) =>
    addMemberToPool(poolId, data.userId, data.role)
  );

  const changeRoleMutation = useMutation((data: { accessId: number; role: string }) =>
    updateMemberRole(data.accessId, data.role)
  );

  const removeMutation = useMutation((accessId: number) =>
    removeMemberFromPool(accessId)
  );

  const filteredAccesses = useFilteredMembers(poolStats?.accesses, searchTerm, roleFilter);

  const handleViewDetails = (access: typeof filteredAccesses[0]) => {
    setSelectedMember({ user: access.user, role: access.role, accessId: access.id });
    setShowDetailsModal(true);
  };

  const handleChangeRole = (access: typeof filteredAccesses[0]) => {
    setSelectedMember({ user: access.user, role: access.role, accessId: access.id });
    setShowChangeRoleModal(true);
  };

  const handleRemove = (access: typeof filteredAccesses[0]) => {
    setSelectedMember({ user: access.user, role: access.role, accessId: access.id });
    setShowRemoveModal(true);
  };

  const handleChangeRoleConfirm = async (newRole: string) => {
    if (!selectedMember) return;
    await changeRoleMutation.execute({ accessId: selectedMember.accessId, role: newRole });
  };

  const handleRemoveConfirm = async () => {
    if (!selectedMember) return;
    await removeMutation.execute(selectedMember.accessId);
  };

  useEffect(() => {
    if (addMutation.success) {
      setRefreshKey((prev) => prev + 1);
      showSuccess("Membre ajouté avec succès");
    }
  }, [addMutation.success]);

  useEffect(() => {
    if (changeRoleMutation.success) {
      setShowChangeRoleModal(false);
      setSelectedMember(null);
      setRefreshKey((prev) => prev + 1);
      showSuccess("Rôle modifié avec succès");
    }
  }, [changeRoleMutation.success]);

  useEffect(() => {
    if (removeMutation.success) {
      setShowRemoveModal(false);
      setSelectedMember(null);
      setRefreshKey((prev) => prev + 1);
      showSuccess("Membre retiré avec succès");
    }
  }, [removeMutation.success]);

  useEffect(() => {
    if (addMutation.error) {
      showError("Erreur lors de l'ajout du membre");
    }
  }, [addMutation.error]);

  useEffect(() => {
    if (changeRoleMutation.error) {
      showError("Erreur lors de la modification du rôle");
    }
  }, [changeRoleMutation.error]);

  useEffect(() => {
    if (removeMutation.error) {
      showError("Erreur lors du retrait du membre");
    }
  }, [removeMutation.error]);

  if (loadingStats) {
    return (
      <div className="members-tab__loading">
        <span className="members-tab__spinner" />
        Chargement des membres...
      </div>
    );
  }

  if (errorStats) {
    return <div className="members-tab__error">Erreur lors du chargement des membres</div>;
  }

  return (
    <div className="members-tab">
      {isPublicView && (
        <div className="members-tab__public-banner">
          <span className="members-tab__public-icon">🎯</span>
          <div>
            <strong>Mode démonstration</strong>
            <p>Vous consultez les membres d'un pool public. Les actions de modification sont désactivées.</p>
          </div>
        </div>
      )}

      <HeaderBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        totalMembers={filteredAccesses.length}
      />

      <div className="members-tab__content">
        {filteredAccesses.length === 0 ? (
          <div className="members-tab__empty">
            {searchTerm || roleFilter !== "Tous"
              ? "Aucun membre ne correspond à votre recherche"
              : "Aucun membre dans cette pool"}
          </div>
        ) : (
          <div className="members-tab__list">
            {filteredAccesses.map((access) => (
              <MemberRow
                key={access.id}
                member={access.user}
                role={access.role}
                onViewDetails={() => handleViewDetails(access)}
                onChangeRole={() => handleChangeRole(access)}
                onRemove={() => handleRemove(access)}
                isPublicView={isPublicView}
              />
            ))}
          </div>
        )}
      </div>

      {showDetailsModal && selectedMember && (
        <MemberDetailsModal
          member={selectedMember.user}
          role={selectedMember.role}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedMember(null);
          }}
        />
      )}

      {!isPublicView && showChangeRoleModal && selectedMember && (
        <ChangeRoleModal
          member={selectedMember.user}
          currentRole={selectedMember.role}
          onChangeRole={handleChangeRoleConfirm}
          onClose={() => {
            setShowChangeRoleModal(false);
            setSelectedMember(null);
          }}
          loading={changeRoleMutation.loading}
        />
      )}

      {!isPublicView && showRemoveModal && selectedMember && (
        <RemoveMemberModal
          member={selectedMember.user}
          role={selectedMember.role}
          onConfirm={handleRemoveConfirm}
          onClose={() => {
            setShowRemoveModal(false);
            setSelectedMember(null);
          }}
          loading={removeMutation.loading}
        />
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

export default MembersTab;
