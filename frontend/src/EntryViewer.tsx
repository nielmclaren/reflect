import { Button } from '@material-ui/core';
import "./EntryViewer.css";
import { Util } from "./util";

type Props = {
    body: string
    submittedAt: Date
    isRead: boolean
    lastReadAt: Date | undefined
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

    const lastReadAt = props.lastReadAt ? 'Yes - ' + props.lastReadAt : 'Yes but when?';

    return <div className="EntryViewer">
        <label className="EntryViewer-bodyLabel">Body</label>
        <div className="EntryViewer-body blob">{props.body}</div>
        <label className="EntryViewer-momentLabel">Moment</label>
        <div className="EntryViewer-moment blob">{props.moment}</div>
        <label className="EntryViewer-submittedAtLabel">Submitted</label>
        <div className="EntryViewer-submittedAt blob">{Util.dateToTimeString(props.submittedAt)}</div>
        <label className="EntryViewer-isReadLabel">Is read</label>
        <div className="EntryViewer-isRead blob">{props.isRead ? lastReadAt : 'No'}</div>
        {props.isRead ? '' : markReadButton}
    </div>;
}
