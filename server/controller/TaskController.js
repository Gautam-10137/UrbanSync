const TaskServices = require("../services/TaskServices");

const TaskController = {
  createTask: async (req, res) => {
    try {
      const {projectId} = req.params;
      const detail = req.body;
      const task =await TaskServices.createTask(detail, projectId);
      res.status(201).send({task});
    } catch (err) {
      res.status(500).send({ message: "Task creation failed." });
    }
  },
  fetchTasks: async(req,res)=>{
    try{
       const {userId}=req.params;
       const tasks= await TaskServices.fetchTaskFromDB(userId);
       if(tasks==null){
        res.status(404).send({message:'No tasks assigned'});
       }
       
       res.status(200).send({tasks});


    }catch(err){
      res.status(500).send({message:'Error Fetching tasks'});
    }
  },
  updateStatus: async(req,res)=>{
    try{
      const {taskId}= req.params;
      const {status}=req.body;
      console.log(req.body);
      const task=await TaskServices.updateTaskStatusInDB(taskId,status);
      console.log(task);
      if(!task){
       return  res.status(404).send({message:'Task not found'});
      }
      res.status(200).send({task});
    }catch(err){ 
      res.status(500).send({message:'Error Updating status'});
    }
  },
  addComment: async(req,res)=>{
    try{
      
      const {taskId}=req.params;
      const  detail=req.body;
      const newComment=await TaskServices.addComment(taskId,detail);
      res.status(200).send({newComment});
    }catch(err){
        console.error('Error adding comment.');
        res.status(500).send({message:'Error adding comment'});
    }
  },
  addAssignee: async(req,res)=>{
    try{
       const {taskId}=req.params;
       const {userId}=req.body;
       const task=await TaskServices.addAssignee(taskId,userId);
       res.status(200).send({task});
    }catch(err){
        console.error('Error adding assignee.');
        res.status(500).send({message:'Error adding assignee'});
    }
  },
  removeAssignee: async(req,res)=>{
    try{
       const {taskId}=req.params;
       const {userId}=req.body;
       const task=await TaskServices.removeAssignee(taskId,userId);
       res.status(200).send({task});
    }catch(err){
        console.error('Error removing assignee');
        res.status(500).send({message:'Error removing assignee'});
    }
  },
  updateTask: async(req,res)=>{
    try{
      const {taskId}=req.params;
      const updatedDetails=req.body;

      const updatedTask= await TaskServices.updateTaskFromDB(taskId,updatedDetails);

      res.status(201).send({updatedTask});
    }
    catch(err){
      console.error('Error updating task');
      res.status(500).send({message:'Error updating task'});
    }
  },
  removeTask:async(req,res)=>{
    try{
      const {taskId}=req.params;
      const removedTask= await TaskServices.removeTaskFromDB(taskId);
      if(!removedTask){
        res.status(400).send({message:"Invalid Task"});
        return;
      }
      res.status(200).send({message:"Task Removed Successfully."});
    }catch(err){
      res.status(500).send({message:"Error Removing task from DB"});
    }
  }
};

module.exports=TaskController;
