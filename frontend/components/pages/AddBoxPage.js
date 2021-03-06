import React, { Component } from 'react';
import { Header, Container, Icon, Form, Button, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AddBoxPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestPending: false,
            name: '',
            description: '',
            imageSelected: null,
            errorMsg: null
        };
        this.itemImageInput = null;
        this.imageToUpload = null;
    }

    uploadImage = () => {
        if (this.itemImageInput && this.itemImageInput.files[0] !== undefined) {
            this.imageToUpload = this.itemImageInput.files[0];
            this.setState({ imageSelected: this.imageToUpload.name });
        }
    }

    createBox = async() => {
        if (this.state.name.trim() === '') return;

        this.setState({ requestPending: true });

        let imageURL;
        let error = false;
        if (this.imageToUpload !== null) {
            const data = new FormData();
            data.append('image', this.imageToUpload);
            await fetch('/api/image', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                body: data
            }).then((resp) => {
                return resp.json();
            }).then((res) => {
                imageURL = res.imageURL;
            }).catch((err) => {
                console.error(err);
                this.setState({ requestPending: false, errorMsg: 'Cannot upload image' });
                error = true;
            });
        }
        if (error) return;
        const data = { name: this.state.name };
        if (this.state.description.trim() !== '') data.description = this.state.description;
        if (imageURL) data.imageURL = imageURL;
        await fetch('/api/box', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((resp) => {
            return resp.json();
        }).then(() => {
            this.setState({ requestPending: false });
            this.props.switchPage(2);
        }).catch((err) => {
            this.setState({ requestPending: false, errorMsg: err.message });
        });
    }

    handleBoxNameChange = e => this.setState({ name: e.target.value });

    handleBoxDescriptionChange = e => this.setState({ description: e.target.value });

    render() {
        return (
            <Container>
                <Button
                    icon="chevron left" content="Back" compact primary
                    style={{ marginBottom: '5px' }}
                    onClick={() => this.props.switchPage(2)} />
                <Container style={{textAlign: 'center'}}>
                    <Header as="h2" icon>
                        <Icon name="add square" /> Create a New Box
                    </Header>
                </Container>
                <Form>
                    <Form.Field required>
                        <label>Box name</label>
                        <input
                            type="text"
                            placeholder="Name of the box..."
                            value={this.state.name}
                            onChange={this.handleBoxNameChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <input
                            type="text"
                            placeholder="Description..."
                            value={this.state.description}
                            onChange={this.handleBoxDescriptionChange}/>
                    </Form.Field>
                    <Form.Field inline>
                        <label>Image</label>
                        <label className="ui icon button" htmlFor="uploadImage">
                            <Icon name="upload" /> &nbsp; Upload
                        </label>
                        <input
                            id="uploadImage"
                            type="file"
                            style={{display: "none"}}
                            onChange={this.uploadImage}
                            ref={(input) => { this.itemImageInput = input; }}
                            accept=".jpg, .jpeg, .png"
                        />
                        <span>&nbsp; {this.state.imageSelected}</span>
                    </Form.Field>
                </Form>
                <Container style={{textAlign: 'center', marginTop: '20px'}}>
                    <Button onClick={this.createBox} loading={this.state.requestPending} size="large" positive>
                        Submit
                    </Button>
                    {this.state.errorMsg !== null ?
                        <Message negative>
                            <Message.Header>Cannot create box</Message.Header>
                            <p>{this.state.errorMsg}</p>
                        </Message> : null
                    }
                </Container>
            </Container>
        );
    }
}

AddBoxPage.propTypes = {
    switchPage: PropTypes.func
};

export default AddBoxPage;
