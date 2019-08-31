const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fetch = require('node-fetch');
const prompt = require('prompt');

// Ask for script configuration
prompt.start();

prompt.get(['username', 'repository', 'token'], function (err, result) {
  const { username, repository, token } = result;

  fetchStargazers({ username, repository, token });
});

async function fetchStargazers({ username, repository, token }) {
  const csvWriter = createCsvWriter({
    path: `${username}-${repository}.csv`,
    header: [
      { id: 'name', title: 'Name' },
      { id: 'username', title: 'Username' },
      { id: 'followers', title: 'Followers' }
    ]
  });

  let usersFetched = 0;
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const usersInfo = await getUsersInfo({ username, repository, token, endCursor });

    hasNextPage = usersInfo.hasNextPage;
    endCursor = usersInfo.endCursor;

    await csvWriter.writeRecords(usersInfo.stargazers)
    usersFetched += usersInfo.stargazers.length;
    console.log(`Fetched ${usersFetched} users so far!`);
  }

  console.log(`Successfuly fetched stargazer data in ${username}-${repository}.csv`);
}

async function getUsersInfo({ username, repository, token, endCursor }) {
  const endCursorForQuery = endCursor ? `"${endCursor}"` : null;

  const query = `
  query { 
    repository(owner:"${username}" name:"${repository}") {
      id
      stargazers(first: 100, after: ${endCursorForQuery} ){
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            login
            name
            followers {
              totalCount
            }
          }
          cursor
        }
      }
    }
  }
  `;

  const usersResponse = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      "Authorization": `token ${token}`
    },
    body: JSON.stringify({ query }),
  });

  const response = await usersResponse.text();
  const parsedResponse = JSON.parse(response);
  const stargazers = parsedResponse.data.repository.stargazers;

  return {
    hasNextPage: stargazers.pageInfo.hasNextPage,
    endCursor: stargazers.pageInfo.endCursor,
    stargazers: stargazers.edges.map(({ node: user }) => ({
      id: user.id,
      name: user.name,
      username: user.login,
      followers: user.followers.totalCount
    }))
  }
}