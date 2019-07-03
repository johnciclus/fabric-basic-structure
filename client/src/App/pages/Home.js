import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div className="App">
                <h1>Bart Network</h1>
                {/* Link to List.js */}
                <div className="ButtonDiv">
                    <Link to={'./creditors'}>
                        <button className="Button" variant="raised">
                            Creditors
                        </button>
                    </Link>
                </div>
                <div className="ButtonDiv">
                    <Link to={'./growers'}>
                        <button className="Button" variant="raised">
                            Growers
                        </button>
                    </Link>
                </div>
                <div className="ButtonDiv">
                    <Link to={'./credit_guarantees'}>
                        <button className="Button" variant="raised">
                            Credit Guarantee
                        </button>
                    </Link>
                </div>
                <div className="ButtonDiv">
                    <Link to={'./credit_operations'}>
                        <button className="Button" variant="raised">
                            Credit Operations
                        </button>
                    </Link>
                </div>
                <div className="ButtonDiv">
                    <Link to={'./historical'}>
                        <button className="Button" variant="raised">
                            Historical
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Home;
