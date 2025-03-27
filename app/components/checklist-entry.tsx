import type {ChecklistEntry} from "~/checklist.type";
import {ChecklistSectionComponent} from "~/components/checklist-section";
import {ChecklistItemComponent} from "~/components/checklist-item";
import {DraggableItem} from "~/components/draggable-item";

export function ChecklistEntryComponent({checklistItem, depth = 0}: { checklistItem: ChecklistEntry, depth?: number }) {

    return <>
        <DraggableItem itemId={ checklistItem.id } index={ checklistItem.order } sectionId={ 'ROOT' }>
            { 'items' in checklistItem && <ChecklistSectionComponent sectionId={ checklistItem.id } />}
            { 'done' in checklistItem && <ChecklistItemComponent itemId={ checklistItem.id } /> }
        </DraggableItem>
    </>
}
