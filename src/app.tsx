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
    search: string,
    itemList: Array<Item>,
    sortedList: Array<Item>
}

class App extends Component<any, AppState, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            // linked to the search bar; the string to search for in item name list
            "search": '',

            // cached list of all items; used for iterating not displaying
            "itemList": [],

            // items that are displayed row-by-row based on search parameters
            "sortedList": []
        }
    }

    getData = () => {
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
                "itemList": json.data,
                "sortedList": json.data
            });
        });
    }

    searchItemList = (searchValue: string, searchPool: Array<Item>): Promise<Array<Item>> => {
        console.log(`Searching cached items for query param: ${searchValue}`);
        return new Promise((resolve) => {
            let foundResults: Array<Item> = searchPool.filter((item: Item) => {
                console.log(`Iterating over: `);
                console.log(item);

                let standardizedCompareValue: string = item.name.toLowerCase();
                let standardizedSearchValue: string = searchValue.toLowerCase();

                let checkMatch: number = standardizedCompareValue.indexOf(standardizedSearchValue);
                
                if (checkMatch != -1) {
                    console.log(`Found match at ${checkMatch} for ${item.name}`);
                    // let foundMatch = item.name.indexOf(searchValue);
                    return item;
                }
                
            });

            console.log(`Map results logged below:`);
            console.log(foundResults);
            
            resolve(foundResults);
        });
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target: EventTarget & HTMLInputElement = event.target;
        const value: string = target.value;

        let pool: Array<Item> = this.state.itemList;

        console.log(`Preparing to search list logged below:`);
        console.log(this.state.itemList);
        this.searchItemList(value, pool).then((foundResults) => {
            console.log(`FOUND: ${foundResults}`);

            this.setState({
                "search": value,
                "sortedList": foundResults
            });
        });
    }

    componentDidMount() {
        console.log(`*************** componentDidMount() ***************`);
        console.log(this.state);
        this.getData();
    }

    render() {
        return (
            <main>
                <header>
                </header>
                <main>
                    <section id="sort-parameters">
                        <input name="search" value={this.state.search} placeholder={"Search by name..."} onChange={this.handleChange}/>
                    </section>
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
                                {this.state.sortedList.map((item) => <ItemRow item={item}/>)}
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
