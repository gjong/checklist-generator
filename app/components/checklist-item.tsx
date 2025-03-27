import {ChecklistEntryNameDialog} from "~/components/checklist-entry-name-dialog";
import type {ChecklistItem} from "~/checklist.type";
import {useRef} from "react";
import {transitionClasses} from "~/const";
import {confirmDialog} from "primereact/confirmdialog";
import {Button} from "primereact/button";
import {findItemById, useChecklist} from "~/context";

type ChecklistItemProps = {
    itemId: string,
    onDelete?: (itemId: string) => void
}

export function ChecklistItemComponent({itemId, onDelete}: ChecklistItemProps) {
    const {checklist, updateItemStatus, updateItemTitle} = useChecklist();
    const editTitleDialogRef = useRef<any>(null)
    const checklistItem = findItemById<ChecklistItem>(checklist.items, itemId)!

    const handleDelete = (event: any) => {
        confirmDialog({
            message: 'Are you sure you want to delete "' + checklistItem.title + '"?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            accept: () => onDelete?.(checklistItem.id),
            footer: x => {
                return <>
                    <Button label='cancel' text severity='secondary' icon='pi pi-times-circle' onClick={ x.reject }/>
                    <Button label='delete' text severity='danger' icon='pi pi-trash' onClick={ x.accept }/>
                </>
            }
        })
    }

    return <>
        <ChecklistEntryNameDialog value={ checklistItem.title }
                                  ref={ editTitleDialogRef }
                                  callback={ title => updateItemTitle(checklistItem.id, title) }/>
        <div className='flex justify-between items-center px-2 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/30 mb-1 group checklist-item'>
            <div className='flex gap-2 items-center'>
                <i className={`pi pi-bars text-sm aspect-square cursor-move text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses}`}
                   title="Drag to reorder" />
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded cursor-pointer"
                    checked={checklistItem.done}
                    onChange={ e => updateItemStatus(checklistItem.id, e.target.checked)} />
                <span className={`${checklistItem.done ? 'line-through text-gray-400 dark:text-gray-500' : ''} cursor-pointer`}
                      onClick={ () => updateItemStatus(checklistItem.id, !checklistItem.done) }>
                    {checklistItem.title}
                </span>
             </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <i className={`pi pi-pencil text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses}`}
                   title="Edit item"
                   onClick={() => editTitleDialogRef.current.open()}/>
                <i className={`pi pi-trash text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-red-500 dark:text-gray-300/60 dark:hover:text-red-400 ${transitionClasses}`}
                   title="Delete item"
                   onClick={ handleDelete }/>
            </div>
        </div>

    </>
}
