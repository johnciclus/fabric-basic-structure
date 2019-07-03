import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Creditors from './pages/Creditors';
import Growers from './pages/Growers';
import Guarantees from './pages/Guarantees';
import Operations from './pages/Operations';
import Historical from './pages/Historical';
import 'antd/dist/antd.css';
import './App.css';

class App extends Component {
    render() {
        const App = () => (
            <div>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/creditors' component={Creditors}/>
                    <Route path='/growers' component={Growers}/>
                    <Route path='/credit_guarantees' component={Guarantees}/>
                    <Route path='/credit_operations' component={Operations}/>
                    <Route path='/historical' component={Historical}/>
                </Switch>
            </div>
        );
        return (
            <Switch>
                <App/>
            </Switch>
        );
    }
}

export default App;
