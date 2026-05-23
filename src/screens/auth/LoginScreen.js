import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }
    const data = localStorage.getItem('userData');
    if (!data) {
      alert('No hay usuarios registrados, regístrate primero');
      return;
    }
    const usuario = JSON.parse(data);
    if (usuario.email === email && usuario.password === password) {
      localStorage.setItem('userToken', email);
      window.location.reload();
    } else {
      alert('Correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EventosComunidad</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#4A90D9', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#4A90D9', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#4A90D9', fontSize: 14 },
});