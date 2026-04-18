const fs = require('fs');
const filepath = 'D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');

content = content.replace(
`    </div>
  );

  // Blockchain View`,
`    </div>
  );
};

  // Blockchain View`
);

content = content.replace(
`    </div>
  );

  const FinanceMitraView`,
`    </div>
  );
};

  const FinanceMitraView`
);

fs.writeFileSync(filepath, content);
console.log('Fixed closures');
