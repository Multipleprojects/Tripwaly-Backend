const express=require('express')
const router=express.Router()
const GetController=require('../controller/GetMessage_Controller')
router.get('/', GetController.GetMessage)
module.exports=router