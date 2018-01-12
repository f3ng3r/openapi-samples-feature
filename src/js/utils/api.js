import * as services from './dataServices';

// fetches user data from openapi/port/v1/users/me
export function getUserDetails(accessToken) {
    return services.getData({
        serviceGroup: 'port',
        endPoint: 'v1/users/me',
        accessToken,
    });
}

// fetch instruments from client lib based on AssetType
// eg: Query Params : { AssetType: 'FxSpot' }
export function getInstruments(accessToken, params) {
    const { AssetTypes, keyword } = params;
    return services.getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments',
        queryParams: { AssetTypes, Keywords: keyword },
        accessToken,
    });
}

// fetch instrument details from client lib based on Uic and AssetType
// eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
export function getInstrumentDetails(accessToken, instrument) {
    const { Uic, AssetType, ExpiryDate, PutCall } = instrument;
    return services.getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments/details/{Uic}/{AssetType}',
        queryParams: {
            Uic,
            AssetType,
            ExpiryDate,
            PutCall,
        },
        accessToken,
    });
}

// fetch Info Prices for a particular instrument based on AssetType and Uic
// eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
export function getInfoPrices(accessToken, instrumentDetails) {
    return services.getData({
        serviceGroup: 'trade',
        endPoint: 'v1/infoprices',
        queryParams: {
            AssetType: instrumentDetails.AssetType,
            Uic: instrumentDetails.Uic,
            ExpiryDate: instrumentDetails.expiryDate,
            PutCall: instrumentDetails.PutCall,
            FieldGroups: [
                'DisplayAndFormat',
                'InstrumentPriceDetails',
                'MarketDepth',
                'PriceInfo',
                'PriceInfoDetails',
                'Quote',
            ],
        },
        accessToken,
    });
}

// fetch client details
export function fetchClientInfo(accessToken) {
    return services.getData({
        serviceGroup: 'port',
        endPoint: 'v1/clients/me',
        queryParams: null,
        accessToken,
    });
}

// fetch chart data
export function getChartData(accessToken, chartData) {
    const { AssetType, Uic, Horizon, Count } = chartData;

    return services.getData({
        serviceGroup: 'chart',
        endPoint: 'v1/charts',
        queryParams: {
            AssetType,
            Uic,
            Horizon,
            Count,
            FieldGroups: [
                'ChartInfo',
                'Data',
                'DisplayAndFormat',
            ],
        },
        accessToken,
    });
}

// fetch option chain based on AssetType
// eg: Query Params : { OptionRootId: 19 }
export function getOptionChain(accessToken, Identifier) {
    return services.getData({
        serviceGroup: 'ref',
        endPoint: `v1/instruments/contractoptionspaces/${Identifier}`,
        queryParams: null,
        accessToken,
    });
}

export function getFormattedPrice(price, decimal, formatFlags) {
    return services.formatPrice(price, decimal, formatFlags);
}

