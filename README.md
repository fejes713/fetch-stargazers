# fetch-stargazers 🔬

> Generate CSV file of all stargazers from one repository 

### Why does this exist?
I was always interested in what my repository's stargazers build on GitHub. Navigating through GitHub's UI is a bit hard and tiresome when a repository has a few thousand stars. This little script fetches public user data from GitHub's GraphQL API and writes it to a CSV file that you can read more easily. 


### Problem with the REST solution?
Problem with fetching all users via GitHub's API v3 is that I needed an HTTP call for each user. That wouldn't work since repositories like [30-seconds-of-code](30-seconds-of-code) have nearly 50.000 stargazers, and GitHub only allows 5.000 requests per hour. The program would be slow and inefficient to use if we wanted to query multiple repositories in a short period.

### Solution
GitHub introduced GraphQL version of their API, which allows to query up to 100 users in a single request. The fetch-stargazers uses a new version of GitHub's API to efficiently query all stargazers and write them to a CSV file. 

### How to use?

1. Clone repository: `git@github.com:fejes713/fetch-stargazers.git`
2. `npm install`
3. `npm run` and fill in required configuration

You can find access token, required to access API, under GitHub's account settings.




