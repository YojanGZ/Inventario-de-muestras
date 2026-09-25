import * as SQLite from 'expo-sqlite';

export const getDb = () => {
  return SQLite.openDatabaseSync('inventario.db');
};

export const initDb = async () => {
  const db = getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS muestras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha_elaboracion TEXT,
      producto TEXT,
      numero_orden TEXT,
      cantidad_muestra REAL,
      fecha_descarte TEXT,
      cantidad_producto REAL,
      temperatura_coccion REAL,
      hora_inicial_enfriamiento TEXT,
      hora_final_enfriamiento TEXT,
      tiempo_total_enfriamiento TEXT,
      temperatura_final_enfriamiento REAL,
      nro_termometro TEXT,
      responsable_elaboracion TEXT,
      sabor TEXT,
      olor TEXT,
      color TEXT,
      textura TEXT,
      responsable_sensorial TEXT,
      observacion TEXT
    );
  `);
};

export const insertMuestra = async (muestra) => {
  const db = getDb();

  // Calculate cooling time difference
  let tiempo_calculado = "";
  if (muestra.hora_inicial_enfriamiento && muestra.hora_final_enfriamiento) {
    try {
      // Create arbitrary dates on the same day just to compare time
      const t1 = new Date("1970-01-01T" + muestra.hora_inicial_enfriamiento + "Z");
      const t2 = new Date("1970-01-01T" + muestra.hora_final_enfriamiento + "Z");

      if (t2 < t1) {
        t2.setDate(t2.getDate() + 1); // Pass to next day
      }

      const diffMs = t2 - t1;
      const horas = Math.floor(diffMs / 3600000);
      const minutos = Math.floor((diffMs % 3600000) / 60000);
      tiempo_calculado = `${horas}h ${minutos}m`;
    } catch (e) {
      console.log("Error calculando el tiempo:", e);
    }
  }

  const statement = await db.prepareAsync(
    `INSERT INTO muestras (
      fecha_elaboracion, producto, numero_orden, cantidad_muestra, fecha_descarte,
      cantidad_producto, temperatura_coccion, hora_inicial_enfriamiento,
      hora_final_enfriamiento, tiempo_total_enfriamiento, temperatura_final_enfriamiento,
      nro_termometro, responsable_elaboracion, sabor, olor, color, textura,
      responsable_sensorial, observacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  try {
    await statement.executeAsync([
      muestra.fecha_elaboracion, muestra.producto, muestra.numero_orden,
      parseFloat(muestra.cantidad_muestra) || null, muestra.fecha_descarte,
      parseFloat(muestra.cantidad_producto) || null, parseFloat(muestra.temperatura_coccion) || null,
      muestra.hora_inicial_enfriamiento, muestra.hora_final_enfriamiento,
      tiempo_calculado, parseFloat(muestra.temperatura_final_enfriamiento) || null,
      muestra.nro_termometro, muestra.responsable_elaboracion, muestra.sabor,
      muestra.olor, muestra.color, muestra.textura,
      muestra.responsable_sensorial, muestra.observacion
    ]);
  } finally {
    await statement.finalizeAsync();
  }
};

export const getMuestras = async () => {
  const db = getDb();
  const allRows = await db.getAllAsync('SELECT * FROM muestras ORDER BY id DESC');

  // Calculate status (Vigente, Vence Hoy, Vencido) and format numerical values
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return allRows.map(row => {
    let estado = "Vigente";
    if (row.fecha_descarte) {
      // Split YYYY-MM-DD
      const [year, month, day] = row.fecha_descarte.split('-').map(Number);
      const fd = new Date(year, month - 1, day);

      if (fd < hoy) {
        estado = "Vencido";
      } else if (fd.getTime() === hoy.getTime()) {
        estado = "Vence Hoy";
      }
    }

    return {
      ...row,
      estado,
      cantidad_muestra: row.cantidad_muestra != null ? Number(row.cantidad_muestra).toFixed(1) : null,
      cantidad_producto: row.cantidad_producto != null ? Number(row.cantidad_producto).toFixed(1) : null,
      temperatura_coccion: row.temperatura_coccion != null ? Number(row.temperatura_coccion).toFixed(1) : null,
      temperatura_final_enfriamiento: row.temperatura_final_enfriamiento != null ? Number(row.temperatura_final_enfriamiento).toFixed(1) : null,
    };
  });
};
