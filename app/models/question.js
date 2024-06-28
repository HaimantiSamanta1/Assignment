const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
    skill_id: {
              type: Number, 
              required: true 
             },
    difficulty_level: { 
                      type: String,
                      enum: ['easy', 'medium', 'hard'], 
                      required: true 
                    },
    question: { 
              type: String, 
              required: true 
              },
    response: { 
               type: String 
              },
    rating: { 
            type: Number
            },
    reviewedBy: {
              type: Schema.Types.ObjectId,
              ref: 'User',
              default: null
    }
  });
  
  module.exports = mongoose.model('Question', QuestionSchema,'questions');