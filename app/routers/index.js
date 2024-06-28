const express = require('express');
const route = express.Router();
const VerifyJwtToken = require('../verifyAccessToken');
const userController = require('../controllers/users');

const questionController = require('../controllers/questions');
const ratingControllere=require('../controllers/ratings')

//CRUD api for user sign up
//signup
route.post('/registration',userController.registration);
// Login 
route.post('/login',userController.loginUser);
//Get a user profile
route.get('/getUserProfile',VerifyJwtToken,userController.getUserDetails);
//Update user profile
route.put('/updateUserProfile',VerifyJwtToken,userController.updateUserPorfile);
//Delete user profile
route.delete('/deleteUserAccount/:account_id',userController.deleteAccount)

//Create CRUD api for rating Candidate’s response by reviewer.
//Add rating
route.post('/addRating/:questionId',VerifyJwtToken,ratingControllere.addRating)
//aggregate list
route.get('/skillAggregate',ratingControllere.skillAggregate)
//get rating
route.get('/getRatingDetails/:question_id',ratingControllere.getRatingDetails)
//Delete rating
route.delete('/deleteRating/:question_id',ratingControllere.deleteRating)
//update rating
route.patch('/updateRating/:question_id',ratingControllere.updateRating)

//....................
//CRUD api for Question 
//Create a question
route.post('/addQuestion',questionController.addQuestion)
// Get all questions
route.get('/getQuestion',questionController.getQuestion)
//Get A question 
route.get('/getParticulerQuestionDetails/:_id',questionController.getParticulerQuestionDetails)
//Delete a question
route.delete('/deleteQuestion/:id',questionController.deleteQuestion)
//Update Question Details
route.put('/updateQuestionDetails/:question_id',questionController.updateQuestionDetails)

module.exports = route;