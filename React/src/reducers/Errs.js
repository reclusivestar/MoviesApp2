function Erss(state = {}, action) {
   console.log("Errs reducing action " + action.type);
   switch(action.type) {
   case 'REGISTER_ERR':
      return action.details.toString();
   case 'LOGIN_ERR':
      return action.details.toString();
   case 'CNVTITLE_ERR':
      return action.details.toString();
   case 'LOGOUT_ERR' :
      return action.details.toString();
   case 'GETCNVS_ERR' :
      return action.details.toString();
   case 'GETMSGS_ERR' :
      return action.details.toString();
   case 'ADDMSG_ERR':
      return action.details.toString();
   case 'CNVMOD_ERR':
      return action.details.toString();
   case 'DELCNV_ERROR':
      return action.details.toString();
   case 'CLEAR':
      return {};
   default:
      return state;
   }
}

export default Erss;
