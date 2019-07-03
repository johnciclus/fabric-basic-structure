import React from "react";
import {Form, Button, Input} from "antd";
import rp from 'request-promise';

let ENDPOINT = process.env.REACT_APP_ENDPOINT;


class HorizontalFormGrower extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                rp({
                    uri: `${ENDPOINT}grower`,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: {
                        "id": values.id,
                        "firstName": values.firstName,
                        "lastName": values.lastName,
                        "address": values.address,
                        "score": parseFloat(values.score)
                    },
                    json: true
                }).then((response) => {
                    console.log(response);

                    rp({
                        uri: `${ENDPOINT}grower`,
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
                                message: 'Please input your ID!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="First Name">
                    {getFieldDecorator('firstName', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your first name!',
                            }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Last Name">
                    {getFieldDecorator('lastName', {
                        rules: [{
                            required: true,
                            message: 'Please input your last name!'
                        }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Address">
                    {getFieldDecorator('address', {
                        rules: [{
                            required: true,
                            message: 'Please input your address!'
                        }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="Score">
                    {getFieldDecorator('score', {
                        rules: [{
                            required: true,
                            message: 'Please input your score!'
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


export default Form.create({ name: "horizontal_form"})(HorizontalFormGrower);
