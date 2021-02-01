import React, { Component } from "react";

type Item = {
    name: string,
    season: "Any" | "Spring" | "Summer" | "Fall" | "Winter",
    location: Array<string>,
    time: Array<"Any" | "Morning" | "Afternoon" | "Night">,
    weather: "Any" | "Rain" | "Sun" | "Wind"
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
                <th scope="row"></th>
                <td>{this.props.item.name}</td>
                <td>{this.props.item.season}</td>
                <td>{this.props.item.location}</td>
                <td>{this.props.item.time}</td>
                <td>{this.props.item.weather}</td>
            </tr>
        );
    }
}

export default ItemRow;