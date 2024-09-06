const mongoose = require("mongoose");
const Comment = require("./Comment");

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description:{
    type:String
  },
  status:{
    type: String,
    enum:['to-do','in-progress','completed'],
    default: 'to-do'
  },
  priority:{
    type: String,
    enum:['low','medium','high'],
    default:'medium'
  },
  assignedTo:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
  }],
  projectId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Project',
    required:true
  },
  assignedDate:{
    type: Date,
    default:Date.now()
  },
  dueDate:{
    type:Date,
  },
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Comment'
  }]
},{
    timestamps:true
});

// taskSchema.pre('remove', async function(next){
//   try{
//       await Comment.deleteMany({taskId: this._id});
//       next();
//   }catch(err){
//     next(err);
//   }

// })

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
