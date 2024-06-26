import promisePool from '../../utils/database.js';

const getMatches = async (username) => {
  try {
    const userTableName = 'user_' + username + '_matches';
    const [rows] = await promisePool.query(`SELECT id, homeTeam, awayTeam, homeScore, awayScore, guess  FROM ${userTableName}`);
    return rows;
  } catch (error) {
    console.error('Error in getMatches:', error);
    throw error;
  }
};

const winnerGuessed = async (username) => {
  try {
    const [rows] = await promisePool.query(`SELECT winner FROM users WHERE username = ?`, [username]);
    return rows[0].winner;
  } catch (error) {
    console.error('Error in selectWinnerByUsername:', error);
    throw error;
  }
};

const fetchPoints = async () => {
  try {
    const [rows] = await promisePool.query('SELECT username, points FROM users ORDER BY points DESC LIMIT 15');
    return rows;
  } catch (error) {
    console.error('Error in fetchPoints:', error);
    throw error;
  }
}

const setScore = async (matchId, guess, username) => {
  try {
    const userTableName = 'user_' + username + '_matches';
    const post = await promisePool.query(`UPDATE ${userTableName} SET guess = '${guess}' WHERE id = ${matchId}`);
  } catch (error) {
    console.error('Error in setScore:', error);
    throw error;
  }
}

const postWinner = async (winner, username) => {
  try {
    await promisePool.query(`UPDATE users SET winner = '${winner}' WHERE username = '${username}'`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const addMatchToDatabase = async (match) => {
  try {
    const {homeTeam, awayTeam, homeScore, awayScore} = match;
    const sql =`INSERT INTO matches (homeTeam, awayTeam, homeScore, awayScore) VALUES (?, ?, ?, ?)`;
    const params = [homeTeam, awayTeam, homeScore, awayScore];
    await promisePool.execute(sql, params);
  } catch (error) {
    console.error('Error in addMatchToDatabase:', error);
    throw error;
  }
};

const addResultToDatabase = async (result) => {
  try {
    const {homeTeam, awayTeam, homeScore, awayScore} = result;
    const sql = `UPDATE matches SET homeScore = ?, awayScore = ? WHERE homeTeam = ? AND awayTeam = ?`;
    const params = [homeScore, awayScore, homeTeam, awayTeam];
    await promisePool.execute(sql, params);
  } catch (error) {
    console.error('Error in addResultToDatabase:', error);
    throw error;
  }
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
  console.log('updateUserPoints function called'); // New console.log statement

  try {
    for (const user of users) {
      const username = user.username;
      if (typeof username !== 'string') {
        throw new Error('Username must be a string');
      }

      const userTableName = 'user_' + username + '_matches';
      console.log('Executing first SQL query'); // New console.log statement
      const [matches] = await promisePool.query('SELECT * FROM ??', [userTableName]);

      let points = 0;
      for (const match of matches) {
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
      }

      const [winnerData] = await promisePool.query('SELECT country FROM winner');
      const winner = winnerData.length > 0 ? winnerData[0].country : null;

      const [userData] = await promisePool.query('SELECT winner FROM users WHERE username = ?', [username]);
      const userWinnerGuess = userData.length > 0 ? userData[0].winner : null;

      if (winner && userWinnerGuess === winner) {
        points += 25;
      }
      await promisePool.query('UPDATE users SET points = ? WHERE username = ?', [points, username]);
    }
  } catch (error) {
    console.error('Error in updateUserPoints:', error);
    throw error;
  }
};


export {getMatches, fetchPoints, setScore, addMatchToDatabase, addMatchToUserTables, addResultToDatabase, addResultToUserTables, winnerGuessed, updateUserPoints, postWinner};
