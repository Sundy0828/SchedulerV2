import 'isomorphic-fetch';

export const API = {
  post: (path, payload, token) => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    };

    return fetch('http://localhost:1337/v1' + path, { // change to env
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }).then((res) => {
      return res.json().then(json => ({ json, res }));
    }).then(({json, res}) => {
      if (!res.ok) {
        return Promise.reject(json);
      }

      return json;
    });
  }
};