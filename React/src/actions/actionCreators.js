import * as api from '../api';

export function signIn(credentials, cb) {
   return (dispatch, prevState) => {
      api.signIn(credentials)
      .then((userInfo) => dispatch({type: "SIGN_IN", user: userInfo}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}))
   };
}

export function clearError(){
   return (dispatch, prevState) => {
      dispatch({type: 'CLEAR'});
   };
}

export function signOut(cb) {
   return (dispatch, prevState) => {
      api.signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGOUT_ERR', details: error}));
   };
}

export function register(data, cb) {
   return (dispatch, prevState) => {
      api.postPrs(data)
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'REGISTER_ERR', details: error}));
   };
}

export function searchMvs(query, cb) {
   return (dispatch, prevState) => {
      api.getMovies(query)
      .then((mvs) => dispatch({type: 'SEARCH_MVS', mvs}))
      .then(() => { if (cb) cb();});
   }
}

export function getMvDetails(imdbId, lstId, cb) {
   return (dispatch, prevState) => {
      api.getMoviesId(imdbId, lstId)
      .then((mvs) => dispatch({type: 'ADD_MV', mvs}))
      .then(() => { if (cb) cb();});
   }
}

export function updateCnvs(userId, cb) {
   return (dispatch, prevState) => {
      api.getCnvs(userId)
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', cnvs }))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'GETCNVS_ERR', details: error}));
   };
}

export function updateLists(userId, cb) {
   return (dispatch, prevState) => {
      api.getLists(userId)
      .then((lists) => dispatch({ type: 'UPDATE_LISTS', lists }))
      .then(() => {if (cb) cb();})
      //.catch(error => dispatch({type: 'GETCNVS_ERR', details: error}));
   };
}

export function updateMsgs(cnvId, cb) {
   return (dispatch, prevState) => {
      api.getMsgs(cnvId)
      .then((msgs) => dispatch({ type: 'UPDATE_MSGS', msgs}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'GETMSGS_ERR', details: error}));
   }
}

export function updateMvs(id, genre, ratingFlag, favoriteFlag ,cb) {
   return (dispatch, prevState) => {
      api.getMvs(id, genre, ratingFlag, favoriteFlag)
      .then((mvs) => dispatch({ type: 'UPDATE_MVS', mvs}))
      .then(() => {if (cb) cb();})
   }
}

export function addMv(id, body, cb){
   console.log(body);
   return (dispatch, prevState) => {
      api.addMv(id, body)
      .then((mv) => dispatch({type: 'ADD_MV', data: {mv: mv, id: id}}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'ADDMSG_ERR', details: error}));
   }
}

export function addMsg(id, body, cb){
   return (dispatch, prevState) => {
      api.addMsg(id, body)
      .then((msg) => dispatch({type: 'ADD_MSG', msg}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'ADDMSG_ERR', details: error}));
   }
}

export function addCnv(newCnv, cb) {
   return (dispatch, prevState) => {
      api.postCnv(newCnv)
      .then(cnvRsp => dispatch({type: 'ADD_CNV', cnv: cnvRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'CNVTITLE_ERR', details: error}));
   };
}

export function addList(newLst, cb) {
   return (dispatch, prevState) => {
      api.postList(newLst)
      .then(rsp => dispatch({type: 'ADD_LIST', lst: rsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LST_ERR', details: error}));
   };
}

export function modCnv(cnvId, title, cb) {
   return (dispatch, prevState) => {
      api.putCnv(cnvId, title)
      .then((cnvs) => dispatch({type: 'UPDATE_CNV', data: cnvs}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'CNVMOD_ERR', details: error}));
   };
}

export function favMv(mvId, favFlag, cb) {
   return (dispatch, prevState) => {
      api.putMv(mvId, favFlag)
      .then((mv) => dispatch({type: 'UPDATE_MV', data: {mv: mv, id: mvId}}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'CNVMOD_ERR', details: error}));
   };
}

export function modList(lstId, body, cb) {
   console.log(lstId);
   console.log(body);
   return (dispatch, prevState) => {
      api.putList(lstId, body)
      .then((lsts) => dispatch({type: 'UPDATE_LIST', data: lsts}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LSTMOD_ERROR', details: error}));
   };
}

export function delCnv(cnv, cb){
   var oldCnv = cnv;
   return (dispatch, prevState) => {
      api.delCnv(cnv.id)
      .then(dispatch({type: 'DEL_CNV', data: oldCnv}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'DELCNV_ERROR', details: error}));
   }
}

export function delList(lst, cb){
   var oldLst = lst;
   return (dispatch, prevState) => {
      api.delList(lst.id)
      .then(dispatch({type: 'DEL_LIST', data: oldLst}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'DELCNV_ERROR', details: error}));
   }
}
