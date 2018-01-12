import _ from 'lodash';
import {
    getInfoPrices,
    placeOrder,
    getAccountInfo,
    subscribePrices,
    removeIndividualSubscription,
} from 'src/js/utils/api';
import { doWithLoader, setGlobalErrMessage } from 'src/js/utils/global';

export function getAskBidFormData(instrumentInfo, currentOrder) {
    const askPrice = (instrumentInfo && instrumentInfo.Quote && instrumentInfo.Quote.Ask) ? instrumentInfo.Quote.Ask : 0.0;
    const bidPrice = (instrumentInfo && instrumentInfo.Quote && instrumentInfo.Quote.Bid) ? instrumentInfo.Quote.Bid : 0.0;
    const symbol = instrumentInfo ? instrumentInfo.DisplayAndFormat.Symbol : '';
    return [{
        label: `Instrument (UIC: ${currentOrder.Uic})`,
        value: symbol,
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'AssetType',
        value: currentOrder.AssetType,
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'AskPrice',
        value: askPrice,
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'BidPrice',
        value: bidPrice,
        componentClass: 'text',
        readOnly: 'true',
    },
    ];
}

export function getBuySellFormData(currentOrder, instrumentInfo) {

    function setOrderPrice() {

        // this function is for setting order price box according to the options selected. If
        // Order Type is 'Market', then order tab is disabled and Ask Price is shown for 'Buy' Option and Bid for 'Sell'(or else condition)
        // If Order Type is something else like 'Limit', then order price box is enabled for user to fill its entry.
        if (currentOrder.OrderType === 'Market' && instrumentInfo) {
            if (currentOrder['BuySell'] === 'Buy') {
                return instrumentInfo.Quote.Ask;
            }
            return instrumentInfo.Quote.Bid;
        }
        return currentOrder.OrderPrice;

    }

    return [{
        label: 'BuySell',
        value: ['Buy', 'Sell'],
        componentClass: 'select',
    },
    {
        label: 'OrderPrice',
        value: setOrderPrice(),
        componentClass: 'text',
        readOnly: currentOrder.OrderType === 'Market',
    },
    {
        label: 'OrderAmount',
        value: currentOrder.Amount,
        componentClass: 'text',
    },

    ]
    ;
}

export function orderTypeDurationFormData(supportedOrderTypes, refHandler) {
    return [{
        label: 'OrderType',
        value: supportedOrderTypes,
        ref: refHandler,
        componentClass: 'select',
    },
    {
        label: 'OrderDuration',
        value: ['DayOrder', 'GoodTillCancel', 'ImmediateOrCancel'],
        componentClass: 'select',
    },
    ];
}

export function allocationKeyIdFormData(currentOrder) {
    return [{
        label: 'AllocationKeyId',
        value: currentOrder.AllocationKeyId,
        componentClass: 'input',
    }];
}

export function openCloseFormData() {
    return [{
        label: 'ToOpenClose',
        value: ['ToOpen', 'ToClose'],
        componentClass: 'select',
    }];
}

export function takeProfitFormData(takeProfitPrice) {
    return [{
        label: 'TakeProfit-OrderType',
        value: 'Limit',
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'TakeProfitPrice',
        value: takeProfitPrice,
        componentClass: 'text',
    },
    ];
}

export function stopLossFormData(stopLossPrice) {
    return [{
        label: 'StopLoss-OrderType',
        value: ['StopIfTraded', 'TrailingStopIfTraded', 'StopLimit'],
        componentClass: 'select',
    },
    {
        label: 'StopLossPrice',
        value: stopLossPrice,
        componentClass: 'text',
    },
    ];
}

