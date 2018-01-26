import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import { Row, Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getInfo } from 'src/js/utils/queries';
import * as queries from './queries';
import DetailsHeader from 'src/js/components/detailsHeader';
import Error from 'src/js/modules/error';
import AllocationKeyForm from './allocationKeyForm';
import AllocationKeysTable from './allocationKeysTable';

class AllocationKeys extends React.PureComponent {
    constructor() {
        super();

        this.state = {
            allocationKeys: [],
        };
    }

    componentDidMount() {

        // need to fetch client information on page loading.
        this.fetchAllocationKeyList();
    }

    fetchAllocationKeyList() {
        getInfo('getAllocationKeys', this.props, null, this.handleAllocationKeysReceived);
    }

    handleFetchAllocationKeyParticipatingAccounts(AllocationKeyId, cb) {
        getInfo(
            'getAllocationKeyParticipatingAccounts',
            this.props,
            { AllocationKeyId },
            cb
        );
    }

    handleAllocationKeysReceived(response) {
        this.setState({
            allocationKeys: response.Data,
        });
    }

    handleCreateAllocationKey(allocationKey) {
        queries.postAllocationKey(allocationKey, this.props, () => {
            this.fetchAllocationKeyList();
        });
    }

    getRows() {
        return _.map(this.state.allocationKeys, (value, key) => (
            <tr key={key}>
                <td>{value.AllocationKeyId}</td>
                <td>{value.AllocationKeyName}</td>
                <td>{value.OwnerAccountKey}</td>
                <td>{value.Status}</td>
            </tr>
        ));
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="/userInfo"> this link.</a>
                    </Error>
                    <Row>
                        <div className="col-md-12">
                            <AllocationKeyForm
                                {...this.props}
                                handleCreateAllocationKey={this.handleCreateAllocationKey}
                            />
                        </div>
                    </Row>
                    <hr />
                    <Row>
                        <div className="col-md-12">
                            <Panel header="Allocation Keys" className="panel-primary">
                                <AllocationKeysTable
                                    allocationKeys={this.state.allocationKeys}
                                    fetchParticipatingAccounts={this.handleFetchAllocationKeyParticipatingAccounts}
                                />
                            </Panel>
                        </div>
                    </Row>
                </div>
            </div>
        );
    }
}

AllocationKeys.propTypes = {
    match: PropTypes.object,
};

AllocationKeys.defaultProps = {
    match: {},
};

export default bindHandlers(AllocationKeys);
