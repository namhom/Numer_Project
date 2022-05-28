import React, { useEffect, useState } from "react";

import Desmos from 'desmos'//กราฟ
import './secant.css'
import { create, all } from 'mathjs'//แปลงสมการ

import { addStyles, EditableMathField } from 'react-mathquill' //eq input
import axios from "axios" //ดึง API (volley)
import Swal from "sweetalert2"//แจ้งเตือนtokenหมดอายุ

addStyles()//eq input

const config = {}
const math = create(all, config)//mathjs

const Secant = () => {

    var next = false
    let cx0 = true, cx1 = true
    let dataTable = []
    const [table, setTable] = useState("")
    const [formErrors, setformErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    //สำหรับคำนวน
    const [data, setData] = useState({
        x0: "",
        x1: "",
        check: false,
        sum: 0
    })
    //สำหรับtoken
    const [fxText, setfxText] = useState({
        Title: "Newton",
        Fx: "",
        Latex: "",

    })

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    let scope = { x: 0 }

    const validate = (values) => {
        const errors = {}

        if (!values.x0) {
            errors.x0 = "กรุณากรอกค่า X(0)!"
            cx0 = false
        }
        if (!values.x1) {
            errors.x1 = "กรุณากรอกค่า X(1)!"
            cx1 = false
        }
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const resultFx = fxText.Fx
        setData({
            x0: data.x0,
            x1: data.x1,
            check: true,
            sum: 0
        })

        const parseFx = math.parse(resultFx)
        const secantCompile = parseFx.compile()

        setformErrors(validate(data))
        setIsSubmit(true)
        const findx = (x0, x1) => {
            scope.x = x0
            let fx0 = secantCompile.evaluate(scope)
            scope.x = x1
            let fx1 = secantCompile.evaluate(scope)
            return (x0 - (fx0 * (x0 - x1))) / (fx0 - fx1)
        }
        let x0 = Number(data.x0)
        let x1 = Number(data.x1)
        let y = 0.000001
        let xnew = 0
        let check = 0
        let x00 = 0
        if (cx0 && cx1) {
            do {
                xnew = findx(x0, x1)
                x00 = x0
                x0 = x1
                scope.x = xnew
                check = Math.abs(secantCompile.evaluate(scope))
                dataTable.push({
                    x0: x00.toFixed(6),
                    x1: x1.toFixed(6),
                    X: xnew.toFixed(6),
                    epsilon: check.toFixed(6)
                })
            } while (check > y)
            setData({
                x0: data.x0,
                x1: data.x1,
                check: true,
                sum: xnew.toFixed(6)
            })
            next = true
            createTable()
        }
        else {
            setData({
                x0: data.x0,
                x1: data.x1,
                check: false,
                sum: 0
            })
            next = false
        }
        //
        setIsSubmit(true)
        const resdata = ({
            Title: "Secant",
            Fx: resultFx,
            Latex: fxText.Latex
        })
        console.log(resdata.Fx, resdata.Latex)

        console.log(resdata)
        try {
            const url = "http://localhost:4000/api/rootofeq/savefx"
            const { data: res } = await axios.post(url, resdata)
            console.log(res)

        } catch (error) {
            if (
                error.response.status >= 400 &&
                error.response.status <= 500
            ) console.log(error.response.data)
        }

    }

    const createTable = () => {
        setTable(<table className="table">
            <thead style={{ background: "rgb(199, 155, 228)" }}>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">X(0)</th>
                    <th scope="col">X(1)</th>
                    <th scope="col">X</th>
                    <th scope="col">epsilon</th>
                </tr>
            </thead>
            <tbody>
                {dataTable.map((data, i) => {
                    return (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.x0}</td>
                            <td>{data.x1}</td>
                            <td>{data.X}</td>
                            <td>{data.epsilon}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>)
    }


    useEffect(() => {
        //วาดกราฟ
        if (data.check) {
            const elt = document.getElementById('calculatorgraph')
            elt.innerHTML = ''
            const calculator = Desmos.GraphingCalculator(elt)
            const fx = 'y=' + fxText.Latex
            calculator.setExpression({ id: 'graph1', latex: fx })
            calculator.setExpression({ id: 'graph2', latex: '(' + data.sum + ',' + 0 + ')' })
        }

        console.log(formErrors)
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(data)
        }
        AuthToken()
    }, [data, formErrors, fxText.Latex, fxText.sum, isSubmit])


    const AuthToken = async () => {
        try {
            const data_token = localStorage.getItem('data_token')
            console.log(data_token);
            const url = "http://localhost:4000/api/rootofeq/authtoken_data"
            const { data: res } = await axios.post(url, { token: data_token })

            setfxText({
                Title: res.token.Title,
                Fx: res.token.Fx,
                Latex: res.token.Latex,
            })

        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                localStorage.removeItem("data_token")
                // Swal.fire('Token หมดอายุ')
            }
        }
    }

    const handleRandomfx = async (e) => {
        e.preventDefault()
        try {
            const url = "http://localhost:4000/api/rootofeq/randomfx/Secant"
            const { data: res } = await axios.get(url, fxText)
            console.log(res)
            localStorage.setItem("data_token", res.token)
            // AuthToken()
            setfxText({
                Title: res.data.Title,
                Fx: res.data.Fx,
                Latex: res.data.Latex,

            })
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                console.log(error.response.data)
            }
        }
    }


    return (
        <div >
            <div className="container ">
                <h2 className="mt-5 text-center">Secant</h2>
                <div className="container">
                    <div className="row mt-5 mx-auto">
                        <div className="card col" >
                            <div className="card-body ">
                                <form onSubmit={handleSubmit}>
                                    <div >
                                        <label className="mt-2 mb-2">Fx</label>
                                    </div>
                                    <EditableMathField
                                        className="mathquill-example-field MathField-class w-75 p-2  border border-dark"
                                        latex={fxText.Latex}
                                        onChange={(mathField) => {
                                            setfxText({
                                                Fx: mathField.text(),
                                                Latex: mathField.latex()
                                            })
                                        }}
                                        mathquillDidMount={(mathField) => {
                                            setfxText({
                                                Fx: mathField.text(),
                                                Latex: mathField.latex()
                                            })
                                        }}
                                        style={{ border: "0px", margin: "auto" }}
                                    />
                                    <div >
                                        <label className="mt-2 mb-2">X0</label>
                                        <input className="form-control" onChange={handleChange} value={data.x0} name="x0" placeholder="กรอกค่า X0" />

                                    </div>
                                    <p>{formErrors.x0}</p>
                                    <div >
                                        <label className="mt-2 mb-2">X1</label>
                                        <input className="form-control" onChange={handleChange} value={data.x1} name="x1" placeholder="กรอกค่า X1" />
                                    </div>
                                    <p>{formErrors.x1}</p>
                                    <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <button type="submit" className="btn btn-outline-light  mt-3 mb-2 " style={{ background: "rgb(147, 61, 202)" }}>Calculator</button>
                                        <button type="button" onClick={handleRandomfx} className="btn btn-outline-light  mt-3 mb-2" style={{ background: "rgb(116, 202, 61)" }}>Random</button>
                                    </div>
                                    <h4 className="mt-3">X = {data.sum} </h4>
                                </form>
                            </div>
                        </div>
                        <div className="col">
                            <div id="calculatorgraph" className="graph"></div>
                        </div>
                    </div>
                    <br />

                    <div className="col">
                        {table}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Secant
