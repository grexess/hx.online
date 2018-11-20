// Methods related to links

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { Votings } from './votings.js';

Meteor.methods({

  'getTop100'() {
    return JSON.parse(Assets.getText('top100.json'));
  },

  'getSongFromTop100'(year, index) {
    return JSON.parse(Assets.getText('top100.json'))[year][index];
  },

  //return the count of voting users per year
  'getVotingCount'(year) {
    var query = Votings.find({ [year]: { $exists: true } }, { fields: { [year]: 1, "votedBy": 1, "_id": 0 } }).fetch();
    return query.length;
  },

  'getVotedCharts'(zyear) {

    var year = zyear;
    var query = Votings.find({ [year]: { $exists: true } }, { fields: { [year]: 1, "votedBy": 1, "_id": 0 } }).fetch();

    var top100ofYear = JSON.parse(Assets.getText('top100.json'))[year];
    var results = {};
    var voted = 0;

    var votCounter = {};

    //get each voting
    query.forEach(function (entry) {

      var voting = entry[year];
      //var votedBy = entry["votedBy"];

      var aKeys = Object.keys(voting);

      aKeys.forEach(function (place) {




        var vPlace = voting[place];

        if (votCounter.hasOwnProperty(vPlace)) {
          votCounter[vPlace].votings = votCounter[vPlace].votings + 1;
          //votCounter[vPlace].votedBy.push(votedBy);
        } else {
          //votCounter[vPlace] = {"votings": 1, "votedBy": [votedBy]};
          votCounter[vPlace] = { "votings": 1 };
        }

        if (results.hasOwnProperty(vPlace)) {
          var addScore;
          switch (place) {
            case "top1":
              addScore = results[vPlace]["score"] + 5;
              break;
            case "top2":
              addScore = results[vPlace]["score"] + 3;
              break;
            case "top3":
              addScore = results[vPlace]["score"] + 1;
              break;
          }

          results[vPlace]["score"] = addScore;

        } else {
          switch (place) {
            case "top1":
              results[vPlace] = { "score": 5, song: top100ofYear[vPlace - 1] };
              break;
            case "top2":
              results[vPlace] = { "score": 3, song: top100ofYear[vPlace - 1] };
              break;
            case "top3":
              results[vPlace] = { "score": 1, song: top100ofYear[vPlace - 1] };
              break;
          }
        }


        //getCover
        try {
          const result = HTTP.call('GET', 'https://itunes.apple.com/search?term=ed+sheeran+perfect', {
            params: { user: userId }
          });
          return true;
        } catch (e) {
          // Got a network error, timeout, or HTTP error in the 400 or 500 range.
          return false;
        }
      


      });
  });

//add total song votings and voters
(Object.keys(results)).forEach(function (song) {
  if (votCounter.hasOwnProperty(song)) {
    results[song].voted = votCounter[song].votings;
    //results[song].voter = votCounter[song].votedBy.length;
  }
});
var response = { "results": results, "votings": query.length };
return response;
  }
});