import type {ChecklistEntry} from "~/checklist.type";
import {ChecklistSectionComponent} from "~/components/checklist-section";
import {ChecklistItemComponent} from "~/components/checklist-item";

export function ChecklistEntry({checklistItem, depth = 0}: { checklistItem: ChecklistEntry, depth?: number }) {
    if ('title' in checklistItem && 'items' in checklistItem) {
        return <ChecklistSectionComponent sectionId={checklistItem.id} depth={depth} />
    }

    return <ChecklistItemComponent itemId={checklistItem.id} />
}
