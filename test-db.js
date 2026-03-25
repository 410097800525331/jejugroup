const mysql = require('mysql2/promise');

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234'
    });
    
    await connection.query('DROP DATABASE IF EXISTS jejugroup_db;');
    await connection.query('CREATE DATABASE jejugroup_db DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;');
    console.log('Database jejugroup_db recreated successfully.');

    await connection.end();
  } catch (e) {
    console.error(e);
  }
}

run();
