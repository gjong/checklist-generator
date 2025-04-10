import type {ChecklistEntry, ChecklistSection} from "~/checklist.type";
import {useReducer, useRef, useState, useEffect} from "react";
import {ChecklistEntryNameDialog} from "~/components/checklist-entry-name-dialog";
import {ChecklistItemComponent} from "~/components/checklist-item";
import {transitionClasses} from "~/const";
import {findItemById, useChecklist} from "~/context";
import {ChecklistEntryDialog} from "~/components/checklist-entry-dialog";
import {DraggableItem} from "~/components/draggable-item";
import {confirmDialog} from "primereact/confirmdialog";
import {Button} from "primereact/button";
import {Tooltip} from "primereact/tooltip";
import {useKeyboardShortcuts} from "~/context/keyboard-shortcuts";

type ChecklistSectionProps = {
    sectionId: string,
    depth?: number,
}

// Define section colors for depth 0 sections with rounded borders
const sectionColors = [
    'border-l-4 border-l-blue-500 rounded-l-lg shadow-sm',
    'border-l-4 border-l-green-500 rounded-l-lg shadow-sm',
    'border-l-4 border-l-purple-500 rounded-l-lg shadow-sm',
    'border-l-4 border-l-amber-500 rounded-l-lg shadow-sm',
    'border-l-4 border-l-rose-500 rounded-l-lg shadow-sm',
    'border-l-4 border-l-cyan-500 rounded-l-lg shadow-sm',
    'border-l-4 border-l-emerald-500 rounded-l-lg shadow-sm',
    'border-l-4 border-l-indigo-500 rounded-l-lg shadow-sm',
];

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
    const { editDialogRef, newItemDialogRef, quickAddRef } = useKeyboardShortcuts();
    const [_, forceUpdate] = useReducer(x => x + 1, 0);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddText, setQuickAddText] = useState('');
    const quickAddInputRef = useRef<HTMLInputElement>(null);

    // Set up the quick add reference
    useEffect(() => {
        quickAddRef.current.show = () => {
            setShowQuickAdd(true);
            setTimeout(() => {
                quickAddInputRef.current?.focus();
            }, 50);
        };
    }, [quickAddRef]);

    const section = findItemById<ChecklistSection>(checklist.items, sectionId)!;
    if (!section) {
        return <></>
    }

    const { completed, total } = computeStatistics(section);
    const headerSize = depth > 0 ? 'text-lg' : 'text-2xl';
    const progressPercentage = total > 0 ? (completed / total * 100) : 0;
    
    // Get color class for depth 0 sections
    const colorClass = depth === 0 
        ? sectionColors[parseInt(sectionId) % sectionColors.length] 
        : '';
    
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

    const handleQuickAdd = () => {
        if (quickAddText.trim()) {
            addItemToSection(section.id, {
                id: crypto.randomUUID(),
                title: quickAddText.trim(),
                order: section.items?.length ?? 0,
                done: false
            });
            setQuickAddText('');
            setShowQuickAdd(false);
            forceUpdate();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleQuickAdd();
        } else if (e.key === 'Escape') {
            setShowQuickAdd(false);
        }
    };

    return <section 
        data-completed={ completed } 
        data-total={ total } 
        className={`checklist-section relative group ${colorClass} ${depth === 0 ? 'pl-3 pr-4 py-3 mb-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700' : ''}`}
        aria-label={`Section: ${section.title}`}
    >
        <ChecklistEntryDialog ref={ newItemDialogRef } callback={ onCreateEntryCompleted } order={ section.items?.length ?? 0 } />
        <ChecklistEntryNameDialog value={ section.title }
                                  ref={ editDialogRef }
                                  callback={ title => updateSectionTitle(section.id, title) }/>
        
        <div className="flex items-center gap-2 mb-2">
            <h2 className={`leading-6 text-gray-700 dark:text-gray-300 m-0 flex gap-2 items-center ${headerSize} ${depth === 0 ? 'font-semibold' : ''}`}>
                <i className={`pi pi-bars text-sm aspect-square cursor-move text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses} drag-handle`}
                   data-pr-tooltip="Drag to reorder section"
                   role="button"
                   tabIndex={0}
                   aria-label="Drag to reorder section" />
                { section.title }
            </h2>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <i className={`pi pi-pencil text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-gray-400/90 dark:text-gray-300/60 dark:hover:text-gray-300 ${transitionClasses}`}
                   data-pr-tooltip="Edit section title (Ctrl+E)"
                   role="button"
                   tabIndex={0}
                   onClick={() => editDialogRef.current.open()}
                   onKeyDown={(e) => e.key === 'Enter' && editDialogRef.current.open()}
                   aria-label="Edit section title" />

                <i className={`pi pi-plus text-sm aspect-square cursor-pointer transition-colors text-gray-400/60 hover:text-blue-400/90 dark:text-gray-300/60 dark:hover:blue-gray-300 ${transitionClasses}`}
                   data-pr-tooltip="Add new item (Ctrl+N)"
                   role="button"
                   tabIndex={0}
                   onClick={() => newItemDialogRef.current.open()}
                   onKeyDown={(e) => e.key === 'Enter' && newItemDialogRef.current.open()}
                   aria-label="Add new item" />

                <i className={`pi pi-trash text-sm aspect-square cursor-pointer text-gray-400/60 hover:text-red-500 dark:text-gray-300/60 dark:hover:text-red-400 ${transitionClasses}`}
                   data-pr-tooltip="Delete section (Delete)"
                   role="button"
                   tabIndex={0}
                   onClick={ onDeleteSection }
                   onKeyDown={(e) => e.key === 'Enter' && onDeleteSection()}
                   aria-label="Delete section" />
            </div>
        </div>

        { depth == 0 &&
            <div className="w-full bg-gray-200/50 rounded-lg h-[.8rem] mb-3 relative group/progress">
                <div 
                    className={`bg-blue-400 h-full rounded-full transition-[width] ease-in-out duration-300`} 
                    style={{ width: `${progressPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
                <div className="absolute right-0 top-[-1.5rem] text-sm text-gray-500 dark:text-gray-400 opacity-0 group-hover/progress:opacity-100 transition-opacity">
                    {completed} of {total} items completed
                </div>
            </div>
        }

        {showQuickAdd && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                <input
                    ref={quickAddInputRef}
                    type="text"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Type task name and press Enter..."
                    value={quickAddText}
                    onChange={(e) => setQuickAddText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    icon="pi pi-check"
                    rounded
                    text
                    onClick={handleQuickAdd}
                    disabled={!quickAddText.trim()}
                />
                <Button
                    icon="pi pi-times"
                    rounded
                    text
                    onClick={() => setShowQuickAdd(false)}
                />
            </div>
        )}

        <div className={`mt-2 ${depth === 0 ? 'pl-4' : 'pl-4'} flex gap-1 flex-col`}>
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

        {depth === 0 && (
            <div className="mt-4 flex justify-center gap-2">
                <Button
                    icon="pi pi-plus"
                    rounded
                    text
                    size="small"
                    onClick={() => {
                        setShowQuickAdd(true);
                        setTimeout(() => {
                            quickAddInputRef.current?.focus();
                        }, 50);
                    }}
                    tooltip="Quickly add a new task (Ctrl+T)"
                />
                <Button
                    icon="pi pi-folder"
                    size="small"
                    rounded
                    text
                    onClick={() => newItemDialogRef.current.open()}
                    tooltip="Add a new section"
                />
            </div>
        )}
    </section>
}
