import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    cargarUsuario();
  }, []);

const cargarUsuario = () => {
    const data = localStorage.getItem('userData');
    if (data) setUsuario(JSON.parse(data));
  };

const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.reload();
  };
    
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario?.nombre ? usuario.nombre[0].toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre || 'Usuario'}</Text>
        <Text style={styles.email}>{usuario?.email || ''}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de la cuenta</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{usuario?.nombre || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{usuario?.email || 'N/A'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#4A90D9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A90D9', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, color: '#333', fontWeight: '500' },
  logoutButton: { backgroundColor: '#e74c3c', padding: 14, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});