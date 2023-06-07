import React, { useState } from 'react'

const Login = () => {
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [contact, setContact] = useState()
    const [password, setPassword] = useState()
    const [dob, setDob] = useState()
    const [isMale, setIsMale] = useState(true)
    const [isAdmin, setIsAdmin] = useState(true)

    const onRegisterClick = () => {
        console.log(firstName)
        console.log(lastName)
        console.log(contact)
        console.log(email)
        console.log(isAdmin)
        console.log(isMale)
    }

    return (
        <>
            <div>
                <form>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">First Name</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: sejal"
                                value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Last Name</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: naik"
                                value={lastName} onChange={(event) => setLastName(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: sej@gmail.com"
                                value={email} onChange={(event) => setEmail(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Contact</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" id="inputPassword3" placeholder="9876543210"
                                value={contact} onChange={(event) => setContact(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Date of birth</label>
                        <div className="col-sm-10">
                            <input type="date" className="form-control" id="inputPassword3" placeholder="15/11/1994"
                                value={dob} onChange={(event) => setDob(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Password</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="eg: sej@gmail.com"
                                value={password} onChange={(event) => setPassword(event.target.value)} />
                        </div>
                    </div>
                    <fieldset className="form-group">
                        <div className="row">
                            <legend className="col-form-label col-sm-2 pt-0">Gender</legend>
                            <div className="col-sm-10">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="gender" value={isMale}
                                        onClick={() => setIsMale(true)} />
                                    <label className="form-check-label">
                                        Male
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="gender" value={isMale}
                                        onClick={() => setIsMale(false)} />
                                    <label className="form-check-label">
                                        Female
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="form-group row">
                        <div className="col-sm-2">Is Admin?</div>
                        <div className="col-sm-10">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value={isAdmin}
                                    onClick={() => setIsAdmin()} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <button type="submit" className="btn btn-primary" onClick={(event) => onRegisterClick()}>
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>

    )
}

export default Login