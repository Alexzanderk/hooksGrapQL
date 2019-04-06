import React, { useState, useContext } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import Context from '../../context';

import { useClient } from '../../client';

import { CREATE_PIN_MUTATION } from '../../graphql/mutations.js';

const CreatePin = ({ classes }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [submited, setSubmited] = useState(false);

    const client = useClient();

    const { state, dispatch } = useContext(Context);

    const handleSubmit = async e => {
        try {
            e.preventDefault();

            setSubmited(true);
            const url = await handleImageUpload();
            const { latitude, longitude } = state.draft;
            const variables = {
                title,
                image: url,
                content,
                latitude,
                longitude
            };
            const { createPin } = await client.request(
                CREATE_PIN_MUTATION,
                variables
            );
            dispatch({ type: 'CREATE_PIN', payload: createPin });
            handleDeleteDraft();

            console.log('Created pin:', { createPin });
        } catch (err) {
            setSubmited(false);
            console.error('Error created pin:', err);
        }
    };

    const handleImageUpload = async () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'geopins');
        data.append('cloud_name', 'alexzanderk');
        try {
            const res = await axios.post(
                'https://api.cloudinary.com/v1_1/alexzanderk/image/upload',
                data
            );
            return res.data.url;
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteDraft = () => {
        setTitle('');
        setImage('');
        setContent('');
        dispatch({ type: 'DELETE_DRAFT' });
    };

    return (
        <form className={classes.form}>
            <Typography
                component="h2"
                variant="h4"
                color="secondary"
                className={classes.alignCenter}>
                <LandscapeIcon className={classes.iconLarge} />
                Pin Location
            </Typography>
            <div>
                <TextField
                    name="title"
                    label="Title"
                    placeholder="Inser blog title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <input
                    accept="image/*"
                    id="image"
                    type="file"
                    className={classes.input}
                    onChange={e => setImage(e.target.files[0])}
                />
                <label htmlFor="image">
                    <Button
                        style={{ color: image && 'green' }}
                        component="span"
                        size="small"
                        className={classes.button}>
                        <AddAPhotoIcon />
                    </Button>
                </label>
            </div>
            <div className={classes.contentField}>
                <TextField
                    name="content"
                    label="Content"
                    multiline
                    rows="6"
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
            </div>
            <div>
                <Button
                    onClick={handleDeleteDraft}
                    variant="contained"
                    className={classes.button}
                    color="primary">
                    <ClearIcon className={classes.leftIcon} />
                    Discard
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    className={classes.button}
                    color="secondary"
                    disabled={
                        !title.trim() || !content.trim() || !image || submited
                    }
                    onClick={handleSubmit}>
                    Save
                    <SaveIcon className={classes.leftIcon} />
                </Button>
            </div>
        </form>
    );
};

const styles = theme => ({
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingBottom: theme.spacing.unit
    },
    contentField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '95%'
    },
    input: {
        display: 'none'
    },
    alignCenter: {
        display: 'flex',
        alignItems: 'center'
    },
    iconLarge: {
        fontSize: 40,
        marginRight: theme.spacing.unit
    },
    leftIcon: {
        fontSize: 20,
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        fontSize: 20,
        marginLeft: theme.spacing.unit
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit,
        marginLeft: 0
    }
});

export default withStyles(styles)(CreatePin);
