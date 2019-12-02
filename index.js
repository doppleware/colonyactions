const core = require('@actions/core');
const wait = require('./wait');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try { 
    const token = core.getInput('colony_token');
    const account = core.getInput('colony_account');
    const space = core.getInput('colony_space');
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`); 
    var request = require('request');
    var url = 'http://' + account + '.cloudshellcolony.com/api/spaces/'+space;
    request.get(url + '/blueprints')
    .auth(null, null, true, token)
    .on('response', function(response) {
      core.setOutput('result', response.statusCode);
      console.log(response.statusCode); // 200
      console.log(response.headers['content-type']); // 'image/png'

    });
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