export function getUpdatedValues(event, order, ask, bid) {
    const value = event.target.value;
    switch (event.target.id) {
        case 'AllocationKeyId':
            order.currentOrder.AllocationKeyId = value;
            break;

        case 'BuySell':
            order.currentOrder.BuySell = value;
            order.currentOrder.OrderPrice = order.currentOrder.BuySell === 'Buy' ? ask : bid;
            break;

        case 'OrderDuration':
            order.currentOrder.OrderDuration.DurationType = value;
            break;

        case 'OrderAmount':
            order.currentOrder.Amount = value;
            break;

        case 'OrderPrice':
            order.currentOrder.OrderPrice = value;
            break;

        case 'Account':
            order.currentOrder.AccountKey = value;
            break;

        case 'ToOpenClose':
            order.currentOrder.ToOpenClose = value;
            break;

        case 'OrderType':
            order.currentOrder.OrderType = value;
            break;

        case 'TakeProfitPrice':
            order.takeProfitPrice = value;
            break;

        case 'StopLossPrice':
            order.stopLossPrice = value;
            break;

        case 'StopLoss-OrderType':
            order.stopLossOrderType = value;
            break;

        default:
            break;
    }
    return order;
}

export function getRelatedOrder(orderType, orderPrice, currentOrder) {
    return {
        Uic: currentOrder.Uic,
        AssetType: currentOrder.AssetType,
        OrderType: orderType,
        OrderPrice: orderPrice,
        OrderDuration: currentOrder.OrderDuration,
        Amount: currentOrder.Amount,
        AccountKey: currentOrder.AccountKey,
        BuySell: currentOrder.BuySell === 'Buy' ? 'Sell' : 'Buy',

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
        OrderRelation: 'IfDoneMaster',
        ToOpenClose: 'ToClose',
    };
}

export function fetchInfoPrices(instrument, props, cb) {

    const { AssetType, Uic } = instrument;
    const instrumentData = { AssetType, Uic };

    if (instrument.Expiry && instrument.PutCall) {
        instrumentData.expiryDate = instrument.Expiry;
        instrumentData.PutCall = instrument.PutCall;
    }

    doWithLoader(props, _.partial(getInfoPrices, props.accessToken, instrumentData), (result) => cb(result.response));
}

export function postOrder(order, props, cb) {
    doWithLoader(props, _.partial(placeOrder, props.accessToken, order), (result) => cb(result.response));
}

export function fetchAccountInfo(props, cb) {
    doWithLoader(props, _.partial(getAccountInfo, props.accessToken), (result) => cb(result.response));
}

export function getAccountArray(accountInfo) {
    return _.reduce(accountInfo.Data, (result, value) => {
        result.push(value);
        return result;
    }, []);
}

// methods for handling subscription for prices
export function removeSubscription(subscription, props, cb) {
    if (subscription) {
        doWithLoader(
            props,
            _.partial(removeIndividualSubscription, props.accessToken, subscription),
            () => cb()
        );
    }
}

export function createSubscription(instrument, props, onPriceUpdate, cb) {

    const { AssetType, Uic } = instrument;
    const instrumentData = { AssetType, Uic };

    if (instrument.Expiry && instrument.PutCall) {
        instrumentData.expiryDate = instrument.Expiry;
        instrumentData.PutCall = instrument.PutCall;
    }

    doWithLoader(
        props,
        _.partial(subscribePrices,
            props.accessToken,
            instrumentData,
            onPriceUpdate,
            setGlobalErrMessage.bind(null, props)),
        (result) => cb(result)
    );
}

// this function checks if everything is ok with the order or else it shows custom validation error
export function validateOrder(order, props) {
    let isOrderOk = true;

    const { Uic, AccountKey, Amount, OrderPrice } = order;

    if (!Uic) {
        props.setErrMessage('The Uic is not present. The order can\'t be placed.');
        isOrderOk = false;
    } else if (!AccountKey) {
        props.setErrMessage('Please select an account before placing order.');
        isOrderOk = false;
    } else if (!Amount && Amount > 0) {
        props.setErrMessage('Please fill some appropriate order quantity before placing the order.');
        isOrderOk = false;
    } else if (!OrderPrice && OrderPrice > 0) {
        props.setErrMessage('Please fill an appropriate order price.');
        isOrderOk = false;
    }

    return isOrderOk;
}
