export default function Mvs(state = [], action) {
   console.log("Lists reducing action " + action.type);
   switch (action.type) {
      case 'UPDATE_LISTS': // Replace previous cnvs
         console.log(action);
         return action.lists;
      case 'UPDATE_LIST':
         console.log(action);
         return state.map(val => val.id !== action.data.id ?
            val : Object.assign({}, val, { title: action.data.title, publicFlag: action.data.publicFlag }));
      case 'ADD_LIST':
         console.log(action);
         return state.concat([action.lst]);
      case 'DEL_LIST':
         return state.filter(lst => lst.id !== action.data.id);
      default:
         return state;
   }
}
