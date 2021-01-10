let express = require('express');
let request = require('request');
let querystring = require('querystring');
const fetch = require('node-fetch');
let app = express();

let port = process.env.PORT || 8888;
const client_id = 'e9c3676278ee431694c8c5bcb7eb6e63'; // Your client id
const client_secret = '612a7dcaaed94639aa0599b0597bbf71'; // Your secret
const redirect_uri = `http://localhost:8888/callback`; // Your redirect uri

app.get('/', (req, res) => {
    res.send("hi there");
});

app.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: 'user-read-private user-read-email',
        redirect_uri
      }))
});


app.get('/callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(
            client_id + ':' + client_secret
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      var access_token = body.access_token;
        fetch('https://api.spotify.com/v1/me', {
            headers : {
                'Authorization': 'Bearer ' + access_token
            }
        })
        .then(response => response.json())
        .then(data => res.json(data));
    })
});

app.listen(port, (req, res) => {
    console.log(`App started, listening on ${port}`);
});