// import logo from './logo.svg';
import './App.css';
// import Sej from './Sej';
// import Login from './Login';
// import Number from './Number';
// import GrandFather from './family/GrandFather';
// import LoginOneWay from './LoginOneWay';
// import Todo from './Todo';
import Navbar from './components/Navbar/Navbar';
// import Amount from './Amount';
// import Count from './Count';
// import Navbar2 from './Navbar2';
// import Mark from './Mark';
// import Money from './Money';
import User from './components/User/User';
import Bank from './components/Bank/Bank';
import Account from './components/Account/Account';
import Dashboard from './components/Dashboard/Dashboard';
import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Login from './components/Login/Login';
import { getLocalStorage as getLocalStorageService } from './service/Utility/LocalStorage'
import Redirect from './components/Shared/Redirect';
import Transaction from './components/Transaction/Transaction';
import Passbook from './components/Transaction/Passbook';

function App() {

  // ************************************ VARIABLE DEFINITIONS ********************************************

  // Variable for isAdmin.
  let [isAdmin, setIsAdmin] = useState(getLocalStorageService("isAdmin") ? getLocalStorageService("isAdmin") : null)

  // Variable for .
  let [isLoggedIn, setIsLoggedIn] = useState(getLocalStorageService("isLoggedIn") ? getLocalStorageService("isLoggedIn") : null)

  // ***************************** IGNORE ********************************
  // const user = {
  //   firstName: "Rachel",
  //   lastName: "Green"
  // }

  return (
    <div className="App">
      <Navbar setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} isLoggedIn={isLoggedIn} />
      {!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} /> : <></>}
      <Routes>

        {/* If authorized and not admin then go to the specific routes. */}
        {isLoggedIn ? (isAdmin == null || isAdmin == "false") ? (
          <>
            <Route exact path='/account' element={<Account />} />
            <Route exact path='/dashboard' element={<Dashboard />} />
            <Route exact path='/' element={<Dashboard />} />
            <Route exact path='/transaction' element={<Transaction />} />
            <Route exact path="/passbook/:accountID" element={<Passbook />} />
          </>
        ) : (

          // If authorized and is admin then go to the specific routes.
          <>
            <Route exact path='/bank' element={<Bank />} />
            <Route exact path='/account' element={<Account />} />
            <Route exact path='/user' element={<User />} />
            <Route exact path='/dashboard' element={<Dashboard />} />
            <Route exact path='/' element={<Dashboard />} />
          </>
        )
          :
          (
            // If not authorized then redirect to redirect component which will redirect to login component.
            <>
              <Route exact path="/bank" element={<Redirect />} />
              <Route exact path="/account" element={<Redirect />} />
              <Route exact path="/user" element={<Redirect />} />
              <Route exact path="/dashboard" element={<Redirect />} />
              <Route exact path="/transaction" element={<Redirect />} />
              <Route exact path="/passbook" element={<Redirect />} />
            </>
          )
        }
        {/* <Route exact path="/" element={<Login />} /> */}
        {/* <Route exact path="/login" element={<Login />} /> */}
      </Routes>

      {/* ***************************** IGNORE ******************************** */}
      {/* <Navbar2></Navbar2>
      <Mark></Mark>
      <Money></Money> */}
      {/* <Navbar></Navbar>
      <Amount></Amount>
      <Count></Count> */}
      {/* <Todo></Todo> */}
      {/* <LoginOneWay></LoginOneWay> */}
      {/* <GrandFather></GrandFather> */}
      {/* <Number/> */}
      {/* <Login/> */}
      {/* <h1>
        Ye app wala hai
      </h1>
      <Sej firstName={user.firstName} lastName={user.lastName} /> */}
    </div>
  );
}

export default App;
