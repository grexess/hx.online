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

    //get each voting
    query.forEach(function (entry) {
      var voting = entry[Object.keys(entry)[0]];
      Object.keys(voting).forEach(function (place) {

        if (results.hasOwnProperty(voting[place])) {
          switch (place) {
            case "top1":
              results[voting[place]]["score"] = results[voting[place]]["score"] + 5;      
              break;
            case "top2":
              results[voting[place]]["score"] = results[voting[place]]["score"] + 3;

              break;
            case "top3":
              results[voting[place]]["score"] = results[voting[place]]["score"] + 1;
              break;
          }
        } else {
          switch (place) {
            case "top1":
              results[voting[place]] = {"score": 5, song: top100ofYear[voting[place]-1]};
              break;
            case "top2":
            results[voting[place]] = {"score": 3, song: top100ofYear[voting[place]-1]};
              break;
            case "top3":
            results[voting[place]] = {"score": 1, song: top100ofYear[voting[place]-1]};
              break;
          }
        }
      });
    });
    return results;
  }
});
