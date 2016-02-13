import ServerActions from '../actions/ServerActions';

const post = (url, body) => fetch(url, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(body || {}),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}).then(res => {
  res.json().then(res => {
    ServerActions.receiveLinks(res.data.links);
  });
});

const API = {
  fetchLinks() {
    const query = {
      query: `{
        links {
          _id
          title
          url
        }
      }`
    };
    post('/graphql', query);
  }
};

export default API;
