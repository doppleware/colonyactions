const core = require('@actions/core');
const wait = require('./wait');
const github = require('@actions/github');

function get_sandbox_details(url, token,id, callback){
    var request = require('request');

    var status = ''
    var details = ''
    request.get(url+'/sandbox/' + id)
    .auth(null, null, true, token)
    .on('response', function(response) {
          // unmodified http.IncomingMessage object
      response.on('data', function(data) {
        // compressed data as it is received
        details += data.toString()
      })

      response.on('end', function(data) {
        // compressed data as it is received
        callback(JSON.parse(details)[0])
      })

    });


}

function get_sandbox_details_recursive(url, token,id){

     get_sandbox_details(url, token, id, 
            function (status){
              done = false
              if (status.sandbox_status=='Ended'){
                 core.setFailed('Blueprint failed policy validation');
                 done = true
              }

              if (status.status_details!='' && status.status_details!='Waiting'){
                 core.setOutput('Approved');
                 done = true
              }

              if (done == false){
                setTimeout(function() {
                  get_sandbox_details_recursive(url,token,id);
                },1500)
              }

            });


}
// most @actions toolkit packages have async methods
async function run() {
  try { 
    var request = require('request');

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
          // unmodified http.IncomingMessage object
      response.on('data', function(data) {
        // compressed data as it is received
        id = JSON.parse(data.toString()).id;

      });

    });

    get_sandbox_details_recursive(url,token,id)

   
    
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
