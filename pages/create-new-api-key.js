import React, {useState} from "react";
import {connect} from "react-redux";
import Head from "next/head";
import {
    Button,
} from 'antd';

const initialState = {
    apiKey: ""
};


const createNewApiPage = () => {
    const [form, setForm] = useState(initialState);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        console.log(form,e);
    };
    return (
        <React.Fragment>
            <Head>
                <title>create new Api Key</title>
            </Head>
            <div className="custom-modal animated">
                <div className="container">
                    <div className="row">
                        <div className="box">
                            <div className="logo-area">
                                <h2>Create new Api Key</h2>
                            </div>
                            <div className="bg">
                                <div className="form-group">
                                    <label>Creating an API private key provides access to markets and real-time trading
                                        services on BTCBOLSA
                                        via third-party site or application.
                                    </label>
                                </div>
                                <input
                                    value={form.apiKey || ''}
                                    onChange={handleChange}
                                    type="text"
                                    className="custom_input"
                                    name="apiKey"/>


                                <div className="input-group-append">
                                    <Button type="primary" className="custom_button" block onClick={handleSubmit}>
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const {appConfig} = state.users;
    return {
        appConfig
    }
};
export default connect(mapStateToProps)(createNewApiPage);
