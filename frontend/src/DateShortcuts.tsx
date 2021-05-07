import { Button } from '@material-ui/core';
import { Util } from './util';

type Props = {
    onChange: (value: Date) => void
};

export default function DateShortcuts(props: Props) {
    const minus390Days = Util.daysAgo(390);
    const minus30Days = Util.daysAgo(30);
    const minus1Day = Util.daysAgo(1);

    return <div>
        <Button
            color="default"
            fullWidth={false}
            onClick={event => props.onChange(Util.daysAgo(390))}
            variant="contained"
        >-390 days</Button>

        <Button
            color="default"
            fullWidth={false}
            onClick={event => props.onChange(Util.daysAgo(30))}
            variant="contained"
        >-30 days</Button>

        <Button
            color="default"
            fullWidth={false}
            onClick={event => props.onChange(Util.daysAgo(1))}
            variant="contained"
        >-1 day</Button>

        <Button
            color="default"
            fullWidth={false}
            onClick={event => props.onChange(new Date())}
            variant="contained"
        >0 day</Button>
    </div>;
}
