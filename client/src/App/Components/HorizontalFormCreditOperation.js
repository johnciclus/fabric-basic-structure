import React from "react";
import {Form, Button, Input} from "antd";
import rp from 'request-promise';

let ENDPOINT = process.env.REACT_APP_ENDPOINT;


class HorizontalFormCreditor extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                rp({
                    uri: `${ENDPOINT}creditOperation`,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: {
                        "debtor": `Grower#${values.debtor}`,
                        "creditor": `Creditor#${values.creditor}`,
                        "guarantee": `CreditGuarantee#${values.guarantee}`,
                        "timestamp": values.timestamp
                    },
                    json: true
                }).then((response) => {
                    console.log(response);

                    rp({
                        uri: `${ENDPOINT}creditOperation`,
                        headers: {'Accept': 'application/json'},
                        json: true
                    }).then((list) => {
                        this.props.setListState(list);
                    }).catch(function (err) {
                        console.log(err);
                    });
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                console.log('An error happend: ', err);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return(
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="Debtor">
                    {getFieldDecorator('debtor', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the Debtor ID!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Creditor">
                    {getFieldDecorator('creditor', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the Creditor ID!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Guarantee">
                    {getFieldDecorator('guarantee', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the Guarantee ID!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="TimeStamp">
                    {getFieldDecorator('timestamp', {
                        rules: [{
                            required: true,
                            message: 'Please input the Timestamp!'
                        }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}


export default Form.create({ name: "horizontal_form"})(HorizontalFormCreditor);
