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
        
        listElement = $(
            '<li class="w3-bar w3-padding-small w3-tiny"><div class="w3-bar-item w3-xlarge w3-center" style="width:4em">' +
            value.pos +
            '</div><div class="w3-bar-item"></div><div class="w3-bar-item"><span class="w3-small"><b>' +
            value.interpret +
            "</b></span><br><span>" +
            value.title +
            '</span></div></div>');

            $("#top").append(listElement);
    });
}


