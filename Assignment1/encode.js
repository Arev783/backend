
const fs = require('fs');

const headBuf = Buffer.alloc(7);

headBuf.write('SNSR',0,'ascii');
headBuf.writeUInt8(1,4);
headBuf.writeUInt16BE(10,5);

const res = [];

const baseTimestamp = Math.floor(Date.now() / 1000);

for(let i = 0 ;i<10;++i){
    res.push({
        timeStamp : baseTimestamp + i * 10,
        temperature : Math.floor(18 + Math.random() * 10),
        sensoreId : (i % 3) + 1

    })
}

const buf = Buffer.alloc(97);
headBuf.copy(buf);

for(let i = 0;i<10;++i){
    const offset = 7 + i * 9;
    buf.writeUInt32BE(res[i].timeStamp,offset);
    buf.writeFloatBE(res[i].temperature,offset + 4);
    buf.writeUInt8(res[i].sensoreId,offset + 8);
  
}
fs.writeFileSync('records.bin',buf);
console.log('records.bin created!');
