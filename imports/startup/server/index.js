// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';

import {
    Votings
} from '../../api/charts/votings.js';

import {
    Charts
} from '../../api/charts/chartCollection.js';

getData();

// Insert chart data if the chart collection is empty
function getData() {
    
    if (Charts.find().count() === 0) {
        var jsonData = JSON.parse(Assets.getText("top100.json"));

        Object.keys(jsonData).forEach(function (key) {
            Charts.insert({
                year: key,
                songs : jsonData[key]
            }, function (error, result) {
                if (error) console.log(error);
                if (result) console.log(key +' created!');
            });
        })
    }
}

Meteor.publish('charts', () => {
    return Charts.find({});
  })

Meteor.publish('votings', function () {
    return Votings.find();
});

Votings.allow({
    'insert': function (userId, doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true;
    },
    'remove': function (userId, doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true;
    },
    'update': function (userId, doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true;
    }
});

