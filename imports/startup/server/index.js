// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';

import {
    Votings
} from '../../api/charts/votings.js';

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

