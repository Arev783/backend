const fs = require('fs');
const shift = Number(process.argv[2]);
const buffer = fs.readFileSync('input.txt');

    for(let i = 0;i<buffer.length;++i){
        const byte = buffer[i];
        if( byte >= 97 && byte <= 122){
          buffer[i] =  97 + ((( byte - 97 + shift)%26 +26)%26);
           
        }
       else  if( byte >= 65 &&  byte <= 90){
         buffer[i] =  65 + ((( byte- 65 + shift)%26 +26)%26);
        }
    }
fs.writeFileSync('output.txt',buffer);