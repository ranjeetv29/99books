var express = require('express');
var router = express.Router();
var adminmodel = require('../models/adminmodel')
var usermodel = require('../models/usermodel')
var url = require('url');
var path = require('path')
const { user } = require('../models/connection');

/* Middleware function to apply security on all users urls */
router.use('/',(req,res,next)=>{
	if(req.session.sunm == undefined || req.session.srole != "user") {
		res.redirect("/login")
	}
	else {
		next()
	}
})

/* Middleware function to fetch user details for update profile*/
var userDetails
router.all('/my-account/epuser',(req,res,next)=>{		// here all() for both get and post
	adminmodel.fetchUser(req.session.username).then((result)=>{
		userDetails = result[0]
		next()
	}).catch((err)=>{
		console.log(err)
	})
})

/* Middleware function to fetch state details for edit address*/
var statelist
router.all('/my-account/address',(req,res,next)=>{		// here all() for both get and post
	usermodel.fetchAll("state").then((result)=>{
		statelist = result
		next()
	}).catch((err)=>{
		console.log(err)
	})
})
router.all('/makepayment',(req,res,next)=>{		// here all() for both get and post
	usermodel.fetchAll("state").then((result)=>{
		statelist = result
		next()
	}).catch((err)=>{
		console.log(err)
	})
})

/* Middleware function to fetch category list*/
var catlist
router.all('/sell',(req,res,next)=>{		// here all() for both get and post
  usermodel.fetchAll("category").then((result)=>{
		catlist = result
		next()
	}).catch((err)=>{
		console.log(err)
	})
})	

// var catprolist
// router.all('/addproduct',(req,res,next)=>{		// here all() for both get and post
// 	adminmodel.fetchAll("category").then((result)=>{
// 		catprolist = result
// 		next()
// 	}).catch((err)=>{
// 		console.log(err)
// 	})
// })

/* Middleware function to fetch address details for update address */
var addressDetails
router.all('/my-account/address',(req,res,next)=>{		// here all() for both get and post
	usermodel.fetchAddress(req.session.username).then((result)=>{
		addressDetails = result[0]
		next()
	}).catch((err)=>{
		console.log(err)
	})
})
router.all('/makepayment',(req,res,next)=>{		// here all() for both get and post
	usermodel.fetchAddress(req.session.username).then((result)=>{
		addressDetails = result[0]
		next()
	}).catch((err)=>{
		console.log(err)
	})
})

/* middleware function for Fech details for contect page */
var userContact
router.all('/usercontact',(req,res,next)=>{		// here all() for both get and post
	adminmodel.fetchUser(req.session.username).then((result)=>{
		userContact = result[0]
		next()
	}).catch((err)=>{
		console.log(err)
	})
})


/* GET user home page */
router.get('/', function(req, res, next) {
  usermodel.fetchAll("category").then((result)=>{
    res.render('userhome',{"sunm":req.session.sunm,"catlist":result})
  }).catch((err)=>{
    console.log(err)
  })
});

/* GET my-account page */
router.get('/my-account', function(req, res, next) {
  res.render('my-account',{"sunm":req.session.sunm})
});

    /* GET my-account page/change password . */
    router.get('/my-account/cpuser', function(req, res, next) {
      res.render('cpuser',{"sunm":req.session.sunm,"username":req.session.username,"output":""})
    });

    /* POST my-account page/change password . */
    router.post('/my-account/cpuser', function(req, res, next) {
      adminmodel.changePasswordAdmin(req.body).then((result)=>{     // Admin is also for user
        if(result.length > 0){
          if(req.body.newpassword == req.body.cnfnewpassword) {
            adminmodel.updatePassword(req.body).then((result1)=>{
              res.render('cpuser',{"sunm":req.session.sunm,"username":req.session.username,"output":"Password Chenged Successfuly..."})
            }).catch((err1)=>{
              console.log(err1)
            })
          }
          else {
            res.render('cpuser',{"sunm":req.session.sunm,"username":req.session.username,"output":"New Password & Confirm Password Field Not Matched, Please Try Again..."})
          }
        }
        else {
          res.render('cpuser',{"sunm":req.session.sunm,"username":req.session.username,"output":"Invalid Password, Please Try Again..."})
        }
      }).catch((err)=>{
        console.log(err)
      })
    });

    /* GET my-account page/edit profile */
    router.get('/my-account/epuser', function(req, res, next) {
      res.render('epuser',{"sunm":req.session.sunm,"username":req.session.username,"output":"","userDetails":userDetails})
    });
    /* POST my-account page/edit profile */
	  router.post('/my-account/epuser', function(req, res, next) {
		  adminmodel.updateUserDetails(req.body).then((result)=>{
			  res.redirect('/users/my-account/epuser')
		  }).catch((err)=>{
			  console.log(err)
		  })
	  });

    /* GET my-account page/edit address */
    router.get('/my-account/address', function(req, res, next) {
      res.render('address',{"sunm":req.session.sunm,"username":req.session.username,"output":"","statelist":statelist,"addressDetails":addressDetails})
    });
    /* POST my-account page/edit address */
    router.post('/my-account/address', function(req, res, next) {
      usermodel.updateAddressDetails(req.body).then((result)=>{
        res.redirect('/users/my-account/address')
        // res.render('address',{"sunm":req.session.sunm,"username":req.session.username,"output":"Address Added Successfully...","statelist":statelist,"addressDetails":addressDetails})
      }).catch((err)=>{
        console.log(err)
      })
    });


