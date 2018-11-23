import './songs.html';

import { Charts } from '../../../api/charts/chartCollection.js';



Template.songs.onCreated(function () {
});

Template.songs.helpers({

    charts(year) {
        
        if(!year){
            year = Template.instance().state.get('currentYear');
        }
        return Charts.find({year: year});
    }
});