// Import client startup through a single index entry point

import './routes.js';


Accounts.onLogin(function(user){
    if(user.type === "password"){
        $('#id01').hide();
        
    }
    $('#userName').text(Meteor.user().emails[0].address);
  });