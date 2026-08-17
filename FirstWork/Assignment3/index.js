
const fs = require('fs/promises');
const { join } = require('path');

const env = process.argv[2];
const override = `config.${env}.json`;

async function loadBase(name){

    try{
        const json = await fs.readFile(name,'utf-8');
        return JSON.parse(json);
    }catch(err){
        throw new Error(`Failed to load required base config "${name}": ${err.message}`);
    }
}

async function loadOverride(name){
    try{
       const json = await fs.readFile(name,'utf-8');
        return JSON.parse(json);
    }catch(err){
        if(err.code === 'ENOENT'){
            console.log(`Warning: override file "${name}" not found, continuing with base config only.`);
            return {};
        }else{
            throw new Error(`Failed to parse override config "${name}": ${err.message}`);
        }
    }
}
async function main(){
    const env = process.argv[2];
    const base = await loadBase('config.base.json');
    const override = await loadOverride(`config.${env}.json`)
    let  merged = copy(base,override);
    merged = JSON.stringify(merged,null,2);
    await fs.writeFile('config.final.json.tmp',merged);
    await fs.rename('config.final.json.tmp','config.final.json');
}

function isObject(value){
    return(
        value!==null && typeof value === 'object' && !Array.isArray(value)
        )
}

function copy(base,override){
const res = {...base};
for(const key in override){
    if(isObject(base[key]) && isObject(override[key])){
         res[key] = copy(base[key],override[key]);
    }else{
        res[key] = override[key];
    }
}
return res;
}

main().catch(error => {
    console.error(error.message);
    process.exit(1);
});