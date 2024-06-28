const Question = require('../models/question');
const ObjectId = require('mongoose').Types.ObjectId

class questionServie{    
  //Delete rating and reviewer id START 
  async findAndDeleteQuestion(id) {
    try {
      return await Question.findByIdAndUpdate(
        id,
        { $unset: { rating: "", reviewedBy: "" } },
        { new: true }
      );
    } catch (err) {
      throw err;
    }
  }
  //Delete rating and reviewer id END
  //Get a particuler Question info START
  async GetQuestionInformation(_id) {
      try {
        const result = await Question.findById(_id)
        return { Status: true, data: result }
      } catch (err) {
        throw err
      }
  }
  //Get a particuler Question info END

  //Update a questong rating START
  async updateQuestionRating(id, rating) {
      try {
        let result = await Question.findByIdAndUpdate(
          id,
          { $set: { rating: rating } },
          { new: true }
        );
        return { Status: true, result };
      } catch (err) {
        console.log('updateQuestionRating error', err);
        throw err;
      }
    }
   //Update a questong rating END 

   //Update Question Details START
   async updateQuestionDetails(question_id,data){
    try{
          let result = await Question.findByIdAndUpdate(question_id,{$set:data},{new:true})
          return {Status:true,result}   
      }
    catch(err){
      console.log('updateProfile err',err);
      throw err
    }
  }
   //Update Question Details END

}



module.exports = new questionServie()