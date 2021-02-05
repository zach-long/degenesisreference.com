import React, { Component, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';

import ItemRow from './components/item';

type Item = {
    name: string
    maxSpeed?: string
    acceleration?: string
    brake?: string
    armor?: string
    body?: string
    structure?: string
    fleshWounds?: string,
    trauma?: string,
    armorRating?: string
    defense?: string
    attack? :string
    effect?: string
    injector?: string
    caliber?: string
    handling?: string
    distance?: string
    damage?: string
    magazine?: string
    qualities?: string
    encumbrance?: string
    artillerySlots?: string
    tech?: string
    slots?: string
    value?: string
    resources?: string
    cult?: string
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

type SortCriteria = {
    sort: string,
    value: Array<string>
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

    resetNameSearch = () => {
        this.setState({search: ''});
    }

    // iterates over every sortable value in state to determine what the status of the 'sortingApplied' indicator should be
    isSortingApplied = (): Promise<boolean> => {
        return new Promise((resolve) => {
            Object.keys(this.state.categories).map((key) => {
                // @ts-expect-error
                if (this.state.categories[key].checked == true) {
                    resolve(true);
                }
            });
            resolve(false);
        });
    }

    // iterates over every sortable value in state to determine what fields are being sorted into which values per field
    getSortedFields = (): Promise<Array<SortCriteria>> => {
        return new Promise((resolve) => {
            let sortedValues: Array<string> = Object.keys(this.state.categories).filter((key) => {
                // @ts-ignore
                if (this.state.categories[key].checked == true) {
                    // @ts-ignore
                    return this.state.categories[key].name
                }
            });
            let sortedFields: Array<SortCriteria> = [{sort: "category", value: sortedValues}];
            resolve(sortedFields);
        });
    }

    // 
    applySorting = (criteria: Array<SortCriteria>): Promise<Array<Item>> => {
        console.log(`Searching cached items for sorting criteria...`);
        return new Promise((resolve) => {
            const searchPool = this.state.itemList;
            console.log(`* Determining search pool, is sorting applied?`);
            console.log(`* According to state: ${this.state.sortingApplied}`);
            console.log(criteria);
            let foundResults: Array<Item> = searchPool.filter((item: Item) => {
                let matchedItem: Array<Item> = [];
                criteria.forEach((criterion) => {
                    // @ts-ignore
                    if (criterion.value.includes(item[criterion.sort])) {
                        matchedItem.push(item);
                    }
                });
                if (matchedItem.length > 0) {
                    return matchedItem;
                }
            });

            resolve(foundResults);
        });
    }

    getCategories = (json: any): Object => {
        let categories: Array<string> =  Array.from(new Set(json.data.map((dataObj: any): string => dataObj.category)));
        let sortableCategories: Array<SortableItem> = categories.map((category: string): SortableItem => {
            return {name: category, checked: false};
        });
        let builtCategories: Object = sortableCategories.reduce((o, key) => {
            return {...o, [key.name]: key};
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

            console.log(`Filter results logged below:`);
            console.log(foundResults);
            
            resolve(foundResults);
        });
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target: EventTarget & HTMLInputElement = event.target;
        const value: string = target.value;

        let pool: Array<Item> = this.state.sortedList;

        console.log(`Preparing to search list logged below:`);
        console.log(this.state.itemList);
        this.searchItemList(value, pool).then((foundResults) => {
            console.log(`FOUND: ${foundResults}`);

            this.setState({
                search: value,
                displayList: foundResults
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

        console.log(`* isSortingApplied()`);
        this.isSortingApplied().then((isSortingApplied: boolean) => {
            console.log(isSortingApplied);
            this.setState({sortingApplied: isSortingApplied});

            if (isSortingApplied) {
                console.log(`* getSortedFields()`);
                this.getSortedFields().then((result: Array<SortCriteria>) => {
                    console.log(result);
    
                    console.log(`* applySorting()`);
                    this.applySorting(result).then((result: Array<Item>) => {
                        console.log(`* applySorting result:`);
                        console.log(result);
    
                        this.resetNameSearch();   
                        this.setState({
                            sortedList: result,
                            displayList: result
                        });
                    });
                });
            } else {
                console.log(`* No sorting applied, setting displayList to itemList`);

                this.resetNameSearch();
                this.setState({
                    sortedList: this.state.itemList,
                    displayList: this.state.itemList
                });
            }
        });
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
                        <div className="sort-category-container">
                            <h4>Name Sort</h4>
                            <div className="sort-container"><input id="name-search" name="search" value={this.state.search} placeholder={"Search by name..."} onChange={this.handleChange}/></div>
                        </div>
                        <div className="sort-category-container">
                            <h4>Category Sort</h4>
                            <div id="category-container" className="sort-container">
                                {Object.keys(this.state.categories).map((key) => (
                                <div className="category-input-container">
                                    {/* @ts-ignore */}
                                    <input name={this.state.categories[key].name} type="checkbox" checked={this.state.categories[key].checked} onChange={this.handleCategoryToggleChange} />&nbsp;<label>{this.state.categories[key].name}</label>
                                </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="sorted-output">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Max Speed</th>
                                    <th scope="col">Acceleration</th>
                                    <th scope="col">Brake</th>
                                    <th scope="col">Armor</th>
                                    <th scope="col">Body</th>
                                    <th scope="col">Structure</th>
                                    <th scope="col">Flesh Wounds</th>
                                    <th scope="col">Trauma</th>
                                    <th scope="col">Armor Rating</th>
                                    <th scope="col">Defense</th>
                                    <th scope="col">Attack</th>
                                    <th scope="col">Effect</th>
                                    <th scope="col">Injector</th>
                                    <th scope="col">Caliber</th>
                                    <th scope="col">Handling</th>
                                    <th scope="col">Distance</th>
                                    <th scope="col">Damage</th>
                                    <th scope="col">Magazine</th>
                                    <th scope="col">Qualities</th>
                                    <th scope="col">Encumbrance</th>
                                    <th scope="col">Slots (Artillery)</th>
                                    <th scope="col">Tech</th>
                                    <th scope="col">Slots</th>
                                    <th scope="col">Value</th>
                                    <th scope="col">Resources</th>
                                    <th scope="col">Cult</th>
                                    <th scope="col">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.displayList.map((item) => <ItemRow item={item}/>)}
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
