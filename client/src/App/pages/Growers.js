import React, { Component } from 'react';
import rp from 'request-promise';
import HorizontalForm from '../Components/HorizontalFormGrower';
let ENDPOINT = process.env.REACT_APP_ENDPOINT;

class Growers extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: []
        }
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getGrowers();
    }

    // Retrieves the list of items from the Express app
    getGrowers = () => {
        rp({
            uri: `${ENDPOINT}grower`,
            headers: {'Accept': 'application/json', 'Access-Control-Allow-Origin': '*'},
            json: true
        }).then((list) => {
            console.log(list);
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
                <h1>Insert a Grower</h1>
                <HorizontalForm setListState={this.setListState} />
                <h1>List of Growers</h1>
                {list.length ? (
                    <div>
                        {list.map((item) => {
                            return(
                                <div className="ListItem" key={item.id}>
                                    <p><b>ID: {item.id}</b></p>
                                    <p>First Name: {item.firstName}</p>
                                    <p>Last Name: {item.lastName}</p>
                                    <p>Address: {item.address}</p>
                                    <p>Score: {item.score}</p>
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

export default Growers;
