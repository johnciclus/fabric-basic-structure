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
                    uri: `${ENDPOINT}creditGuarantee`,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: {
                        "id": values.id,
                        "name": values.name,
                        "type": values.type,
                        "digitalAddress": values.digitalAddress,
                        "expirationDate": values.expirationDate,
                        "value": parseInt(values.value),
                        "units": values.units,
                        "owner": `Grower#${values.owner}`,
                    },
                    json: true
                }).then((response) => {
                    console.log(response);

                    rp({
                        uri: `${ENDPOINT}creditGuarantee`,
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
                <Form.Item label="ID">
                    {getFieldDecorator('id', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input its ID!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Name">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input its name!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Type">
                    {getFieldDecorator('type', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input its type!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Digital Address">
                    {getFieldDecorator('digitalAddress', {
                        rules: [{
                            required: true,
                            message: 'Please input its digital address!'
                        }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Expiration date">
                    {getFieldDecorator('expirationDate', {
                        rules: [{
                            required: true,
                            message: 'Please input its expiration date!'
                        }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Value">
                    {getFieldDecorator('value', {
                        rules: [{
                            required: true,
                            message: 'Please input its value!'
                        }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Units">
                    {getFieldDecorator('units', {
                        rules: [{
                            required: true,
                            message: 'Please input its units!'
                        }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Owner">
                    {getFieldDecorator('owner', {
                        rules: [{
                            required: true,
                            message: 'Please input its owner!'
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
