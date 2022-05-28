const express = require('express')
const app = express()
const cors = require('cors') //ดักจับคำร้องขอที่ถูกเรียกจากโดเมนอื่น
const port = 4000
require('dotenv').config()

//connection to database
const connection = require('./db')
connection()
const rootofEQ = require('./routes/rootofeq')

//middlewares
app.use(express.json())
app.use(cors())

//swagger
const swaggerjsdoc = require('swagger-jsdoc')
const swaggerui = require('swagger-ui-express')

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Swagger X Numer',
            description: 'Swagger X Numer',
            contact: {
                name: "Chomlada"
            },
            server: [
                {
                    url: "http://localhost:4000"
                }
            ],
        }
    },
    apis: ["index.js"]
}
const swaggerDocs = swaggerjsdoc(options)
app.use('/api-docs',swaggerui.serve,swaggerui.setup(swaggerDocs))
  /**
   * @swagger
   * /api/rootofeq/{Api}/{Param}:
   *  get:
   *    summary: Get Eqa
   *    parameters:
   *      - in : path
   *        name : Api
   *        schema :
   *            type : string
   *      - in : path
   *        name : Param
   *        schema :
   *            type : string
   *    responses:
   *        200:
   *            description : ok
   *        404:
   *            description : not found
   *  */     

//routes
app.use('/api/rootofeq', rootofEQ)

app.listen(port, () => console.log(`Running Server on ${port}`))