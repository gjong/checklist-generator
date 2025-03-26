type Unique = {
    id: string;
}

export type Checklist = Unique & {
    title: string;
    items: ChecklistEntry[];
}

export type ChecklistEntry = ChecklistItem | ChecklistSection;
export type ChecklistSection = Unique & {
    title: string;
    items: ChecklistEntry[];
}
export type ChecklistItem = Unique & {
    title: string;
    description?: string;
    done: boolean;
}
