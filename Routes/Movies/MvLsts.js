var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/MvLsts';

router.get('/', function(req, res) {
   var login = req.session.id;
   var owner = req.query.owner;
   var id = parseInt(owner);
   var vld = req.validator;
   var newArr = [];
   var admin = req.session && req.session.isAdmin();


   var handler = function(err, lstArr) {
      console.log(lstArr);
   if (!err && lstArr) {
      Object.keys(lstArr).forEach(function(key) {
         console.log(key, lstArr[key]);
         if (lstArr[key].publicFlag) {
            newArr.push(lstArr[key]);
         }
         else if (login === id || admin) {
            newArr.push(lstArr[key]);
         }
      });
      res.json(newArr);
   }
   else{
      res.json([]);
   }
      req.cnn.release();
   };


   if (login && owner) {
      if (id) {
         req.cnn.chkQry('select ml.id, title, ownerId, publicFlag, email,' +
          ' lastImage from MovieList ml' + 
          ' join Person p on ownerId = p.id where ml.ownerId = ?', [id], handler);
      }
      else {
         handler();
      }
   }
   else {
      req.cnn.chkQry('select ml.id, title, ownerId, publicFlag, email,' +
      ' lastImage from MovieList ml' + 
      ' join Person p on ownerId = p.id', null, handler);
   }
});

