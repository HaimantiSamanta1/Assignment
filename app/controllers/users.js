const Users = require('../models/user');
var validator = require("email-validator");
const userService = require('../services/user-service');
const jwtTokenService = require('../services/jwt-service');
const bcrypt = require('bcrypt');

//Registration User Account START
exports.registration = async (req, res) => {
    try{  
        const {name,role,email,password} = req.body         
        if(!req.body.name || !req.body.role ||!req.body.email ||!req.body.password){
            return res.status(406).send({Status:false,message:'Please enter all required fields!'})
        }
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        if(validator.validate(email)===true) {  
           const result = await userService.findAccount(email)          
                if(result){
                            return res.status(400).json({Status:false,message:'This Email Already Exist!'})
                }else{
                    var data = {
                            name,
                            role,
                            email:email,
                            password :hashedPassword                   
                        }
                    const response = await userService.createAccount(data)
                    const Authorization  = jwtTokenService.generateJwtToken({user_id:response._id,LoggedIn:true})
                    await jwtTokenService.storeRefreshToken(Authorization,response._id)
                    console.log("registaration Data ",response)
                    return res.status(200).json({Status:true,message:response})
                }
        }else{
                return res.status(400).json({Status:false,message:'Email is not valid'})
             }              
    } catch (error) {
        console.error('Error updating material details:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
//Registration User Account END

//User login START
exports.loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await userService.findAccount(email);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ status: false, message: 'The email/password is invalid.' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: false, message: 'The email/password is invalid.' });
        }

        // Generate JWT token
        const newAccessToken = jwtTokenService.generateJwtToken({
            user_id: user._id,
            LoggedIn: true,
        });

        // Store the refresh token
        await jwtTokenService.updateRefreshToken(user._id, newAccessToken);

        // Send the response with the access token
        return res.status(200).json({
            status: true,
            message: 'Login successful!',
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Error updating material details:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
//User login END

//Read a User Account START
exports.getUserDetails=async(req,res)=>{
    try{
        const {user_id} = req.userData
        const data = await userService.GetUserInformation(user_id)
        return res.status(200).json({Status:true,data})
    }catch(err){
        console.log(err);
        return res.status(400).json({Status:false,message:err.message})
    }
};
//Read a User Account End

//Delete User Account START
exports.deleteAccount = async(req,res)=>{
    try{
        let {account_id} = req.params
        let data = await userService.findAndDeleteUserAccount(account_id)
        if(data){
            return res.status(200).json({Status:true,message:'Account delete successfully',data})
        }else{
            return res.status(404).send({Status:false,message:'Not Found User Account'})
        }
    }catch(err){
        console.log("deleteAccount error",err);
        return res.status(400).json({Status:false,message:'sorry! somthing went wrong'})
    }
};
//Delete User Account END

//Update All user data  START
exports.updateUserPorfile = async (req,res) => {
    try{
        const {name,role,email,password} = req.body
        console.log(name,role,email,password)
        const {user_id} = req.userData;
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        let data ={};    
        const data1 = {
           name:name||'',
           role:role||'',
           email:email||'',
           password:hashedPassword||'',         
           }
       data = data1
            const result = await userService.UpdatePorfile(user_id,data)
            if(result.Status===true){
            let updateData = result.result
                return res.status(200).json({Status:true,message:'Update Profile Successful!',updateData})
            }
            else{
                return res.status(200).json(result)
            }
       
        }catch(err){
            console.log("deleteAccount error",err);
            return res.status(400).json({Status:false,message:'sorry! somthing went wrong'})
        }
};
//Update All user data END