// Methods related to links

import { Meteor } from 'meteor/meteor';

import { Votings } from './votings.js';


Meteor.methods({

  'getTop100'() {


    //check images for a certain year

    var year = "1990"
    var top100ofYear = JSON.parse(Assets.getText('top100.json'))[year];

    top100ofYear.forEach(function (song) {
      var songImg = year + "-" + song.pos + ".jpg";
      var img = Images.findOne({ "original.name": songImg });

      if (img) {
        //exist;
      } else {
        storeImage(year, song);
      }
    });


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

        //check images
        var song = top100ofYear[vPlace - 1];
        var songImg = year + "-" + song.pos + ".jpg";
        var img = Images.findOne({ "original.name": songImg });

        if (img) {
          song.img = "/covers/" + img.collectionName + '-' + img._id + '-' + img.original.name;
        } else {
          song.img = storeImage(year, song);
        }

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

/* store an URL into filesystem */
function storeImage(year, song) {

  var fs = Npm.require('fs');

  var url = "https://itunes.apple.com/search?term=" + encodeURI(song.interpret) + "%20" + encodeURI(song.title) + "&limit=1";

  let iTunesResponse = HTTP.call('GET', url);

  if (iTunesResponse.statusCode === 200) {

    if (iTunesResponse && iTunesResponse.data && iTunesResponse.data.results[0] && iTunesResponse.data.results[0].artworkUrl100) {
      var imgUrl = iTunesResponse.data.results[0].artworkUrl100;

      let response = HTTP.call('GET', imgUrl, {
        npmRequestOptions: {
          encoding: null
        }
      });

      if (response.statusCode === 200) {
        var newImg = new FS.File();
        newImg.attachData(response.content, { type: 'utf8' });
        newImg.name(year + '-' + song.pos + '.jpg');
        Images.insert(newImg, function (error, fileObj) {
          if (error) {
            console.log('E100:' + error);
          } else {
            return newImg.collectionName + '-' + newImg._id + '-' + newImg.original.name
          }
        }
        )
      } else {
        console.log('E101:' + response.statusCode);
      }
    }
  }
  return "/img/cd.png";
}
