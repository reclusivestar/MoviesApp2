// Orderly interface to the REST server, providing:
// 1. Standard URL base
// 2. Standard headers to manage CORS and content type
// 3. Guarantee that 4xx and 5xx results are returned as
//    rejected promises, with a payload comprising an
//    array of user-readable strings describing the error.
// 4. All successful post operations return promises that
//    resolve to a JS object representing the newly added
//    entity (all fields, not just those in the post body)
// 5. Signin and signout operations that retain relevant
//    cookie data.  Successful signin returns promise 
//    resolving to newly signed in user.

const baseURL = "http://localhost:3001/";
const searchURL  = "http://www.omdbapi.com/?s=";
const movieDetailURL = "http://www.omdbapi.com/?i=";
const api = "&apikey=a3db778c";
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const headers = new Headers();
var cookie;

headers.set('Content-Type', 'application/JSON');

const reqConf = {
   headers: headers,
   credentials: 'include',
};

// Helper functions for the comon request types, automatically
// adding verb, headers, and error management.
export function post(endpoint, body) {
   console.log(body);
   return fetch(baseURL + endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...reqConf
   });
}

export function put(endpoint, body) {
   return fetch(baseURL + endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...reqConf
   });
}

export function get(endpoint) {
   return fetch(baseURL + endpoint, {
      method: 'GET',
      ...reqConf
   });
}

export function getApi(query) {
   return fetch(searchURL + query + api, {
      method: 'GET',
      header: headers,
      credentials: "omit"
   });
}

export function getMvDetailsApi(id) {
   return fetch(movieDetailURL + id + api, {
      method: 'GET',
      header: headers,
      credentials: "omit"
   });
}

export function del(endpoint) {
   return fetch(baseURL + endpoint, {
      method: 'DELETE',
      ...reqConf
   });
}

function handleErrors(response) {
   if (response.status === 500)
      throw "Server Connect Error";
   else if (response.status === 400)
      return response.json()
         .then(err => {throw errorTranslate(err[0].tag, 'en')}); 
   else if (response.status == 401)
      throw "Unauthorized";
   else if (response.status == 403)
      throw "Forbidden";
   return response;
}

// Functions for performing the api requests

/**
 * Sign a user into the service, returning a promise of the 
 * user data
 * @param {{email: string, password: string}} cred
 */
export function signIn(cred) {
   return post("Ssns", cred)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then((response) => {
         let location = response.headers.get("Location").split('/');
         cookie = location[location.length - 1];
         return get("Ssns/" + cookie)
      })
      .then(response => response.json())   // ..json() returns a Promise!
      .then(rsp => get('Prss/' + rsp.prsId))
      .then(userResponse => userResponse.json())
      .then(rsp => rsp[0])
}

export function getMovies(query) {
   return getApi(query)
      .then((res) => res.json())
}

export function getMoviesId(imdbId, lstId) {
   console.log(lstId);
   return getMvDetailsApi(imdbId)
      .then((res) => res.json())
      .then((rsp) => {
         //console.log(rsp);
         return post(`MvLsts/${lstId}/Mvs/`, {
            "Title": rsp.Title,
            "Year": rsp.Year,
            "Genre": rsp.Genre,
            "imdbRating": parseInt(rsp.imdbRating),
            "imdbID": rsp.imdbID,
            "Poster": rsp.Poster
         })
      })
      .then(rsp => {
         console.log(rsp);
         let location = rsp.headers.get("Location").split('/');
         return get(`Mvs/${location[location.length-1]}`);
      })
      .then(rsp => rsp.json());
}


/**
 * @returns {Promise} result of the sign out request
 */
export function signOut() {
   return del("Ssns/" + cookie)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors);
}

/**
 * Register a user
 * @param {Object} user
 * @returns {Promise resolving to new user}
 */
export function postPrs(user) {
   return post("Prss", user)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
  
   //.catch((error) => {console.log(error)});
      //return get("Prss/" + location[location.length - 1]);
   //.then(rsp => rsp.json());
   //[0]);
}

/**
 * @returns {Promise} json parsed data
 */
export function getCnvs(userId) {
   return get("Cnvs" + (userId ? "?owner="+userId : ""))
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then((res) => res.json());
}

export function getLists(userId) {
   return get("MvLsts" + (userId ? "?owner=" + userId : ""))
   .catch(err => Promise.reject("Server Connect Error"))
   .then(handleErrors)
   .then((res) => res.json());
}

export function putCnv(id, body) {
   return put(`Cnvs/${id}`, body)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then(rsp => {
         return get(`Cnvs/${id}`);
      })
      .then(rsp => rsp.json());
}

export function putList(lstId, body){
   return put(`MvLsts/${lstId}`, body)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then(rsp => {
         return get(`MvLsts/${lstId}`);
      })
      .then(rsp => rsp.json());
}

