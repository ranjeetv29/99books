var db = require('./connection')

function indexmodel(){
    this.registerUser=(userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find().toArray((err,result)=>{
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
                    userDetails._id = _id+1
                    userDetails.status = 1
                    userDetails.role = "user"
                    userDetails.info = Date()
                    db.collection("register").insertOne(userDetails,(err,result)=>{
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })
    }

    this.userLogin = (userDetails)=>{
        userDetails.status = 1
        return new Promise((resolve,reject)=>{
            db.collection("register").find(userDetails).toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }
    
    this.fetchAll = (collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find().toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }


}

module.exports=new  indexmodel()