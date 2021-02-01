import React, { Component } from "react";

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

interface ItemProps {
    item: Item
}

interface ItemState {
}

class ItemRow extends Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.item.name}</td>
                <td>{this.props.item.effect}</td>
                <td>{this.props.item.encumbrance}</td>
                <td>{this.props.item.tech}</td>
                <td>{this.props.item.slots}</td>
                <td>{this.props.item.value}</td>
                <td>{this.props.item.resources}</td>
                <td>{this.props.item.cult}</td>
                <td>{this.props.item.category}</td>
            </tr>
        );
    }
}

export default ItemRow;