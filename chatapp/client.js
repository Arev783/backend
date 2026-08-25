const net = require('node:net');
let state = false;
let messange;
let username;
let buffer = '';
const client = net.createConnection({
host:process.env.HOST,
port: Number(process.env.PORT)
});

client.on('data',(data)=>{
     buffer+=data;
             let index;

    while ((index = buffer.indexOf('\n')) !== -1) {
        const text = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
    
    messange = text;
    if(messange.startsWith('Connected as')){
        state = true;
    }
    console.log(text.toString());
}
})

process.stdin.on('data',(data)=>{
              if(!state){
              username = data;
              }
                client.write(data);
              
})

client.on('error',(err)=>{
    console.log(err.message);
})

client.on('end',()=>{
    process.exit();
});
