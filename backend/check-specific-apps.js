const db = require('./db');

async function checkApps() {
    try {
        const res = await db.query('SELECT id, ai_score, ai_decision FROM adoption_applications WHERE id IN (47, 48, 49, 50, 51)');
        console.log('Applications found:', res.rows);
    } catch (e) {
        console.error(e);
    }
}

checkApps();
