import * as fs from 'fs';

const directories = [
    './Logs'
];

const files = [
    // './logs/test.log'
];

for (const dir of directories) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

for (const file of files) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '');
    }
}