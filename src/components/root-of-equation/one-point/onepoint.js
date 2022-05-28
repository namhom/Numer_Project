import React, { useEffect, useState } from "react";

import Desmos from 'desmos'//กราฟ
import './onepoint.css'
import { create, all } from 'mathjs'//แปลงสมการ

import { addStyles, EditableMathField } from 'react-mathquill' //eq input
import axios from "axios" //ดึง API (volley)
import Swal from "sweetalert2"//แจ้งเตือนtokenหมดอายุ

addStyles()//eq input

const config = {}
const math = create(all, config)//mathjs

const Onepoint = () => {
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
        Title: "Onepoint",
        Fx: "",
        Latex: "",

    })

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const resultFx = fxText.Fx
        setData({
            x: data.x,
            check: true,
            sum: 0,
        })

        const parseFx = math.parse(resultFx)
        const onepointCompile = parseFx.compile()

        let scope = { x: 0 }
        let x = Number(data.x)
        let y = 0.000001
        let i = 0

        while (true) {
            let oldx = x

            scope.x = x
            x = onepointCompile.evaluate(scope)
            let ab = Math.abs((x - oldx) / x)
            ab = Math.abs((x - oldx) / x)
            if (ab <= y && ab >= -y) {
                if (i === 0) {
                    dataTable.push({
                        xo: oldx.toFixed(6),
                        xn: x.toFixed(6),
                        epsilon: '-'
                    })
                }
                else {
                    dataTable.push({
                        xo: oldx.toFixed(6),
                        xn: x.toFixed(6),
                        epsilon: ab.toFixed(6)
                    })
                }
                setData({
                    x: data.x,
                    check: true,
                    sum: x.toFixed(6)
                })
                break
            }
            else {
                if (i === 0) {
                    dataTable.push({
                        xo: oldx.toFixed(6),
                        xn: x.toFixed(6),
                        epsilon: '-'
                    })
                }
                else {
                    dataTable.push({
                        xo: oldx.toFixed(6),
                        xn: x.toFixed(6),
                        epsilon: ab.toFixed(6)
                    })
                }
            }
        }
        createTable()


        const resdata = ({
            Title: "Onepoint",
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

        if (data.check) {
            const elt = document.getElementById('calculatorgraph')
            elt.innerHTML = ''
            const calculator = Desmos.GraphingCalculator(elt)
            const fx = 'y=' + fxText.Latex +"-x"
            calculator.setExpression({ id: 'graph1', latex: fx})
            calculator.setExpression({ id: 'graph2', latex: '(' + data.sum + ',' + 0 + ')'})
        }
        
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
            const url = "http://localhost:4000/api/rootofeq/randomfx/Onepoint"
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
                <h2 className="mt-5 text-center">Onepoint</h2>
                <div className="container">
                    <div className="row mt-5 mx-auto">
                        <div className="card col" >
                            <div className="card-body ">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div>
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
                                    </div>
                                    <div >
                                        <label className="mt-2 mb-2">X</label>
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

export default Onepoint