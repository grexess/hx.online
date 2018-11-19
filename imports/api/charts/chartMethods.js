// Methods related to links

import { Meteor } from 'meteor/meteor';

import { Votings } from './votings.js';

Meteor.methods({

  'getTop100'() {
    return JSON.parse(Assets.getText('top100.json'));
  },

  'getSongFromTop100'(year, index) {
    return JSON.parse(Assets.getText('top100.json'))[year][index];
  },

  'getVotedCharts'(year) {

    var query = Votings.find({ [year]: { $exists: true } }, { fields: { [year]: 1, "_id": 0 } }).fetch();
    var top100ofYear = JSON.parse(Assets.getText('top100.json'))[year];
    var results = {};
    var voted = 0;

    var votCounter = {};


    //get each voting
    query.forEach(function (entry) {

      debugger;
      var voting = entry[Object.keys(entry)[0]];

      var aKeys = Object.keys(voting);

      aKeys.forEach(function (place) {

        if (votCounter.hasOwnProperty(voting[place])) {
          console.log('yes');
          votCounter[voting[place]] = votCounter[voting[place]]++;
        } else {
          console.log('no');
          votCounter[voting[place]] = 1;
        }

        if (results.hasOwnProperty(voting[place])) {
          switch (place) {
            case "top1":
              results[voting[place]]["score"] = results[voting[place]]["score"] + 5;
              results[voting[place]]["voter"] = query.length;
              results[voting[place]]["voted"] = voted;
              break;
            case "top2":
              results[voting[place]]["score"] = results[voting[place]]["score"] + 3;
              results[voting[place]]["voter"] = query.length;
              results[voting[place]]["voted"] = voted;
              break;
            case "top3":
              results[voting[place]]["score"] = results[voting[place]]["score"] + 1;
              results[voting[place]]["voter"] = query.length;
              results[voting[place]]["voted"] = voted;
              break;
          }
        } else {
          switch (place) {
            case "top1":
              results[voting[place]] = { "score": 5, song: top100ofYear[voting[place] - 1], "voter": query.length, "voted": voted };
              break;
            case "top2":
              results[voting[place]] = { "score": 3, song: top100ofYear[voting[place] - 1], "voter": query.length, "voted": voted };
              break;
            case "top3":
              results[voting[place]] = { "score": 1, song: top100ofYear[voting[place] - 1], "voter": query.length, "voted": voted };
              break;
          }
        }
      });

      //add total song votings and voters
      (Object.keys(results)).forEach(function (song) {
        debugger;
        if (votCounter.hasOwnProperty(song)) {
          results[song].voted = votCounter[song];
        }
      });

      return results;
    });
  }
});