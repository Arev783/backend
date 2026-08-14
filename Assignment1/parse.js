const fs = require('fs');

const buf = fs.readFileSync('records.bin');

const magic = buf.toString('ascii',0,4);
const vers = buf.readUInt8(4);
if(magic !== "SNSR" || vers !== 1){
    throw new Error("Magic bytes dont equal SNSR and invalid version");
}
console.log("File format valid (SNSR v1)");

const recordCount = buf.readUInt16BE(5);
console.log(`Records parsed: ${recordCount}`);

const records = [];

for (let i = 0; i < recordCount; i++) {
  const offset = 7 + i * 9;
  const timestamp = buf.readUInt32BE(offset);
  const temperature = buf.readFloatBE(offset + 4);
  const sensorId = buf.readUInt8(offset + 8);

  records.push({
    timestamp: new Date(timestamp * 1000), 
    temperature,
    sensorId
  });
}

let sum = 0;

for(let i = 0;i<records.length;++i){
    sum += records[i].temperature;
}

const avg = sum / records.length;

console.log(`Average temperature: ${avg.toFixed(2)}°C`);

const map = new Map();
for(let i = 0;i<records.length;++i){
   map.set(records[i].sensorId,(map.get(records[i].sensorId) || 0) + 1);
}
const arr = Array.from(map.values());
let res;
const max = Math.max(...arr);
for(const [key,val] of map){
    if(val === max){
         res = key;
        break;
    }
}
console.log(`Most active sensor: #${res} (${max} readings)`);

