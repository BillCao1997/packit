import React, { Component } from 'react';
import { Header, Button, Transition, Form, Input, Segment, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import categories from '../../categories.json';

class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addingCategory: 'none',
            addingCategoryText: 'None',
            quantity: 1,
            itemName: '',
            requestPending: false
        };
        this.inputNameRef = null;
    }

    clearForm = () => this.setState({ addingCategory: 'none', quantity: 1, itemName: '' });

    addItem = () => {
        if (this.state.itemName.trim() === '') return;

        this.setState({ requestPending: true });

        fetch('/api/item', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: this.state.quantity,
                category: this.state.addingCategory,
                insideBox: this.props.boxId,
                name: this.state.itemName
            })
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            this.setState({ requestPending: false, addingCategory: 'none' });
            this.props.prependItemToList(res.item);
        }).catch((err) => {
            console.error(err);
            this.setState({ requestPending: false });
        });
    }

    showAddItemForm = async(category) => {
        if (this.state.addingCategory === category.value) {
            this.setState({ addingCategory: 'none' });
        } else {
            await this.setState({ addingCategory: category.value, addingCategoryText: category.text });
            this.inputNameRef.focus();
        }
    }

    handleItemNameChange = e => this.setState({ itemName: e.target.value });

    decrementQuantity = () => this.setState({ quantity: Math.max(this.state.quantity - 1, 1) });

    incrementQuantity = () => this.setState({ quantity: this.state.quantity + 1 });

    render() {
        return (
            <Segment>
                <Header as="h3" icon="plus" content="Add Item" />
                <div style={{ textAlign: 'center' }}>
                    {
                        categories.map((category, index) => {
                            if (index === 0) return null;
                            return (
                                <div style={{ margin: '5px', display: 'inline-block' }} key={index}>
                                    <Button
                                        icon={category.icon}
                                        toggle
                                        active={this.state.addingCategory === category.value}
                                        onClick={() => this.showAddItemForm(category)}
                                        size="massive"
                                        compact/>
                                </div>
                            );
                        })
                    }
                </div>
                <Transition
                    visible={this.state.addingCategory !== 'none'}
                    animation="fade down"
                    duration={500}
                    unmountOnHide
                    onHide={this.clearForm}>
                    <Segment>
                        <Form>
                            <Form.Field inline required>
                                <label>Category</label>
                                <Input
                                    value={this.state.addingCategoryText}
                                    readOnly
                                    transparent/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Name</label>
                                <Input
                                    placeholder="Item name"
                                    onChange={this.handleItemNameChange}
                                    ref={(ref) => { this.inputNameRef = ref; }}/>
                            </Form.Field>
                            <Form.Field inline required>
                                <label>Quantity</label>
                                <Button.Group size="small">
                                    <Button icon="minus" onClick={this.decrementQuantity} />
                                    <Button content={this.state.quantity} />
                                    <Button icon="plus" onClick={this.incrementQuantity} />
                                </Button.Group>
                            </Form.Field>
                        </Form>
                        <Container style={{textAlign: 'center', marginTop: '10px'}}>
                            <Button
                                onClick={this.addItem}
                                loading={this.state.requestPending}
                                disabled={this.state.requestPending}
                                positive>
                                Add
                            </Button>
                        </Container>
                    </Segment>
                </Transition>
            </Segment>
        );
    }
}

AddItem.propTypes = {
    boxId: PropTypes.string,
    prependItemToList: PropTypes.func
};

export default AddItem;
