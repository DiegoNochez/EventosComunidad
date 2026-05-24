import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, ScrollView, Modal
} from 'react-native';

const eventosIniciales = [
  {
    id: '1',
    titulo: 'Festival Cultural',
    fecha: '2026-06-15',
    hora: '10:00 AM',
    ubicacion: 'Parque Central',
    descripcion: 'Festival anual de cultura y arte comunitario.',
    organizador: 'Comité Cultural',
    asistentes: 24,
  },
  {
    id: '2',
    titulo: 'Limpieza Comunitaria',
    fecha: '2026-06-20',
    hora: '07:00 AM',
    ubicacion: 'Colonia San José',
    descripcion: 'Jornada de limpieza para mantener nuestra comunidad limpia.',
    organizador: 'Vecinos Unidos',
    asistentes: 15,
  },
];

const HORAS = [
  '06:00 AM','07:00 AM','08:00 AM','09:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM',
  '06:00 PM','07:00 PM','08:00 PM','09:00 PM',
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function CalendarioModal({ visible, onClose, onSelect, fechaActual }) {
  const hoy = new Date();
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());

  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const primerDia = new Date(anio, mes, 1).getDay();
  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1);
  const blancos = Array.from({ length: primerDia }, (_, i) => i);

  const seleccionar = (dia) => {
    const fecha = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    onSelect(fecha);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={cal.overlay}>
        <View style={cal.container}>
          <View style={cal.header}>
            <TouchableOpacity onPress={() => { if (mes === 0) { setMes(11); setAnio(anio - 1); } else setMes(mes - 1); }}>
              <Text style={cal.nav}>◀</Text>
            </TouchableOpacity>
            <Text style={cal.titulo}>{MESES[mes]} {anio}</Text>
            <TouchableOpacity onPress={() => { if (mes === 11) { setMes(0); setAnio(anio + 1); } else setMes(mes + 1); }}>
              <Text style={cal.nav}>▶</Text>
            </TouchableOpacity>
          </View>
          <View style={cal.grid}>
            {['D','L','M','M','J','V','S'].map((d, i) => <Text key={i} style={cal.diaSem}>{d}</Text>)}
            {blancos.map((_, i) => <View key={`b${i}`} style={cal.celda} />)}
            {dias.map(dia => (
              <TouchableOpacity key={dia} style={cal.celda} onPress={() => seleccionar(dia)}>
                <Text style={cal.diaNum}>{dia}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={cal.btnCerrar} onPress={onClose}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function HoraModal({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={cal.overlay}>
        <View style={[cal.container, { maxHeight: 400 }]}>
          <Text style={[cal.titulo, { marginBottom: 12 }]}>Seleccionar Hora</Text>
          <ScrollView>
            {HORAS.map(h => (
              <TouchableOpacity key={h} style={hora.item} onPress={() => { onSelect(h); onClose(); }}>
                <Text style={hora.text}>{h}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={cal.btnCerrar} onPress={onClose}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function EventsScreen() {
  const [eventos, setEventos] = useState(eventosIniciales);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [calVisible, setCalVisible] = useState(false);
  const [horaVisible, setHoraVisible] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ titulo: '', fecha: '', hora: '', ubicacion: '', descripcion: '', organizador: '' });

  const abrirCrear = () => {
    setForm({ titulo: '', fecha: '', hora: '', ubicacion: '', descripcion: '', organizador: '' });
    setEditando(false);
    setModalVisible(true);
  };

  const abrirEditar = (evento) => {
    setForm(evento);
    setEditando(true);
    setModalVisible(true);
    setDetailVisible(false);
  };

  const guardarEvento = () => {
    if (!form.titulo || !form.fecha || !form.ubicacion) {
      alert('Título, fecha y ubicación son obligatorios');
      return;
    }
    if (editando) {
      setEventos(eventos.map(e => e.id === form.id ? { ...form } : e));
    } else {
      setEventos([...eventos, { ...form, id: Date.now().toString(), asistentes: 0 }]);
    }
    setModalVisible(false);
  };

  const eliminarEvento = (id) => {
    setEventos(eventos.filter(e => e.id !== id));
    setDetailVisible(false);
  };

  const confirmarAsistencia = (id) => {
    setEventos(eventos.map(e => e.id === id ? { ...e, asistentes: e.asistentes + 1 } : e));
    alert('¡Asistencia confirmada!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Comunitarios</Text>
      <TouchableOpacity style={styles.btnCrear} onPress={abrirCrear}>
        <Text style={styles.btnCrearText}>+ Crear Evento</Text>
      </TouchableOpacity>

      <FlatList
        data={eventos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => { setEventoSeleccionado(item); setDetailVisible(true); }}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            <Text style={styles.cardInfo}>📅 {item.fecha} — {item.hora}</Text>
            <Text style={styles.cardInfo}>📍 {item.ubicacion}</Text>
            <Text style={styles.cardInfo}>👥 {item.asistentes} asistentes</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal Crear/Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editando ? 'Editar Evento' : 'Nuevo Evento'}</Text>
            <TextInput style={styles.input} placeholder="Título" value={form.titulo} onChangeText={v => setForm({ ...form, titulo: v })} />

            <TouchableOpacity style={styles.inputBtn} onPress={() => setCalVisible(true)}>
              <Text style={form.fecha ? styles.inputBtnText : styles.inputBtnPlaceholder}>
                {form.fecha || '📅 Seleccionar Fecha'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.inputBtn} onPress={() => setHoraVisible(true)}>
              <Text style={form.hora ? styles.inputBtnText : styles.inputBtnPlaceholder}>
                {form.hora || '🕐 Seleccionar Hora'}
              </Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Ubicación" value={form.ubicacion} onChangeText={v => setForm({ ...form, ubicacion: v })} />
            <TextInput style={styles.input} placeholder="Organizador" value={form.organizador} onChangeText={v => setForm({ ...form, organizador: v })} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Descripción" value={form.descripcion} onChangeText={v => setForm({ ...form, descripcion: v })} multiline />

            <TouchableOpacity style={styles.btnGuardar} onPress={guardarEvento}>
              <Text style={styles.btnText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Detalle */}
      <Modal visible={detailVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            {eventoSeleccionado && <>
              <Text style={styles.modalTitle}>{eventoSeleccionado.titulo}</Text>
              <Text style={styles.detailText}>📅 {eventoSeleccionado.fecha} — {eventoSeleccionado.hora}</Text>
              <Text style={styles.detailText}>📍 {eventoSeleccionado.ubicacion}</Text>
              <Text style={styles.detailText}>👤 {eventoSeleccionado.organizador}</Text>
              <Text style={styles.detailText}>👥 {eventoSeleccionado.asistentes} asistentes</Text>
              <Text style={styles.detailText}>📝 {eventoSeleccionado.descripcion}</Text>
              <TouchableOpacity style={styles.btnAsistir} onPress={() => confirmarAsistencia(eventoSeleccionado.id)}>
                <Text style={styles.btnText}>✅ Confirmar Asistencia</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={() => abrirEditar(eventoSeleccionado)}>
                <Text style={styles.btnText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnEliminar} onPress={() => eliminarEvento(eventoSeleccionado.id)}>
                <Text style={styles.btnText}>🗑️ Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setDetailVisible(false)}>
                <Text style={styles.btnText}>Cerrar</Text>
              </TouchableOpacity>
            </>}
          </ScrollView>
        </View>
      </Modal>

      <CalendarioModal visible={calVisible} onClose={() => setCalVisible(false)} onSelect={v => setForm({ ...form, fecha: v })} />
      <HoraModal visible={horaVisible} onClose={() => setHoraVisible(false)} onSelect={v => setForm({ ...form, hora: v })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4A90D9', marginBottom: 12, marginTop: 40 },
  btnCrear: { backgroundColor: '#4A90D9', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  btnCrearText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  cardInfo: { fontSize: 14, color: '#666', marginBottom: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#4A90D9', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 15 },
  inputBtn: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  inputBtnText: { fontSize: 15, color: '#333' },
  inputBtnPlaceholder: { fontSize: 15, color: '#999' },
  btnGuardar: { backgroundColor: '#4A90D9', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnCancelar: { backgroundColor: '#999', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnEliminar: { backgroundColor: '#e74c3c', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnAsistir: { backgroundColor: '#27ae60', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  detailText: { fontSize: 15, color: '#444', marginBottom: 10 },
});

const cal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#4A90D9', textAlign: 'center' },
  nav: { fontSize: 20, color: '#4A90D9', paddingHorizontal: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  celda: { width: '14.28%', alignItems: 'center', paddingVertical: 8 },
  diaSem: { width: '14.28%', textAlign: 'center', fontWeight: 'bold', color: '#666', marginBottom: 4 },
  diaNum: { fontSize: 15, color: '#333' },
  btnCerrar: { backgroundColor: '#999', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 12 },
});

const hora = StyleSheet.create({
  item: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  text: { fontSize: 16, color: '#333', textAlign: 'center' },
});