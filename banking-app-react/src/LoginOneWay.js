import React, { useRef } from 'react'

const LoginOneWay = () => {
    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const password = useRef()
    const isAdmin = useRef()
    const totalBalance = useRef()
    const form = useRef()

    const onSubmitClick = (event) => {
        event.preventDefault()
        console.log(firstName.current.value)
        console.log(lastName.current.value)
        console.log(email.current.value)
        console.log(password.current.value)
        console.log(isAdmin.current.value)
        console.log(totalBalance.current.value)
        console.log(form)
    }

    return (
        <>
            <div>
                <form ref={form}>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">First Name</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: sejal"
                                ref={firstName} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Last Name</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: naik"
                                ref={lastName} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: sej@gmail.com"
                                ref={email} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Password</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: sej@gmail.com"
                                ref={password} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2">Is Admin?</div>
                        <div className="col-sm-10">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value={isAdmin}
                                    ref={isAdmin} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginOneWay