import ServerActions from '../actions/ServerActions';

const post = (url, body) => fetch(url, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(body || {}),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}).then(res => res.json());

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
    post('/graphql', query).then(res => {
      ServerActions.receiveLinks(res.data.links);
    });
  }
};

export default API;
