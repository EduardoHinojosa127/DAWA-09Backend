const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Conexión a la base de datos
mongoose.connect('mongodb://localhost/tareas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(error => console.error('Error al conectar a la base de datos:', error));

// Definición del esquema de la tarea
const tareaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  }
});

// Definición del modelo de la tarea
const Tarea = mongoose.model('Tarea', tareaSchema);

// Creación de la aplicación Express
const app = express();
app.use(express.json());

// Configuración de CORS
app.use(cors());

// Ruta para obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Ruta para crear una nueva tarea
app.post('/tareas', async (req, res) => {
  try {
    const tarea = new Tarea({ nombre: req.body.nombre });
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// Ruta para actualizar una tarea
app.put('/tareas/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, { nombre: req.body.nombre }, { new: true });
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// Ruta para eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
