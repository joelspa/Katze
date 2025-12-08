// Ver constraint de adoption_status
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function checkConstraint() {
    try {
        const result = await pool.query(`
            SELECT check_clause 
            FROM information_schema.check_constraints 
            WHERE constraint_name = 'cats_adoption_status_check'
        `);
        
        console.log('\n📋 Constraint de adoption_status:');
        console.log(result.rows[0].check_clause);
        console.log('');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkConstraint();
