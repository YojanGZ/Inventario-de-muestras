import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getMuestras } from '../database/db';
import { useIsFocused } from '@react-navigation/native';

export default function InventoryExpiredScreen() {
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    const res = await getMuestras();
    // Filter only expired items
    const expired = res.filter(m => m.estado === 'Vencido');
    setData(expired);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.producto}</Text>
        <Text>Fecha Elaboración: {item.fecha_elaboracion}</Text>
        <Text>Número Orden: {item.numero_orden}</Text>
        <Text>Fecha Descarte: {item.fecha_descarte}</Text>
        <Text>Cantidad Producto: {item.cantidad_producto}</Text>
        <Text>Responsable: {item.responsable_elaboracion}</Text>
        <Text style={styles.state}>Estado: {item.estado}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{padding: 20, color: 'green'}}>¡Excelente! No hay muestras vencidas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#ffe6e6', padding: 15, margin: 10, borderRadius: 8, elevation: 2, borderWidth: 1, borderColor: 'red' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: 'red' },
  state: { fontWeight: 'bold', color: 'red', marginTop: 5 }
});
