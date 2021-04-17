import "./EntryViewer.css";

type Props = {
    body: string
    moment: string
};

export default function EntryViewer(props: Props) {
    return <div className="EntryViewer">
        <label className="EntryViewer-bodyLabel">Body</label>
        <div className="EntryViewer-body blob">{props.body}</div>
        <label className="EntryViewer-momentLabel">Moment</label>
        <div className="EntryViewer-moment blob">{props.moment}</div>
    </div>;
}
