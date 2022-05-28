const router = require('express').Router()
const rootofEQSchema = require('../models/rootofeq')
const myjsonwebtoken = require('jsonwebtoken')

router.post('/authtoken_data',async(req, res)=>{
    try{
        const jwtResponse = myjsonwebtoken.verify(req.body.token,process.env.JWTPRIVATEKEY)
        return res.status(200).send({status: "token_ok",token:jwtResponse})

    }catch(error){
        return res.status(404).send({status: "token exp"})
    }
})

router.get('/randomfx/:title', async (req, res) => {
    console.log(req.params.title)
   
    const getRootofeq = await rootofEQSchema.aggregate(
        [
            { $match: { Title: req.params.title } },
            { $sample: { size: 1 } }
        ]
    )
    if (getRootofeq.length>0) {
      const findReal = await rootofEQSchema.findOne({
          _id : getRootofeq[0]._id
      })

      if(findReal){
          const token = findReal.generateMyjwt()
          return res.status(200).send({token:token,data:findReal})
      }
    }
    else{
        return res.status(200).send('not found eq')
    }

})

router.post('/savefx', async (req, res) => {
    const { Title, Fx, Latex } = req.body
    console.log(req.body)
    const rootofChecking = await rootofEQSchema.findOne({
        Title: Title,
        Fx: Fx,
        Latex: Latex
    })

    if (rootofChecking) res.status(409).send({ message: 'สมการนี้ถูกบันทึกอยู่ประวัติเรียบร้อยแล้ว' })
    else {
        const result = await rootofEQSchema.create({
            Title,
            Fx,
            Latex
        })

        return res.status(200).send(result)
    }
})

module.exports = router