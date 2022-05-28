import React from 'react'
// import './navbar.css'

import { Link } from 'react-router-dom'
const Navbar = () => {
    return (
        <div>          
            <nav className="navbar navbar-expand-lg navbar-light bg-light"    >
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/"><Link to="/">Home</Link></a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Root of Equation
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/"><Link to="/bisection">Bisection</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/falseposition">False Position</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/one-point">One Point Iteration</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/newton-raphson">Newton Raphson</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/secant">Secant</Link></a></li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Linear Algebraic Equation
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/"> <Link to="/cramers-ruls">Cramer's Rule</Link></a></li>
                                    <li><a className="dropdown-item" href="/"> <Link to="/gauss-elimination">Gauss Elimination</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/gauss-jordan">Gauss-Jodan</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/lu-decomposition">LU Decomposition</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/cholesky-decomposition">Cholesky decomposition</Link></a></li>
                                    {/* <div class="dropdown-divider"></div>
                                    <li><a className="dropdown-item" href="/"><Link to="/jacobi-iteration">Jacobi Iteration</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/gauss-seidel">Gauss-Seidel Iteration</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/conjugate-gradient">Conjugate Gradient</Link></a></li> */}
                                </ul>
                            </li>

                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                INTERPOLATION
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/"> <Link to="/cramers-ruls">Newton's divided-differences</Link></a></li>
                                    <li><a className="dropdown-item" href="/"> <Link to="/gauss-elimination">Lagrange polynomials</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/gauss-jordan">Spline interpolation</Link></a></li>
                                </ul>
                            </li> */}

                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                LEAST-SQUARES REGRESSION
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/"> <Link to="/cramers-ruls">Linear Regression</Link></a></li>
                                    <li><a className="dropdown-item" href="/"> <Link to="/gauss-elimination">Polynomials Regression</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/gauss-jordan">Multiple Linear Regression</Link></a></li>
                                </ul>
                            </li> */}

                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Numerical Integration
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/"> <Link to="/cramers-ruls">Trapezoidal Rule</Link></a></li>
                                    <li><a className="dropdown-item" href="/"> <Link to="/gauss-elimination">Composite Trapezoidal Rule</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/gauss-jordan">Simpson's Rule</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/lu-decomposition">Composite Simpson's Rule</Link></a></li>
                                 
                                </ul>
                            </li> */}

                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Numerical Differentiation
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/"> <Link to="/cramers-ruls">Trapezoidal Rule</Link></a></li>
                                    <li><a className="dropdown-item" href="/"> <Link to="/gauss-elimination">Composite Trapezoidal Rule</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/gauss-jordan">Simpson's Rule</Link></a></li>
                                    <li><a className="dropdown-item" href="/"><Link to="/lu-decomposition">Composite Simpson's Rule</Link></a></li>
                                 
                                </ul>
                            </li> */}

                        </ul>

                    </div>
                </div>
            </nav>
        </div >

    );
}

export default Navbar 