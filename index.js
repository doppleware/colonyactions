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
    end_time = new Date();
    end_time.setHours(end_time.getHours() + 4);
    end_time_str = end_time.toISOString();
    var request = require('request');
    var url = 'http://' + account + '.cloudshellcolony.com/api/spaces/'+space;
    request.post(url + '/sandbox',{
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
      console.log(response); 
      console.log(response.text);// 'image/png'

    });
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
