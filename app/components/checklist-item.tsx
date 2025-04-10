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
        <div
            className='flex justify-between items-center px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/30 mb-1 group checklist-item transition-colors duration-200'
            role="listitem"
            aria-label={checklistItem.title}
        >
            <div className='flex gap-2 items-center flex-1'>
                <i className={`pi pi-bars text-sm aspect-square cursor-move text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses} drag-handle`}
                   data-pr-tooltip="Drag to reorder item"
                   role="button"
                   tabIndex={0}
                   aria-label="Drag to reorder item" />

                <div className="relative">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded cursor-pointer appearance-none border-2 border-gray-300 dark:border-gray-600 checked:bg-blue-500 checked:border-blue-500 transition-colors duration-200"
                        checked={checklistItem.done}
                        onChange={ e => updateItemStatus(checklistItem.id, e.target.checked)}
                        aria-label={`Mark "${checklistItem.title}" as ${checklistItem.done ? 'incomplete' : 'complete'}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <i className={`pi pi-check text-[10px] text-white ${checklistItem.done ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}></i>
                    </div>
                </div>

                <span
                    className={`${checklistItem.done ? 'line-through text-gray-400 dark:text-gray-500' : ''} cursor-pointer select-none transition-colors duration-200`}
                    onClick={ () => updateItemStatus(checklistItem.id, !checklistItem.done) }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && updateItemStatus(checklistItem.id, !checklistItem.done)}
                >
                    {checklistItem.title}
                </span>
             </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <i className={`pi pi-pencil text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses}`}
                   data-pr-tooltip="Edit item (Ctrl+E)"
                   role="button"
                   tabIndex={0}
                   onClick={() => editTitleDialogRef.current.open()}
                   onKeyDown={(e) => e.key === 'Enter' && editTitleDialogRef.current.open()}
                   aria-label="Edit item" />

                <i className={`pi pi-trash text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-red-500 dark:text-gray-300/60 dark:hover:text-red-400 ${transitionClasses}`}
                   data-pr-tooltip="Delete item (Delete)"
                   role="button"
                   tabIndex={0}
                   onClick={ handleDelete }
                   onKeyDown={(e) => e.key === 'Enter' && handleDelete(e)}
                   aria-label="Delete item" />
            </div>
        </div>
    </>
}
