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
                <td>{this.props.item.maxSpeed}</td>
                <td>{this.props.item.acceleration}</td>
                <td>{this.props.item.brake}</td>
                <td>{this.props.item.armor}</td>
                <td>{this.props.item.body}</td>
                <td>{this.props.item.structure}</td>
                <td>{this.props.item.fleshWounds}</td>
                <td>{this.props.item.trauma}</td>
                <td>{this.props.item.armorRating}</td>
                <td>{this.props.item.defense}</td>
                <td>{this.props.item.attack}</td>
                <td>{this.props.item.effect}</td>
                <td>{this.props.item.injector}</td>
                <td>{this.props.item.caliber}</td>
                <td>{this.props.item.handling}</td>
                <td>{this.props.item.distance}</td>
                <td>{this.props.item.damage}</td>
                <td>{this.props.item.magazine}</td>
                <td>{this.props.item.qualities}</td>
                <td>{this.props.item.encumbrance}</td>
                <td>{this.props.item.artillerySlots}</td>
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