const { Pool } = require('pg')

const pool = new Pool({
    host: 'psql-container',
    user: 'postgres',
    password: 'postgres',
    database: 'firsttest',
    port: '5432'
})

const getProject = async (req, res) => {
    const response = await pool.query('SELECT * FROM projects');
    console.log(response.rows);
    res.send('proyecto re loco capo')
}

module.exports = {
    getProject
}