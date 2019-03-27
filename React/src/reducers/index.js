import { combineReducers } from 'redux';

import Prss from './Prss';
import Cnvs from './Cnvs';
import Errs from './Errs';
import Msgs from './Msgs';
import Mvs from './Mvs';
import Lists from './Lists';
import Search from './Search';

const rootReducer = combineReducers({Prss, Cnvs, Errs, Msgs, Mvs, Lists, Search});
export default rootReducer;


