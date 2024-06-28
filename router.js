const router = require('express').Router();

const user = require('./app/routers/index')

router.use('/user',user);



module.exports = router;