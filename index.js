const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

io.on('connection', (socket) => {
    console.log(`Socket: ${socket.id} detectado`);
});

app.use('/', express.static(path.join(__dirname, 'public')));

const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;
const parser = new ReadLine();

//configuracion del objeto
const mySerial = new SerialPort('/dev/ttyUSB0',{
 baudRate: 9600
});

// Abrimos el puerto
mySerial.on('open', () => {
    console.log('Open Serial Port');
});

// recibimos los datos
mySerial.on('data', (data) => {
console.log(data.toString());
io.emit('arduino:data', {
    value: data.toString()
    });
});

// Si recibimos un error
mySerial.on('err', (err) => {
    console.log(err.message);
});

server.listen(3000, () => {
    console.log('server on port: ', 3000);   
});