/* GET contactus page */
router.get('/usercontact', function(req, res, next) {
    res.render('usercontact',{"sunm":req.session.sunm,"username":req.session.username,"output":"","userContact":userContact})
});

/* GET category list page */
router.get('/categorylist', function(req, res, next) {
  usermodel.fetchAll("category").then((result)=>{
    res.render('categorylist',{"sunm":req.session.sunm,"catlist":result})
  }).catch((err)=>{
    console.log(err)
  })
});

/* GET sub category list page */
router.get('/subcategorylist', function(req, res, next) {
  var catid = parseInt(url.parse(req.url,true).query.catid)
  usermodel.fetchSubCategory(catid).then((result)=>{
    res.render('subcategorylist',{"sunm":req.session.sunm,"subcatlist":result})
  }).catch((err)=>{
    console.log(err)
  })
});

/* GET About us page */
router.get('/userabout', function(req, res, next) {
  res.render('userabout',{"sunm":req.session.sunm})
});

/* GET Gallery us page */
router.get('/usergallery', function(req, res, next) {
  res.render('usergallery',{"sunm":req.session.sunm})
});

/* GET our service page. */
router.get('/userservice', function(req, res, next) {
  adminmodel.fetchUsers().then((result)=>{
		adminmodel.fetchAll("order").then((result1)=>{
			adminmodel.fetchAll1("product").then((result2)=>{
				res.render('userservice',{"sunm":req.session.sunm,"ulist":result,"olist":result1,"plist":result2})
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

/* GET view books page */
router.get('/viewbooks', function(req, res, next) {
  var catid = parseInt(url.parse(req.url,true).query.catid)
  usermodel.fetchAll("category").then((result)=>{
    if(result.length > 0) {
      var subcatid = url.parse(req.url, true).query.subcatid
      usermodel.fetchSubCategory(catid).then((result1)=>{
        if(result.length > 0) {
          usermodel.fetchBooks(subcatid).then((result2)=>{
            if(result.length > 0){
              usermodel.fetchUsersBook(subcatid).then((result3)=>{
                res.render('viewbooks',{"sunm":req.session.sunm,"blist":result2,"userblist":result3,"catlist":result,"subcatlist":result1})
              }).catch((err3)=>{
                console.log(err3)
              })
            }
          }).catch((err2)=>{
            console.log(err2)
          })
        }
      }).catch((err1)=>{
        console.log(err1)    
      })
    }
  }).catch((err)=>{
    console.log(err)
  })
})

/* GET my order page */
router.get('/myorder', function(req, res, next) {
  var urlObj = url.parse(req.url, true).query
  var bid = parseInt(urlObj.bid)
  var title = urlObj.title
  var discription = urlObj.discription
  var price = parseInt(urlObj.price)
  var qty = 1
  var bookimgnm = urlObj.bookimgnm
  var status = urlObj.status
  res.render('myorder',{"sunm":req.session.sunm,"bid":bid,"price":price,"qty":qty,"title":title,"discription":discription,"bookimgnm":bookimgnm,"status":status})
});


/* GET make payment page. */
router.get('/makepayment', function(req, res, next) {
  var urlMakePay = url.parse(req.url, true).query
  var bid = parseInt(urlMakePay.bid)
  var price = parseInt(urlMakePay.price)
  var title = urlMakePay.title
  var qty = 1
  var amount = parseInt(price*qty)
  var PAYPAL_URL = "https://www.sandbox.paypal.com/cgi-bin/webscr"
  var PAYPAL_ID = "sb-9luxz6362848@business.example.com"
  res.render('makepayment',{"sunm":req.session.sunm,"username":req.session.username,"bid":bid,"price":price,"title":title,"qty":qty,"amount":amount,"PAYPAL_URL":PAYPAL_URL,"PAYPAL_ID":PAYPAL_ID,"statelist":statelist,"addressDetails":addressDetails});
});
/* POST make payment page/edit address */
router.post('/makepayment', function(req, res, next) {
  var urlMakePay = url.parse(req.url, true).query
  var bid = parseInt(urlMakePay.bid)
  var price = parseInt(urlMakePay.price)
  var title = urlMakePay.title
  var qty = 1
  var amount = parseInt(price*qty)
  var PAYPAL_URL = "https://www.sandbox.paypal.com/cgi-bin/webscr"
  var PAYPAL_ID = "sb-9luxz6362848@business.example.com"
  res.render('makepayment',{"sunm":req.session.sunm,"username":req.session.username,"bid":bid,"price":price,"title":title,"qty":qty,"amount":amount,"PAYPAL_URL":PAYPAL_URL,"PAYPAL_ID":PAYPAL_ID,"statelist":statelist,"addressDetails":addressDetails});
});

/* GET payment sussess page. */
router.get('/paymentdetails', function(req, res, next) {
  var paymentDetails = url.parse(req.url, true).query
  usermodel.addOrder(paymentDetails).then((result)=>{
    res.redirect('https://books99ob.herokuapp.com/users/success')
  }).catch((err)=>{
    console.log(err)
  })
});

/* GET Success page */
router.get('/success', function(req, res, next) {
  res.render('success',{"sunm":req.session.sunm})
});

/* GET Cancel page */
router.get('/cancel', function(req, res, next) {
  res.render('cancel',{"sunm":req.session.sunm})
});

/* GET Thnakyou page */
router.get('/userthankyou', function(req, res, next) {
  res.render('userthankyou',{"sunm":req.session.sunm})
});

/* GET Cancel page */
router.get('/cancel', function(req, res, next) {
  res.render('cancel',{"sunm":req.session.sunm})
});

/* GET view order page */
router.get('/viewordersuser', function(req, res, next) {
  usermodel.fetchOrder(req.session.username).then((result)=>{
    res.render('viewordersuser',{"sunm":req.session.sunm,"olist":result})
  }).catch((err)=>{
    console.log(err)
  })
});


/* GET fetch state list */
router.get('/fetchStateAJAX', function(req, res, next) {
  var state = url.parse(req.url,true).query.state
  usermodel.fetchStateAJAX(state).then((result)=>{
    var citylist_options = "<option>Select City</option>"
    for(let row of result) {
      citylist_options += ("<option value='"+row.citynm+"'>"+row.citynm+"</option>")
    }
    res.send(citylist_options)  
  }).catch((err)=>{
    console.log(err)
  })
});

/* GET Sell book page */
router.get('/sell', function(req, res, next) {
  res.render('sell',{"sunm":req.session.sunm,"username":req.session.username,"output":"","catlist":catlist})
});
/* POST Sell book page */
router.post('/sell', function(req, res, next) {
  var bookimg = req.files.bookimg
  var bookimgnm = Date.now()+"-user-"+bookimg.name
  var uploadpath = path.join(__dirname,"../public/uploads/productimages",bookimgnm)
  req.body.bookimgnm = bookimgnm
  usermodel.addProduct(req.body).then((result)=>{
    bookimg.mv(uploadpath)
    res.render('sell',{"sunm":req.session.sunm,"username":req.session.username,"output":"Book Added Successfully....","catlist":catlist})
  }).catch((err)=>{
    console.log(err)
  })
});
/* GET fetchSubcategoryAJAX */
router.get('/fetchSubcategoryAJAX', function(req, res, next) {
	var catid = parseInt(url.parse(req.url,true).query.catid)
	adminmodel.fetchSubcategoryAJAX(catid).then((result)=>{
		var sclist_options = "<option>Select Sub Category</option>"
		for(let row of result) {
			sclist_options += ("<option value='"+row._id+"'>"+row.subcatnm+"</option>")
		}
		res.send(sclist_options)
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET viewselluser page */
router.get('/viewselluser', function(req, res, next) {
  usermodel.fetchUserProduct(req.session.username).then((result)=>{
    res.render('viewselluser',{"sunm":req.session.sunm,"usersellbook":result})
  }).catch((err)=>{
    console.log(err)
  })
});

/* Action on viewselluser page */
router.get('/manageuserbooksstatus', function(req, res, next) {
	var obj = url.parse(req.url, true).query
	adminmodel.manageUserBooksStatus(obj).then((result)=>{
		res.redirect('/users/viewselluser')
	}).catch((err)=>{
		console.log(err)
	})
});




module.exports = router;
