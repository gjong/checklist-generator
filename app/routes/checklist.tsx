import type {Route} from "../../.react-router/types/app/routes/+types/checklist";
import {ChecklistEntryComponent} from "~/components/checklist-entry";
import type {Checklist} from "~/checklist.type";
import {type LoaderFunctionArgs, useLoaderData, useNavigate} from "react-router";
import {ChecklistProvider, useChecklist, DragDropProvider} from "~/context";
import defaultChecklist from "~/data/default-checklist.json"
import {Button} from "primereact/button";
import {DownloadChecklist} from "~/components/download-checklist";
import {transitionClasses} from "~/const";
import {ChecklistEntryNameDialog} from "~/components/checklist-entry-name-dialog";
import {useRef} from "react";
import {ChecklistEntryDialog} from "~/components/checklist-entry-dialog";
import {PrintableChecklist} from "~/components/printable-checklist";
import {patchAnyStructureChanges} from "~/migrations";
import { Tooltip } from "primereact/tooltip";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Edit your checklist"},
        {name: "description", content: "Edit your checklist"},
    ];
}

export function clientLoader({ request, params }: LoaderFunctionArgs) {
    if (params.checklistId) {
        const cachedChecklist = localStorage.getItem(params.checklistId);
        if (cachedChecklist) {
            const checklist = JSON.parse(cachedChecklist);
            if (patchAnyStructureChanges(checklist)) {
                localStorage.setItem(params.checklistId, JSON.stringify(checklist));
            }
            return checklist;
        }
    }
    return defaultChecklist as Checklist;
}

const ChecklistInnerComponent = () => {
    const {checklist, renameChecklist, addItemToSection} = useChecklist()
    const editTitleDialogRef = useRef<any>(null)
    const newEntrDialogRef = useRef<any>(null)
    const navigate = useNavigate()

    return <>
        <ChecklistEntryNameDialog value={checklist?.title }
                                  ref={ editTitleDialogRef }
                                  callback={ title => renameChecklist(title) }/>
        <ChecklistEntryDialog ref={ newEntrDialogRef } callback={ entry => addItemToSection(checklist.id, entry) } order={ checklist?.items?.length ?? 0 } />
        <h1 className="leading-6 font-bold text-gray-700 dark:text-gray-400 justify-center text-3xl mb-10 flex gap-2 items-center">
            {checklist?.title}
            <i className={`pi pi-pencil text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses}`}
               title="Edit section"
               onClick={() => editTitleDialogRef.current.open()}/>
            <i className={`pi pi-plus text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-blue-400/90 dark:text-gray-300/60 dark:hover:blue-gray-300 ${transitionClasses}`}
               title="Add item"
               onClick={() => newEntrDialogRef.current.open()}/>
        </h1>

        <div className='flex flex-col gap-4 checklist-content'>
            {
                (checklist?.items || [])
                    .sort((a, b) => a.order - b.order)
                    .map(checklistItem => <ChecklistEntryComponent checklistItem={checklistItem} key={checklistItem.title} />)
            }
        </div>

        <div className='flex justify-end gap-2'>
            <Button label='load other' icon='pi pi-arrow-circle-left' severity='secondary' text onClick={() => navigate('/load-checklist')}/>
            <Button label='Print' icon='pi pi-print' severity='info' onClick={() => window.print()} />
            <DownloadChecklist />
        </div>

        <div className="hidden print:block">
            <PrintableChecklist />
        </div>
        
        <Tooltip target=".checklist-section [data-pr-tooltip]" position="left" />
    </>
}

export default function ChecklistComponent() {
    const initialChecklist = useLoaderData<Checklist>();

    return <>
        <ChecklistProvider initialChecklist={ initialChecklist }>
            <DragDropProvider>
                <ChecklistInnerComponent />
            </DragDropProvider>
        </ChecklistProvider>
    </>
}
