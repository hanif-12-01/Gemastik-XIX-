const fs = require('fs'); let f = 'D:/LOMBA/GEMASTIK/ecothread-mitra-react/src/App.jsx'; let c = fs.readFileSync(f, 'utf8'); c = c.replace(/\\\/g, '\').replace(/\\\$/g, '$'); fs.writeFileSync(f, c);
