import React, { Component, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';

import Table from './components/table';

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
    checked: boolean,
    headers: Array<string>
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
            console.log(`Categorie result:`);
            console.log(categories);
            return [categories, json];
        }).then((ctgJsonArr) => {
            console.log(`Setting state with categories & data`);
            console.log(ctgJsonArr)
            this.setState({
                categories: ctgJsonArr[0],
                itemList: ctgJsonArr[1].data,
                sortedList: ctgJsonArr[1].data,
                displayList: ctgJsonArr[1].data
            });
        });
    }

    resetNameSearch = () => {
        this.setState({search: ''});
    }

    resetSort = () => {
        let falsifyCategories = this.state.categories;
        Object.keys(falsifyCategories).forEach((category) => {
            // @ts-expect-error
            falsifyCategories[category].checked = false;
        });
        console.log(falsifyCategories);

        this.setState({
            sortingApplied: false,
            search: '',
            categories: falsifyCategories,
            sortedList: this.state.itemList,
            displayList: this.state.itemList
        });
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

    mergeCategories = (sortableCategories: Array<SortableItem>, tableHeaders: Array<{category: string, headers: Array<string>}>): Promise<Array<SortableItem>> => {
        return new Promise((resolve) => {
            sortableCategories.forEach((categoryItem: SortableItem, i) => {
                // console.log(`${categoryItem.name} == ${tableHeaders[i].category}`);
                // console.log(categoryItem.name == tableHeaders[i].category);
                if (categoryItem.name == tableHeaders[i].category) {
                    categoryItem.headers = tableHeaders[i].headers;
                }
            });
            resolve(sortableCategories);
        });
    }

    getCategories = (json: any): Object => {
        console.log(`* getCategories`);
        let categories: Array<string> =  Array.from(new Set(json.data.map((dataObj: any): string => dataObj.category)));
        // console.log(`* categories`);
        // console.log(categories);
        let sortableCategories: Array<SortableItem> = categories.map((category: string): SortableItem => {
            return {name: category, checked: false, headers: []};
        });
        // console.log(`* sortableCategories`);
        // console.log(sortableCategories);

        let tableHeaders: Array<{category: string, headers: Array<string>}> = Array.from(new Set(json.data.map((dataObj: any) => {
            return JSON.stringify({category: dataObj.category, headers: Object.keys(dataObj)})
        })));
        // console.log(`* tableHeaders unparsed`);
        // console.log(tableHeaders);
        // @ts-expect-error
        tableHeaders = [...tableHeaders].map((i) => JSON.parse(i));
        // console.log(`* tableHeaders parsed`);
        // console.log(tableHeaders);

        sortableCategories.forEach((categoryItem: SortableItem, i) => {
            if (categoryItem.name == tableHeaders[i].category) {
                categoryItem.headers = tableHeaders[i].headers;
            }
        });

        // console.log(`* sortableCategories merged`);
        // console.log(sortableCategories);

        let builtCategories: Object = sortableCategories.reduce((o, key) => {
            return {...o, [key.name]: key};
        }, {});
        // console.log(`* builtCategories - being returned`);
        // console.log(builtCategories);
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
        // const value = target.type === 'checkbox' ? target.checked : target.value;

        let pool: Array<Item> = this.state.sortedList;

        console.log(`Preparing to search list logged below:`);
        console.log(pool);
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
        console.log(`MOUNT | App`);
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
                                    {/* @ts-expect-error */}
                                    <input name={this.state.categories[key].name} type="checkbox" checked={this.state.categories[key].checked} onChange={this.handleCategoryToggleChange} />&nbsp;<label>{this.state.categories[key].name}</label>
                                </div>
                                ))}
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary btn-reset" onClick={this.resetSort}>Reset</button>
                    </section>
                    <section id="sorted-output">
                        {/* {console.log(`RENDER | building tables`)} */}
                        {Object.keys(this.state.categories).map((category) => (
                            // load table only if (checked == true AND sortApplied == true) OR (checked = false AND sortApplied == false) -> checked == sortApplied?
                            // @ts-expect-error
                            (this.state.sortingApplied == this.state.categories[category].checked) &&
                            // @ts-expect-error
                            <Table category={this.state.categories[category].name} checked={this.state.categories[category].checked} headers={this.state.categories[category].headers} items={this.state.displayList} />
                        ))}
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
