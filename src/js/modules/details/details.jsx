import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserInfo from 'src/js/modules/userInfo';
import Introduction from 'src/js/modules/introduction';
import InstrumentDetails from 'src/js/modules/instrumentDetails';
import InfoPrices from 'src/js/modules/infoPrices';
import Prices from 'src/js/modules/prices';
import ClientPortfolio from 'src/js/modules/clientPortfolio';
import OptionChain from 'src/js/modules/optionChain';
import ChartPolling from 'src/js/modules/charts';
import ChartStreaming from 'src/js/modules/chartStreaming';
import AllocationKeys from 'src/js/modules/allocationKeys';
import Orders from 'src/js/modules/orders';

const resourcePage = (Comp, props) => (routeProps) => (
    React.createElement(Comp, {
        ...props,
        ...routeProps,
    })
);

function Details(props) {
    return (
        <div className="details">
            <Switch>
                <Route path="/intro" component={resourcePage(Introduction, props)}/>
                <Route path="/userInfo" component={resourcePage(UserInfo, props)}/>
                <Route path="/instruments" component={resourcePage(InstrumentDetails, props)}/>
                <Route path="/infoPrices" component={resourcePage(InfoPrices, props)}/>
                <Route path="/prices" component={resourcePage(Prices, props)}/>
                <Route path="/clientPortfolio" component={resourcePage(ClientPortfolio, props)}/>
                <Route path="/options" component={resourcePage(OptionChain, props)}/>
                <Route path="/chartPolling" component={resourcePage(ChartPolling, props)}/>
                <Route path="/chartStreaming" component={resourcePage(ChartStreaming, props)}/>
                <Route path="/orders" component={resourcePage(Orders, props)}/>
                <Route path="/allocationKeys" component={resourcePage(AllocationKeys, props)}/>
                <Redirect exact path="/" to="/intro"/>
            </Switch>
        </div>
    );
}

export default Details;
