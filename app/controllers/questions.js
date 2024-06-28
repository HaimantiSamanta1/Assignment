const Question = require('../models/question');
const questioService = require('../services/rating-service');

//Create a question START
exports.addQuestion = async (req, res) => {   
    try {
        const { skill_id, difficulty_level, question, response } = req.body;
        const newQuestion = new Question({ skill_id, difficulty_level, question, response });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
//Create a question END

//Get all questions START
exports.getQuestion = async (req, res) => {   
try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
//Get all questions END

//Get a question by ID
exports.getParticulerQuestionDetails=async(req,res)=>{
    try{
        const {_id} = req.params
        const question = await Question.findById(_id);
          if (!question) {
              return res.status(404).json({ Status: false, message: 'Question ID not found!' });
          }
          const result = await Question.find()
          return res.status(200).json({Status:true,result})
        } catch (error) {
          console.error('Error updating material details:', error.message);
          return res.status(500).json({ success: false, message: error.message });
      }
  }
  //Get a question by ID

//Delete a question START
exports.deleteQuestion = async(req,res)=>{
  try{
      let {id} = req.params
      let data = await questioService.findAndDeleteQuestion(id)
      if(data){
          return res.status(200).json({Status:true,message:'Question delete successfully',data})
      }else{
          return res.status(404).send({Status:false,message:'Not Found Question Id'})
      }
  }catch(err){
      console.log("deleteAccount error",err);
      return res.status(400).json({Status:false,message:'sorry! somthing went wrong'})
  }
};
//Delete a question END


//Update Question Details START
exports.updateQuestionDetails = async (req,res) => {
    try{
        // Extract question ID from request parameters
        const { question_id } = req.params;
        // Extract the updated data from request body
        const {skill_id,difficulty_level,question} = req.body
       
        let data ={};    
        const data1 = {
            skill_id:skill_id||'',
            difficulty_level:difficulty_level||'',
            question:question||'',                
           }
       data = data1
            const result = await questioService.updateQuestionDetails(question_id,data)
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
//Update Question Details START
