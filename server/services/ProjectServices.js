const { default: mongoose } = require("mongoose");
const { fetchProjects } = require("../controller/ProjectController");
const Project = require("../model/Project");
const Task = require("../model/Task");
const User = require("../model/User");
const { $where } = require("../model/User");
const { sendMail } = require("./AuthServices");
const { removeTaskFromDB } = require("./TaskServices");
const ChatMessage = require("../model/ChatMessage");
const TaskServices = require("./TaskServices");


const ProjectServices = {
  createProject: async (detail) => {
    try {
      const { name, description, members,tasks } = detail;
      const newProject = new Project({ name, description, members });
      await newProject.save();
      
      for(const idx in members){
        const msg = `
        <p>You are added to the Project:</p>
        <p><strong>Project Name:</strong> ${name}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Role:</strong> ${members[idx].role}</p>
      `;
        sendMail(members[idx].userId.email,"New Project",msg);
       
      } 
      
     if(tasks.length>0){ tasks.forEach(async (task)=>{
       const newTask= new Task({...task,projectId:newProject._id});
       await newTask.save();
      
       await Project.findByIdAndUpdate(newProject._id,{
        $push:{tasks:newTask._id}},{new:true});
      
       await TaskServices.sendTaskMail(newTask,name);
       
      })
    }
    const updated=await Project.findById(newProject._id);
      
      return updated ;
    } catch (err) {
      console.error("Error creating a new Project: " + err.message);
      throw err;
    }
  },
  fetchProjectFromDB: async (userId) => {
    try {
      const projects = await Project.find({ "members.userId": userId })
        .populate({
          path:"members.userId",
          model:"User"
         })
        .populate({
          path: "tasks",
          populate: [
          {
            path: "assignedTo",
            model: "User",
          },
          {
            path: "comments",
            model: "Comment",
            populate: {
              path: "author",
              model: "User",
            }
          }
        ]
        });
        
      return projects;
    } catch (err) {
      console.error("Error fetching projects :" + err.message);
    }
  },
  updateProjectFromDB: async (projectId, updateDetails) => {
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $set: updateDetails,
        },
        { new: true, runValidators: true }
      );

      if (!updatedProject) {
        throw new Error("Project not found!");
      }
      return updatedProject;
    } catch (err) {
      console.error("Error updating project :" + err.message);
    }
  },
  removeProjectFromDB: async (projectId) => {
    try {
      const project =await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      const session= await mongoose.startSession();
      session.startTransaction();
      try{
         await Promise.all(project.tasks.map(async (taskId) => {
           await removeTaskFromDB(taskId);
         }));
         await ChatMessage.deleteMany({projectID:project._id}).session(session);
         await Project.findByIdAndDelete(projectId).session(session);
         await session.commitTransaction();
         console.log("Project and associated tasks deleted successfully");
      }catch(err){
        await session.abortTransaction();
        console.error("Error Deleting project and associated tasks");
      }finally{
        session.endSession();
      } 
      return project;
    } catch (err) {
      console.error("Error removing project");
    }
  },
  addMemberToProject: async (projectId, userId, role) => {
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $push: { members: { userId, role } },
        },
        { new: true, useFindAndModify: false }
      );
      
      return {
        success: true,
        message: "Member added successfully",
        project: updatedProject,
      };
    } catch (err) {
      console.error("Error Adding user to project :" + err.message);
      throw err;
    }
  },
  sendProjectMailToUser:async(req,res)=>{
     try{
          const {email}=req.params;
          const {project,role}=req.body;
          const msg = `
          <p>You are added to the Project:</p>
          <p><strong>Project Name:</strong> ${project.name}</p>
          <p><strong>Description:</strong> ${project.description}</p>
          <p><strong>Role:</strong> ${role}</p>
        `;
          sendMail(email,"New Project",msg);    
          res.status(200).send({message:'mail sent successfully'});

     }catch(err){
      console.log(err.message)
     }
  },
  removeMemberFromProject: async (projectId, userId) => {
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        {
          $pull: { members: { userId: userId } },
        },
        { new: true }
      );
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (err) {
      console.error("Error removing the user");
      throw err;
    }
  },
};

module.exports = ProjectServices;
