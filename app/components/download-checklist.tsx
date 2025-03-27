import {useChecklist} from "~/context/checklist-context";
import {Button} from "primereact/button";

export const DownloadChecklist = () => {
    const {checklist} = useChecklist()
    const onDownloadClick = () => {
        const checklistContent = JSON.stringify(checklist, null, 2);
        const blob = new Blob([checklistContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `${checklist.title}.checklist`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return <Button label='Save checklist' icon='pi pi-download' severity='success' onClick={onDownloadClick}  />
}
