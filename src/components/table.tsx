import React, { Component } from "react";

import ItemRow from './item';

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

interface TableProps {
    category: string,
    checked: boolean,
    headers: Array<string>,
    items: Array<Item>,
}

interface TableState {
}

class Table extends Component<TableProps, TableState> {
    constructor(props: TableProps) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        // console.log(`MOUNT | Table`);
    }

    render() {
        let found = this.props.items.filter((item) => {
            if (item.category == this.props.category) return item;
        });

        if (found.length > 0) {
            return (
                <table className="table category-table">
                    <thead>
                        <tr><th scope="col" colSpan={this.props.headers.length} className="category-header-name">{this.props.category}</th></tr>
                        <tr>
                            {/* {console.log(`RENDER | loading table headers for ${this.props.category}`)} */}
                            {this.props.headers.map((header) => (
                                <th scope="col">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.items.map((item) => (
                            item.category == this.props.category && <ItemRow item={item} headers={this.props.headers}/>
                        ))}
                    </tbody>
                </table>
            )
        } else {
            return null;
        }
    }
}

export default Table;