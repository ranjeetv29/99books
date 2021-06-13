var express = require('express');
var router = express.Router();
var adminmodel = require('../models/adminmodel')
var path = require('path')
var url = require('url');
const { Console } = require('console');

/* Middleware function to apply security on all admin urls */
router.use("/", (req,res,next)=>{
	if(req.session.sunm==undefined || req.session.srole!="admin") {
		res.redirect("/login")
	}
	else {
		next()
	}
})

/* Middleware function to fetch category list*/
var catlist
router.all('/addsubcategories',(req,res,next)=>{		// here all() for both get and post
	adminmodel.fetchAll("category").then((result)=>{
		catlist = result
		next()
	}).catch((err)=>{
		console.log(err)
	})
})	

var catprolist
router.all('/addproduct',(req,res,next)=>{		// here all() for both get and post
	adminmodel.fetchAll("category").then((result)=>{
		catprolist = result
		next()
	}).catch((err)=>{
		console.log(err)
	})
})

/* Middleware function to fetch state list */
var stlist
router.all('/addcity',(req,res,next)=>{
	adminmodel.fetchAll("state").then((result)=>{
		stlist = result
		next()
	}).catch((err)=>{
		console.log(err)
	})
})

/* Middleware function to fetch user details for update profile*/
var userDetails
router.all('/adminprofile/epadmin',(req,res,next)=>{		// here all() for both get and post
	adminmodel.fetchUser(req.session.username).then((result)=>{
		userDetails = result[0]
		next()
	}).catch((err)=>{
		console.log(err)
	})
})

/* GET Admin home page. */
router.get('/', function(req, res, next) {
	//-------------------------------
	adminmodel.fetchUsers().then((result)=>{
		adminmodel.fetchAll("order").then((result1)=>{
			adminmodel.fetchAll1("product").then((result2)=>{
				res.render('adminhome',{"sunm":req.session.sunm,"ulist":result,"olist":result1,"plist":result2})
			}).catch((err2)=>{
				console.log(err2)
			})
		}).catch((err1)=>{
			console.log(err1)
		})
	}).catch((err)=>{
		console.log(err)
	})
	//-------------------------------
	// res.render('adminhome',{"sunm":req.session.sunm})
});

/* GET Manage Users listing. */
router.get('/manageusers', function(req, res, next) {
	adminmodel.fetchUsers().then((result)=>{
		res.render('manageusers',{"userDetails":result,"sunm":req.session.sunm})
	}).catch((err)=>{
		console.log(err)
	})
});

