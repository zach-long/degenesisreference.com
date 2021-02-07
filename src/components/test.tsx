import React, { Component } from "react";

interface TestProps {
    p: any
}

interface TestState {
}

class Test extends Component<TestProps, TestState> {
    constructor(props: TestProps) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        console.log(`TEST`);
    }

    render() {
        return (
            <h1>THIS IS A TEST {this.props.p}</h1>
        );
    }
}

export default Test;