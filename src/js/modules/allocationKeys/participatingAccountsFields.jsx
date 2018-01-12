import React from 'react';
import _ from 'lodash';

import PropTypes from 'prop-types';

import { Button, FormGroup, ControlLabel, FormControl, Col, Row } from 'react-bootstrap';

const ParticipatingAccountsFields = ({ participatingAccountsInfo, onParticipatingAccountsInfoChange }) => {

    const addParticipatingAccount = () => {
        const updatedParticipatingAccountsInfo = participatingAccountsInfo;
        updatedParticipatingAccountsInfo.push({
            'AccountKey': '',
            'AcceptRemainderAmount': '',
            'Priority': '',
            'UnitValue': '',
        });

        onParticipatingAccountsInfoChange(updatedParticipatingAccountsInfo);
    };

    const removeParticipatingAccount = (idx) => {
        const updatedParticipatingAccountsInfo = participatingAccountsInfo;
        updatedParticipatingAccountsInfo.splice(idx, 1);

        onParticipatingAccountsInfoChange(updatedParticipatingAccountsInfo);
    };

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const [idx, name] = target.name.split('-');

        const updatedParticipatingAccountsInfo = participatingAccountsInfo;
        updatedParticipatingAccountsInfo[idx][name] = value;

        onParticipatingAccountsInfoChange(updatedParticipatingAccountsInfo);
    };

    const getFormElement = (label, key, idx) => (
        <FormGroup>
            <ControlLabel>{label}</ControlLabel>
            <FormControl
                type="text"
                value={participatingAccountsInfo[idx][key]}
                name={idx + '-' + key}
                onChange={handleInputChange}
            />
        </FormGroup>
    );

    const getParticipatingAccountsFields = () => _.map(participatingAccountsInfo, (accountInfo, idx) => (
        <span key={idx}>
            <Row>
                <Col md={5}>
                    { getFormElement('Account Key', 'AccountKey', idx) }
                </Col>
                <Col md={2}>
                    { getFormElement('Remainder', 'AcceptRemainderAmount', idx) }
                </Col>
                <Col md={2}>
                    { getFormElement('Priority', 'Priority', idx) }
                </Col>
                <Col md={3}>
                    { getFormElement('Unit Value', 'UnitValue', idx) }
                </Col>
                <Col md={12}>
                    <Button onClick={_.partial(removeParticipatingAccount, idx)}>Remove</Button>
                </Col>
            </Row>
            <hr />
        </span>
    ));

    return (
        <div>
            {getParticipatingAccountsFields()}
            <Button onClick={addParticipatingAccount} >+ Add Participating Account</Button>
        </div>
    );

};

ParticipatingAccountsFields.propTypes = {
    participatingAccountsInfo: PropTypes.array,
    onParticipatingAccountsInfoChange: PropTypes.func.isRequired,
};

export default ParticipatingAccountsFields;
