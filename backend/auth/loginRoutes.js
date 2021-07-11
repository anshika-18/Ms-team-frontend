require('dotenv').config()
const bcrypt=require('bcryptjs')
const User=require('./model')

module.exports=(app)=>{

    //login to ms-team
    app.post('/api/auth/login',(req,res)=>{
        console.log(req.body)
        const {email,password}=req.body;
        //if all fields are not provided
        if(!email||!password)
            return res.status(400).json({msg:"please enter all details..."})
        //find by email
        User.findOne({email})
            .then(data=>{
                //not yet registered
                if(!data)
                    return res.status(401).json({msg:"user does not exist.Please register before You login.."})

                //compare password wheater it is valid or not
                bcrypt.compare(password,data.password)
                    .then(isMatch=>{
                        if(!isMatch)
                            return res.status(401).json({msg:"Invalid Password"})
                        
                        return res.status(200).json({
                            user:{
                                id:data.id,
                                name:data.name,
                                email:data.email
                            }
                        })
                    })
                    .catch(err=>{
                        return res.status(500).json(err)
                    })
            })
            .catch(err=>{
                return res.status(404).json(err)
            })
    })
}
