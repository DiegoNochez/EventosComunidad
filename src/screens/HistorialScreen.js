import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView
} from 'react-native';

const historialInicial = [
  {
    id: '1',
    titulo: 'Festival Cultural',
    fecha: '2026-05-15',
    ubicacion: 'Parque Central',
    asistio: true,
    calificacion: 5,
  },
  {
    id: '2',
    titulo: 'Limpieza Comunitaria',
    fecha: '2026-04-20',
    ubicacion: 'Colonia San José',
    asistio: true,
    calificacion: 4,
  },
  {
    id: '3',
    titulo: 'Taller de Música',
    fecha: '2026-03-10',
    ubicacion: 'Centro Cultural',
    asistio: false,
    calificacion: 0,
  },
];

function Estrellas({ calificacion }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ fontSize: 16, color: i <= calificacion ? '#f1c40f' : '#ddd' }}>★</Text>
      ))}
    </View>
  );
}

export default function HistorialScreen() {
  const [historial] = useState(historialInicial);
  const [filtro, setFiltro] = useState('todos');

  const eventosFiltrados = historial.filter(e => {
    if (filtro === 'asistidos') return e.asistio;
    if (filtro === 'no_asistidos') return !e.asistio;
    return true;
  });

  const totalAsistidos = historial.filter(e => e.asistio).length;
  const totalEventos = historial.length;
  const promedio = historial
    .filter(e => e.calificacion > 0)
    .reduce((a, e, _, arr) => a + e.calificacion / arr.length, 0)
    .toFixed(1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historial y Estadísticas</Text>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{totalEventos}</Text>
          <Text style={styles.statLabel}>Total Eventos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{totalAsistidos}</Text>
          <Text style={styles.statLabel}>Asistidos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{promedio}⭐</Text>
          <Text style={styles.statLabel}>Promedio</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtros}>
        {['todos', 'asistidos', 'no_asistidos'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, filtro === f && styles.filtroActivo]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filtroText, filtro === f && styles.filtroTextoActivo]}>
              {f === 'todos' ? 'Todos' : f === 'asistidos' ? 'Asistidos' : 'No asistidos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      {eventosFiltrados.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            <View style={[styles.badge, { backgroundColor: item.asistio ? '#27ae60' : '#e74c3c' }]}>
              <Text style={styles.badgeText}>{item.asistio ? 'Asistí' : 'No asistí'}</Text>
            </View>
          </View>
          <Text style={styles.cardInfo}>📅 {item.fecha}</Text>
          <Text style={styles.cardInfo}>📍 {item.ubicacion}</Text>
          {item.calificacion > 0 && <Estrellas calificacion={item.calificacion} />}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4A90D9', marginBottom: 16, marginTop: 40 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', flex: 1, marginHorizontal: 4, elevation: 2 },
  statNum: { fontSize: 22, fontWeight: 'bold', color: '#4A90D9' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  filtros: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  filtroBtn: { flex: 1, padding: 8, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  filtroActivo: { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  filtroText: { fontSize: 12, color: '#666' },
  filtroTextoActivo: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  cardInfo: { fontSize: 14, color: '#666', marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});