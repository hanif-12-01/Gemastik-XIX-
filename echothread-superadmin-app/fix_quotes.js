const fs = require('fs');
const filepath = 'D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx';
let text = fs.readFileSync(filepath, 'utf8');

text = text.replace("} from \\'lucide-react\\';", "} from 'lucide-react';");

fs.writeFileSync(filepath, text);
console.log("Fixed quotes");