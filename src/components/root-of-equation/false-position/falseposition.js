import React, { useEffect, useState } from "react";

import Desmos from 'desmos'//กราฟ
import './falseposition.css'
import { create, all } from 'mathjs'//แปลงสมการ

import { addStyles, EditableMathField } from 'react-mathquill' //eq input
import axios from "axios" //ดึง API (volley)
import Swal from "sweetalert2"//แจ้งเตือนtokenหมดอายุ

addStyles()//eq input

const config = {}
const math = create(all, config)//mathjs

const Falseposition = () => {
    var next = false
    let dataTable = []
    const [table, setTable] = useState("")
    const [formErrors, setformErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    //สำหรับคำนวน
    const [data, setData] = useState({
        xL: "",
        xR: "",
        check: false,
        sum: 0,
    })

    //สำหรับtoken
    const [fxText, setfxText] = useState({
        Title: "Falseposition",
        Fx: "",
        Latex: "",

    })


    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    let scope = { x: 0 }
    const validate = (values, fxl, fxr) => {
        const errors = {}

        if (!values.xL) {
            errors.xL = "กรุณากรอกค่า XL!"
        }
        if (!values.xR) {
            errors.xR = "กรุณากรอกค่า XR!"
        }
        else if (fxl < 0 && fxr < 0) {
            errors.xR = "fxl มีค่าน้อยกว่า 0 fxr ต้องมีค่ามากกว่า 0"
        }
        else if (fxl > 0 && fxr > 0) {
            errors.xR = "fxl มีค่ามากกว่า 0 fxr ต้องมีค่าน้อยกว่า 0"
        }
        return errors
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        const resultFx = fxText.Fx
        setData({
            xL: data.xL,
            xR: data.xR,
            check: true,
            sum: 0,
        })

        const parseFx = math.parse(resultFx)
        const bisectionCompile = parseFx.compile()

        let xL = Number(data.xL), xR = Number(data.xR), xM, oxL, oxR
        let fxl, fxr, fxm
        let eps, y = 0.000001
        let loop = true
        let i = 0

        const cal = (fxM, fxR) => {
            if (fxM * fxR < 0) {
                eps = Math.abs((Number(xM) - Number(xL)) / xM)
                oxL = xL
                xL = xM
                console.log("epsilon = " + eps.toFixed(6) + "\n");
                if (i === 0) {
                    dataTable.push({
                        L: oxL.toFixed(6),
                        R: xR.toFixed(6),
                        M: xM.toFixed(6),
                        epsilon: '-'
                    })
                }
                else {
                    dataTable.push({
                        L: oxL.toFixed(6),
                        R: xR.toFixed(6),
                        M: xM.toFixed(6),
                        epsilon: eps.toFixed(6)
                    })
                }
            }
            else { //มากกว่า 0
                eps = Math.abs((Number(xM) - Number(xR)) / xM)
                oxR = xR
                xR = xM
                console.log("epsilon = " + eps.toFixed(6) + "\n");
                if (i === 0) {
                    dataTable.push({
                        L: xL.toFixed(6),
                        R: oxR.toFixed(6),
                        M: xM.toFixed(6),
                        epsilon: '-'
                    })
                }
                else {
                    dataTable.push({
                        L: xL.toFixed(6),
                        R: oxR.toFixed(6),
                        M: xM.toFixed(6),
                        epsilon: eps.toFixed(6)
                    })
                }
            }
        }
        scope.x = xL
        console.log(xL)
        fxl = bisectionCompile.evaluate(scope)
        scope.x = xR
        console.log(xR)
        fxr = bisectionCompile.evaluate(scope)
        if ((fxl < 0 && fxr > 0) || (fxl > 0 && fxr < 0)) {
            next = true
            while (loop) {
                console.log('iteration' + i)
                scope.x = xL
                console.log(xL)
                fxl = bisectionCompile.evaluate(scope)
                scope.x = xR
                console.log(xR)
                fxr = bisectionCompile.evaluate(scope)

                console.log('fxl = ' + fxl + '\n', 'fxr = ' + fxr)
                xM = ((xL * fxr) - (xR * fxl)) / (fxr - fxl)
                console.log('X1 = ' + xM)
                scope.x = xM
                fxm = bisectionCompile.evaluate(scope)
                console.log('fxm = ' + fxm)

                cal(fxm, fxr)

                if (eps <= y) loop = false
                i++
            }
            setData({
                xL: data.xL,
                xR: data.xR,
                check: true,
                sum: xM.toFixed(6)
            })
            createTable()
        }
        else {
            setData({
                xL: data.xL,
                xR: data.xR,
                check: false,
                sum: 0
            })
            next = false
        }
        setformErrors(validate(data, fxl, fxr))
        setIsSubmit(true)

        setformErrors(validate(data, fxl, fxr))
        setIsSubmit(true)
        const resdata = ({
            Title: "Falseposition",
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
                    <th scope="col">XL</th>
                    <th scope="col">XR</th>
                    <th scope="col">XM</th>
                    <th scope="col">epsilon</th>
                </tr>
            </thead>
            <tbody>
                {dataTable.map((data, i) => {
                    return (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.L}</td>
                            <td>{data.R}</td>
                            <td>{data.M}</td>
                            <td>{data.epsilon}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>)
    }


    useEffect(() => {

        //แสดงกราฟ
        if (data.check) {
            const elt = document.getElementById('calculatorgraph')
            elt.innerHTML = ''
            const calculator = Desmos.GraphingCalculator(elt)
            const fx = 'y=' + fxText.Latex
            calculator.setExpression({ id: 'graph1', latex: fx})
            calculator.setExpression({ id: 'graph2', latex: '(' + data.sum + ',' + 0 + ')'})
        }
        console.log(formErrors)
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(data)
        }
        AuthToken()
    }, [data, formErrors, fxText.Fx, fxText.Latex, isSubmit])

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
            const url = "http://localhost:4000/api/rootofeq/randomfx/Falseposition"
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
                <h2 className="mt-5 text-center">False Position</h2>
                <div className="container">
                    <div className="row mt-5 mx-auto">
                        <div className="card col" >
                            <div className="card-body ">
                                <form onSubmit={handleSubmit}>
                                    <div >
                                        <label className="mt-2 mb-2">Fx</label>
                                    </div>
                                    <div>
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
                                    </div>
                                    <div>
                                        <label className="mt-2 mb-2"> xL</label>
                                        <input className="form-control " onChange={handleChange} value={data.xL} name='xL' placeholder="xL" />
                                    </div>

                                    <p>{formErrors.xL}</p>
                                    <div >
                                        <label className="mt-2 mb-2">xR</label>
                                        <input className="form-control" onChange={handleChange} value={data.xR} name="xR" placeholder="xR" />
                                    </div>
                                    <p>{formErrors.xR}</p>
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

export default Falseposition