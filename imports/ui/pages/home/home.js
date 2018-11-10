import './home.html';

import '../../components/header/header.js';
import '../../components/login/login.js';
import '../../components/login/custom.js';
import '../../components/login/customInput.js';
import '../../components/login/customSubmit.js';

import '../../components/info/info.js';
import '../../components/charts/charts.js';


Template['override-at_form'].replaces('atForm');
Template['override-atTextInput'].replaces('atTextInput');
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');