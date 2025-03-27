type Unique = {
    id: string;
}

export type Checklist = Unique & {
    version: string;
    title: string;
    items: ChecklistEntry[];
}

export type ChecklistEntry = ChecklistItem | ChecklistSection;
export type ChecklistSection = Unique & {
    title: string;
    items: ChecklistEntry[];
    order: number;
}
export type ChecklistItem = Unique & {
    title: string;
    description?: string;
    done: boolean;
    order: number;
}

export const ItemTypes = {
    ITEM: 'item',
    SECTION: 'section'
};
