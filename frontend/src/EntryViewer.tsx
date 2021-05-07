import "./EntryViewer.css";
import { Util } from "./util";

type Props = {
    body: string
    created: Date
    moment: string
};

export default function EntryViewer(props: Props) {
    return <div className="EntryViewer">
        <label className="EntryViewer-bodyLabel">Body</label>
        <div className="EntryViewer-body blob">{props.body}</div>
        <label className="EntryViewer-momentLabel">Moment</label>
        <div className="EntryViewer-moment blob">{props.moment}</div>
        <label className="EntryViewer-createdLabel">Submitted</label>
        <div className="EntryViewer-created blob">{Util.dateToTimeString(props.created)}</div>
    </div>;
}
