document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form');
  const userList = document.getElementById('user-list');
  const reposList = document.getElementById('repos-list');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    userList.innerHTML = ''; // Clear previous search results
    reposList.innerHTML = ''; // Clear previous repositories

    const searchInput = document.getElementById('search').value;
    if (!searchInput) return; // Ignore empty search queries

    fetch(`https://api.github.com/search/users?q=${searchInput}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch user data.');
      }
      return response.json();
    })
    .then(data => {
      if (data.items && data.items.length > 0) {
        data.items.forEach(user => {
          const userItem = document.createElement('li');
          userItem.innerHTML = `
            <div class="user-info">
              <img src="${user.avatar_url}" alt="${user.login}" />
              <div class="user-details">
                <h3><a href="${user.html_url}" target="_blank">${user.login}</a></h3>
              </div>
            </div>
          `;
          userItem.addEventListener('click', () => {
            fetchUserRepos(user.login);
          });
          userList.appendChild(userItem);
        });
      } else {
        userList.innerHTML = 'No matching users found.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      userList.innerHTML = 'An error occurred while fetching data.';
    });
  });

  function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch repository data.');
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 0) {
        reposList.innerHTML = ''; // Clear previous repositories
        data.forEach(repo => {
          const repoItem = document.createElement('li');
          repoItem.innerHTML = `
            <div class="repo-info">
              <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
              <p>${repo.description}</p>
            </div>
          `;
          reposList.appendChild(repoItem);
        });
      } else {
        reposList.innerHTML = 'No repositories found for this user.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      reposList.innerHTML = 'An error occurred while fetching repository data.';
    });
  }
});
