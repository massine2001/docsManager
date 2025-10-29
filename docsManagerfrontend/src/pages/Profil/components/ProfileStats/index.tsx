import { useEffect, useState } from "react";
import { fetchPoolsFromUser } from "../../../../api/userPageApi";
import { fetchFilesByPoolId } from "../../../../api/poolPageApi";
import type { Pool, File } from "../../../../types/models";
import './style.css';

interface ProfileStatsProps {
  userId: number;
}

interface Stats {
  totalPools: number;
  totalFiles: number;
  filesUploaded: number;
  recentActivity: Array<{
    id: number;
    type: 'pool' | 'file';
    name: string;
    date: string;
  }>;
}

const ProfileStats = ({ userId }: ProfileStatsProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const userPools: Pool[] = await fetchPoolsFromUser(userId);
        
        let allFiles: File[] = [];
        let filesUploadedByUser = 0;

        for (const pool of userPools) {
          try {
            const poolFiles = await fetchFilesByPoolId(pool.id);
            allFiles = [...allFiles, ...poolFiles];
            
            filesUploadedByUser += poolFiles.filter(
              file => file.userUploader.id === userId
            ).length;
          } catch (error) {
          }
        }

        const recentActivity = [
          ...userPools.slice(0, 5).map(pool => ({
            id: pool.id,
            type: 'pool' as const,
            name: pool.name,
            date: pool.createdAt || '',
          })),
          ...allFiles
            .filter(file => file.userUploader.id === userId)
            .slice(0, 5)
            .map(file => ({
              id: file.id,
              type: 'file' as const,
              name: file.name,
              date: file.createdAt,
            })),
        ]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10);

        setStats({
          totalPools: userPools.length,
          totalFiles: allFiles.length,
          filesUploaded: filesUploadedByUser,
          recentActivity,
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="profile-stats">
        <div className="stats-loading">
          <div className="spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="profile-stats">
        <div className="stats-error">
          Impossible de charger les statistiques
        </div>
      </div>
    );
  }

  return (
    <div className="profile-stats">
      <h2>Vos statistiques</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPools}</div>
            <div className="stat-label">Pools</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalFiles}</div>
            <div className="stat-label">Fichiers (Total)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⬆️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.filesUploaded}</div>
            <div className="stat-label">Fichiers uploadés</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">
              {stats.totalPools > 0 
                ? Math.round(stats.filesUploaded / stats.totalPools) 
                : 0}
            </div>
            <div className="stat-label">Fichiers / Pool</div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Activité récente</h3>
        {stats.recentActivity.length === 0 ? (
          <div className="no-activity">
            <p>Aucune activité récente</p>
          </div>
        ) : (
          <div className="activity-list">
            {stats.recentActivity.map((activity, index) => (
              <div key={`${activity.type}-${activity.id}-${index}`} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'pool' ? '📦' : '📄'}
                </div>
                <div className="activity-content">
                  <div className="activity-name">{activity.name}</div>
                  <div className="activity-type">
                    {activity.type === 'pool' ? 'Pool créée' : 'Fichier uploadé'}
                  </div>
                </div>
                <div className="activity-date">
                  {activity.date ? new Date(activity.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'Date inconnue'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStats;
