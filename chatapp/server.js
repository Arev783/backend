const net = require('node:net');
const PORT = Number(process.env.PORT);
const clients = new Map();
const server = net.createServer((socket)=>{
     let username = null;
     let buffer = '';
 socket.write("Send your username\n");
   socket.setEncoding('utf8');
     socket.on('close', () => {
        if (username) removeClient(username, socket);
    });
    socket.on('data',(data)=>{
        buffer+=data;

            if (buffer.length > 10000) {
    socket.write("Message too long\n");
    socket.destroy();
    return;
}
             let index;

    while ((index = buffer.indexOf('\n')) !== -1) {
        let message = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
   message = message.replace(/\r$/, '');
         const name = message.trim();
         if(username === null){
            if(name === ""){
                socket.write("This username is empty try again\n");
            }
     else if(!(clients.has(name))){
        username = name;
   clients.set(name,socket);
   socket.write(`Connected as ${name}\n`);
          }else{
            socket.write("This username already has try again\n");
          }
         }else{
       if(message === '/quit'){
        socket.end();
        return;
         }else if(message.split(' ')[0] === '/who'){
            for(const user of clients.keys()){
                    socket.write(`${user}\n`);
            }
         }
           else if( message.split(' ')[0] !== '/msg'){
                broadcast(message,socket,username);
            }else{
sendPrivateMessage(message,username,socket);
            }
         }

    }
  
    })
 socket.on('error',(err)=>{
    console.log(err.message);
  })

    socket.on('end',()=>{
        console.log(`${socket} is disconected`);
    })
})

server.listen(PORT,()=>{
    console.log(`Server is running in port: ${PORT}`);
})

function broadcast(messange,sendersocket,senderUsername){
    for(const socket of clients.values()){
        if(socket !== sendersocket){
             socket.write(`${senderUsername}: ${messange}\n`);
        }
    }
}

function sendPrivateMessage(messange,senderusername,sendersocket){
    
    const parts = messange.split(' ');
    const text =  parts.slice(2).join(' ');
    const targetsocket = clients.get(parts[1]);
if(text){
 if (!targetsocket) {
    sendersocket.write("This user dont exist\n" );
}else{
        targetsocket.write(`[DM from ${senderusername}]:${text}\n`);
        sendersocket.write(`[you -> ${parts[1]}]:${text}\n`);
    }
}else{
     sendersocket.write("Invalid message\n");
}

}

function removeClient(username, sendersocket) {
    for (const socket of clients.values()) {
        if (socket !== sendersocket) {
            socket.write(`${username} left the chat\n`);
        }
    }
    clients.delete(username);
}

