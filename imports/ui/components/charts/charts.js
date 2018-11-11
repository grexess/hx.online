import './charts.html';

var allCharts;

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

        var votingArea = '<div class="w3-bar w3-tiny"><div class="w3-bar-item"><input class=" w3-radio" type="radio" name="top1" value="female"><label>Top1</label></div><div class="w3-bar-item"><input class=" w3-radio" type="radio" name="top1" value="female"><label>Top2</label></div><div class="w3-bar-item"><input class=" w3-radio" type="radio" name="top1" value="female"><label>Top3</label></div></div>';
        
        listElement = $(
            '<li class="w3-bar"><div class="w3-row w3-panel"><div class="w3-col w3-center s1 m1 l1"><div class="w3-large w3-left">' +
            value.pos +
            '</div></div><div class="w3-col s11 m11 l7"><div><span class="w3-small"><b>' +
            value.interpret +
            "</b></span><br><span>" + 
            value.title + '</span></div></div><div class="w3-col w3-left l4">' + votingArea + '</div></div></li>');

            $("#top").append(listElement);
    });
}


