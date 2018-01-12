import React from 'react';
import PropTypes from 'prop-types';

import { bindHandlers } from 'react-bind-handlers';

import _ from 'lodash';
import { getInfo } from 'src/js/utils/queries';

import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Col } from 'react-bootstrap';

import ParticipatingAccountsFields from './participatingAccountsFields';

class AllocationKeyForm extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            'Accounts': [],
            'CurrentAllocationKey': {
                'AllocationKeyName': '',
                'AllocationUnitType': 'Unit',
                'MarginHandling': 'Reduce',
                'OneTime': true,
                'OwnerAccountKey': '',
                'ParticipatingAccountsInfo': [],
            },

        };
    }

    componentDidMount() {
        // need to fetch client information on page loading.
        getInfo('getAccountInfo', this.props, null, this.handleAccountInfo);
    }

    handleAccountInfo(response) {
        const accounts = _.map(response.Data, (account) => {
            return { name: account.AccountId, val: account.AccountKey };
        });

        this.setState({
            'Accounts': accounts,
            'CurrentAllocationKey': {
                ...this.state.CurrentAllocationKey,
                'OwnerAccountKey': accounts[0].val,
            },
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            'CurrentAllocationKey': {
                ...this.state.CurrentAllocationKey,
                [name]: value,
            },
        });
    }

    handleParticipatingAccountsInfoChange(updatedParticipatingAccountsInfo) {
        this.setState({
            'CurrentAllocationKey': {
                ...this.state.CurrentAllocationKey,
                'ParticipatingAccountsInfo': updatedParticipatingAccountsInfo,
            },
        });
    }

    handleCreateAllocationKey() {
        this.props.handleCreateAllocationKey(this.state.CurrentAllocationKey);
    }

    getFormElement(label, key, kind = 'input', options = []) {
        let control;
        if (kind === 'select') {
            const optionsFields = _.map(options, (option) => (<option key={option.val} value={option.val}>{option.name}</option>));

            console.log(optionsFields);

            control = (
                <FormControl
                    componentClass="select"
                    value={this.state.CurrentAllocationKey[key]}
                    name={key}
                    onChange={this.handleInputChange}
                >
                    { optionsFields }
                </FormControl>
            );
        } else {
            control = (
                <FormControl
                    type="text"
                    value={this.state.CurrentAllocationKey[key]}
                    name={key}
                    onChange={this.handleInputChange}
                />
            );
        }

        return (
            <FormGroup>
                <ControlLabel>{label}</ControlLabel>
                { control }
            </FormGroup>
        );
    }

    render() {
        return (
            <div>
                <Form>
                    <Row>
                        <Col md={4}>
                            { this.getFormElement('Name', 'AllocationKeyName') }
                            { this.getFormElement(
                                'Unit Type',
                                'AllocationUnitType',
                                'select',
                                [{ name: 'Unit', val: 'Unit' }, { name: 'Percentage', val: 'Percentage' }]
                            ) }
                            { this.getFormElement(
                                'Margin Handling',
                                'MarginHandling',
                                'select',
                                [{ name: 'Reduce', val: 'Reduce' }, { name: 'Reject', val: 'Reject' }]
                            ) }
                            { this.getFormElement(
                                'One Time',
                                'OneTime',
                                'select',
                                [{ name: 'True', val: true }, { name: 'False', val: false }]
                            ) }
                            { this.getFormElement(
                                'Owner Account Key',
                                'OwnerAccountKey',
                                'select',
                                this.state.Accounts
                            ) }
                        </Col>
                        <Col md={8}>
                            <ParticipatingAccountsFields
                                participatingAccountsInfo={this.state.CurrentAllocationKey.ParticipatingAccountsInfo}
                                onParticipatingAccountsInfoChange={this.handleParticipatingAccountsInfoChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Button bsStyle="primary" onClick={this.handleCreateAllocationKey}>
                                      Create Allocation Key</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

AllocationKeyForm.propTypes = {
    handleCreateAllocationKey: PropTypes.func.isRequired,
};

export default bindHandlers(AllocationKeyForm);
