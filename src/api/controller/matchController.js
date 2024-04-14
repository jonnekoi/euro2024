import {getMatches, fetchPoints} from '../models/match-model.js';

const postMatches = async (req, res) => {
  const result = await getMatches();
  console.log(result);
  if(result){
    res.send(result);
  }
}

const getPoints = async (req, res) => {
  const result = await fetchPoints();
  console.log(result);
  if(result){
    res.send(result);
  }
}

export {postMatches, getPoints};
