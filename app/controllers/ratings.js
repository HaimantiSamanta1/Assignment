const Question = require('../models/question');
const User = require('../models/user');
const userService = require('../services/user-service');
const ratingService = require('../services/rating-service')

// Create a new rating START
exports.addRating = async (req, res) => {
    try {
      const { questionId } = req.params; 
      const { rate } = req.body;
      let { token } = req.userData;

        const accessToken = req.headers['authorization'].split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({
                status: false,
                message: 'Token not provided.',
            });
        }

        const user = await userService.finduserAccountdetails(accessToken)
        // Log the assignAs property
      
        console.log('User name:', user.name);
        console.log('User role:', user.role);
        console.log('User id:', user._id);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'User not found.',
                local: accessToken
            });
        }
    
      if (user.role !== 'reviewer') {
        return res.status(403).json({ error: 'Only reviewers can rate candidate responses' });
      }
    
      // Find the question by its ID
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Update the question with rating and reviewer information
    question.rating = rate;
    question.reviewedBy = user._id; // Save the reviewer's ID

    // Save the updated question
    const updatedQuestion = await question.save();
    return res.status(200).json({Status:true,updatedQuestion})
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
}
// Create a new rating END


/* 
Reviewer rates the candidate and the data becomes: 

[ {skillId: 1, difficulty_level: ‘easy’, question:’What is node?’, rating:5, response:””},{skillId: 1, difficulty_level: ‘easy’, question:’What is express?’, rating: 5, response:””},{skillId: 1, difficulty_level: ‘hard’, question:’How to handle child processes in node?’, rating:4, response:””}, {skillId: 1, difficulty_level: ‘medium’, question:’What are streams?’, rating: 4, response:””}]

The aggregate list output should look like:  [ { skillId: 1, rating: 4.3} ] 

rating calculation: ( 1 * 5 * 2 + 2 * 4 * 1 + 3 * 4 * 1) / ( 1 * 5  + 2 * 4  + 3 * 4 )
*/


//aggregate list START
exports.skillAggregate = async (req, res) => {  
  try {
    // Perform an aggregation on the Question collection
    const aggregatedSkills = await Question.aggregate([
      {
        // Group by the skill_id field
        $group: {
          _id: '$skill_id',
          // Calculate the total weighted rating for each skill
          totalWeightedRating: {
            $sum: {
              $multiply: [
                {
                  // Determine the weight based on the difficulty level
                  $switch: {
                    branches: [
                      { case: { $eq: ['$difficulty_level', 'easy'] }, then: 1 },
                      { case: { $eq: ['$difficulty_level', 'medium'] }, then: 2 },
                      { case: { $eq: ['$difficulty_level', 'hard'] }, then: 3 }
                    ],
                    default: 1 // Default weight if difficulty level doesn't match any case
                  }
                },
                '$rating' // Multiply the weight by the rating
              ]
            }
          },
          // Calculate the total weight for each skill
          totalWeight: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ['$difficulty_level', 'easy'] }, then: 1 },
                  { case: { $eq: ['$difficulty_level', 'medium'] }, then: 2 },
                  { case: { $eq: ['$difficulty_level', 'hard'] }, then: 3 }
                ],
                default: 1 // Default weight if difficulty level doesn't match any case
              }
            }
          }
        }
      },
      {
        // Project the final result
        $project: {
          _id: 0, // Exclude the _id field from the result
          skillId: '$_id', // Include the skill ID
          // Calculate the average rating and round to one decimal place
          rating: { $round: [{ $divide: ['$totalWeightedRating', '$totalWeight'] }, 1] }
        }
      }
    ]);

    // Respond with the aggregated skills data
    res.json(aggregatedSkills);
  } catch (err) {
    // Handle any errors that occur during the aggregation process
    res.status(500).json({ error: 'Server error' });
  }
};
//aggregate list END


//Delete Rating START
exports.deleteRating = async(req,res)=>{
  try{
     // Extract the question ID from the request parameters
      let {question_id} = req.params
      // Call the rating service to find and delete the question's rating
      let data = await ratingService.findAndDeleteQuestion(question_id)
      // If data is returned, it means the operation was successful
      if(data){
          return res.status(200).json({Status:true,message:'Rating delete successfully',data})
      }else{
          // If no data is returned, the question ID was not found
          return res.status(404).send({Status:false,message:'Not Found Question ID'})
      }
  }catch(err){
      console.log("deleteAccount error",err);
      return res.status(400).json({Status:false,message:'sorry! somthing went wrong'})
  }
};
//Delete Rating END

//Read a Question with rating START
exports.getRatingDetails=async(req,res)=>{
  try{
      const {question_id} = req.params
      const data = await ratingService.GetQuestionInformation(question_id)
      return res.status(200).json({Status:true,data})
  }catch(err){
      console.log(err);
      return res.status(400).json({Status:false,message:err.message})
  }
};
//Read a Question with rating End

//Update a question rating START
exports.updateRating=async(req,res)=>{
try {
  const { question_id } = req.params;
  const { rating } = req.body;
  const data = await ratingService.updateQuestionRating(question_id,rating)
      return res.status(200).json({Status:true,data})
}catch(err){
  console.log(err);
  return res.status(400).json({Status:false,message:err.message})
}
}; 
//Update a question rating END