import React, { Component } from 'react';
import rp from 'request-promise';
import HorizontalForm from '../Components/HorizontalFormCreditOperation';
let ENDPOINT = process.env.REACT_APP_ENDPOINT;

class Operations extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: []
        }
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getOperations();
    }

    // Retrieves the list of items from the Express app
    getOperations= () => {
        rp({
            uri: `${ENDPOINT}creditOperation`,
            headers: {'Accept': 'application/json'},
            json: true
        }).then((list) => {
            this.setState({ list });
        });
    };

    setListState = (list) => {
        this.setState({list});
    };

    render() {
        const { list } = this.state;

        return (
            <div className="App">
                <h1>Creating a new Credit Operation</h1>
                <HorizontalForm setListState={this.setListState}/>
                <h1>List of Credit Operation</h1>

                {list.length ? (
                    <div>
                        {list.map((item) => {
                            console.log(item);
                            return(
                                <div className="ListItem"  key={item.id}>
                                    <p><b>ID: {item.id}</b></p>
                                    <p>Debtor: {item.debtor} </p>
                                    <p>Creditor: {item.creditor} </p>
                                    <p>Guarantee: {item.guarantee} </p>
                                    <p>State: {item.state}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <h2>No List Items Found</h2>
                    </div>
                )
                }

            </div>
        );
    }
}

export default Operations;
