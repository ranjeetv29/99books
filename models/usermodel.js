var db = require('./connection')

function usermodel() {
    this.fetchSubCategory = (catid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find({"catid":catid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.fetchBooks = (subcatid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("product").find({"subcatid":subcatid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }
    this.fetchUsersBook = (subcatid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("userproduct").find({"subcatid":subcatid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.fetchAll = (collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find().toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.addOrder = (paymentDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("order").find().toArray((err,result)=>{
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
                    paymentDetails._id = _id+1
                    paymentDetails.info = Date()
                    paymentDetails.status = "receive"
                    db.collection("order").insertOne(paymentDetails,(err,result)=>{
                        err ? reject(err) : resolve(result);
                    })
                }
            })
        })
    }

    this.fetchOrder = (uid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("order").find({"uid":uid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.fetchStateAJAX = (state)=>{
        return new Promise((resolve,reject)=>{
            db.collection("city").find({"statenm":state}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.fetchAddress = (username)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({"email":username}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.updateAddressDetails = (addressDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").updateOne({"email":addressDetails.email},{$set:{"state":addressDetails.state,"city":addressDetails.city,"address":addressDetails.address,"zip":addressDetails.zip}},(err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.addProduct=(userBookDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("userproduct").find().toArray((err,result)=>{
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
                    userBookDetails._id = _id+1
                    userBookDetails.info = Date()
                    userBookDetails.status = 0
                    db.collection("userproduct").insertOne(userBookDetails,(err,result)=>{
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })
    }

    this.fetchUserProduct = (uid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("userproduct").find({"uid":uid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }
}

module.exports=new  usermodel()