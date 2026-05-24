import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, ScrollView, Modal
} from 'react-native';

const eventosConComentarios = [
  {
    id: '1',
    titulo: 'Festival Cultural',
    comentarios: [
      { id: '1', usuario: 'María', texto: 'Estuvo increíble!', calificacion: 5 },
      { id: '2', usuario: 'Carlos', texto: 'Muy bien organizado', calificacion: 4 },
    ],
  },
  {
    id: '2',
    titulo: 'Limpieza Comunitaria',
    comentarios: [
      { id: '1', usuario: 'Ana', texto: 'Excelente iniciativa', calificacion: 5 },
    ],
  },
];

function Estrellas({ calificacion, onSelect }) {
  return (
    <View style={{ flexDirection: 'row', marginVertical: 8 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => onSelect && onSelect(i)}>
          <Text style={{ fontSize: 28, color: i <= calificacion ? '#f1c40f' : '#ddd' }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SocialScreen() {
  const [eventos, setEventos] = useState(eventosConComentarios);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [nuevaCalificacion, setNuevaCalificacion] = useState(0);

  const abrirEvento = (evento) => {
    setEventoSeleccionado(evento);
    setNuevoComentario('');
    setNuevaCalificacion(0);
    setModalVisible(true);
  };

  const agregarComentario = () => {
    if (!nuevoComentario || nuevaCalificacion === 0) {
      alert('Escribe un comentario y selecciona una calificación');
      return;
    }
    const comentario = {
      id: Date.now().toString(),
      usuario: 'Tú',
      texto: nuevoComentario,
      calificacion: nuevaCalificacion,
    };
    const updatedEventos = eventos.map(e =>
      e.id === eventoSeleccionado.id
        ? { ...e, comentarios: [...e.comentarios, comentario] }
        : e
    );
    setEventos(updatedEventos);
    setEventoSeleccionado({ ...eventoSeleccionado, comentarios: [...eventoSeleccionado.comentarios, comentario] });
    setNuevoComentario('');
    setNuevaCalificacion(0);
  };

  const promedioCalificacion = (comentarios) => {
    if (!comentarios.length) return 0;
    const sum = comentarios.reduce((a, c) => a + c.calificacion, 0);
    return (sum / comentarios.length).toFixed(1);
  };

  const compartir = (evento) => {
    alert(`Compartiendo: ${evento.titulo}\n¡Únete a este evento comunitario!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interacción Social</Text>

      <FlatList
        data={eventos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => abrirEvento(item)}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            <Text style={styles.cardInfo}>⭐ {promedioCalificacion(item.comentarios)} — {item.comentarios.length} comentarios</Text>
            <TouchableOpacity style={styles.btnCompartir} onPress={() => compartir(item)}>
              <Text style={styles.btnCompartirText}>📤 Compartir</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            {eventoSeleccionado && <>
              <Text style={styles.modalTitle}>{eventoSeleccionado.titulo}</Text>
              <Text style={styles.seccion}>Comentarios</Text>

              {eventoSeleccionado.comentarios.map(c => (
                <View key={c.id} style={styles.comentario}>
                  <Text style={styles.comentarioUsuario}>{c.usuario}</Text>
                  <Estrellas calificacion={c.calificacion} />
                  <Text style={styles.comentarioTexto}>{c.texto}</Text>
                </View>
              ))}

              <Text style={styles.seccion}>Agregar Comentario</Text>
              <Estrellas calificacion={nuevaCalificacion} onSelect={setNuevaCalificacion} />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Escribe tu comentario..."
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
                multiline
              />
              <TouchableOpacity style={styles.btnGuardar} onPress={agregarComentario}>
                <Text style={styles.btnText}>Publicar Comentario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cerrar</Text>
              </TouchableOpacity>
            </>}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4A90D9', marginBottom: 12, marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  cardInfo: { fontSize: 14, color: '#666', marginBottom: 8 },
  btnCompartir: { backgroundColor: '#f0f7ff', padding: 8, borderRadius: 8, alignItems: 'center' },
  btnCompartirText: { color: '#4A90D9', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#4A90D9', marginBottom: 16 },
  seccion: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 12, marginBottom: 8 },
  comentario: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, marginBottom: 10 },
  comentarioUsuario: { fontWeight: 'bold', color: '#4A90D9' },
  comentarioTexto: { color: '#444', marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 15 },
  btnGuardar: { backgroundColor: '#4A90D9', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnCancelar: { backgroundColor: '#999', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});