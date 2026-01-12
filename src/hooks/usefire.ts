import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, query, limitToLast, orderByKey } from 'firebase/database';

export interface VitalData {
  heart: number;
  oxygen: number;
  temp: number;
  timestamp: number;
  id?: string; // Guardamos el ID por si acaso
}

export function useVitalsFirebase() {
  const [latestVitals, setLatestVitals] = useState<VitalData | null>(null);
  const [history, setHistory] = useState<VitalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. APUNTAMOS A LA COLECCIÓN 'vitals'
    const vitalsRef = ref(db, 'vitals');

    // 2. CREAMOS LA CONSULTA
    // Pedimos los últimos 50 registros ordenados cronológicamente
    const recentVitalsQuery = query(vitalsRef, orderByKey(), limitToLast(50));

    // 3. ESCUCHAMOS LOS CAMBIOS
    const unsubscribe = onValue(recentVitalsQuery, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // Firebase devuelve un objeto de objetos: { "-ID1": {datos}, "-ID2": {datos} }
        // Lo convertimos a un array fácil de usar
        const dataArray: VitalData[] = Object.keys(data).map((key) => ({
          heart: data[key].heart,      // Ya coinciden con tu imagen, no hay que traducir
          oxygen: data[key].oxygen,
          temp: data[key].temp,
          timestamp: data[key].timestamp,
          id: key
        }));

        // Ordenamos: El más nuevo primero (para mostrarlo arriba en tablas)
        // Los IDs de Firebase (-Oik...) se ordenan cronológicamente
        const sortedHistory = dataArray.reverse();

        setHistory(sortedHistory);       // Guardamos todo el historial real
        setLatestVitals(sortedHistory[0]); // El primero es el más reciente (Live)
      } else {
        // Si borras la base de datos y está vacía
        setLatestVitals(null);
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { latestVitals, history, loading };
}