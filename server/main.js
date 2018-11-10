// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

Meteor.call('readit',function(err,response){
    console.log(response);
});