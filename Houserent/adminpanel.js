
var express = require('express');
var router = express.Router();
var db = require('./db');
var expressSession = require('express-session');

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json({extended: false}));
router.use(expressSession({secret: 'top secret', resave: false, saveUninitialized: true}));



router.get('/', function(req, res){
	
		if(!req.session.login){
    res.redirect('/login');
    return;
  }
  else
  {
  	if(req.session.user.UserStatus != "admin"){
  		res.redirect('/login');
       return;
  	}
  }
	message = req.session.message;
	req.session.message = "";
	var q = "SELECT * FROM (`post`) JOIN `area` ON `area`.`AreaId` = `post`.`Area` WHERE  Approval = '1' ORDER BY `postId` desc";
  db.getData(q, null, function(result){


  	var q = "SELECT * FROM (`post`) JOIN `area` ON `area`.`AreaId` = `post`.`Area` WHERE Approval = '0' ORDER BY `postId` desc";
  db.getData(q, null, function(result2){

  	var q = "SELECT * FROM (`area`)";
  db.getData(q, null, function(result3){


  	var q = "SELECT * FROM (`user`)  WHERE UserStatus = 'admin'";
  db.getData(q, null, function(result4){




		    var data = {
		    'post': result,
		    'posti' : result2,
		    'area' : result3,
		    'admin' : result4,
		    'message': message,
		    
		};
	res.render('admin',data);



		});
});
	});
});
});


router.get('/report', function(req, res){

		if(!req.session.login){
    res.redirect('/login');
    return;
  }
  else
  {
  	if(req.session.user.UserStatus != "admin"){
  		res.redirect('/login');
       return;
  	}
  }
  var q = "SELECT `AreaName` FROM (`post`) JOIN `area` ON `area`.`AreaId` = `post`.`Area` WHERE `HireStatus` = '0' AND `Approval` = '1' GROUP BY `Area` ORDER BY count('Area') desc";
  db.getData(q, null, function(result){
  	console.log(result[0].AreaName);


  	var q = "SELECT `UserName` FROM (`post`) JOIN `user` ON `user`.`UserId` = `post`.`CreatedBy` GROUP BY `CreatedBy` ORDER BY count('CratedBy') desc";
  db.getData(q, null, function(result2){
  	console.log(result[0].AreaName);

  	var q = "SELECT `Keyword` FROM (`searchhistory`) GROUP BY `Keyword` ORDER BY count('Keyword') desc";
  db.getData(q, null, function(result3){
  	console.log(result[0].AreaName);


  	var q = "SELECT `Ip` FROM (`searchhistory`) GROUP BY `Ip` ORDER BY count('Ip') desc";
  db.getData(q, null, function(result4){
  	console.log(result[0].AreaName);
   var data = {
		    'AreaName': result[0].AreaName,
		    'UserName' : result2[0].UserName,
		    'Keyword' : result3[0].Keyword,
		    'Ip' : result4[0].Ip
		    
		};
		res.render('report',data);

		});
});
	});
});
});

router.get('/deletePost/:id', function(req, res){

		if(!req.session.login){
    res.redirect('/login');
    return;
  }
  else
  {
  	if(req.session.user.UserStatus != "admin"){
  		res.redirect('/login');
       return;
  	}
  }

	 var q = "delete from post where PostId = "+req.params.id;
  db.getData(q, null, function(result){
});
  req.session.message = "Post Deleted";
		res.redirect('/adminpanel');
	});



router.get('/approve/:id', function(req, res){

		if(!req.session.login){
    res.redirect('/login');
    return;
  }
  else
  {
  	if(req.session.user.UserStatus != "admin"){
  		res.redirect('/login');
       return;
  	}
  }
 var q = "update post set Approval='1' where PostId = "+req.params.id;
  db.getData(q, null, function(result){
});
  req.session.message = "Post Approved";
		res.redirect('/adminpanel');
	});


module.exports = router;