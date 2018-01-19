import React from 'react';
import { bindHandlers } from 'react-bind-handlers';

import _ from 'lodash';
import { Table, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class AllocationKeysTable extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            expandedKey: false,
            participatingAccountsInfo: null,
        };
    }

    handleToggleDetails(key) {
        this.setState({
            expandedKey: (this.state.expandedKey === key ? false : key),
            participatingAccountsInfo: null,
        });
        this.props.fetchParticipatingAccounts(this.props.allocationKeys[key].AllocationKeyId, this.handleAllocationKeyParticipatingAccountsReceived);
    }

    getParticipatingAccountsRows(key) {
        if (this.state.expandedKey === key) {
            if (this.state.participatingAccountsInfo) {
                return _.map(this.state.participatingAccountsInfo, (account) => (
                    <tr key={account.AccountKey}>
                        <td>{account.AccountKey}</td>
                        <td>{account.AcceptRemainderAmount}</td>
                        <td>{account.Priority}</td>
                        <td>{account.UnitValue}</td>
                    </tr>
                ));
            }
            return (
                <tr><td colSpan="5">Loading...</td></tr>
            );

        }
    }

    handleAllocationKeyParticipatingAccountsReceived(response) {
        this.setState({
            participatingAccountsInfo: response.ParticipatingAccountsInfo,
        });
    }

    getRows() {
        return _.map(this.props.allocationKeys, (value, key) => (
            <tbody key={key}>
                <tr onClick={_.partial(this.handleToggleDetails, key)}>
                    <td>{value.AllocationKeyId}</td>
                    <td>{value.AllocationKeyName}</td>
                    <td>{value.OwnerAccountKey}</td>
                    <td>{value.Status}</td>
                    <td><Glyphicon className="glyph pull-right" glyph={classNames({
                        'chevron-left': this.state.expandedKey !== key,
                        'chevron-down': this.state.expandedKey === key,
                    })}
                    /></td>
                </tr>
                { this.getParticipatingAccountsRows(key) }
            </tbody>
        ));
    }

    render() {
        return (
            <Table responsive>
                <tbody>
                    <tr>
                        <th className="table-instrument">ID</th>
                        <th className="table-status">Name</th>
                        <th className="table-amount">Owner Account Key</th>
                        <th className="table-exposure">Status</th>
                    </tr>
                </tbody>
                {this.getRows()}
            </Table>
        );
    }

}

AllocationKeysTable.propTypes = { allocationKeys: PropTypes.array,
    fetchParticipatingAccounts: PropTypes.func,
};

AllocationKeysTable.defaultProps = { allocationKeys: [] };

export default bindHandlers(AllocationKeysTable);
