import { Button, CircularProgress, TextField } from '@material-ui/core';

type Props = {
    isLoading: boolean
    body: string
    moment: string
    onBodyChange: (value: string) => void
    onMomentChange: (value: string) => void
    onSubmit: () => void
};

export default function EntryEditor(props: Props) {
    return <div>
        <TextField id="body"
            disabled={props.isLoading}
            fullWidth={true}
            label="Body"
            margin="normal"
            multiline={true}
            onChange={event => props.onBodyChange(event.target.value)}
            required={true}
            rows="12"
            value={props.body}
            variant="outlined"
        />

        <TextField id="moment"
            disabled={props.isLoading}
            fullWidth={true}
            label="Moment"
            margin="normal"
            multiline={true}
            onChange={event => props.onMomentChange(event.target.value)}
            required={true}
            rows="2"
            value={props.moment}
            variant="outlined"
        />

        <Button
            color="primary"
            fullWidth={true}
            disabled={props.isLoading}
            onClick={props.onSubmit}
            variant="contained"
        >{props.isLoading ? <CircularProgress size={24} /> : 'Submit'}</Button>
    </div>;
}
