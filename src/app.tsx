import React, { Component, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';

import ItemRow from './components/item';

type Item = {
    name: string,
    effect: string,
    encumbrance: number,
    tech: number,
    slots: number | null,
    value: number,
    resources: number,
    cult: string | null,
    category: string
}

interface AppState {
    sortingApplied: boolean,
    search: string,
    categories: Object,
    itemList: Array<Item>,
    sortedList: Array<Item>,
    displayList: Array<Item>
}

type SortableItem = {
    name: string,
    checked: boolean
}

class App extends Component<any, AppState, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            sortingApplied: false,

            // linked to the search bar; the string to search for in item name list
            search: '',

            // 
            categories: {},

            // cached list of all items; used for iterating not displaying
            itemList: [],

            // used to iterate when sorting is already applied in some manner and additional sorting is being applied
            sortedList: [],

            // data sent to display components; contents should always match what is seen
            displayList :[]
        }
    }

    getData = () => {
        fetch('data/data.json', {
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
            let categories: Object = this.getCategories(json);
            console.log(`* Categories:`);
            console.log(categories);
            this.setState({
                categories: categories,
                itemList: json.data,
                sortedList: json.data,
                displayList: json.data
            });
        });
    }

    getCategories = (json: any): Object => {
        let categories: Array<string> =  Array.from(new Set(json.data.map((dataObj: any): string => dataObj.category)));
        let sortableCategories: Array<SortableItem> = categories.map((category: string): SortableItem => {
            return {name: category, checked: false};
        });
        let builtCategories: Object = sortableCategories.reduce((o, key) => {
            return {...o, [key.name]: key}
        }, {});
        return builtCategories;
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
                search: value,
                sortedList: foundResults
            });
        });
    }

    handleCategoryToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target: EventTarget & HTMLInputElement = event.target;
        const value: boolean = target.checked;
        const name: string = target.name;

        console.log(`* handleCategoryToggleChange()`);
        // @ts-expect-error
        console.log(this.state.categories[name].name + ' ' + this.state.categories[name].checked + ' -> ' + value);

        let category: Object = {...this.state.categories};
        // @ts-expect-error
        category[name].checked = value;

        // @ts-expect-error
        this.setState({category});
    }

    componentDidMount() {
        console.log(`*************** componentDidMount() ***************`);
        console.log(this.state);
        this.getData();
    }

    render() {
        return (
            <div id="app-container">
                <header>
                    <h1 className="text-center">Degenesis Item Lookup Database</h1>
                </header>
                <main id="content">
                    <section id="sort-parameters">
                        <input id="name-search" name="search" value={this.state.search} placeholder={"Search by name..."} onChange={this.handleChange}/>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Effect</th>
                                    <th scope="col">Encumbrance</th>
                                    <th scope="col">Tech</th>
                                    <th scope="col">Slots</th>
                                    <th scope="col">Value</th>
                                    <th scope="col">Resources</th>
                                    <th scope="col">Cult</th>
                                    <th scope="col">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td scope="col">Name</td>
                                    <td scope="col">Effect</td>
                                    <td scope="col">Encumbrance</td>
                                    <td scope="col">Tech</td>
                                    <td scope="col">Slots</td>
                                    <td scope="col">Value</td>
                                    <td scope="col">Resources</td>
                                    <td scope="col">Cult</td>
                                    <td scope="col">
                                        {/* {this.state.categories.map((category: SortableItem) => (
                                            <div>
                                                <input name={category.name} type="checkbox" checked={category.checked} onChange={this.handleCategoryToggleChange} />&nbsp;<label>{category.name}</label>
                                            </div>
                                        ))} */}
                                        {Object.keys(this.state.categories).map((key) => (
                                        <div>
                                            {/* @ts-ignore */}
                                            <input name={this.state.categories[key].name} type="checkbox" checked={this.state.categories[key].checked} onChange={this.handleCategoryToggleChange} />&nbsp;<label>{this.state.categories[key].name}</label>
                                        </div>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section id="sorted-output">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Effect</th>
                                    <th scope="col">Encumbrance</th>
                                    <th scope="col">Tech</th>
                                    <th scope="col">Slots</th>
                                    <th scope="col">Value</th>
                                    <th scope="col">Resources</th>
                                    <th scope="col">Cult</th>
                                    <th scope="col">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.sortedList.map((item) => <ItemRow item={item}/>)}
                            </tbody>
                        </table>
                    </section>
                </main>
                <footer>
                    <div className="footer-element">
                        <h6 className="text-center">&copy; 2021 Zachary Long</h6>
                    </div>
                    <div className="footer-element">
                        <h6 className="text-center">Zachary Long &amp; "Degenesis Item Lookup Database" is not affiliated with SIXMOREVODKA and exists with the intent of making their intellectual property, DEGENESIS, more accessible. Consider visiting <a href="https://sixmorevodka.com/home" target="_blank">SMV</a> online or the official site of the primal-punk tabletop-roleplaying game <a href="https://degenesis.com/" target="_blank">DEGENESIS</a>.</h6>
                    </div>
                </footer>
            </div>
            
        );
    }
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
