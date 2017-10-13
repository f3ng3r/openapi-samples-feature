import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import CustomRowForPositions from './customRowForPositions';

class CustomTableForPositions extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        });
    }

    getNetPositionsDataTable() {
        const netPositionTableArray = _.map(this.state.data, (value, key) => (
            <tr key={key}>
                <td>{key}</td>
                <td>{value.NetPositionView.Status}</td>
                <td>{value.NetPositionBase.Amount}</td>
                <td>{value.NetPositionView.AverageOpenPrice}</td>
            </tr>
        ));

        if (!_.isEmpty(this.props.data)) {
            const PositionTableArray = _.map(this.props.data, (value, index) => (
                <div key={index}>
                    <CustomRowForPositions onlyPositionData={this.props.onlyPositionData} index={index} value={value}/>
                </div>));
            return PositionTableArray;
        }
        return netPositionTableArray;
    }

    render() {
        return (
            <div>
                <Table responsive>
                    <tbody>
                        <tr>
                            <td className="table-instrument">Instrument</td>
                            <td className="table-status">Status</td>
                            <td className="table-amount">Amount</td>
                            <td className="table-price">Open Price</td>
                        </tr>
                    </tbody>
                </Table>
                {this.getNetPositionsDataTable()}
            </div>
        );
    }
}

CustomTableForPositions
    .propTypes = {
        data: PropTypes.object,
        onlyPositionData: PropTypes.object,
    };

export default bindHandlers(CustomTableForPositions);
