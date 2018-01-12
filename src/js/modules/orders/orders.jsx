import React from 'react';
import ReactDOM from 'react-dom';
import { bindHandlers } from 'react-bind-handlers';
import { Panel } from 'react-bootstrap';
import * as queries from './queries';
import { object } from 'prop-types';
import _ from 'lodash';

import DetailsHeader from 'src/js/components/detailsHeader';
import Error from 'src/js/modules/error';
import Assets from 'src/js/modules/assets';
import Dropdown from 'src/js/components/dropdown';
import FormTemplate from 'src/js/components/form/formTemplate';
import OrdersNPositionsTab from 'src/js/components/ordersNPositionsTab';
import { checkIfOption, checkIfPutCallExpiry } from 'src/js/utils/global';

class Orders extends React.PureComponent {
    constructor() {
        super();

        // currentOrder contains minimum required parameters for placing an order
        this.currentOrder = {
            // default values on UI.
            Uic: '',
            AssetType: '',
            AllocationKeyId: '',
            OrderType: 'Market',
            OrderPrice: 0.0,
            OrderDuration: { DurationType: 'DayOrder' },
            Amount: 0,
            AccountKey: '',
            BuySell: 'Buy',

            /* possible order relations
               IfDoneMaster   -   If Done Orders is a combination of an entry order and conditional orders
                                  If the order is filled, then a (slave) stop loss, limit or trailing stop
                                  will automatically be attached to the new open position
               IfDoneSlave    -   If Done Orders is a combination of an entry order and conditional orders
                                  If the order is filled, then a (slave) stop loss, limit or trailing stop
                                  will automatically be attached to the new open position
               IfDoneSlaveOco -   Slave order with OCO. See OCO.
               Oco            -   One-Cancels-the-Other Order (OCO). A pair of orders stipulating that if
                                    one order is executed, then the other order is automatically canceled
               StandAlone     -   No relation to other order
            */
            OrderRelation: 'StandAlone',
            ToOpenClose: 'ToOpen',
            Orders: [],

            // currently sample works for StandAlone orders only. Work to be done for other OrderRelations
        };

        this.takeProfitPrice = 0.0;
        this.stopLossPrice = 0.0;
        this.stopLossOrderType = 'StopLimit';

        // this is for storing reference of order type dropdown for resetting it later on.
        this.OrderTypeRef = null;

        this.state = {
            updated: false,
            responseData: {},
            selectedOptionSpace: null,
            selectedAccount: null,
            accounts: [],
            instrumentInfo: null,
            supportedOrderTypes: [],
            takeProfitOpen: false,
            stopLossOpen: false,
            optionRoot: null,
        };
    }

    componentDidMount() {
        queries.fetchAccountInfo(this.props, (response) => {
            this.setState({ accounts: queries.getAccountArray(response) });
        });
    }

    componentWillUnmount() {
        this.handleUnsubscribe();
    }

    handleRef(elm) {
        this.OrderTypeRef = elm;
    }

    handleInstrumentChange(instrument) {
        queries.fetchInfoPrices(instrument, this.props, (response) => {
            this.currentOrder.Amount = response.Quote.Amount;
            this.currentOrder.Uic = response.Uic;
            this.currentOrder.AssetType = response.AssetType;
            this.currentOrder.OrderPrice = response.Quote.Ask ? response.Quote.Ask : 0.0;
            this.currentOrder.OrderType = instrument.SupportedOrderTypes[0];
            this.setState({
                supportedOrderTypes: instrument.SupportedOrderTypes,
                instrumentInfo: response,
            });
            this.handleUnsubscribe();
            this.handleSubscribe(instrument);

            // this is for resetting the ordertype to default value while changing instrument.
            ReactDOM.findDOMNode(this.OrderTypeRef).value = '';
        });

    }

    handleSubscribe(instrument) {
        queries.createSubscription(instrument, this.props, this.handlePriceUpdate, (subscription) => {
            this.subscription = subscription;
        });
    }

    handleUnsubscribe() {
        queries.removeSubscription(this.subscription, this.props, () => {
            this.subscription = null;
        });
    }

    handlePriceUpdate(data) {
        const { Data } = data;

        // we are taking 'Quote' only because we want only price updates (especially ask and bid).
        if (Data && Data.Quote) {
            this.setState({ instrumentInfo: _.defaultsDeep(data.Data, this.state.instrumentInfo) });
        }
    }

    handleAssetTypeChange(assetType) {
        if (!checkIfOption(assetType) && !checkIfPutCallExpiry(assetType)) {
            this.setState({ optionRoot: null });
        }
    }

    handleAccountSelect(account) {
        this.currentOrder.AccountKey = account.AccountKey;
        this.setState({ selectedAccount: account });
    }

    handlePlaceOrder(currentOrder) {
        this.currentOrder = currentOrder;

        const isOrderOk = queries.validateOrder(this.currentOrder, this.props);
        if (isOrderOk) {
            queries.postOrder(this.currentOrder, this.props, (response) => {
                this.setState({ responseData: response });
            });
        }
    }

    render() {
        const accountTitle = this.state.selectedAccount ? this.state.selectedAccount.AccountId : 'Select Account';
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="/userInfo"> this link.</a>
                    </Error>
                    <Assets
                        {...this.props}
                        onInstrumentSelected={this.handleInstrumentChange}
                        onOptionRootSelected={this.handleOptionRoot}
                        onAssetTypeSelected={this.handleAssetTypeChange}
                    >

                        {/* select account dropdown*/}
                        <Dropdown
                            title={accountTitle}
                            handleSelect={this.handleAccountSelect}
                            data={this.state.accounts}
                            itemKey="AccountId"
                            value="AccountId"
                            id="accounts"
                        />
                    </Assets>
                    <Panel header="Order Details" className="panel-primary">
                        <FormTemplate
                            {...this.state}
                            {...this.props}
                            queries={queries}
                            handleValueChange={this.handleValueChange}
                            handleInstrumentChange={this.handleInstrumentChange}
                            handleRef={this.handleRef}
                            currentOrder={this.currentOrder}
                            handleProfitBtnClick={this.handleProfitBtnClick}
                            handlePlaceOrder={this.handlePlaceOrder}
                        />
                    </Panel>
                    <Panel className="panel-primary">
                        <OrdersNPositionsTab selectedAccount={this.state.selectedAccount} {...this.props}/>
                    </Panel>
                </div>
            </div>
        );
    }
}

Orders.propTypes = { match: object };

Orders.defaultProps = { match: {} };

export default bindHandlers(Orders);
