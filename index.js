const core = require('@actions/core');
const wait = require('./wait');
const github = require('@actions/github');
const request = require('request');

// most @actions toolkit packages have async methods
async function run() {
  try { 
    const token = core.getInput('colony_token');
    const account = core.getInput('colony_account');
    const space = core.getInput('colony_space');
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    //console.log(`The event payload: ${payload}`); 
    var url = 'https://' + account + '.cloudshellcolony.com/api/spaces/'+space ;
    var id = ''
    request.post(url+'/sandbox',{
       json: {
        sandbox_name: 'test',
        blueprint_name: 'movies-dev-env',
        description: 'test',
        automation: 'true',
        duration: 'P0Y0M0DT2H0M0S',
        inputs: {
          DB_USER: 'user',
          DB_PASS: 'test123@',
          DB_NAME: 'test',
          INSTACES: '1'

        }}
      })
    .auth(null, null, true, token)
    .on('response', function(response) {
      core.setOutput('result', response.statusCode);
      console.log(response.statusCode); // 200
          // unmodified http.IncomingMessage object
      response.on('data', function(data) {
        // compressed data as it is received
        console.log('received ' + data.length + ' bytes of compressed data');
        id = JSON.parse(data.toString()).id;

      })

    });

    request.get(url+'/sandbox/' + id)
    .auth(null, null, true, token)
    .on('response', function(response) {
      core.setOutput('result', response.statusCode);
      console.log(response.statusCode); // 200
          // unmodified http.IncomingMessage object
      response.on('data', function(data) {
        // compressed data as it is received
        console.log('received ' + data.length + ' bytes of compressed data');
        status = JSON.parse(data.toString()).sandbox_status;
        console.log('status ' + status);
        status_details = JSON.parse(data.toString()).status_details;
        console.log('status details ' + status_details);
      })
    });

    core.setFailed('blah');
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
