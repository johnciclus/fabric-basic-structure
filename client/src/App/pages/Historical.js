import React, { Component } from 'react';
import rp from 'request-promise';
let ENDPOINT = process.env.REACT_APP_ENDPOINT;

class Operations extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            transaction_list: [],
            operations_list: []
        }
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getTransactions();
        this.getOperations();
    }

    // Retrieves the list of items from the Express app
    getTransactions= () => {
        rp({
            uri: `${ENDPOINT}creatingCreditOperation`,
            headers: {'Accept': 'application/json'},
            json: true
        }).then((transaction_list) => {
            this.setState({ transaction_list });
        });
    };

    getOperations= () => {
        rp({
            uri: `${ENDPOINT}system/historian`,
            headers: {'Accept': 'application/json'},
            json: true
        }).then((operations_list) => {
            this.setState({ operations_list });
        });
    };

    render() {
        const { transaction_list, operations_list } = this.state;

        return (
            <div className="App">
                <h1>Transactions</h1>
                {transaction_list.length ? (
                    <div>
                        {transaction_list.map((item) => {
                            console.log(item);
                            return(
                                <div className="ListItem"  key={item.transactionId}>
                                    <p><b>ID: {item.transactionId}</b></p>
                                    <p>Debtor: {item.debtor} </p>
                                    <p>Creditor: {item.creditor} </p>
                                    <p>Guarantee: {item.guarantee} </p>
                                    <p>timeStamp: {item.timestamp}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <h2>No Transactions Found</h2>
                    </div>
                )
                }
                <h1>All Operations</h1>
                {operations_list.length ? (
                    <div>
                        {operations_list.map((item) => {
                            console.log(item);
                            return(
                                <div className="ListItem"  key={item.transactionId}>
                                    <p><b>ID: {item.transactionId}</b></p>
                                    <p>Class: {item.$class} </p>
                                    <p>transactionType: {item.transactionType} </p>
                                    <p>transactionInvoked: {item.transactionInvoked} </p>
                                    <p>participantInvoking: {item.participantInvoking}</p>
                                    <p>identityUsed: {item.identityUsed} </p>
                                    <p>eventsEmitted: {item.eventsEmitted} </p>
                                    <p>transactionTimestamp: {item.transactionTimestamp} </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <h2>No Transactions Found</h2>
                    </div>
                )
                }
            </div>
        );
    }
}

export default Operations;
