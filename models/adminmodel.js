var db = require('./connection')

function adminmodel(){
    this.AddCategory=(catnm,catimgnm)=>{
        var catDetails = {}
        return new Promise((resolve,reject)=>{
            db.collection("category").find().toArray((err,result)=>{
                if(err){
                    reject(err)
                }
                else{
                    var _id
                    if(result.length == 0){
                        _id = 0
                    }
                    else{
                        _id = result[0]._id
                        for(let row of result){
                            if(_id < row._id){
                                _id = row._id
                            }
                        }
                    }
                    catDetails._id = _id+1
                    catDetails.catnm = catnm
                    catDetails.catimgnm = catimgnm
                    db.collection("category").insertOne(catDetails,(err,result)=>{
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })
    }

    this.fetchUsers = ()=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({"role":"user"}).toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.manageUserStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            if(obj.s == "block") {
                db.collection("register").updateOne({"_id":parseInt(obj.regid)},{$set:{"status":0}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else if(obj.s == "verify") {
                db.collection("register").updateOne({"_id":parseInt(obj.regid)},{$set:{"status":1}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else {
                db.collection("register").remove({"_id":parseInt(obj.regid)},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
        })
    }

    this.fetchAll = (collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find().toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.fetchAll1 = (collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find().toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.AddSubCategory=(catid,subcatnm,subcatimgnm)=>{
        var subcatDetails={}
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find().toArray((err,result)=>{
                if(err) {
                    reject(err)
                }
                else {
                    var _id
                    if(result.length == 0) {
                        _id = 0
                    }
                    else {
                        _id = result[0]._id
                        for(let row of result) {
                            if(_id < row._id){
                                _id = row._id
                            }
                        }
                    }
                    subcatDetails._id = _id+1
                    subcatDetails.catid = catid
                    subcatDetails.subcatnm = subcatnm
                    subcatDetails.subcatimgnm = subcatimgnm
                    db.collection("subcategory").insertOne(subcatDetails,(err,result)=>{
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })
    }

    this.changePasswordAdmin=(formData)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({"email":formData.username,"password":formData.oldpassword}).toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.updatePassword=(formData)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").update({"email":formData.username},{$set:{"password":formData.cnfnewpassword}},(err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.fetchUser = (email)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({"email":email}).toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.updateUserDetails = (userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").update({"email":userDetails.email},{$set:{"name":userDetails.name,"mobile":userDetails.mobile,"dob":userDetails.dob}},(err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.fetchSubcategoryAJAX=(catid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find({"catid":catid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.addProduct=(pDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("product").find().toArray((err,result)=>{
                if(err){
                    reject(err)
                }
                else{
                    var _id
                    if(result.length == 0){
                        _id = 0
                    }
                    else{
                        _id = result[0]._id
                        for(let row of result){
                            if(_id < row._id){
                                _id = row._id
                            }
                        }
                    }
                    pDetails._id = _id+1
                    pDetails.status = "available"
                    db.collection("product").insertOne(pDetails,(err,result)=>{
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })
    }

    this.manageCategoryStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            db.collection("category").remove({"_id":parseInt(obj.catid)},(err,result)=>{
                err ? reject(err) : resolve(result)
            })
            
        })
    }

    this.manageSubCategoryStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").remove({"_id":parseInt(obj.subcatid)},(err,result)=>{
                err ? reject(err) : resolve(result)
            })
            
        })
    }

    this.manageProductStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            if(obj.s == "available") {
                db.collection("product").updateOne({"_id":parseInt(obj.pid)},{$set:{"status":"available"}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else if(obj.s == "not-available") {
                db.collection("product").updateOne({"_id":parseInt(obj.pid)},{$set:{"status":"not-available"}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else {
                db.collection("product").remove({"_id":parseInt(obj.pid)},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
        })
    }

    this.manageOrderStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            if(obj.s == "block") {
                db.collection("order").updateOne({"_id":parseInt(obj.oid)},{$set:{"status":0}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else if(obj.s == "verify") {
                db.collection("order").updateOne({"_id":parseInt(obj.oid)},{$set:{"status":1}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else {
                db.collection("order").remove({"_id":parseInt(obj.oid)},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
        })
    }

    this.addState = (statenm)=>{
        var stateName = {}
        return new Promise((resolve,reject)=>{
            db.collection("state").find().toArray((err,result)=>{
                if(err){
                    reject(err)
                }
                else{
                    var _id
                    if(result.length==0){
                        _id=0
                    }
                    else {
                        _id = result[0]._id
                        for(let row of result){
                            if(_id<row._id){
                                _id=row._id
                            }
                        }
                    }
                    stateName._id = _id+1
                    stateName.statenm = statenm
                    stateName.status = 0
                    db.collection("state").insertOne(stateName,(err,result)=>{
                        err ? reject(err) : resolve(result);
                    })
                }
            })
        })
    }

    this.manageStateStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            if(obj.s == "available") {
                db.collection("state").updateOne({"_id":parseInt(obj.sid)},{$set:{"status":1}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else if(obj.s == "not-available") {
                db.collection("state").updateOne({"_id":parseInt(obj.sid)},{$set:{"status":0}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else {
                db.collection("state").remove({"_id":parseInt(obj.sid)},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
        })
    }

    
    this.addCity = (statenm,citynm)=>{
        var cityName = {}
        return new Promise((resolve,reject)=>{
            db.collection("city").find().toArray((err,result)=>{
                if(err){
                    reject(err)
                }
                else{
                    var _id
                    if(result.length==0){
                        _id=0
                    }
                    else {
                        _id = result[0]._id
                        for(let row of result){
                            if(_id<row._id){
                                _id=row._id
                            }
                        }
                    }
                    cityName._id = _id+1
                    cityName.statenm = statenm
                    cityName.citynm = citynm
                    cityName.status = 0
                    db.collection("city").insertOne(cityName,(err,result)=>{
                        err ? reject(err) : resolve(result);
                    })
                }
            })
        })
    }
    this.manageCityStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            if(obj.s == "available") {
                db.collection("city").updateOne({"_id":parseInt(obj.cityid)},{$set:{"status":1}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else if(obj.s == "not-available") {
                db.collection("city").updateOne({"_id":parseInt(obj.cityid)},{$set:{"status":0}},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
            else {
                db.collection("city").remove({"_id":parseInt(obj.cityid)},(err,result)=>{
                    err ? reject(err) : resolve(result)
                })
            }
        })
    }

    this.fetchUserProduct = ()=>{
        return new Promise((resolve,reject)=>{
            db.collection("userproduct").find().toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.manageUserBooksStatus = (obj)=>{
        return new Promise((resolve,reject)=>{
            if(obj.s == "not-available") {
                db.collection("userproduct").updateOne({"_id":parseInt(obj.usersellid)},{$set:{"status":0}},(err,result)=>{
                    err ? reject(err) : resolve(result);
                })
            }
            else if(obj.s == "available"){
                db.collection("userproduct").updateOne({"_id":parseInt(obj.usersellid)},{$set:{"status":1}},(err,result)=>{
                    err ? reject(err) : resolve(result);
                })
            }
            else (
                db.collection("userproduct").remove({"_id":parseInt(obj.usersellid)},(err,result)=>{
                    err ? reject(err) : resolve(result);
                })
            )
        })
    }
}



module.exports=new  adminmodel()