export function putMv(mvId, body){
   return put(`Mvs/${mvId}`, body)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then(rsp => {
         return get(`Mvs/${mvId}`);
      })
      .then(rsp => rsp.json());
}

export function getMsgs(id){
   return get(`Cnvs/${id}/Msgs`)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then((res) => res.json());
}

export function getMvs(id, genre, ratingFlag, favoriteFlag) {
   console.log(genre);
   console.log(favoriteFlag);
   console.log(ratingFlag);
   return get(`MvLsts/${id}/Mvs?` + (genre ? "genre=" + genre + "&" : "")
    + (ratingFlag ? "ratingFlag=" + ratingFlag + "&" : "") 
    + (favoriteFlag ? "favoriteFlag=" + favoriteFlag : ""))
   .catch(err => Promise.reject("Server Connect Error"))
   .then(handleErrors)
   .then((res) => res.json());
}

export function addMsg(id, body) {
    return post(`Cnvs/${id}/Msgs`, body)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then(rsp => {
         let location = rsp.headers.get("Location").split('/');
         return get(`Msgs/${location[location.length-1]}`);
      })
      .then(rsp => rsp.json());
}

export function addMv(id, body) {
   return post(`MvLsts/${id}/Mvs`, body)
     .catch(err => Promise.reject("Server Connect Error"))
     .then(handleErrors)
     .then(rsp => {
        let location = rsp.headers.get("Location").split('/');
        return get(`Mvs/${location[location.length-1]}`);
     })
     .then(rsp => rsp.json());
}

export function postCnv(body) {
   return post('Cnvs', body)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors)
      .then(rsp => {
         let location = rsp.headers.get("Location").split('/');
         return get(`Cnvs/${location[location.length-1]}`);
      })
      .then(rsp => rsp.json());
}

export function postList(body) {
   return post('MvLsts', body)
   .catch(err => Promise.reject("Server Connect Error"))
   .then(handleErrors)
   .then(rsp => { 
         let location = rsp.headers.get("Location").split('/');
         return get(`MvLsts/${location[location.length-1]}`);
   })
   .then(rsp => rsp.json());
}

export function delCnv(cnvId){
   return del("Cnvs/" + cnvId)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors);
}

export function delList(lstId){
   return del("MvLsts/" + lstId)
      .catch(err => Promise.reject("Server Connect Error"))
      .then(handleErrors);
}

const errMap = {
   en: {
      missingField: 'Field missing from request: ',
      badValue: 'Field has bad value: ',
      notFound: 'Entity not present in DB',
      badLogin: 'Email/password combination invalid',
      dupEmail: 'Email duplicates an existing email',
      noTerms: 'Acceptance of terms is required',
      forbiddenRole: 'Role specified is not permitted.',
      noOldPwd: 'Change of password requires an old password',
      oldPwdMismatch: 'Old password that was provided is incorrect.',
      dupTitle: 'Conversation title duplicates an existing one',
      dupEnrollment: 'Duplicate enrollment',
      forbiddenField: 'Field in body not allowed.',
      queryFailed: 'Query failed (server problem).'
   },
   es: {
      missingField: '[ES] Field missing from request: ',
      badValue: '[ES] Field has bad value: ',
      notFound: '[ES] Entity not present in DB',
      badLogin: '[ES] Email/password combination invalid',
      dupEmail: '[ES] Email duplicates an existing email',
      noTerms: '[ES] Acceptance of terms is required',
      forbiddenRole: '[ES] Role specified is not permitted.',
      noOldPwd: '[ES] Change of password requires an old password',
      oldPwdMismatch: '[ES] Old password that was provided is incorrect.',
      dupTitle: '[ES] Conversation title duplicates an existing one',
      dupEnrollment: '[ES] Duplicate enrollment',
      forbiddenField: '[ES] Field in body not allowed.',
      queryFailed: '[ES] Query failed (server problem).'
   },
   swe: {
      missingField: 'Ett fält saknas: ',
      badValue: 'Fält har dåligt värde: ',
      notFound: 'Entitet saknas i DB',
      badLogin: 'Email/lösenord kombination ogilltig',
      dupEmail: 'Email duplicerar en existerande email',
      noTerms: 'Villkoren måste accepteras',
      forbiddenRole: 'Angiven roll förjuden',
      noOldPwd: 'Tidiagre lösenord krav för att updatera lösenordet',
      oldPwdMismatch: 'Tidigare lösenord felaktigt',
      dupTitle: 'Konversationstitel duplicerar tidigare existerande titel',
      dupEnrollment: 'Duplicerad inskrivning',
      forbiddenField: 'Förbjudet fält i meddelandekroppen',
      queryFailed: 'Förfrågan misslyckades (server problem).'
   }
}

/**
 * @param {string} errTag
 * @param {string} lang
 */
export function errorTranslate(errTag, lang = 'en') {
   return errMap[lang][errTag] ||  'Unknown Error!';
}
