// Methods related to links

import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'getTop100'() {
        return JSON.parse(Assets.getText('top100.json'));
      }
});
