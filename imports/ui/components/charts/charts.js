import './charts.html';

var allCharts;

var tops = { top1: null, top2: null, top3: null };

function selectYear(year) {
    //buildTop100(year);
    $("#toptitle").text(year);
}

Template.charts.onCreated(function () {

    Meteor.call('getTop100', function (err, response) {
        allCharts = response;
        buildDropDownEntries();
    });

});

Template.charts.events({
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
            
            $.each(Object.keys(tops), function (index, value) {
                if (value != topName) {
                    if (tops[value] != null && tops[value] === topValue ) {
                        bAlreadyVoted = true;
                    }
                }
            });

            if (bAlreadyVoted) {
                Bert.alert('Diesen Song hast Du schon gevoted!', 'danger', 'fixed-top');
                event.currentTarget.checked = false;
            } else {
                tops[topName] = topValue;
                buildVoteMessage(topValue.substr(0, topValue.indexOf('-')), topValue.substr(topValue.indexOf('-') +1), topName.substr(3));
            }
        }
    }
});

var favorits = {
    "1989": {
        "1": {
            "interpret": "David Hasselhoff",
            "title": "Looking For Freedom"
        },
        "2": {
            "interpret": "Robin Beck",
            "title": "First Time"
        },
        "3": {
            "interpret": "Kaoma",
            "title": "Lambada"
        }
    }
}

function buildVoteMessage(year, song, top){

    Meteor.call('getSongFromTop100', year, (song), function (err, response) {
        Bert.alert(response.interpret + " mit " + response.title +  ' ist ' + year +' Deine Nummer ' + top + '!', 'success', 'growl-top-right');
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
            value.title + '</span></div></div><div class="w3-col w3-left l4">';

        listElement = listElement + '<div class="w3-bar w3-tiny"><div class="w3-bar-item"><input class="w3-radio" type="radio" name="top1" value="' + year + '-' + index + '"><label>Top1</label></div><div class="w3-bar-item"><input class="w3-radio" type="radio" name="top2" value="' + year + '-' + index + '"><label>Top2</label></div><div class="w3-bar-item"><input class="w3-radio" type="radio" name="top3" value="' + year + '-' + index + '"><label>Top3</label></div></div>';

        listElement = listElement + '</div></div></li>';

        $("#top").append($(listElement));
    });
}


