import React, { Component } from 'react';
import rp from 'request-promise';
import HorizontalForm from "../Components/HorizontalFormCreditGuarantee";
let ENDPOINT = process.env.REACT_APP_ENDPOINT;

class Guarantees extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: []
        }
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getGuarantees();
    }

    // Retrieves the list of items from the Express app
    getGuarantees= () => {
        rp({
            uri: `${ENDPOINT}creditGuarantee`,
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
                <h1>Insert a Credit Guarantee</h1>
                <HorizontalForm setListState={this.setListState} />
                <h1>List of Credit Guarantees</h1>
                {/* Check to see if any items are found*/}
                {list.length ? (
                    <div>
                        {/* Render the list of items */}
                        {list.map((item) => {
                            return(
                                <div className="ListItem" key={item.id}>
                                    <p><b>ID: {item.id}</b></p>
                                    <p>Name: {item.name}</p>
                                    <p>Type: {item.type}</p>
                                    <p>Owner: {item.owner}</p>
                                    <p>Digital Address: {item.digitalAddress}</p>
                                    <p>Expiration Date: {item.expirationDate}</p>
                                    <p>Value: {item.value}</p>
                                    <p>Units: {item.units}</p>
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

export default Guarantees;
