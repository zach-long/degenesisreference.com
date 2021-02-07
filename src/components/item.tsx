import React, { Component } from "react";

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

interface ItemProps {
    item: Item,
    headers: Array<string>
}

interface ItemState {
}

class ItemRow extends Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        // console.log(`MOUNT | ItemRow`);
        // console.log(`Expected columns: ${this.props.headers}`);
        // console.log(`Item fields: ${Object.keys(this.props.item)}`)
    }

    render() {
        return (
            <tr>
                {this.props.headers.map((header) => (
                    // @ts-expect-error
                    <td>{this.props.item[header]}</td>
                ))}
            </tr>
        );
    }
}

export default ItemRow;