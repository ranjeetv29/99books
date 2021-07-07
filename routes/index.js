const { urlencoded } = require('express');
var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel')
var adminmodel = require('../models/adminmodel')
var usermodel = require('../models/usermodel')

/* Middleware function to apply security on all main urls */
router.use('/login',(req,res,next)=>{
	req.session.sunm = undefined
	req.session.srole = undefined		
    // console.log("index router working....")
	next()
})  

/* GET home page. */
router.get('/', function(req, res, next) {
    usermodel.fetchAll("category").then((result)=>{
        res.render('index',{"sunm":req.session.sunm,"catlist":result})
    }).catch((err)=>{
        console.log(err)
    })
});






/* GET about us page. */
router.get('/about', function(req, res, next) {
    res.render('about');
});

/* GET contact us page. */
router.get('/contact', function(req, res, next) {
    res.render('contact');
});

/* GET our service page. */
router.get('/service', function(req, res, next) {
    adminmodel.fetchUsers().then((result)=>{
		adminmodel.fetchAll("order").then((result1)=>{
			adminmodel.fetchAll1("product").then((result2)=>{
				res.render('service',{"sunm":req.session.sunm,"ulist":result,"olist":result1,"plist":result2})
			}).catch((err2)=>{
				console.log(err2)
			})
		}).catch((err1)=>{
			console.log(err1)
		})
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET Register page. */
router.get('/register', function(req, res, next) {
    indexmodel.fetchAll("register").then((result)=>{
        res.render('register',{"sunm":req.session.sunm,"registerlist":result,"output":""})
	}).catch((err)=>{
	  console.log(err)
	})
});
/* POST Register page. */
router.post('/register', function(req, res, next) {
    // console.log(req.body)
    indexmodel.registerUser(req.body).then((result)=>{
        // res.render('register',{"output":"Registration Successful..."});
        res.redirect('https://books99ob.herokuapp.com/login')
    }).catch((err)=>{
        res.render('register',{"output":"Already have an account with these email. Try to login..."});
        console.log(err)
    })
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login',{"output":""});
});
/* POST login page. */
router.post('/login', function(req, res, next) {
    indexmodel.userLogin(req.body).then((result)=>{
        if(result.length > 0){

        /* To store user details in session */
            req.session.sunm = result[0].name
            req.session.srole = result[0].role
            req.session.username = result[0].email

            if(result[0].role == "admin"){
                res.redirect('/admin');
            }
            else{
                res.redirect('/users')
            }
        }
        else{
            res.render('login',{"output":"Login failid, Invalid email or password or Unverified user..."});
        }
    }).catch((err)=>{
        console.log(err)
    })
});

/* GET categories page. */
router.get('/categories', function(req, res, next) {
    res.render('categories');
});

/* GET gallery page. */
router.get('/gallery', function(req, res, next) {
    res.render('gallery');
});

/* GET search bar. */
router.get('/search', function(req, res, next) {
  	res.render('search');
});

/* GET cart side menu. */
router.get('/cart', function(req, res, next) {
  	res.render('cart');
});

/* GET my account */
router.get('/my-account', function(req, res, next) {
  	res.render('my-account');
});

/* GET Thnakyou page */
router.get('/thankyou', function(req, res, next) {
    res.render('thankyou')
  });

/* GET Project report */
router.get('/report', function(req, res, next) {
    res.render('report')
  });

module.exports = router;
