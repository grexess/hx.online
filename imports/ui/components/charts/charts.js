import './charts.html';

import { Votings } from '../../../api/charts/votings.js';

var allCharts;
var tops = null;

/* Rebuild list with Voting area*/
Accounts.onLogin(function (user) {
    if (user.type === "password") {
        buildTop100($("#toptitle").text());
    }
})

/* Rebuild list without Voting area*/
Accounts.onLogout(function (user) {
    buildTop100($("#toptitle").text());
})

function selectYear(year) {
    //buildTop100(year);
    $("#toptitle").text(year);
}

Template.charts.helpers({
    votings() {
        return Votings.find({});
    },

    userEmail: function (user) {
        if (user.emails && user.emails.length > 0) {
            return user.emails[0].address;
        }
        return 'no email';
    }
});

Template.charts.onCreated(function () {

    Meteor.subscribe('votings');

    Meteor.call('getTop100', function (err, response) {
        allCharts = response;
        buildDropDownEntries();
    });
});

Template.charts.events({

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

    'click #top100'(event, instance) {
        document.getElementById("mySidebar").style.display = "none";
        $('.content').empty();
            buildDropDownEntries();
    },

    'click #hxVotings'(event, instance) {
        document.getElementById("mySidebar").style.display = "none";
        $('.content').empty();

    },

    'click #userVotings'(event, instance) {
        document.getElementById("mySidebar").style.display = "none";
        $('.content').empty();
    },

    'click #logoffBtn'(event, instance) {
        event.preventDefault();
        Meteor.logout();
        document.getElementById("mySidebar").style.display = "none";
    },

    'click .selectYear'(event) {
        event.preventDefault();
        buildTop100(event.currentTarget.dataset.year);
    },

    'click .w3-radio'(event) {

        var bAlreadyVoted = false;

        if (event.currentTarget.checked) {
            //check if this is already voted
            var topName = event.currentTarget.name;
            var topValue = event.currentTarget.value;
            var year = topValue.substr(0, topValue.indexOf('-'));
            var aYear = null;

            tops = Votings.findOne({ votedBy: Meteor.user().emails[0].address });

            if (tops) {

                if (tops[year]) {

                    aYear = tops[year];

                    for (i = 1; i <= 3; i++) {

                        if (aYear['top' + i] === topValue.substr(topValue.indexOf('-') + 1)) {
                            bAlreadyVoted = true;
                            break;
                        }
                    }
                }
            }


            if (bAlreadyVoted) {
                Bert.alert('Diesen Song hast Du schon gevoted!', 'danger', 'fixed-top');
                event.currentTarget.checked = false;
            } else {

                var song = topValue.substr(topValue.indexOf('-') + 1);
                var place = topName.substr(3);
                var id;

                //is place already voted update voting
                if (!tops) {
                    // Insert voting into into the collection
                    /*  id = Votings.insert({
                         votedBy: Meteor.user().emails[0].address,
                         year: year,
                         ['top' + place]: song,
                         createdAt: new Date(),
                     }, function (error, result) {
                         if (error) console.log(error); //info about what went wrong
                         if (result) {
                             buildVoteMessage(year, song, place);
                         } //the _id of new object if successful);
                     }); */
                    id = Votings.insert({
                        votedBy: Meteor.user().emails[0].address,
                        [year]: { ['top' + place]: song },
                        createdAt: new Date()
                    }, function (error, result) {
                        if (error) console.log(error); //info about what went wrong
                        if (result) {
                            buildVoteMessage(year, song, place);
                        } //the _id of new object if successful);
                    });
                } else {
                    //update or add place
                    var setObject = {};
                    setObject[year + ".top" + place] = song;
                    Votings.update({ _id: tops._id }, { $set: setObject }, function (error, result) {
                        if (error) console.log(error); //info about what went wrong
                        if (result) {
                            tops = Votings.findOne({ $and: [{ votedBy: Meteor.user().emails[0].address }, { year: year }] });
                            buildVoteMessage(year, song, place);
                        } //the _id of new object if successful);
                    });
                }
            }
        }
    }
});

function buildVoteMessage(year, song, top) {

    Meteor.call('getSongFromTop100', year, (song - 1), function (err, response) {
        Bert.alert(response.interpret + " mit " + response.title + ' ist ' + year + ' Deine Nummer ' + top + '!', 'success', 'growl-top-right');
    });
}

function buildDropDownEntries() {

    var ddElement;
    $.each(allCharts, function (index, value) {
        ddElement = $('<a class="w3-bar-item selectYear" href="javascript:void(0)" data-year="' + index + '">' + index + ' </a>');
        $("#topyears").append(ddElement);
    });

    buildTop100(Object.keys(allCharts)[0]);
}

function buildTop100(year) {

    $("#toptitle").text(year);

    $("#top").empty();

    var listElement, voteElement;
    $.each(allCharts[year], function (index, value) {

        listElement =
            '<li class="w3-bar"><div class="w3-row w3-panel"><div class="w3-col w3-center s1 m1 l1"><div class="w3-large w3-left">' +
            value.pos +
            '</div></div><div class="w3-col s11 m11 l7"><div><span class="w3-small"><b>' +
            value.interpret +
            "</b></span><br><span>" +
            value.title + '</span></div></div>';

        if (Meteor.user()) {
            listElement = listElement + '<div class="w3-col w3-left l4"><div class="w3-bar w3-tiny"><div class="w3-bar-item"><input class="w3-radio" type="radio" name="top1" value="' + year + '-' + (index + 1) + '"><label>Top1</label></div><div class="w3-bar-item"><input class="w3-radio" type="radio" name="top2" value="' + year + '-' + (index + 1) + '"><label>Top2</label></div><div class="w3-bar-item"><input class="w3-radio" type="radio" name="top3" value="' + year + '-' + (index + 1) + '"><label>Top3</label></div></div></div>';
        }
        listElement = listElement + '</div></li>';

        $("#top").append($(listElement));
    });

    //setVotings
    if (Meteor.user()) {
        tops = Votings.findOne({ votedBy: Meteor.user().emails[0].address });
    }
    if (tops && tops[year]) {
        var yearRating = tops[year];
        $("#top").find($("input[value='" + year + '-' + yearRating['top1'] + "'][name='top1']")).prop('checked', true);
        $("#top").find($("input[value='" + year + '-' + yearRating['top2'] + "'][name='top2']")).prop('checked', true);
        $("#top").find($("input[value='" + year + '-' + yearRating['top3'] + "'][name='top3']")).prop('checked', true);
    }
}