/* subscribe to Info prices for a set of instruments based on AssetType and Uics.
    eg: Query Params : {
        Arguments: {
            AssetType: 'FxSpot',
            Uics: 21,2
        },
        RefreshRate: 5
    }
*/
export function subscribeInfoPrices(accessToken, instrumentData, onUpdate, onError) {
    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup: 'trade',
            endPoint: 'v1/infoPrices/subscriptions',
            queryParams: {
                Arguments: {
                    AssetType: instrumentData.AssetType,
                    Uics: instrumentData.Uics,
                    FieldGroups: [
                        'DisplayAndFormat',
                        'InstrumentPriceDetails',
                        'MarketDepth',
                        'PriceInfo',
                        'PriceInfoDetails',
                        'Quote',
                    ],
                },
                RefreshRate: 5,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

/*  subscribe to Prices for a single instrument based on AssetType and Uic.
     eg: Query Params : {
         Arguments: {
             AssetType: 'FxSpot',
             Uic: 21
         },
         RefreshRate: 5
     }
*/
export function subscribePrices(accessToken, instrumentData, onUpdate, onError) {
    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup: 'trade',
            endPoint: 'v1/Prices/subscriptions',
            queryParams: {
                Arguments: {
                    ...instrumentData,
                    FieldGroups: [
                        'Commissions',
                        'DisplayAndFormat',
                        'Greeks',
                        'InstrumentPriceDetails',
                        'MarginImpact',
                        'MarketDepth',
                        'PriceInfo',
                        'PriceInfoDetails',
                        'Quote',
                    ],
                },
                RefreshRate: 5,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

/* handling chart streaming data*/

export function subscribeChartStreamingData(accessToken, chartData, onUpdate, onError) {
    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup: 'chart',
            endPoint: 'v1/charts/subscriptions',
            queryParams: {
                Arguments: {
                    AssetType: chartData.AssetType,
                    Uic: chartData.Uic,
                    Horizon: chartData.Horizon,
                    Count: chartData.Count,
                },
                RefreshRate: 5,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

// subscribe to Optionschain
export function subscribeOptionsChain(accessToken, optionsData, onUpdate, onError) {
    const { Identifier, AssetType } = optionsData;

    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup: 'trade',
            endPoint: 'v1/optionschain/subscriptions',
            queryParams: {
                Arguments: {
                    AssetType,
                    Identifier,
                    MaxStrikesPerExpiry: 4,
                },
                RefreshRate: 2000,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

// remove individual subscription
export function removeIndividualSubscription(accessToken, subscription) {
    return new Promise((resolve) => {
        services.disposeIndividualSubscription(accessToken, subscription);
        resolve();
    });
}

// fetch Account details
export function getAccountInfo(accessToken) {
    return services.getData({
        serviceGroup: 'port',
        endPoint: 'v1/accounts/me',
        queryParams: null,
        accessToken,
    });
}

// fetch Info Prices for a set of instruments based on AssetType and Uics
// eg: Query Params : { AssetType: 'FxSpot', Uics: 21,2 }
export function getInfoPricesList(accessToken, instrumentData) {
    return services.getData({
        serviceGroup: 'trade',
        endPoint: 'v1/infoprices/list',
        queryParams: {
            AssetType: instrumentData.AssetType,
            Uics: instrumentData.Uics,
            FieldGroups: [
                'DisplayAndFormat',
                'InstrumentPriceDetails',
                'MarketDepth',
                'PriceInfo',
                'PriceInfoDetails',
                'Quote',
            ],
        },
        accessToken,
    });
}

// returns formatted price
export function formatPrice(price, decimal, formatFlags) {
    return services.formatPrice(price, decimal, formatFlags);
}

// return balance information
export function getBalancesInfo(accessToken, params) {
    return services.getData({
        serviceGroup: 'port',
        endPoint: 'v1/balances',
        queryParams: params,
        accessToken,
    });
}

// return allocation keys
export function getAllocationKeys(accessToken, params) {
    return services.getData({
        serviceGroup: 'trade',
        endPoint: 'v1/allocationkeys',
        queryParams: params,
        accessToken,
    });
}

// return participating accounts for allocaiton key
export function getAllocationKeyParticipatingAccounts(accessToken, params) {
    return services.getData({
        serviceGroup: 'trade',
        endPoint: 'v1/allocationkeys/{AllocationKeyId}',
        queryParams: params,
        accessToken,
    });
}

// create allocation key
export function createAllocationKey(accessToken, allocationKey) {
    return services.postData({
        serviceGroup: 'trade',
        endPoint: 'v1/allocationkeys',
        queryParams: null,
        body: allocationKey,
        accessToken,
    });
}

// create order subscription
export function createOrderSubscription(accessToken, subscriptionArgs, onUpdate, onError) {
    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup: 'port',
            endPoint: 'v1/orders/subscriptions',
            queryParams: {
                Arguments: {
                    AccountKey: subscriptionArgs.accountKey,
                    ClientKey: subscriptionArgs.clientKey,
                    FieldGroups: subscriptionArgs.fieldGroups,
                },
                RefreshRate: 5,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

// create positions subscription
export function createPositionSubscription(accessToken, subscriptionArgs, onUpdate, onError) {
    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup: 'port',
            endPoint: 'v1/positions/subscriptions',
            queryParams: {
                Arguments: {
                    AccountKey: subscriptionArgs.accountKey,
                    ClientKey: subscriptionArgs.clientKey,
                    FieldGroups: subscriptionArgs.fieldGroups,
                    NetPositionId: subscriptionArgs.NetPositionId,
                },
                RefreshRate: 5,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

// create net positions subscription
export function createNetPositionSubscription(accessToken, subscriptionArgs, onUpdate, onError) {
    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup: 'port',
            endPoint: 'v1/netpositions/subscriptions',
            queryParams: {
                Arguments: {
                    AccountKey: subscriptionArgs.accountKey,
                    ClientKey: subscriptionArgs.clientKey,
                    FieldGroups: subscriptionArgs.fieldGroups,
                },
                RefreshRate: 5,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

// place order
export function placeOrder(accessToken, order) {
    return services.postData({
        serviceGroup: 'trade',
        endPoint: 'v2/orders',
        queryParams: null,
        body: order,
        accessToken,
    });
}
