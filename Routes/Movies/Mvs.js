var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Mvs';

router.get('/:id', function(req, res) {
   var vld = req.validator;
   var mvId = parseInt(req.params.id)
   console.log(mvId);
   var query = 'select whenMade, p.email, m.Title, Year, imdbID,' + 
    ' Genre, imdbRating, m.favoriteFlag from Movie m' +
    ' join MovieList ml on lstId = m.lstId join' + 
    ' Person p on prsId = p.id where m.id = ?';

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.id, Tags.noLogin, null, cb)) {
         req.cnn.chkQry(query, [mvId], cb);
      }
   },
   function(mvArr, fields, cb) {
      if (vld.check(mvArr[0], Tags.notFound, null, cb)) {
         mvArr[0].whenMade = 
          mvArr[0].whenMade && mvArr[0].whenMade.getTime();
         mvArr[0].id = mvId;
         res.json(mvArr[0]);
         cb();
      }
   }],
   function(err) {
      req.cnn.release();
   });
});

router.put('/:mvId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var mvId = parseInt(req.params.mvId);

   async.waterfall([
   function(cb) {
      if (vld.check(('favoriteFlag' in body), Tags.missingField, 
          ["favoriteFlag"], cb)) {
         cnn.chkQry('select * from Movie where id = ?', [mvId], cb);
      }
   },
   function(mvs, fields, cb) {
      console.log(mvs);
      if (vld.check(mvs.length, Tags.notFound, null, cb) &&
       vld.checkPrsOK(mvs[0].prsId, cb))
       cnn.chkQry("update Movie set favoriteFlag = ? where id = ?",
       [body.favoriteFlag, mvId], cb);
   }],
   function(err) {
      if (!err)
         res.status(200).end();
      req.cnn.release();
   });
});

module.exports = router;
