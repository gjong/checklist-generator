import type {ChecklistEntry, ChecklistSection} from "~/checklist.type";
import {useReducer, useRef} from "react";
import {ChecklistEntryNameDialog} from "~/components/checklist-entry-name-dialog";
import {ChecklistItemComponent} from "~/components/checklist-item";
import {transitionClasses} from "~/const";
import {findItemById, useChecklist} from "~/context";
import {ChecklistEntryDialog} from "~/components/checklist-entry-dialog";
import {DraggableItem} from "~/components/draggable-item";
import {confirmDialog} from "primereact/confirmdialog";
import {Button} from "primereact/button";

type ChecklistSectionProps = {
    sectionId: string,
    depth?: number,
}

function computeStatistics(section: ChecklistSection): { completed: number, total: number } {
    function computeTotalChildren(item: ChecklistSection): number {
        return item.items.reduce((acc, item) => {
            if ('items' in item) {
                return acc + computeTotalChildren(item)
            } else {
                return acc + 1
            }
        }, 0)
    }
    function computeCompletedChildren(item: ChecklistSection): number {
        return item.items.reduce((acc, item) => {
            if ('items' in item) {
                return acc + computeCompletedChildren(item as ChecklistSection)
            } else {
                return acc + (item.done ? 1 : 0)
            }
        }, 0)
    }

    if (!section.items) {
        return { completed: 0, total: 0 }
    }
    return {
        completed: computeCompletedChildren(section),
        total: computeTotalChildren(section)
    }
}

export function ChecklistSectionComponent({sectionId, depth = 0}: ChecklistSectionProps) {
    const { addItemToSection, checklist, updateSectionTitle, deleteItem } = useChecklist();
    const editTitleDialogRef = useRef<any>(null)
    const newEntrDialogRef = useRef<any>(null)
    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    const section = findItemById<ChecklistSection>(checklist.items, sectionId)!;
    if (!section) {
        return <></>
    }

    const { completed, total } = computeStatistics(section);
    const headerSize = depth > 0 ? 'text-lg' : 'text-2xl';
    const onCreateEntryCompleted = (entry: ChecklistEntry) => {
        addItemToSection(section.id, entry);
        forceUpdate()
    }
    const onDeleteSection = () => {
        confirmDialog({
            message: 'Are you sure you want to delete "' + section.title + '"?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            accept: () => deleteItem(section.id),
            footer: x => {
                return <>
                    <Button label='cancel' text severity='secondary' icon='pi pi-times-circle' onClick={ x.reject }/>
                    <Button label='delete' text severity='danger' icon='pi pi-trash' onClick={ x.accept }/>
                </>
            }
        })
    };

    return <section data-completed={ completed } data-total={ total } className='checklist-section'>
        <ChecklistEntryDialog ref={ newEntrDialogRef } callback={ onCreateEntryCompleted } order={ section.items?.length ?? 0 } />
        <ChecklistEntryNameDialog value={ section.title }
                                  ref={ editTitleDialogRef }
                                  callback={ title => updateSectionTitle(section.id, title) }/>
        <h2 className={`leading-6 text-gray-700 dark:text-gray-300 m-0 flex gap-2 items-center ${headerSize} mb-2`}>
            <i className={`pi pi-bars text-sm aspect-square cursor-move text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses}`}
               title="Drag to reorder" />
            { section.title }
            <i className={`pi pi-pencil text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses}`}
               title="Edit section"
               onClick={() => editTitleDialogRef.current.open()}/>

            <i className={`pi pi-plus text-sm aspect-square cursor-pointer transition-colors text-gray-400/60 hover:text-blue-400/90 dark:text-gray-300/60 dark:hover:blue-gray-300 ${transitionClasses}`}
               title="Add item"
               onClick={() => newEntrDialogRef.current.open()}/>

            <i className={`pi pi-trash text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-red-500 dark:text-gray-300/60 dark:hover:text-red-400 ${transitionClasses}`}
               title="Delete section"
               onClick={ onDeleteSection }/>
        </h2>

        { depth == 0 &&
            <div className="w-full bg-gray-200/50 rounded-lg h-[.8rem] mb-3">
                <div className={`bg-blue-400 h-full rounded-full transition-[width] ease-in-out duration-300`} style={{ width: `${total > 0 ? (completed / total * 100) : 0}%` }}></div>
            </div>
        }

        <div className='mt-2 pl-4 flex gap-1 flex-col'>
            { (section.items || [])
                .sort((a, b) => a.order - b.order)
                .map(item => {

                    return <DraggableItem itemId={ item.id } index={ item.order } sectionId={ section.id } key={item.id}>
                            { 'items' in item && <ChecklistSectionComponent sectionId={ item.id } depth={depth + 1} />}
                            { 'done' in item && <ChecklistItemComponent itemId={ item.id } onDelete={() => deleteItem(item.id)} /> }
                        </DraggableItem>
                })
            }
        </div>
    </section>
}
