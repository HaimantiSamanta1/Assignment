const Users = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId
const tokenService = require('../services/jwt-service');

class userServie{

    //Find a particuler account by email START
    async findAccount(email){
      try{
          const data = await Users.findOne({email:email})
          if(data){
            return data;
          }
          else{
            return false;
          }
      }catch(err){
        console.log('service error',err);
        throw err
      }
    }
    //Find a particuler account by email END
  
    // Create user account SRART
    async createAccount(data){
      try{
        return await Users.create(data)
      }catch(err){
        console.log('create service ',err);
        throw err
      }
    }
  //Create user account END

  
    //Find a particuler user account by email START
    async findAccount(email) {
      try {
        const data = await Users.findOne({ email: email })
            if (data) {
              return data;
            }else {
              return false;
            }
      } catch (err) {
        console.log('service error', err);
        throw err
      }
    }
    //Find a particuler user account by email END

    //Find user details START
    async GetUserInformation(user_id){
            try{
                return await Users.findById(user_id)
            }catch(err){
              console.log('getprofile service err',err);
              throw new Error()
            }
    }
    //Find user details START

    //find and delete user account START
    async findAndDeleteUserAccount(id){
      try{
        return await Users.findByIdAndDelete(id,{$set:{active:false}},{new:true})
      }catch(err){
        throw err
      }
    }
    //find and delete user account END

  //find and update a user account START
    async UpdatePorfile(user_id,data){
      try{
        let email = data.email,mobilenumber=data.mobilenumber
        let odata = await Users.findOne({email:email})
        if(odata && odata._id!=user_id){
          console.log(odata._id,odata._id!=user_id,user_id!==new ObjectId(user_id),user_id)
          return {Status:false,message:'This email already exist'}
        }else{
            
            let result = await Users.findByIdAndUpdate(user_id,{$set:data},{new:true})
            return {Status:true,result}
      
        }
      }
      catch(err){
        console.log('updateProfile err',err);
        throw err
      }
    }
  //find and update a user account END

  //Get token details info START
  async finduserAccountdetails(token) {
    try {
      const decodedToken = tokenService.verifyAccessToken(token);

      if (!decodedToken || !decodedToken.user_id) {
        throw new Error('Invalid token');
      }

      const user = await Users.findById(decodedToken.user_id)
        .select('-createdAt -updatedAt -tokens -noti -password -__v') // Exclude fields
        .exec();

      return user;
    } catch (err) {
      console.log('service error', err);
      throw err;
    }
  }
//Get token details info END
}

module.exports = new userServie()