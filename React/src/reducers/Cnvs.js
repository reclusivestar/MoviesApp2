export default function Cnvs(state = [], action) {
   console.log("Cnvs reducing action " + action.type);

   switch (action.type) {
      case 'UPDATE_CNVS': // Replace previous cnvs
         return action.cnvs;
      case 'UPDATE_CNV':
         return state.map(val => val.id !== action.data.id ?
            val : Object.assign({}, val, { title: action.data.title }));
      case 'ADD_CNV':
         return state.concat([action.cnv]);
      case 'DEL_CNV':
         return state.filter(cnv => cnv.id !== action.data.id);
      default:
         return state;
   }
}
