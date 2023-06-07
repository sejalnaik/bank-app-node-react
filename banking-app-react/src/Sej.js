import React from 'react'
import Rachel from './Rachel';

const Sej = (user) => {
  const buttonKaClickInSej = () => {
    alert("hahahahahhaa sej")
  }
  return (
    <div>
      <h1>
        Ye sej wala hai
      </h1>
      <div>
        First name: {user.firstName}
        <br />
        Last name: {user.lastName}
      </div>
      <Rachel fullname={user.firstName + " " + user.lastName} buttonKaClickInSej={buttonKaClickInSej} />
    </div>
  )
}

export default Sej