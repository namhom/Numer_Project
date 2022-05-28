const mongoose = require('mongoose')
const myjsonwebtoken = require('jsonwebtoken')

const rootofEQSchema = new mongoose.Schema({
    Title: { type: String, require: true },
    Fx: { type: String, require: true },
    Latex: { type: String, require: true }
}, { collection: 'randomfx' })

rootofEQSchema.methods.generateMyjwt = function() {
    const mytoken = myjsonwebtoken.sign({_id:this._id , Title:this.Title , Fx:this.Fx , Latex : this.Latex}
        ,process.env.JWTPRIVATEKEY,{expiresIn:'5m'})
    return mytoken
}

module.exports = mongoose.model('rootofEQSchema', rootofEQSchema)