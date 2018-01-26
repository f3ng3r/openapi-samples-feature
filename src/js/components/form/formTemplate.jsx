import React from 'react';
import { Button, FormGroup, Well, Row, Col, Form, Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { bindHandlers } from 'react-bind-handlers';

import FormGroupTemplate from './formGroupTemplate';
import Options from 'src/js/modules/assets/options';

class FormTemplate extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            optionRoot: props.optionRoot,
            takeProfitOpen: false,
            stopLossOpen: false,
        };

        this.currentOrder = props.currentOrder;
        this.takeProfitPrice = props.takeProfitPrice;
        this.stopLossPrice = props.stopLossPrice;
        this.stopLossOrderType = props.stopLossOrderType;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            optionRoot: nextProps.optionRoot,
        });
    }

    handleValueChange(event) {
        const { getUpdatedValues } = this.props.queries;
        const updatedValues = getUpdatedValues(event, {
            currentOrder: this.currentOrder,
            takeProfitPrice: this.takeProfitPrice,
            stopLossPrice: this.stopLossPrice,
            stopLossOrderType: this.stopLossOrderType,
        }, this.Ask, this.Bid);
        this.currentOrder = updatedValues.currentOrder;
        this.takeProfitPrice = updatedValues.takeProfitPrice;
        this.stopLossPrice = updatedValues.stopLossPrice;
        this.stopLossOrderType = updatedValues.stopLossOrderType;

        this.setState({ updated: !this.state.updated });
    }

    handleProfitBtnClick() {
        this.setState({ takeProfitOpen: !this.state.takeProfitOpen });
    }

    handleLossBtnClick() {
        this.setState({ stopLossOpen: !this.state.stopLossOpen });
    }

    handleOrderPlace() {
        this.currentOrder.Orders = [];

        const { getRelatedOrder } = this.props.queries;
        if (this.state.takeProfitOpen) {
            // Setup related order
            const order = getRelatedOrder('Limit', this.takeProfitPrice, this.currentOrder);
            this.currentOrder.Orders.push(order);
        }
        if (this.state.stopLossOpen) {
            // Setup another related order
            const order = getRelatedOrder(this.stopLossOrderType, this.stopLossPrice, this.currentOrder);
            order.StopLimitPrice = this.stopLossPrice;
            this.currentOrder.Orders.push(order);
        }

        this.props.handlePlaceOrder(this.currentOrder);
    }

    render() {
        const {
            instrumentInfo,
            optionRoot,
            handleInstrumentChange,
            supportedOrderTypes,
            handleRef,
        } =
            this.props;

        const {
            getAskBidFormData,
            getBuySellFormData,
            orderTypeDurationFormData,
            stopLossFormData,
            openCloseFormData,
            takeProfitFormData,
            allocationKeyIdFormData,
        } = this.props.queries;

        return (
            <Form>

                {/* row1 with ask/bid prices which are readonly*/}
                <FormGroupTemplate
                    data={getAskBidFormData(instrumentInfo, this.currentOrder)}
                    onChange={this.handleValueChange}
                />

                {/* options row which shows only when some option is selected*/}
                {this.state.optionRoot &&
                <Options
                    {...this.props}
                    optionRoot={optionRoot}
                    onInstrumentSelected={handleInstrumentChange}
                />
                }

                {/* row2 with manual input ask/bid prices*/}
                <FormGroupTemplate
                    data={getBuySellFormData(this.currentOrder, instrumentInfo)}
                    onChange={this.handleValueChange}
                />

                {/* row3 with manual input*/}
                <FormGroupTemplate
                    data={orderTypeDurationFormData(supportedOrderTypes, handleRef)}
                    onChange={this.handleValueChange}
                />
                {this.state.optionRoot &&
                <FormGroupTemplate
                    data={openCloseFormData()}
                    onChange={this.handleValueChange}
                />
                }

                {/* row4 with manual input of Allocation Key Id*/}
                <FormGroupTemplate
                    data={allocationKeyIdFormData(this.currentOrder)}
                    onChange={this.handleValueChange}
                />

                <FormGroup>
                    {/* take profit section*/}
                    <div>
                        <Button bsStyle="link" disabled={this.state.takeProfitOpen}
                            onClick={this.handleProfitBtnClick}
                        >Take Profit</Button>
                        <Collapse in={this.state.takeProfitOpen}>
                            <div>
                                <Well>
                                    <FormGroupTemplate
                                        data={takeProfitFormData(this.takeProfitPrice)}
                                        onChange={this.handleValueChange}
                                    />
                                    <Button bsStyle="primary"
                                        onClick={this.handleProfitBtnClick}
                                    >Remove</Button>
                                </Well>
                            </div>
                        </Collapse>
                    </div>

                    {/* stop loss section*/}
                    <div>
                        <Button bsStyle="link" disabled={this.state.stopLossOpen}
                            onClick={this.handleLossBtnClick}
                        >Stop Loss</Button>
                        <Collapse in={this.state.stopLossOpen}>
                            <div>
                                <Well>
                                    <FormGroupTemplate data={stopLossFormData(this.stopLossPrice)}
                                        onChange={this.handleValueChange}
                                    />
                                    <Button bsStyle="primary"
                                        onClick={this.handleLossBtnClick}
                                    >Remove</Button>
                                </Well>
                            </div>
                        </Collapse>
                    </div>
                </FormGroup>

                <FormGroup bsSize="large">
                    <Row>
                        <Col sm={3}>
                            <Button bsStyle="primary" block onClick={this.handleOrderPlace}>
                                Place Order</Button>
                        </Col>
                    </Row>
                </FormGroup>
            </Form>
        );
    }
}

FormTemplate.propTypes = {
    instrumentInfo: PropTypes.object,
    optionRoot: PropTypes.object,
    handleInstrumentChange: PropTypes.func.isRequired,
    supportedOrderTypes: PropTypes.array.isRequired,
    currentOrder: PropTypes.object.isRequired,
    queries: PropTypes.object.isRequired,
    takeProfitPrice: PropTypes.object,
    stopLossPrice: PropTypes.object,
    stopLossOrderType: PropTypes.object,
    handlePlaceOrder: PropTypes.func.isRequired,
    handleRef: PropTypes.func.isRequired,
};

export default bindHandlers(FormTemplate);