router.post('/', function(req, res) {
   console.log("post")
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var prsId = parseInt(req.session.id);
   var MAX_TITLE_LEN = 100;
   var publicFlag = 0;
   var newBody = {}

   async.waterfall([
   function(cb) {
     if (vld.check(req.session.id, Tags.noLogin, null, cb) &&
      vld.check(('title' in body), Tags.missingField, ["title"], cb) &&
      vld.check(body.title && body.title.length < MAX_TITLE_LEN,
      Tags.badValue, ["title"], cb) &&
      vld.check(!('publicFlag' in body) || 
       (body.publicFlag === 0 || body.publicFlag === 1), 
       Tags.badValue, ["publicFlag"], cb)) {
         if (!('publicFlag' in body)) {
            body.publicFlag = 0;
         }
         body.ownerId = prsId;
         console.log(body);
         cnn.chkQry("insert into MovieList set ?", body, cb);
      }
   },
   function(insRes, fields, cb) {
      console.log("location");
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

router.put('/:lstId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var lstId = parseInt(req.params.lstId);

   async.waterfall([
   function(cb) {
      if (vld.check(('title' in body), Tags.missingField, ["title"], cb) &&
          vld.check(!('publicFlag' in body) || 
          (body.publicFlag === 0 || body.publicFlag === 1), 
          Tags.badValue, ['publicFlag'], cb)) {
         console.log(body.title);
         cnn.chkQry('select * from MovieList where id = ?', [lstId], cb);
      }
   },
   function(mvLsts, fields, cb) {
      if (vld.check(mvLsts.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(mvLsts[0].ownerId, cb))
          console.log(body);
          console.log(lstId);
          cnn.chkQry("update MovieList set ? where id = ?",
          [body, lstId], cb);
   }],
   function(err) {
      if (!err)
         res.status(200).end();
      req.cnn.release();
   });
});

router.delete('/:lstId', function(req, res) {
   var vld = req.validator;
   var lstId = parseInt(req.params.lstId);
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from MovieList where id = ?', [lstId], cb);
   },
   function(mvLsts, fields, cb) {
      if (vld.check(mvLsts.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(mvLsts[0].ownerId, cb))
         cnn.chkQry('delete from MovieList where id = ?', [lstId], cb);
   }],
   function(err) {
      if (!err)
         res.status(200).end();
      cnn.release();
   });
});

router.get('/:lstId/Mvs', function(req, res) {
   var vld = req.validator;
   var lstId = parseInt(req.params.lstId);
   var cnn = req.cnn;
   var query = 'select m.id, m.Title, whenMade, email, Genre, ' + 
    'imdbID, Year, m.favoriteFlag, imdbRating from MovieList ml' +
    ' join Movie m on lstId = ml.id join' +
    ' Person p on prsId = p.id where ml.id = ?'
   var params = [lstId];
   var ratingFlag = req.query.ratingFlag;
   var genre = req.query.genre;
   var favoriteFlag = req.query.favoriteFlag;
   console.log(req.query);

   if (genre) {
      query += (" and Genre LIKE '%" + genre + "%'");
   }
   if (favoriteFlag && parseInt(favoriteFlag) === 1) {
      console.log("favorite");
      query += ' and m.favoriteFlag > 0';
   }

   if (ratingFlag && parseInt(ratingFlag) === 1) {
      query += ' order by imdbRating DESC, id';
   }
   else if (ratingFlag && parseInt(ratingFlag) === 2) {
      query += ' order by imdbRating, id';
   }
   else {
      query += ' order by whenMade, id';
   }
   console.log(query);

   async.waterfall([
   function(cb) {  // Check for existence of MovieList
      if (vld.check(req.session.id, Tags.noLogin, null, cb))
         cnn.chkQry('select * from MovieList where id = ?', [lstId], cb);
   },
   function(mvLsts, fields, cb) { // Get indicated movies
      if (vld.check(mvLsts.length, Tags.notFound, null, cb))
         cnn.chkQry(query, params, cb);
   },
   function(mvs, fields, cb) { // Return retrieved movies
      Object.keys(mvs).forEach(function(key) {
         mvs[key].whenMade = mvs[key].whenMade
          && mvs[key].whenMade.getTime();
      });
      res.json(mvs);
      cb();
   }],
   function(err){
      cnn.release();
   });
});

router.get('/:id', function(req, res) {
   var vld = req.validator;
   var id = parseInt(req.params.id);
   console.log(id);

   async.waterfall([
   function(cb) {
     if (vld.check(req.session.id, Tags.noLogin, null, cb))
        req.cnn.chkQry('select * from MovieList where id = ?', [id],
         cb);
   },
   function(lstArr, fields, cb) {
      if (vld.check(lstArr.length, Tags.notFound, null, cb)) {
         res.json(lstArr[0]);
         //res.status(200).end();
         cb();
      }
   }],
   function(err) {
      req.cnn.release();
   });
});


router.post('/:lstId/Mvs', function(req, res){
   var vld = req.validator;
   var cnn = req.cnn;
   var lstId = parseInt(req.params.lstId);
   var body = req.body;
   var prsId = parseInt(req.session.id);
   var now;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.id, Tags.noLogin, null, cb) &&
       vld.chain(('Title' in body), Tags.missingField, ["Title"])
       .chain(('Genre' in body), Tags.missingField, ["Genres"])
       .chain(('Year' in body), Tags.missingField, ["Year"])
       .chain(('imdbID' in body), Tags.missingField, ["imdbID"])
       .chain(('Poster' in body), Tags.missingField, ["Poster"])
       .check(('imdbRating' in body), Tags.missingField, ["Rating"], cb)) 
         cnn.chkQry('select * from MovieList where id = ?', [lstId], cb);
   },
   function(mvLsts, fields, cb) {
      if (vld.check(mvLsts.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(mvLsts[0].ownerId, cb))
         cnn.chkQry('insert into Movie set ?',
          {lstId: lstId, prsId: prsId,
          whenMade: now = new Date(), Title: req.body.Title,
          Genre: req.body.Genre, Year: req.body.Year,
          imdbID: req.body.imdbID, imdbRating: req.body.imdbRating,
          favoriteFlag: 0}, cb);
   },
   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cnn.chkQry("update MovieList set lastImage = ? where id = ?",
       [body.Poster, lstId], cb);
   }],
   function(err) {
      cnn.release();
   });
});

module.exports = router;
