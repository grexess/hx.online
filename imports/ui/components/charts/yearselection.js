import './yearselection.html';

import { Charts } from '../../../api/charts/chartCollection.js';


Template.yearselection.helpers({

    years() {
        return Charts.find({},{sort: {year: -1}},{ fields: { year: 1}}).fetch()[0].year;
    }
});