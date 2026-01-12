import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, query, limitToLast } from 'firebase/database';

interface VitalData {
  heart: number;
  oxygen: number;
  temp: number;
  timestamp: number;
}

export function useVitalsFirebase() {
  const [latestVitals, setLatestVitals] = useState<VitalData | null>(null);
  const [history, setHistory] = useState<VitalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar valor actual (se actualiza instantáneamente)
    const currentRef = ref(db, 'currentVitals');
    const unsubscribeCurrent = onValue(currentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLatestVitals(data);
      }
      setLoading(false);
    });

    // Escuchar historial
    const historyRef = ref(db, 'vitalsHistory');
    const historyQuery = query(historyRef, limitToLast(50));
    const unsubscribeHistory = onValue(historyQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const vitalsArray = Object.values(data) as VitalData[];
        vitalsArray.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(vitalsArray);
      }
    });

    return () => {
      unsubscribeCurrent();
      unsubscribeHistory();
    };
  }, []);

  return { latestVitals, history, loading };
}