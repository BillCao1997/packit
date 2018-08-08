import React, { Component } from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Boxes from '../home/Boxes';
import SearchItem from '../home/SearchItem';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedLogin: false,
            isBoxesLoading: true,
            boxes: null
        };
    }

    componentDidMount() {
        fetch('/api/box', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            if (res.error) return console.log('ERROR:', res.message);
            this.setState({ boxes: res.boxes, isBoxesLoading: false });
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        return (
            <Container>
                <Header as="h2">
                    <Icon name="home" />
                    <Header.Content>
                        PackIt!
                        <Header.Subheader>Make your moving easier</Header.Subheader>
                    </Header.Content>
                </Header>
                <Boxes
                    boxes={this.state.boxes}
                    switchPage={this.props.switchPage}
                    openBox={(id) => this.props.openBox(id, this.state.boxes)}
                    isBoxesLoading={this.state.isBoxesLoading} />
                <SearchItem />
            </Container>
        );
    }
}

HomePage.propTypes = {
    switchPage: PropTypes.func,
    openBox: PropTypes.func
};

export default HomePage;
