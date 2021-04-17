import { Button, TextField } from '@material-ui/core';

type Props = {
    body: string
    moment: string
    onBodyChange: (value: string) => void
    onMomentChange: (value: string) => void
    onSubmit: () => void
};

export default function EntryEditor(props: Props) {
    return <div>
        <TextField id="body"
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
            onClick={props.onSubmit}
            variant="contained"
        >Submit</Button>
    </div>;
}
