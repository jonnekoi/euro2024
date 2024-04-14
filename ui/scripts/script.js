'use strict';

const url = 'http://localhost:3000/v1';

const addUserForm = document.querySelector('#add-user-form');
const formContainer = document.querySelector('#form-container');
const logOutButton = document.querySelector('#logoutButton');
const tableContainer = document.querySelector('.table-container');
const pointsTableContainer = document.querySelector('#points-table-container');
const loginForm = document.querySelector('#login-form');
const logOut = document.querySelector('#logoutButton');

// get user from sessionStorage
let user = JSON.parse(sessionStorage.getItem('user'));

addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  data.role = 'user';
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  //console.log(data);
  const response = await fetch(url + '/auth/register', fetchOptions);
  console.log('virhe', response);
  const json = await response.json();
  startApp(true);
});

loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  if (!json.user) {
    alert(json.error.message);
  } else {
    // save token and user
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    user = JSON.parse(sessionStorage.getItem('user'));
    startApp();
  }
});

logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  confirm('Are you sure?');
  stopApp();
});

const getMatches = async () => {
  try {
    const response = await fetch(url + '/get/matches')
    if(!response.ok) {
      throw new Error("Error", response.statusText);
    }
    const rows = await response.json();

    const tableRows = rows.map((row) => {
      return `<tr>
                <td>${row.homeTeam}</td>
                <td>${row.awayTeam}</td>
                <td>${row.homeScore || ''}-${row.awayScore || ''}</td>
                <td><input type="text" name="guess" placeholder="e.g. 1-1" class="light-border guess-input"></td>
              </tr>`;
    }).join('');
    document.getElementById('matchesData').innerHTML = tableRows;
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    document.getElementById('matchesData').innerHTML = `<tr><td colspan="4">Error loading matches.</td></tr>`;
  }
}

const getPoints = async () => {
  try {
    const response = await fetch(url + '/get/points')
    if(!response.ok) {
      throw new Error("Error", response.statusText);
    }
    const rows = await response.json();

    const tableRows = rows.map((row) =>{
      return `<tr>
                <td>${row.username}</td>
                <td>${row.points}</td>
              </tr>`;
    }).join('');
    document.getElementById('pointsData').innerHTML = tableRows;
  } catch (error) {
    console.error('Failed to fetch points:', error);
    document.getElementById('pointsData').innerHTML = `<tr><td colspan="4">Error loading points.</td></tr>`;
  }
}

async function startApp(){
  formContainer.style.display = 'none';
  logOutButton.style.display = 'block';
  await getMatches();
  await getPoints();
  tableContainer.style.display = 'block';
  pointsTableContainer.style.display = 'block';
}

function stopApp(){
  tableContainer.style.display = 'none';
  pointsTableContainer.style.display = 'none';
  formContainer.style.display = 'block';
  logOutButton.style.display = 'none';
}

