import promisePool from '../../utils/database.js';

const getMatches = async (username) => {
  const userTableName = 'user_' + username + '_matches';
  const [rows] = await promisePool.query(`SELECT id, homeTeam, awayTeam, homeScore, awayScore, guess  FROM ${userTableName}`);
  return rows;
};

const fetchPoints = async () => {
  const [rows] = await promisePool.query('SELECT username, points FROM users ORDER BY points DESC LIMIT 5');
  return rows;
}

const setScore = async (matchId, guess, username) => {
  const userTableName = 'user_' + username + '_matches';
  const post = await promisePool.query(`UPDATE ${userTableName} SET guess = '${guess}' WHERE id = ${matchId}`);
}

const addMatchToDatabase = async (match) => {
  const {homeTeam, awayTeam, homeScore, awayScore} = match;
  const sql =`INSERT INTO matches (homeTeam, awayTeam, homeScore, awayScore) VALUES (?, ?, ?, ?)`;
  const params = [homeTeam, awayTeam, homeScore, awayScore];
  await promisePool.execute(sql, params);
};

const addResultToDatabase = async (result) => {
  const {homeTeam, awayTeam, homeScore, awayScore} = result;
  const sql = `UPDATE matches SET homeScore = ?, awayScore = ? WHERE homeTeam = ? AND awayTeam = ?`;
  const params = [homeScore, awayScore, homeTeam, awayTeam];
  await promisePool.execute(sql, params);
}

const addResultToUserTables = async (result, users) => {
  const {homeTeam, awayTeam, homeScore, awayScore} = result;
  for (const user of users) {
    const tableName = `user_${user.username}_matches`;
    const sql = `UPDATE ${tableName} SET homeScore = ?, awayScore = ? WHERE homeTeam = ? AND awayTeam = ?`;
    const params = [homeScore, awayScore, homeTeam, awayTeam];
    try {
      await promisePool.execute(sql, params);
      console.log(`Result added to ${tableName}`);
    } catch (error) {
      console.error(`Error adding match to ${tableName}:`, error);
    }
  }
};

const addMatchToUserTables = async (match, users) => {
  const { homeTeam, awayTeam, homeScore, awayScore } = match;
  for (const user of users) {
    const tableName = `user_${user.username}_matches`;
    const sql = `INSERT INTO ${tableName} (homeTeam, awayTeam, homeScore, awayScore) VALUES (?, ?, ?, ?)`;
    const params = [homeTeam, awayTeam, homeScore, awayScore];

    try {
      await promisePool.execute(sql, params);
    } catch (error) {
      console.error(`Error adding match to ${tableName}:`, error);
    }
  }
};

const updateUserPoints = async (users) => {
  for (const user of users) {
    const username = user.username;
    const userTableName = 'user_' + username + '_matches';
    const [matches] = await promisePool.query(`SELECT * FROM ${userTableName}`);
    let points = 0;
    matches.forEach(match => {
      const guess = match.guess;
      if (guess !== null) {
        if (match.homeScore + '-' + match.awayScore === guess) {
          points += 5;
        } else {
          const [matchHomeScore, matchAwayScore] = [match.homeScore, match.awayScore];
          const [guessHomeScore, guessAwayScore] = guess.split('-').map(Number);
          if ((matchHomeScore > matchAwayScore && guessHomeScore > guessAwayScore) ||
              (matchHomeScore < matchAwayScore && guessHomeScore < guessAwayScore) ||
              (matchHomeScore === matchAwayScore && guessHomeScore === guessAwayScore)) {
            points += 2;
          }
        }
      }
    });

    const [userData] = await promisePool.query(`SELECT * FROM users WHERE username = ?`, [username]);
    if (userData.length > 0) {
      const userPoints = points;
      await promisePool.query(`UPDATE users SET points = ? WHERE username = ?`, [userPoints, username]);
    }
  }
}

export {getMatches, fetchPoints, setScore, addMatchToDatabase, addMatchToUserTables, addResultToDatabase, addResultToUserTables, updateUserPoints};
