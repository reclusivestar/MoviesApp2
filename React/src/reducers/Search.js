export default function Search(state = [], action) {
    console.log("Search reducing action " + action.type);
   switch (action.type) {
      case 'SEARCH_MVS': // Replace previous cnvs
        // console.log(action.mvs)
         return action.mvs;
      case 'ADD_MVS':
         console.log(action.mvs);
         return action.mvs;
      default:
         return state;
    }
 }
 