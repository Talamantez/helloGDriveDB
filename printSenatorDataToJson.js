console.log('running app');

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    authorize(JSON.parse(content), listSenatorDetails);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    console.log('authorizing');
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    console.log('getting new token');
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    console.log('storing token');
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print data from the Senator Address spreadsheet:
 * https://docs.google.com/spreadsheets/d/1riS63DOPbLO8doaKNJK8aYYon2FxvrsuetP6nia_NrA
 */
function listSenatorDetails(auth) {

    var senatorsByLastName = {};

    var sheets = google.sheets('v4');

    sheets.spreadsheets.values.get({

        auth: auth,
        spreadsheetId: '1riS63DOPbLO8doaKNJK8aYYon2FxvrsuetP6nia_NrA',
        range: 'A2:H'

    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        var rows = response.values;

        if (        rows.length == 0   ) {
            console.log('No data found.');
        }

        else if (   rows[1][0] !== '0'    ) {
            console.log('the Google Doc referenced is not formatted correctly: The first column (sen_id) of the first row should be a string \'0\' currently it equals ' + rows[0][0]);          
        }

        else {
            var storedIndex = 'initVal';
            var senatorId = 0;

            for (var i = 1; i < rows.length; i++) {
                var row = rows[i];

                // Uncomment the following lines to Debug
                // console.log( 'row[0]: ' + row[0] );
                // console.log( 'storedIndex: ' + storedIndex );
                
                if( row[0] == storedIndex ){
                    // do nothing, move on to next row
                    storedIndex = row[0];
                }
                else if ( row[0] == '0' ){
                    senatorsByLastName[ senatorId.toString() ] = row[2];
                    senatorId += 1;
                    storedIndex = row[0];                 

                } else {
                    // console.log(row[2]);
                    // add the senator's last name to the 'Senators' object
                    senatorsByLastName[senatorId] = row[2];
                    senatorId += 1;
                    // store the index to compare to next loop
                    storedIndex = row[0];
                }

            }
            console.log(senatorsByLastName);
        }

    });
}
