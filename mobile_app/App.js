import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initDb } from './src/database/db';

import FormScreen from './src/screens/FormScreen';
const Tab = createBottomTabNavigator();
import InventoryFullScreen from './src/screens/InventoryFullScreen';
import InventoryExpiredScreen from './src/screens/InventoryExpiredScreen';


import { View, Text } from 'react-native';


export default function App() {
  const [dbReady, setDbReady] = React.useState(false);

  useEffect(() => {
    initDb()
      .then(() => {
        console.log('Database initialized');
        setDbReady(true);
      })
      .catch((e) => console.log('DB Init Error', e));
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando base de datos...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 13, marginBottom: 5 },
          tabBarIconStyle: { display: 'none' }, // Hiding icons for simplicity
        }}
      >
        <Tab.Screen name="Ingresar" component={FormScreen} />
        <Tab.Screen name="Inventario" component={InventoryFullScreen} />
        <Tab.Screen name="Vencidas" component={InventoryExpiredScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
