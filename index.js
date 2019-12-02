const core = require('@actions/core');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const token = core.getInput('colony_token');
    const account = core.getInput('colony_account');
    const space = core.getInput('colony_space');
    var request = require('request');
    var url = 'http://' + account + '.cloudshellcolony.com/api/spaces/'+space;
    request.get(url + '/blueprints')
    .auth(null, null, true, token)
    .on('response', function(response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type']) // 'image/png'
    })
    core.setOutput('result', response.statusCode);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
