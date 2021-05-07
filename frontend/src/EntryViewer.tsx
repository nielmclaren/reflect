import { Button } from '@material-ui/core';
import "./EntryViewer.css";
import { Util } from "./util";

type Props = {
    body: string
    created: Date
    isRead: boolean
    moment: string
    onMarkRead: () => void
};

export default function EntryViewer(props: Props) {
    const markReadButton = <Button
        color="default"
        fullWidth={false}
        onClick={() => props.onMarkRead()}
        variant="contained"
    >Mark Read</Button>;


    return <div className="EntryViewer">
        <label className="EntryViewer-bodyLabel">Body</label>
        <div className="EntryViewer-body blob">{props.body}</div>
        <label className="EntryViewer-momentLabel">Moment</label>
        <div className="EntryViewer-moment blob">{props.moment}</div>
        <label className="EntryViewer-createdLabel">Submitted</label>
        <div className="EntryViewer-created blob">{Util.dateToTimeString(props.created)}</div>
        <label className="EntryViewer-isReadLabel">Is read</label>
        <div className="EntryViewer-isRead blob">{props.isRead ? 'Yes' : 'No'}</div>
        {props.isRead ? '' : markReadButton}
    </div>;
}
