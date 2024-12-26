const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
})

/**
 * Plucks a single key from an array of objects.
 * @param {Object[]} rows - The array of objects to pluck from.
 * @returns {any[]} - An array of the values of the plucked key.
 * @throws {TypeError} - If the rows are not an array.
 * @throws {Error} - If the rows are empty.
 * @throws {Error} - If the rows have more than one key.
 */
const pluck = (rows) => {
	if (!Array.isArray(rows)) throw new TypeError('Rows must be an array');
	if (rows.length === 0) return [];
	if (Object.keys(rows[0]).length !== 1) throw new ValueError('Rows must have only one key');

	const key = Object.keys(rows[0])[0];
	return rows.map((row) => row[key]);
}

/**
 * Executes a query and optionally plucks results.
 * @param {any} connection - The database connection or pool.
 * @param {string} query - The SQL query.
 * @param {Array} params - The query parameters.
 * @param {Function} method - The query or execute method to use.
 * @param {boolean} pluck - Whether to pluck results.
 */
const runQuery = async (connection, query, params,method='query', pluck=false) => {
	if (!method in ['query', 'execute']) throw new Error('Invalid method');

	const [results] = await connection[method](query, params);
	return pluck ? pluck(results) : results;
};


module.exports = {
	pool,
	query: async (query, params, pluck=false) => 
		runQuery(pool, query, params),
	execute: async (query, params, pluck=false) =>
		runQuery(pool, query, params, method='execute'),
		
	transaction: async (callback) => {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			const result = await callback(connection);
			await connection.commit();
			return result;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	},
}
