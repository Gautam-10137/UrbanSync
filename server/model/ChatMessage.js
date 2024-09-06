const mongoose=require('mongoose');

const chatMessageSchema=new mongoose.Schema({
    projectID:{ type:mongoose.Schema.Types.ObjectId, ref:'Project',required:true},
    senderID:{ type:mongoose.Schema.Types.ObjectId, ref:'User',required:true },
    content:{type:String ,required:true},
    createdAt:{type:Date,default:Date.now}
});

const ChatMessage=mongoose.model('ChatMessage',chatMessageSchema);

module.exports=ChatMessage;