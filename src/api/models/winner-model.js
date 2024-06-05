import promisePool from '../../utils/database.js';

const addWinnerAdmin = async(winner) => {
  try {
    const sql = `INSERT INTO winner (country) VALUES (?)`;
    const params = [winner];
    await promisePool.execute(sql, params);
  } catch (error){
    console.log(error);
    throw error;
  }
}

const getWinnerAdmin = async(username) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM winner`);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export {addWinnerAdmin, getWinnerAdmin};
