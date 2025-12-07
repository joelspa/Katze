const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'katze', 
    password: 'root', 
    port: 5432 
});

pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'adoption_applications' ORDER BY ordinal_position`)
    .then(res => { 
        console.log('Columnas de adoption_applications:'); 
        res.rows.forEach(r => console.log('  -', r.column_name)); 
        pool.end(); 
    })
    .catch(e => { 
        console.error(e.message); 
        pool.end(); 
    });
