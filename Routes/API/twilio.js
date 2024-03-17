const express=require('express');
const router=express.Router();
const twilioController=require('../../Controllers/twilioController');

router.post('/',twilioController.twilioHandler);
module.exports=router;