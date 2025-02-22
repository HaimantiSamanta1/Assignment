const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { 
            type: String, 
            required: true 
        },
  role: { 
            type: String, 
            enum: ['candidate', 'reviewer'], 
            required: true 
         },
  email: { 
            type: String, 
            required: true, 
            unique: true 
         },
  password:{ 
            type: String, 
            required: true 
           }
});

module.exports = mongoose.model('User', UserSchema);