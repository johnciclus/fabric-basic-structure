import React, { Component } from 'react';
import rp from 'request-promise';
import HorizontalForm from '../Components/HorizontalFormCreditor';
let ENDPOINT = process.env.REACT_APP_ENDPOINT;

class Creditors extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: []
        }
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getCreditors();
    }

    // Retrieves the list of items from the Express app
    getCreditors = () => {
        rp({
            uri: `${ENDPOINT}creditor`,
            headers: {'Accept': 'application/json'},
            json: true
        }).then((list) => {
            this.setState({ list });
        });
    };

    insertCreditor = () => {
        rp({
            uri: `${ENDPOINT}creditor`,
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
                <h1>Insert a Creditor</h1>
                <HorizontalForm setListState={this.setListState}/>
                <h1>List of Creditors</h1>
                {list.length ? (
                    <div>
                        {/* Render the list of items */}
                        {list.map((item) => {
                            //console.log(item);
                            return(
                                <div className="ListItem" key={item.id}>
                                    <p><b>ID: {item.id}</b></p>
                                    <p>Name: {item.name}</p>
                                    <p>Address: {item.address}</p>
                                    <p>Score: {item.score}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <p>No List Items Found</p>
                    </div>
                )}

            </div>
        );
    }
}

export default Creditors;
