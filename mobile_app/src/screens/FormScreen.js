import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { insertMuestra } from '../database/db';

export default function FormScreen() {
  const [formData, setFormData] = useState({
    fecha_elaboracion: new Date(),
    producto: '',
    numero_orden: '',
    cantidad_muestra: '',
    fecha_descarte: new Date(),
    cantidad_producto: '',
    temperatura_coccion: '',
    hora_inicial_enfriamiento: new Date(new Date().setHours(12, 0, 0)),
    hora_final_enfriamiento: new Date(new Date().setHours(12, 0, 0)),
    temperatura_final_enfriamiento: '',
    nro_termometro: '',
    responsable_elaboracion: '',
    sabor: 'Bueno',
    olor: 'Bueno',
    color: 'Bueno',
    textura: 'Bueno',
    responsable_sensorial: '',
    observacion: ''
  });

  const [showPicker, setShowPicker] = useState({ visible: false, mode: 'date', field: null });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onChangePicker = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker({ ...showPicker, visible: false });
    }
    if (selectedDate && showPicker.field) {
      updateField(showPicker.field, selectedDate);
    }
  };

  const openPicker = (field, mode) => {
    setShowPicker({ visible: true, mode, field });
  };

  const formatDate = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  };

  const formatTime = (dateObj) => {
    return dateObj.toTimeString().split(' ')[0];
  };

  const handleSave = async () => {
    try {
      // Formatear datos antes de enviarlos a DB para que correspondan al formato SQLite
      const dataToSave = {
        ...formData,
        fecha_elaboracion: formatDate(formData.fecha_elaboracion),
        fecha_descarte: formatDate(formData.fecha_descarte),
        hora_inicial_enfriamiento: formatTime(formData.hora_inicial_enfriamiento),
        hora_final_enfriamiento: formatTime(formData.hora_final_enfriamiento),
      };

      await insertMuestra(dataToSave);
      Alert.alert("Éxito", "Muestra guardada exitosamente");
      // Reset main fields
      setFormData(prev => ({
        ...prev,
        producto: '',
        numero_orden: '',
        cantidad_muestra: '',
        cantidad_producto: '',
        temperatura_coccion: '',
        temperatura_final_enfriamiento: '',
        observacion: ''
      }));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar la muestra");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ingreso de Nueva Muestra</Text>

      <Text style={styles.label}>Fecha Elaboración</Text>
      <TouchableOpacity onPress={() => openPicker('fecha_elaboracion', 'date')} style={styles.datePickerBtn}>
        <Text>{formatDate(formData.fecha_elaboracion)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Producto</Text>
      <TextInput style={styles.input} value={formData.producto} onChangeText={(v) => updateField('producto', v)} />

      <Text style={styles.label}>Número Orden de Fabricación</Text>
      <TextInput style={styles.input} value={formData.numero_orden} onChangeText={(v) => updateField('numero_orden', v)} />

      <Text style={styles.label}>Cantidad Muestra (g) [Ej: 15.5]</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={formData.cantidad_muestra} onChangeText={(v) => updateField('cantidad_muestra', v)} />

      <Text style={styles.label}>Fecha de Descarte/Vencimiento</Text>
      <TouchableOpacity onPress={() => openPicker('fecha_descarte', 'date')} style={styles.datePickerBtn}>
        <Text>{formatDate(formData.fecha_descarte)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Cantidad Producto (Kg-L)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={formData.cantidad_producto} onChangeText={(v) => updateField('cantidad_producto', v)} />

      <Text style={styles.label}>Temp. Final de Cocción (°C)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={formData.temperatura_coccion} onChangeText={(v) => updateField('temperatura_coccion', v)} />

      <Text style={styles.label}>Hora Inicial Enfriamiento</Text>
      <TouchableOpacity onPress={() => openPicker('hora_inicial_enfriamiento', 'time')} style={styles.datePickerBtn}>
        <Text>{formatTime(formData.hora_inicial_enfriamiento)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Hora Final Enfriamiento</Text>
      <TouchableOpacity onPress={() => openPicker('hora_final_enfriamiento', 'time')} style={styles.datePickerBtn}>
        <Text>{formatTime(formData.hora_final_enfriamiento)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Temp. Enfriamiento Final (°C)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={formData.temperatura_final_enfriamiento} onChangeText={(v) => updateField('temperatura_final_enfriamiento', v)} />

      <Text style={styles.label}>Nro. Termómetro</Text>
      <TextInput style={styles.input} value={formData.nro_termometro} onChangeText={(v) => updateField('nro_termometro', v)} />

      <Text style={styles.label}>Responsable Elaboración</Text>
      <TextInput style={styles.input} value={formData.responsable_elaboracion} onChangeText={(v) => updateField('responsable_elaboracion', v)} />

      <Text style={[styles.header, {marginTop: 20, fontSize: 18}]}>Evaluación Sensorial</Text>

      <Text style={styles.label}>Sabor</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={formData.sabor} onValueChange={(v) => updateField('sabor', v)}>
          <Picker.Item label="Bueno" value="Bueno" />
          <Picker.Item label="Regular" value="Regular" />
          <Picker.Item label="Malo" value="Malo" />
          <Picker.Item label="NC" value="NC" />
          <Picker.Item label="N/A" value="N/A" />
        </Picker>
      </View>

      <Text style={styles.label}>Olor</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={formData.olor} onValueChange={(v) => updateField('olor', v)}>
          <Picker.Item label="Bueno" value="Bueno" />
          <Picker.Item label="Regular" value="Regular" />
          <Picker.Item label="Malo" value="Malo" />
          <Picker.Item label="NC" value="NC" />
          <Picker.Item label="N/A" value="N/A" />
        </Picker>
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={formData.color} onValueChange={(v) => updateField('color', v)}>
          <Picker.Item label="Bueno" value="Bueno" />
          <Picker.Item label="Regular" value="Regular" />
          <Picker.Item label="Malo" value="Malo" />
          <Picker.Item label="NC" value="NC" />
          <Picker.Item label="N/A" value="N/A" />
        </Picker>
      </View>

      <Text style={styles.label}>Textura</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={formData.textura} onValueChange={(v) => updateField('textura', v)}>
          <Picker.Item label="Bueno" value="Bueno" />
          <Picker.Item label="Regular" value="Regular" />
          <Picker.Item label="Malo" value="Malo" />
          <Picker.Item label="NC" value="NC" />
          <Picker.Item label="N/A" value="N/A" />
        </Picker>
      </View>

      <Text style={styles.label}>Responsable Sensorial</Text>
      <TextInput style={styles.input} value={formData.responsable_sensorial} onChangeText={(v) => updateField('responsable_sensorial', v)} />

      <Text style={styles.label}>Observación</Text>
      <TextInput style={[styles.input, {height: 80}]} multiline value={formData.observacion} onChangeText={(v) => updateField('observacion', v)} />

      <View style={styles.buttonContainer}>
        <Button title="Guardar Muestra" onPress={handleSave} />
      </View>
      <View style={{height: 50}} />

      {showPicker.visible && (
        <DateTimePicker
          value={formData[showPicker.field]}
          mode={showPicker.mode}
          is24Hour={true}
          display="default"
          onChange={onChangePicker}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, fontSize: 16, backgroundColor: '#fff' },
  datePickerBtn: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 5, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff' },
  buttonContainer: { marginTop: 30 }
});
