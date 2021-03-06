import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { ButtonToolbar, Row } from 'react-bootstrap';
import { func, array } from 'prop-types';
import * as allAssetTypes from 'src/js/data/allAssetTypes.json';
import { checkIfOption } from 'src/js/utils/global';
import Dropdown from 'src/js/components/dropdown';
import { getInfo } from 'src/js/utils/queries';

class Instruments extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            optionRoot: null,
            assetTypeTitle: 'Select AssetType',
            title: '',
            instruments: null,
        };
    }

    handleAssetTypeSelection(eventKey) {
        // notify if any UI component using it and want to listen to asset change
        const { onAssetTypeSelected } = this.props;
        if (onAssetTypeSelected) {
            onAssetTypeSelected(eventKey);
        }

        this.setState({ assetTypeTitle: eventKey });
        if (checkIfOption(eventKey)) {
            this.setState({ title: 'Select OptionRoot' });
        } else {
            this.setState({ title: 'Select Instrument' });
        }
        getInfo('getInstruments', this.props, { AssetTypes: eventKey }, (response) => {
            this.setState({ instruments: response.Data });
        });
    }

    handleInstrumentSelection(instrument) {
        /* checkIfOption
           true  : simply update state to render option component.
           false : get instrument details.
        */
        const { onOptionRootSelected, onInstrumentSelected } = this.props;
        if (checkIfOption(instrument.AssetType)) {
            onOptionRootSelected(instrument);
        } else {
            instrument.Uic = instrument.Identifier;
            getInfo('getInstrumentDetails', this.props, instrument, (response) => {
                onInstrumentSelected(response);
            });
        }
        this.setState({ title: instrument.Description });
    }

    render() {
        const { assetTypes } = this.props;
        const { assetTypeTitle, instruments, title } = this.state;
        return (
            <div className="pad-box">
                <Row>
                    <ButtonToolbar>
                        <Dropdown
                            data={assetTypes || allAssetTypes.data}
                            title={assetTypeTitle}
                            id="assetTypes"
                            handleSelect={this.handleAssetTypeSelection}
                        />
                        {
                            instruments &&
                            <Dropdown
                                data={instruments}
                                itemKey="Symbol"
                                value="Description"
                                id="instruments"
                                title={title}
                                handleSelect={this.handleInstrumentSelection}
                            />
                        }
                        {this.props.children}
                    </ButtonToolbar>
                </Row>
            </div>
        );
    }
}

Instruments.propTypes = {
    onInstrumentSelected: func.isRequired,
    onAssetTypeSelected: func,
    onOptionRootSelected: func,
    assetTypes: array,
};

export default bindHandlers(Instruments);
