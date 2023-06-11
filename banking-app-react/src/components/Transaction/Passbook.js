import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Create from '@mui/icons-material/Create';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { getTransactions as getTransactionsService } from '../../service/Transaction/Transaction'
import { getAccounts as getAccountsService } from '../../service/Account/Account'
import { getLocalStorage as getLocalStorageService } from '../../service/Utility/LocalStorage'
import { useParams } from "react-router"

const Passbook = () => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Create transaction list object and its setter.
    const [transactionList, setTransactionList] = useState([])

    // Get params from url.
    let { accountID } = useParams()

    // ************************************ USEEFFECT FUNCTIONS ********************************************

    // Print transactions.
    useEffect(() => {
        console.log(transactionList)
    }, [transactionList])

    // Initial functions.
    useEffect(() => {

        // Get transaction list.
        getTransactionList()
    }, [])

    // ************************************ GET FUNCTIONS ********************************************

    // Get transactions.
    const getTransactionList = async () => {
        try {
            let params = {
                accountID: accountID
            }
            const response = await getTransactionsService(params)
            setTransactionList(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    // ************************************ COMPONENT RENDER FUNCTIONS ********************************************

    // Render rows of transactions for transactions table.
    const rowsOfTransaction = Object.values(transactionList).map((transaction, index) => {
        return (
            <tr key={transaction.id}>
                <td>{index + 1}</td>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                {transaction.toAccount ? <td>{transaction.toAccount?.user?.firstName + " " + transaction.toAccount?.user?.lastName}</td> : <><td>-</td></>}
                {transaction.toAccount ? <td>{transaction.toAccount?.accountNumber}</td> : <><td>-</td></>}
                <td>{transaction.createdAt.slice(0, 10) + " " + transaction.createdAt.slice(11, 19)}</td>
                <td>{transaction.closingBalance}</td>
            </tr>
        )
    })

    return (
        <>
            <div className="container-fluid mt-n5 background-style standard-page-margin">

                {/* Page hedaer */}
                <div className="header-style">


                    {/* Total Balance */}
                    {transactionList.length > 0 && (
                        <>
                            <div className='total-balance-style'>
                                Total Balance: {transactionList[transactionList.length - 1].closingBalance}
                            </div>
                        </>
                    )}

                    <div className="header-left-style">
                        pagination
                    </div>
                </div>
                <br /><br />

                {/* Table of accounts */}
                <table className="table table-style">
                    <thead>
                        <tr>
                            <th scope="col">Sr No</th>
                            <th scope="col">Type</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Receiver Name</th>
                            <th scope="col">Receiver Account No</th>
                            <th scope="col">Timestamp</th>
                            <th scope="col">Closing Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsOfTransaction}
                    </tbody>
                </table>
            </div >
        </>
    )
}

export default Passbook