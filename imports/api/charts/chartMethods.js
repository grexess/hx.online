// Methods related to links

import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'getTop100'() {
        return JSON.parse(Assets.getText('top100.json'));
      },

      'getSongFromTop100'(year, index) {
        return JSON.parse(Assets.getText('top100.json'))[year][index];
      }
      
});
