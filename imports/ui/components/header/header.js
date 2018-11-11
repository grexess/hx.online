import './header.html';

Template.header.events({
    'click #menuOpen'(event, instance) {
        var x = document.getElementById("mySidebar");
        x.style.width = "100%";
        x.style.fontSize = "40px";
        x.style.paddingTop = "10%";
        x.style.display = "block";
    },

    'click #menuClose'(event, instance) {
        document.getElementById("mySidebar").style.display = "none";
    },

    'click #userVotings'(event, instance) {
        document.getElementById("mySidebar").style.display = "none";
    },

    'click #logoffBtn'(event, instance) {
        event.preventDefault();
        Meteor.logout();
        document.getElementById("mySidebar").style.display = "none";
    }
  });

  Template.header.helpers({
    userEmail: function(user) {
        if (user.emails && user.emails.length > 0) {
          return user.emails[0].address;
        }
        return 'no email';
      }
  });
