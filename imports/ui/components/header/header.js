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

    'click #logoffBtn'(event, instance) {
        event.preventDefault();
        Meteor.logout();
        document.getElementById("mySidebar").style.display = "none";
    }
  });
