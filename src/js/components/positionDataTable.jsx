import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

class PositionDataTable extends React.PureComponent {

    netPositionTableArray() {
        return _.map(this.props.positionDetails, (value, key) => _.map(value, (positionValue, positionKey) => {
            if (key === this.props.customKey) {
                return (
                    <tr key={positionKey} className="table">
                        <td className="table-instrument">
                            {positionValue.DisplayAndFormat.Symbol}
                        </td>
                        <td className="table-status">
                            {positionValue.PositionBase.Status}
                        </td>
                        <td className="table-amount">
                            {positionValue.PositionBase.Amount}
                        </td>
                        <td className="table-price">
                            {positionValue.PositionBase.OpenPrice}
                        </td>
                    </tr>
                );
            }
        }));
    }

    render() {
        if (!_.isEmpty(this.props.positionDetails)) {
            return (
                <Collapse in={this.props.isOpen}>

                    <tbody className="show-positions">
                        {this.netPositionTableArray()}
                    </tbody>

                </Collapse>
            );
        }
    }
}

PositionDataTable
    .propTypes = {
        customKey: PropTypes.string,
        isOpen: PropTypes.bool,
        value: PropTypes.bool,
        positionDetails: PropTypes.object,
    };
export default bindHandlers(PositionDataTable);
