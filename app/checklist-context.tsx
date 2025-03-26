// src/context/ChecklistContext.tsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import type {ChecklistSection, ChecklistItem, Checklist, ChecklistEntry} from '~/checklist.type';
import {useLocalStorage} from "primereact/hooks";

type ChecklistContextType = {
    checklist: Checklist;
    renameChecklist: (value: string) => void;
    addItemToSection: (sectionId: string, item: ChecklistEntry) => void;
    updateItemStatus: (itemId: string, checked: boolean) => void;
    updateItemTitle: (itemId: string, title: string) => void;
    updateSectionTitle: (sectionId: string, title: string) => void;
    deleteItem: (itemId: string) => void;
    deleteSection: (sectionId: string) => void;
};

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const findItemById = <P = {}>(items: (ChecklistItem | ChecklistSection)[], id: string): P | null => {
    for (const item of items) {
        if (item.id === id) {
            return item as P
        }
        if ('items' in item) {
            const found = findItemById(item.items, id);
            if (found) return found as P;
        }
    }
    return null;
};

export const ChecklistProvider: React.FC<{
    children: React.ReactNode,
    initialChecklist: Checklist
}> = ({children, initialChecklist}) => {
    // Load from localStorage on initial render
    const [checklist, setChecklist] = useLocalStorage<Checklist>(initialChecklist, initialChecklist.id)

    const renameChecklist = (value: string) => {
        setChecklist(currentChecklist => {
            return {
                ...currentChecklist,
                title: value
            }
        })
    }
    const addItemToSection = (sectionId: string, item: ChecklistEntry) => {
        if (sectionId === checklist.id) {
            setChecklist(currentChecklist => ({
                ...currentChecklist,
                items: [...currentChecklist.items, item]
            }))
        } else {
            setChecklist(currentChecklist => {
                const section = findItemById<ChecklistSection>(checklist.items, sectionId)!;
                section.items.push(item);
                return currentChecklist;
            })
        }
    }

    const updateItemStatus = (itemId: string, checked: boolean) => {
        setChecklist(currentChecklist => {
            const newChecklist = structuredClone(currentChecklist);
            const item = findItemById<ChecklistItem>(newChecklist.items, itemId);
            if (item) {
                item.done = checked;
            }
            return newChecklist;
        });
    };

    const updateItemTitle = (itemId: string, title: string) => {
        setChecklist(currentChecklist => {
            const newChecklist = structuredClone(currentChecklist);
            const item = findItemById<ChecklistEntry>(newChecklist.items, itemId);
            if (item) {
                item.title = title;
            }
            return newChecklist;
        });
    };

    const deleteSection = (uniqueId: string) => {
        setChecklist(currentChecklist => {
            function recursiveDeleteById(list: ChecklistEntry[]): ChecklistEntry[] {
                const updatedList = list.filter(entry => entry.id !== uniqueId)
                updatedList.map(entry => {
                    if ('items' in entry) {
                        entry.items = recursiveDeleteById(entry.items)
                    }
                    return entry
                })
                return updatedList;
            }
            return {
                ...currentChecklist,
                items: recursiveDeleteById(currentChecklist.items)
            }
        });
    };

    return (
        <ChecklistContext.Provider value={{
            checklist,
            renameChecklist,
            addItemToSection,
            updateItemStatus,
            updateItemTitle,
            updateSectionTitle: updateItemTitle,
            deleteItem: deleteSection,
            deleteSection
        }}>
            {children}
        </ChecklistContext.Provider>
    );
};

export const useChecklist = () => {
    const context = useContext(ChecklistContext);
    if (!context) {
        throw new Error('useChecklist must be used within a ChecklistProvider');
    }
    return context;
};
