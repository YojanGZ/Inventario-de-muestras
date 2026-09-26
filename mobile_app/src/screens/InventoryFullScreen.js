import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getMuestras } from '../database/db';
import { useIsFocused } from '@react-navigation/native';

export default function InventoryFullScreen() {
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    const res = await getMuestras();
    setData(res);
  };

  const renderItem = ({ item }) => {
    const isExpired = item.estado === 'Vencido';
    const isExpiringToday = item.estado === 'Vence Hoy';

    let color = 'green';
    if (isExpired) color = 'red';
    if (isExpiringToday) color = 'orange';

    return (
      <View style={styles.card}>
        <Text style={[styles.title, { color }]}>{item.producto}</Text>
        <Text>Elaborado: {item.fecha_elaboracion}</Text>
        <Text>Descarte: {item.fecha_descarte} ({item.estado})</Text>
        <Text>Orden: {item.numero_orden}</Text>
        <Text>Cantidad Muestra (g): {item.cantidad_muestra}</Text>
        <Text>Cantidad Producto (Kg-L): {item.cantidad_producto}</Text>
        <Text>Temp. Cocción (°C): {item.temperatura_coccion}</Text>
        <Text>Hora Inicio Enfriamiento: {item.hora_inicial_enfriamiento}</Text>
        <Text>Hora Fin Enfriamiento: {item.hora_final_enfriamiento}</Text>
        <Text>Tiempo Total Enfriamiento: {item.tiempo_total_enfriamiento}</Text>
        <Text>Temp. Final Enfriamiento (°C): {item.temperatura_final_enfriamiento}</Text>
        <Text>Nro. Termómetro: {item.nro_termometro}</Text>
        <Text>Responsable Elaboración: {item.responsable_elaboracion}</Text>
        <Text>Sabor: {item.sabor}</Text>
        <Text>Olor: {item.olor}</Text>
        <Text>Color: {item.color}</Text>
        <Text>Textura: {item.textura}</Text>
        <Text>Responsable Sensorial: {item.responsable_sensorial}</Text>
        <Text>Observación: {item.observacion}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{padding: 20}}>No hay muestras registradas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 15, margin: 10, borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 }
});
