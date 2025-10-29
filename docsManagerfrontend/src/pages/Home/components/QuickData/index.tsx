import { useEffect, useState, useContext } from "react";
import { fetchAllPools } from "../../../../api/poolPageApi";
import { fetchAllFiles } from "../../../../api/filePageApi";
import { AuthContext } from "../../../../contexts/AuthContext";
import './style.css';

interface FetchedData {
    pools: number | null,
    files: number | null,
}

const QuickData: React.FC = () => {
const authContext = useContext(AuthContext);
const user = authContext?.user;

const [fetchedData, setFetchedData] = useState<FetchedData>({
    pools: null,
    files: null,
});

const fetchQuickData = async () => {
    try {
        const [pools, files] = await Promise.all([
            fetchAllPools(),
            fetchAllFiles(),
        ])

        setFetchedData({
            pools: pools.length,
            files: files.length,
        })
    } catch (error) {
        setFetchedData({ pools: 0, files: 0 });
    }
}

useEffect(() => {
    fetchQuickData();
}, [])

    return (
        <div className="quickData">
    <h2>Mes statistiques</h2>
    <div className="statsGrid">
        <div className="statCard">
            <span className="icon">👤</span>
            <div>
                <p className="label">Utilisateur</p>
                <p className="value">{user?.firstName || '...'}</p>
            </div>
        </div>
        <div className="statCard">
            <span className="icon">🕳️</span>
            <div>
                <p className="label">Mes Pools</p>
                <p className="value">{fetchedData.pools ?? '...'}</p>
            </div>
        </div>
        <div className="statCard">
            <span className="icon">📁</span>
            <div>
                <p className="label">Mes Fichiers</p>
                <p className="value">{fetchedData.files ?? '...'}</p>
            </div>
        </div>
        <div className="statCard">
            <span className="icon">🟢</span>
            <div>
                <p className="label">Statut</p>
                <p className="value">Connecté</p>
            </div>
        </div>
    </div>
</div>

    )
}

export default QuickData;