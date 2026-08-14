
const fs = require('fs');
const path = require('path');
const chack = function (name){
   const res =  path.parse(name);
   if(res.name[0] === '.'){
     fs.mkdirSync(path.join('organized','hidden'),{ recursive: true });
     fs.copyFileSync(name,getAvailablePath(path.join('organized','hidden',res.base)));
   }else if(res.ext === ''){
     fs.mkdirSync(path.join('organized','no-extension'),{ recursive: true });
       fs.copyFileSync(name,getAvailablePath(path.join('organized','no-extension',res.base)));
   }else{
      fs.mkdirSync(path.join('organized',res.ext.slice(1)),{ recursive: true });
     fs.copyFileSync(name,getAvailablePath(path.join('organized',res.ext.slice(1),res.base)));
   }
}
const getAvailablePath = function (desiredPath){
if(!fs.existsSync(desiredPath)){
    return desiredPath;
}

const part = path.parse(desiredPath);

let counter = 1;
let newname = part.name + '-' + counter + part.ext;

while(fs.existsSync(path.join(part.dir,newname))){
    counter++;
    newname = part.name + '-' + counter + part.ext;
}

return path.join(part.dir,newname);

}

const walk = function(dirpath){
    const entry = fs.readdirSync(dirpath,{withFileTypes:true});
    for(const ent of entry){
        const fullpath = path.join(dirpath,ent.name);
        if(ent.isDirectory()){
            walk(fullpath);
        }else if(ent.isFile()){
            chack(fullpath);
        }
    }
}
walk('messy');

