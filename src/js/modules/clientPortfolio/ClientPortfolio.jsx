import React from 'react';
import {bindHandlers} from 'react-bind-handlers';
import _ from 'lodash';
import {Row, Col, Tabs, Tab, Panel, Alert} from 'react-bootstrap';

import ClientPortfolioTemplate from './ClientPortfolioTemplate';
import * as API from '../../utils/api';
import {doWithLoader} from '../../utils/global';
import TradeSubscriptions from './TradeSubscriptions';
import DetailsHeader from '../../components/detailsHeader';

class ClientPortfolio extends React.PureComponent {
    constructor(props) {
        super(props);

        let accountsInfo = {};
        this.accounts = [];
        this.currentAccountInformation = {};

        this.state = {
            clientName: '',
            currentAccountId: '',
            accountUpdated: false,
            flag: false,
            clientKey: '',
            accountKey: '',
            accountGroupKey: ''
        };
    }

    componentWillMount() {
        doWithLoader(this.props, _.partial(API.getClientInfo, this.props.accessToken), (result) => {
            this.handleClientAccounts(result.response);
        });
    }

    handleAccountSelection(eventKey, key) {
        this.currentAccountInformation = _.find(this.accountsInfo, (account) => account.AccountId === eventKey);

        const {
            ClientKey,
            AccountGroupKey,
            AccountKey
        } = this.currentAccountInformation;

        let balanceInfoQueryParams = {
            ClientKey,
            AccountGroupKey,
            AccountKey
        }

        doWithLoader(this.props, _.partial(API.getBalancesInfo, this.props.accessToken, balanceInfoQueryParams), (result) => {
            this.handleBalanceInfo(result.response);
        });

        this.setState({
            currentAccountId: eventKey,
            accountKey: AccountKey,
            accountGroupKey: AccountGroupKey
        });
    }

    handleClientAccounts(response) {
        this.clientInformation = response;
        const {Name, DefaultAccountId, ClientKey, DefaultAccountKey} = this.clientInformation;

        doWithLoader(this.props, _.partial(API.getAccountInfo, this.props.accessToken), (result) => {
            this.handleAccountInfo(result.response);
        });

        let balanceInfoQueryParams = {
            ClientKey,
            AccountKey: DefaultAccountKey
        }

        doWithLoader(this.props, _.partial(API.getBalancesInfo, this.props.accessToken, balanceInfoQueryParams), (result) => {
            this.handleBalanceInfo(result.response);
        });

        this.setState({
            clientName: Name,
            currentAccountId: DefaultAccountId,
            clientKey: ClientKey,
            accountKey: DefaultAccountKey
        });
    }

    // callback: successfully got account information
    handleAccountInfo(response) {
        this.accountsInfo = response.Data;

        _.forEach(this.accountsInfo, (individualAccount) => this.accounts.push(individualAccount.AccountId));

        this.currentAccountInformation = _.find(this.accountsInfo, (account) => account.AccountId === this.state.currentAccountId);

        this.setState({
            accountUpdated: true
        });
    }

    handleBalanceInfo(response) {
        this.getBalanceInfoObjectFromResponse(response);
        this.setState({flag: !this.state.flag});
    }

    getBalanceInfoObjectFromResponse(response) {
        const {
            CashBalance,
            TransactionsNotBooked,
            NonMarginPositionsValue,
            UnrealizedMarginProfitLoss,
            CostToClosePositions,
            OptionPremiumsMarketValue,
            TotalValue,
            MarginCollateralNotAvailable,
            MarginUsedByCurrentPositions,
            MarginAvailableForTrading,
            MarginUtilizationPct,
            MarginNetExposure,
            MarginExposureCoveragePct
        } = response;


        this.balancesInfo = {
            'Cash balance': CashBalance,
            'Transactions not booked': TransactionsNotBooked,
            'Value of stocks, ETFs, bounds': NonMarginPositionsValue,
            'P/L of margin positions': UnrealizedMarginProfitLoss,
            'Cost to close': CostToClosePositions,
            'Value of positions': NonMarginPositionsValue + UnrealizedMarginProfitLoss + CostToClosePositions + (OptionPremiumsMarketValue || 0),
            'Account value': TotalValue,
            'Not available as margin collateral': MarginCollateralNotAvailable,
            'Reserved for margin positions': MarginUsedByCurrentPositions,
            'Margin available': MarginAvailableForTrading,
            'Margin uitilisation': MarginUtilizationPct,
            'Net exposure': MarginNetExposure,
            'Exposure coverage': MarginExposureCoveragePct
        }
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className='pad-box'>
                    <h2>
                        <small>
                            This application contains a number of samples to illustrate how to use the different
                            resources
                            and endpoints available in the Saxo Bank OpenAPI.
                            All samples require a valid access token, which you may obtain from the developer portal
                        </small>
                    </h2>
                    <Alert bsStyle='warning'>
                        Some responses may return no samples, depending upon actual market data entitlements and the
                        configuration of the logged in user.
                    </Alert>

                    <ClientPortfolioTemplate
                        clientInformation={this.clientInformation}
                        state={this.state} accounts={this.accounts}
                        currentAccountInfo={this.currentAccountInformation}
                        balancesInfo={this.balancesInfo}
                        onAccountSelection={this.handleAccountSelection}/>
                    <Row>
                        <Col sm={10}>
                            <Panel header='Orders/Positions' className='panel-primary'>
                                <Tabs className='primary' defaultActiveKey={1} animation={false}
                                      id='noanim-tab-example'>
                                    <Tab eventKey={1} title='Orders'>
                                        <TradeSubscriptions
                                            currentAccountInformation={this.currentAccountInformation}
                                            tradeType='Order'
                                            fieldGroups={['DisplayAndFormat', 'ExchangeInfo']}
                                        />
                                    </Tab>
                                    <Tab eventKey={2} title='Positions'>
                                        <TradeSubscriptions
                                            currentAccountInformation={this.currentAccountInformation}
                                            tradeType='NetPosition'
                                            fieldGroups={['NetPositionView', 'NetPositionBase', 'DisplayAndFormat', 'ExchangeInfo', 'SingleAndClosedPositionsBase', 'SingleAndClosedPositionsView', 'SingleAndClosedPositions']}
                                        />
                                    </Tab>
                                </Tabs>
                            </Panel>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default bindHandlers(ClientPortfolio);