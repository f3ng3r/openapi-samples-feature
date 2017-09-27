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
export function getInstruments(accessToken, assetTypes) {
    return services.getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments',
        queryParams: { AssetTypes: assetTypes },
        accessToken,
    });
}

// fetch instrument details from client lib based on Uic and AssetType
// eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
export function getInstrumentDetails(accessToken, uic, assetTypes) {
    return services.getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments/details/{Uic}/{AssetType}',
        queryParams: {
            Uic: uic,
            AssetType: assetTypes,
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
            ExpiryDate: instrumentDetails.ExpiryDate,
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
export function getClientInfo(accessToken) {
    return services.getData({
        serviceGroup: 'port',
        endPoint: 'v1/clients/me',
        queryParams: null,
        accessToken,
    });
}

// fetch option chain based on AssetType
// eg: Query Params : { OptionRootId: 19 }
export function getOptionChain(accessToken, optionId) {
    return services.getData({
        serviceGroup: 'ref',
        endPoint: `v1/instruments/contractoptionspaces/${optionId}`,
        queryParams: null,
        accessToken,
    });
}

export function getFormattedPrice(price, decimal, formatFlags) {
    return services.formatPrice(price, decimal, formatFlags);
}

// fetch option chain based on AssetType
// eg: Query Params : { OptionRootId: 19 }
export function getOptionRootData(accessToken, rootId) {
    return services.getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments/contractoptionspaces',
        queryParams: { OptionRootId: rootId },
        accessToken,
    });
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
                    AssetType: instrumentData.AssetType,
                    Uic: instrumentData.Uic,
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

export function formatPrice(price, decimal, formatFlags) {
    return services.formatPrice(price, decimal, formatFlags);
}

export function getBalancesInfo(accessToken, params) {
    return services.getData({
        serviceGroup: 'port',
        endPoint: 'v1/balances',
        queryParams: params,
        accessToken,
    });
}
