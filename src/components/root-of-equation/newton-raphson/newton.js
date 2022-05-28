import React, { useEffect, useState } from "react";

import Desmos from 'desmos'//กราฟ
import './newton.css'
import { create, all } from 'mathjs'//แปลงสมการ

import { addStyles, EditableMathField } from 'react-mathquill' //eq input
import axios from "axios" //ดึง API (volley)
import Swal from "sweetalert2"//แจ้งเตือนtokenหมดอายุ

addStyles()//eq input

const config = {}
const math = create(all, config)//mathjs

const Newton = () => {
    let dataTable = []
    const [table, setTable] = useState("")
    //สำหรับคำนวน
    const [data, setData] = useState({
        x: "",
        check: false,
        sum: 0,
    })

    //สำหรับtoken
    const [fxText, setfxText] = useState({
        Title: "Newton",
        Fx: "",
        Latex: "",

    })

    let scope = { x: 0 }

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const resultFx = fxText.Fx
        setData({
            x: data.x,
            check: true,
            sum: 0
        })

        const parseFx = math.parse(resultFx)
        const newtonCompile = parseFx.compile()

        const fx = x => {
            scope.x = Number(x)
            let ans = newtonCompile.evaluate(scope)
            console.log("fx = " + ans)
            return (ans)
        }

        const fpx = x => {
            scope.x = x + 0.2
            let fx1 = -newtonCompile.evaluate(scope)
            console.log("fpx1 = " + fx1)

            scope.x = x + 0.1
            let fx2 = 8 * newtonCompile.evaluate(scope)
            console.log("fpx2 = " + fx2)

            scope.x = x - 0.1
            let fx3 = -8 * newtonCompile.evaluate(scope)
            console.log("fpx3 = " + fx3)

            scope.x = x - 0.2
            let fx4 = newtonCompile.evaluate(scope)
            console.log("fpx4 = " + fx4)

            let ans = (fx1 + fx2 + fx3 + fx4) / (12 * 0.1)
            console.log("fpx = " + ans)
            return (
                ans
            )
        }
        console.log(newtonCompile)
        const newton = (x, y) => {
            xold = 0
            xold = x
            x = x - (fx(xold) / fpx(xold))
            console.log('Xe = ' + x)
            let check = Math.abs((x - xold) / x)
            if (check > -y && check < y) {
                dataTable.push({
                    xo: xold.toFixed(6),
                    xn: x.toFixed(6),
                    epsilon: check.toFixed(6)
                })
                setData({
                    x: data.x,
                    check: true,
                    sum: x.toFixed(6)
                })
                console.log("X = " + x.toFixed(6))
            }
            else {
                dataTable.push({
                    xo: xold.toFixed(6),
                    xn: x.toFixed(6),
                    epsilon: check.toFixed(6)
                })
                console.log("X = " + x.toFixed(6))
                newton(x, y)
            }
        }
        // let x = 0.5
        let x = Number(data.x)
        let y = 0.000001
        let xold = x
        x = x - (fx(xold) / fpx(xold))
        console.log('Xe = ' + x)
        let check = Math.abs((x - xold) / x)
        if (check > -y && check < y) {
            setData({
                x: data.x,
                check: true,
                sum: x.toFixed(6)
            })
        }
        else newton(x, y)
        //
        createTable()
        //
        const resdata = ({
            Title: "Newton",
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
                    <th scope="col">X_old</th>
                    <th scope="col">X</th>
                    <th scope="col">epsilon</th>
                </tr>
            </thead>
            <tbody>
                {dataTable.map((data, i) => {
                    return (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.xo}</td>
                            <td>{data.xn}</td>
                            <td>{data.epsilon}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>)
    }


    useEffect(() => {

        const elt = document.getElementById('calculatorgraph')
        elt.innerHTML = ''
        const calculator = Desmos.GraphingCalculator(elt)
        const fx = 'y=' + fxText.Latex
        calculator.setExpression({ id: 'graph1', latex: fx})
        calculator.setExpression({ id: 'graph2', latex: '(' + data.sum + ',' + 0 + ')'})
        console.log(fxText.Fx);
        AuthToken()

    }, [data, fxText.Fx, fxText.Latex])

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
            const url = "http://localhost:4000/api/rootofeq/randomfx/Newton"
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
                <h2 className="mt-5 text-center">Newton</h2>
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
                                        <label className="mt-2 mb-2"> X</label>
                                        <input className="form-control" onChange={handleChange} value={data.x} name="x" placeholder="X" />
                                    </div>

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

export default Newton