/* action on menege users list */
router.get('/manageuserstatus', function(req, res, next) {
	var obj = url.parse(req.url,true).query
	adminmodel.manageUserStatus(obj).then((result)=>{
		res.redirect('/admin/manageusers')
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET Add Categories page. */
router.get('/addcategories', function(req, res, next) {
	res.render('addcategories',{"output":"","sunm":req.session.sunm})
});

/* POST Add Categories page. */
router.post('/addcategories', function(req, res, next) {
	var catnm = req.body.catnm
	var catimg = req.files.catimg
	var catimgnm = Date.now()+"--"+catimg.name
	var uploadpath = path.join(__dirname,"../public/uploads/categoryimages",catimgnm)
	adminmodel.AddCategory(catnm,catimgnm).then((result)=>{
		catimg.mv(uploadpath)
		res.render('addcategories',{"output":"Category Added Successfully...","sunm":req.session.sunm})
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET Add Sub-Categories page. */
router.get('/addsubcategories', function(req, res, next) {
	res.render('addsubcategories',{"output":"","catlist":catlist,"sunm":req.session.sunm})
});

/* POST Add Sub-Categories page. */
router.post('/addsubcategories', function(req, res, next) {
	var catid = parseInt(req.body.catid)
	var subcatnm = req.body.subcatnm
	var catimg = req.files.catimg
	var subcatimgnm = Date.now()+"--"+catimg.name
	var uploadpath = path.join(__dirname,"../public/uploads/subcategoryimages",subcatimgnm)
	adminmodel.AddSubCategory(catid,subcatnm,subcatimgnm).then((result)=>{
		catimg.mv(uploadpath)
		res.render('addsubcategories',{"output":"Sub-Category Added Successfully...","catlist":catlist,"sunm":req.session.sunm})
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET Admin profile page. */
router.get('/adminprofile', function(req, res, next) {
	res.render('adminprofile',{"sunm":req.session.sunm})
});

	/* GET Admin profile page/change password . */
	router.get('/adminprofile/cpadmin', function(req, res, next) {
		res.render('cpadmin',{"sunm":req.session.sunm,"username":req.session.username,"output":""})
	});

	/* POST Admin profile page/change password . */
	router.post('/adminprofile/cpadmin', function(req, res, next) {
		adminmodel.changePasswordAdmin(req.body).then((result)=>{
			if(result.length > 0){
				if(req.body.newpassword == req.body.cnfnewpassword) {
					adminmodel.updatePassword(req.body).then((result1)=>{
						res.render('cpadmin',{"sunm":req.session.sunm,"username":req.session.username,"output":"Password Chenged Successfuly..."})
					}).catch((err1)=>{
						console.log(err1)
					})
				}
				else {
					res.render('cpadmin',{"sunm":req.session.sunm,"username":req.session.username,"output":"New Password & Confirm Password Field Not Matched, Please Try Again..."})
				}
			}
			else {
				res.render('cpadmin',{"sunm":req.session.sunm,"username":req.session.username,"output":"Invalid Password, Please Try Again..."})
			}
		}).catch((err)=>{
			console.log(err)
		})
	});

	/* GET Admin profile page/edit profile */
	router.get('/adminprofile/epadmin', function(req, res, next) {
		res.render('epadmin',{"sunm":req.session.sunm,"username":req.session.username,"output":"","userDetails":userDetails})
	});

	/* POST Admin profile page/edit profile */
	router.post('/adminprofile/epadmin', function(req, res, next) {
		adminmodel.updateUserDetails(req.body).then((result)=>{
			res.redirect('/admin/adminprofile/epadmin')
			// res.render('epadmin',{"sunm":req.session.sunm,"username":req.session.username,"output":"Profile Updated Successfully...","userDetails":userDetails})
		}).catch((err)=>{
			console.log(err)
		})
	});

/* GET Add product page. */
router.get('/addproduct', function(req, res, next) {
	res.render('addproduct',{"sunm":req.session.sunm,"output":"","catprolist":catprolist})
});

/* POST Add product page. */
router.post('/addproduct', function(req, res, next) {
	var bookimg = req.files.bookimg
	var bookimgnm = Date.now()+"--"+bookimg.name
	var uploadpath = path.join(__dirname,"../public/uploads/productimages",bookimgnm)
	req.body.bookimgnm = bookimgnm
	adminmodel.addProduct(req.body).then((result)=>{
		bookimg.mv(uploadpath)
		res.render('addproduct',{"sunm":req.session.sunm,"output":"Product Added Successfully....","catprolist":catprolist})
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

/* GET view All order page */
router.get('/viewordersadmin', function(req, res, next) {
	adminmodel.fetchAll("order").then((result)=>{
	  res.render('viewordersadmin',{"sunm":req.session.sunm,"olist":result})
	}).catch((err)=>{
	  console.log(err)
	})
});

/* action on category list */
router.get('/viewordersadminstatus', function(req, res, next) {
	var obj = url.parse(req.url,true).query
	adminmodel.manageOrderStatus(obj).then((result)=>{
		res.redirect('/admin/viewordersadmin')
	}).catch((err)=>{
		console.log(err)
	})
});
  
/* GET manage category page */
router.get('/managecategory', function(req, res, next) {
	adminmodel.fetchAll("category").then((result)=>{
	  res.render('managecategory',{"sunm":req.session.sunm,"catlist":result})
	}).catch((err)=>{
	  console.log(err)
	})
});

/* action on category list */
router.get('/managecategorystatus', function(req, res, next) {
	var obj = url.parse(req.url,true).query
	adminmodel.manageCategoryStatus(obj).then((result)=>{
		res.redirect('/admin/managecategory')
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET manage sub category  page */
router.get('/managesubcategory', function(req, res, next) {
	adminmodel.fetchAll("subcategory").then((result)=>{
	  res.render('managesubcategory',{"sunm":req.session.sunm,"subcatlist":result})
	}).catch((err)=>{
	  console.log(err)
	})
});

/* action on sub category list */
router.get('/managesubcategorystatus', function(req, res, next) {
	var obj = url.parse(req.url,true).query
	adminmodel.manageSubCategoryStatus(obj).then((result)=>{
		res.redirect('/admin/managesubcategory')
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET manage product page */
router.get('/manageproduct', function(req, res, next) {
	adminmodel.fetchAll("product").then((result)=>{
	  res.render('manageproduct',{"sunm":req.session.sunm,"productlist":result})
	}).catch((err)=>{
	  console.log(err)
	})
});

/* action on product list */
router.get('/manageproductstatus', function(req, res, next) {
	var obj = url.parse(req.url,true).query
	adminmodel.manageProductStatus(obj).then((result)=>{
		res.redirect('/admin/manageproduct')
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET Add state page. */
router.get('/addstate', function(req, res, next) {
	res.render('addstate',{"output":"","sunm":req.session.sunm})
});
/* POST Add state page. */
router.post('/addstate', function(req, res, next) {
	var statenm = req.body.statenm
	adminmodel.addState(statenm).then((result)=>{
		res.render('addstate',{"output":"State Added Successfully....","sunm":req.session.sunm})
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET manage state page */
router.get('/managestate', function(req, res, next) {
	adminmodel.fetchAll("state").then((result)=>{
	  res.render('managestate',{"sunm":req.session.sunm,"statelist":result})
	}).catch((err)=>{
	  console.log(err)
	})
});
/* action on state list */
router.get('/managestatestatus', function(req, res, next) {
	var obj = url.parse(req.url,true).query
	adminmodel.manageStateStatus(obj).then((result)=>{
		res.redirect('/admin/managestate')
	}).catch((err)=>{
		console.log(err)
	})
});


/* GET Add city page. */
router.get('/addcity', function(req, res, next) {
	res.render('addcity',{"output":"","sunm":req.session.sunm,"stlist":stlist})
});
/* POST Add city page. */
router.post('/addcity', function(req, res, next) {
	var statenm = req.body.statenm
	var citynm = req.body.citynm
	adminmodel.addCity(statenm,citynm).then((result)=>{
		res.render('addcity',{"output":"City Added Successfully....","sunm":req.session.sunm,"stlist":stlist})
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET manage city page */
router.get('/managecity', function(req, res, next) {
	adminmodel.fetchAll("city").then((result)=>{
	  res.render('managecity',{"sunm":req.session.sunm,"citylist":result})
	}).catch((err)=>{
	  console.log(err)
	})
});
/* action on city list */
router.get('/managecitystatus', function(req, res, next) {
	var obj = url.parse(req.url,true).query
	adminmodel.manageCityStatus(obj).then((result)=>{
		res.redirect('/admin/managecity')
	}).catch((err)=>{
		console.log(err)
	})
});

/* GET viewselladmin page */
router.get('/viewselladmin', function(req, res, next) {
	adminmodel.fetchUserProduct().then((result)=>{
	  	res.render('viewselladmin',{"sunm":req.session.sunm,"usersellbook":result})
	}).catch((err)=>{
	  	console.log(err)
	})
  });

/* Action on viewselluser page */
router.get('/manageuserbooksstatus', function(req, res, next) {
	var obj = url.parse(req.url, true).query
	adminmodel.manageUserBooksStatus(obj).then((result)=>{
		res.redirect('/admin/viewselladmin')
	}).catch((err)=>{
		console.log(err)
	})
});
  

module.exports = router;
