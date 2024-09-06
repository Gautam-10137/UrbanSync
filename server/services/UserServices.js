const User = require("../model/User");

const UserServices={
    fetchUser: async(req,res)=>{
        try{
            const {email}=req.params;
            
            const user=await User.findOne({email:email});
           
            if(!user){
                return res.status(404).send({message:'User not found'});
            }
           res.status(200).send({user});
        }catch(err){
            res.status(500).send('Error Fetching User')
        }
    }
}

module.exports=UserServices;

