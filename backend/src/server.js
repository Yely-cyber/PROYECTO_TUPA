// Importamos la librería Express previamente instalada
// require() permite utilizar módulos externos dentro del proyecto
const express = require('express')
// Creamos una instancia de la aplicación Express
// Esta variable representará nuestro servidor backend
const app = express()
// Definimos una ruta principal utilizando el método GET
// '/' representa la ruta raíz del servidor
// Cuando un cliente acceda a localhost:3000 se ejecutará esta función
app.get('/', function (req, res) {
    // Enviamos una respuesta al cliente
    // res.send() permite devolver texto o contenido simple
    res.send("Servidor backend funcionando correctamente")
})
// Iniciamos el servidor en el puerto 3000
app.listen(3000, function () {
    // Mensaje mostrado en consola cuando el servidor inicia correctamente
    console.log("Servidor ejecutándose en http://localhost:3000")
})