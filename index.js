const express = require('express') 
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const messagebird = require('messagebird')(process.env.MESSAGE_KEY);

//send code to use
app.post('/sendNumber', (req, res) => {
    const { number  }= req.body
    console.log(number)
    messagebird.verify.create(number, {
        template: 'Your verification code is %token'
    }, function(err, response) {
        if(err) {
            console.log(err)
           return res.status(400) 
               .json({
                error: err.errors[0].description
            })
        } else {
            console.log(response)
            return res.status(200)
            .json({
                id: response.id,
                 message: "We have sent the verification code to your mobile"

            })

        }
    })
})

//verify code from the user

app.post("/verifycode",(req, res)=>{
const {id, token } = req.body
messagebird.verify.verify(id, token, (err, response)=>{
    if(err) {
        return res.status(400)
        .json({
            error: err.errors[0].description,
            id: id
        })
    } else {
        return res.status(200)
        .json({
            message: "You have successfully verified your phone number"
        })
    }

})
})

app.listen(5000, ()=>console.log(`App is running on port 5000`))