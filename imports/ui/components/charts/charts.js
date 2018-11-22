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

    /*  votings() {
         return Votings.find({});
     }, */

    userEmail: function (user) {
        if (user.emails && user.emails.length > 0) {
            return user.emails[0].address;
        }
        return 'no email';
    },
    images: function () {
        return Images.find(); // Where Images is an FS.Collection instance
    }
});

/* Template.charts.onRendered(function() {
          $(document).ready(function() {
            var script = document.createElement("script");
            script.type="text/javascript";
            script.src = "https://itunes.apple.com/search?term&amp;callback=\"function(){alert('doit');\"";
            $("body").append(script);
          });
    }); */


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

    'click #toggleBtn'(event, instance) {
        var year = $('#toptitle').text();
        if (event.currentTarget.checked) {
            //get private charts
            $('#top').empty();
            Meteor.call('getVotedCharts', year, function (err, zresponse) {

                var response = zresponse.results;

                var record, votings = [];
                $.each(response, function (index, value) {
                    record = { "score": response[index].score, "img": response[index].song.img, "voter": response[index].voter, "voted": response[index].voted, "orgPos": response[index].song.pos, "title": response[index].song.title, "interpret": response[index].song.interpret }
                    votings.push(record);
                });

                votings.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));

                $.each(votings, function (idx, value) {

                    var listElement;

                    listElement = '<li class="w3-bar"><div class="w3-row w3-panel"><div class="w3-col w3-center s1 m1 l1"><div class="w3-xlarge w3-center">' +
                        (idx + 1) + '<br><span class="w3-small">(' + value.orgPos + ')</span></div></div><div class="w3-col s10 m10 l6"><div><span class="w3-small"><b>' + value.interpret + '</b></span><br><span>' +
                        value.title + '</span></div></div><div id="img' + idx + '" class="w3-col w3-center s1 m1 l1"><img class="coverimg" src="' + value.img + '" alt="noCover"/></div><div class="w3-col w3-center s12 m4 l3 w3-tiny"><div class="w3-col s6">Score<br><b> ' + value.score + '</b></div><div class="w3-col s6">Voted<br><b><span data-voted="voted">' + value.voted
                        + '<span></b></div></div></div></div></div></div></li>';
                    $("#top").append($(listElement));
                });
            });

        } else {
            buildTop100(year)
        }
    },

    'click .menu-toggle a'(event, instance) {

        toggleYearSelection();

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
        if (Meteor.user()) {
            $('#toggleBtn')[0].checked = false;
        }
        $('.menu').hide();
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
                //set previous checkbox
                var valueStr = year + "-" + tops[year][event.currentTarget.name];
                $('input[value="' + valueStr + '"][name="' + event.currentTarget.name + '"]')[0].checked = true;
            } else {

                var song = topValue.substr(topValue.indexOf('-') + 1);
                var place = topName.substr(3);
                var id;

                //is place already voted update voting
                if (!tops) {
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

    var aYear = [];
    $.each(allCharts, function (index, value) {
        aYear.push(index);
    });
    aYear.reverse();

    $.each(aYear, function (index, value) {
        $('.flex-container').append('<li class="flex-item selectYear" data-year="' + value + '">' + value + '</li>');
    });

    buildTop100(Object.keys(allCharts)[Object.keys(allCharts).length - 1]);
}

function buildTop100(year) {


    Meteor.call('getVotingCount', year, function (err, response) {
        $('.votCnt').text(response);
        if (response > 0) {
            $('#toggleBtn').prop('disabled', false);
            $(".toggle--off").css("color", "#47a3da");
        } else {
            $("#toggleBtn").prop('disabled', true);
            $(".toggle--off").css("color", "#9E9E9E");
        }
    });


    $("#toptitle").text(year);

    $("#top").empty();

    var listElement, voteElement;
    $.each(allCharts[year], function (index, value) {

        listElement =
            '<li class="w3-bar"><div class="w3-row"><div class="w3-col w3-center s1 m1 l1"><div class="w3-large w3-left">' +
            value.pos +
            '</div></div><div class="w3-col s10 m10 l6"><div><span class="w3-small"><b>' +
            value.interpret +
            "</b></span><br><span>" +
            value.title + '</span></div></div><div class="w3-col w3-center s1 m1 l1"><img id="imgPos' + value.pos + '" style="max-width: 50px; padding-right:16px" src="/img/cd.png" alt="noCover"/></div>';

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

function toggleYearSelection() {
    $(".menu").slideToggle(700);
    if ($("#ySel").hasClass('fa-angle-double-down')) {
        $("#ySel").addClass('fa-angle-double-up').removeClass('fa-angle-double-down');
    } else {
        $("#ySel").addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
    }
}
