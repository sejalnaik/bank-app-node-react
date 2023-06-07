import React from 'react'

const Rachel = (user) => {
    const buttonKaClickInRachel = () => {
        
        alert("hahahahahhaa rachel")
    }
    return (
        <div>
            <h1>
                Ye rachel wala hai
            </h1>
            <div>
                Full name: {user.fullname}
            </div>
            <button onClick={buttonKaClickInRachel}>Click rachel ka</button>
            <br />
            <button onClick={user.buttonKaClickInSej}>Click sej ka</button>
        </div>
    )
}

export default Rachel