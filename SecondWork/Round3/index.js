const fs = require('fs');

function rotateIfNeeded(logPath, limitBytes) {

       if (!fs.existsSync(logPath)) {
        console.log(`No log file yet at ${logPath} -- nothing to rotate`);
        return;
    }


const stats = fs.statSync(logPath);

if(stats.size <= limitBytes){
    console.log(`${logPath} is 0 bytes -- under the limit, no rotation needed.`);
    return;
}
  const rotatedPath = logPath + '.1';

    fs.renameSync(logPath, rotatedPath);
    fs.writeFileSync(logPath, '');

    console.log('Log rotated');
     
}

const log = process.argv[2];
rotateIfNeeded(log,100);