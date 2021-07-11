const feedback=require('./schema')

module.exports=(app)=>{
        //submit feedback
        app.post('/feedback',(req,res)=>{
                const {email,rating}=req.body
                console.log(req.body)
                const newData=new feedback({
                        email,
                        rating
                })
                newData.save()
                        .then(user=>{
                                return res.status(200).json(user)
                        })
                        .catch((err)=>{
                                return res.status(400).json(err)
                        })
        })
}