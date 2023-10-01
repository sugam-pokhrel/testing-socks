const express=require("express");

const {Server}=require('socket.io')
const bodyParser=require("body-parser");

const io=new Server({cors:true});

const app=express();

app.use(bodyParser.json());
const emailToSocketMapping=new Map();

 
io.on('connection',(socket)=>{
   
    socket.on('disconnect',()=>{
        console.log("socket is disconnected");
    })
    socket.on('message',(msg)=>{
        console.log(msg);
        io.emit('message-broadcast',msg);
    })
    socket.on('join-room',(data)=>{
        console.log('user',data.username,'joined room',data.room_id)
        const {room_id,username}=data;
        emailToSocketMapping.set(username,socket.id);
        socket.join(room_id);
        socket.broadcast.to(room_id).emit('user-connected',username);
    })
} 
)




app.listen(8000,()=>{
    console.log("server is running on port 8000");
}
);
io.listen(8001,()=>{
    console.log("socket is running on port 8001");
}
);