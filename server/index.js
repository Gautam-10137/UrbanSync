const express= require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const bodyParser=require('body-parser');
const cors=require('cors');
const http=require('http');
const socketIO=require('socket.io');
const PASSWORD=process.env.DBPASSWORD;
const PORT=process.env.PORT;
const route=require('./routes/route');
const handleSocketConnection=require('./services/SocketHandler');

const app= express();
const socketServer= http.createServer(app);
const io = socketIO(socketServer, {
    cors: {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});

mongoose.connect(`mongodb+srv://pahwagautam47:${PASSWORD}@cluster0.ptoi0ie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error(`MongoDB Connection error: ${err}`);
})

// to serve static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin:['http://127.0.0.1:3000','http://localhost:3000'],
    method:['GET','POST','PUT','DELETE']
}));

// setting up socket.io handling
handleSocketConnection(io);

app.use('/api',route);

socketServer.listen(PORT, () => {
    console.log("Server is listening on port: " + PORT);
});