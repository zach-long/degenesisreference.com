import React, { Component, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';

import ItemRow from './components/item';

type Item = {
    name: string,
    season: "Any" | "Spring" | "Summer" | "Fall" | "Winter",
    location: Array<string>,
    time: Array<"Any" | "Morning" | "Afternoon" | "Night">,
    weather: "Any" | "Rain" | "Sun" | "Wind"
}

interface AppState {
    spring: boolean | undefined,
    summer: boolean | undefined,
    fall: boolean | undefined,
    winter: boolean | undefined,
    itemList: Array<Item>
}

class App extends Component<any, AppState, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            spring: true,
            summer: true,
            fall: true,
            winter: true,
            "itemList": []
        }
    }

    getData = () => {
        console.log(`getData()`);
        fetch('public/data.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((response) => {
            console.log(`Fetch result: `);
            console.log(response)
            return response.json();
        }).then((json) => {
            console.log(`JSON result: `);
            console.log(json);
            this.setState({
                "itemList": json.data
            });
        });
    }

    // handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const target = event.target;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     const name = target.name;

    //     // @ts-ignore
    //     this.setState({
    //         [name]: value
    //     });
    // }

    componentDidMount() {
        console.log(`componentDidMount()`);
        this.getData();
    }

    render() {
        return (
            <main>
                <header>
                </header>
                <main>
                    {/* <section id="sort-parameters">
                        <form>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Name Sort</th>
                                        <th scope="col">Season Sort</th>
                                        <th scope="col">Location Sort</th>
                                        <th scope="col">Time Sort</th>
                                        <th scope="col">Weather Sort</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                        <td> */}
                                            {/* <div>
                                                <label>Spring</label>
                                                <input name="spring" type="checkbox" checked={this.state.spring} onChange={this.handleChange}/>
                                            </div>
                                            <div>
                                                <label>Summer</label>
                                                <input name="summer" type="checkbox" checked={this.state.summer} onChange={this.handleChange}/>
                                            </div>
                                            <div>
                                                <label>Fall</label>
                                                <input name="fall" type="checkbox" checked={this.state.fall} onChange={this.handleChange}/>
                                            </div>
                                            <div>
                                                <label>Winter</label>
                                                <input name="winter" type="checkbox" checked={this.state.winter} onChange={this.handleChange}/>
                                            </div> */}
                                        {/* </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </section> */}
                    <section id="sorted-output">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Season</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Weather</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.itemList.map((item) => <ItemRow item={item}/>)}
                            </tbody>
                        </table>
                        
                    </section>
                </main>
                <footer>
                    <h4>&#169; Zachary Long 2021</h4>
                </footer>
            </main>
            
        );
    }
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
