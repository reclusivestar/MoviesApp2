export default function Mvs(state = [], action) {
   console.log("Mvs reducing action " + action.type);
   switch (action.type) {
      case 'UPDATE_MVS':
         return action.mvs;
      case 'UPDATE_MV':
         console.log(action);
         return state.map(val => val.id !== action.data.id ?
            val : Object.assign({}, val, { favoriteFlag: action.data.mv.favoriteFlag }));
      case 'ADD_MV': 
         // action.data.mv.favoriteFlag = 0;
         // action.data.mv.id = action.data.id;
         console.log(action);
         return state.concat([action.mvs]);
      default:
         return state;
   }
}
