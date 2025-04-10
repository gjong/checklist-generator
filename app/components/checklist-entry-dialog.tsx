import {type FormEvent, type Ref, useImperativeHandle, useState, useEffect} from "react";
import type {ChecklistEntry, ChecklistItem, ChecklistSection} from "~/checklist.type";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {RadioButton} from "primereact/radiobutton";
import {Tooltip} from "primereact/tooltip";

type ChecklistEntryDialogProps = {
    ref: Ref<any>,
    callback?: (updated: ChecklistEntry) => void,
    order: number
}

export function ChecklistEntryDialog({ ref, callback, order }: ChecklistEntryDialogProps) {
    const [visible, setVisible] = useState(false)
    const [entry, setEntry] = useState(() => ({
        id: crypto.randomUUID(),
        title: '',
        order
    }))
    const [type, setType] = useState('item')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useImperativeHandle(ref, () => ({
        open() {
            setEntry({
                id: crypto.randomUUID(),
                title: '',
                order
            })
            setVisible(true)
        }
    }));

    // Focus the input field when dialog opens
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                const inputElement = document.querySelector('.entry-title-input') as HTMLInputElement;
                if (inputElement) {
                    inputElement.focus();
                }
            }, 100);
        }
    }, [visible]);

    const onSubmit = (event: FormEvent) => {
        if (!entry.title.trim()) {
            return;
        }
        
        setIsSubmitting(true);
        
        if (type === 'item') {
            callback?.({
                ...entry,
                done: false
            } as ChecklistItem)
        } else {
            callback?.({
                ...entry,
                items: []
            } as ChecklistSection)
        }
        
        setVisible(false)
        setIsSubmitting(false);

        event.preventDefault()
        return false
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (entry.title.trim()) {
                onSubmit(e as any);
            }
        }
    };

    return <>
        <Dialog 
            header={type === 'item' ? "Add a new task" : "Add a new section"}
            className='w-[35rem]'
            visible={visible} 
            onHide={() => setVisible(false)}
            draggable={false}
            resizable={false}
            closeOnEscape={true}
            modal={true}
            breakpoints={{'960px': '75vw', '641px': '90vw'}}
        >
            <form onSubmit={onSubmit} action="#" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className='font-bold text-gray-700 dark:text-gray-200'>
                        {type === 'item' ? "Task name" : "Section name"}
                    </label>
                    <InputText 
                        value={entry.title} 
                        className='w-full entry-title-input'
                        autoFocus={true}
                        onChange={e => setEntry({ ...entry, title: e.currentTarget.value })}
                        onKeyDown={handleKeyDown}
                        placeholder={type === 'item' ? "Enter task name..." : "Enter section name..."}
                    />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <label className='font-bold text-gray-700 dark:text-gray-200'>
                        Entry type
                    </label>
                    <div className="flex flex-col gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" 
                             onClick={() => setType('item')}>
                            <RadioButton 
                                inputId="item" 
                                name="type" 
                                value="item" 
                                onChange={(e) => setType(e.value)} 
                                checked={type === 'item'} 
                            />
                            <div className="flex flex-col">
                                <label htmlFor="item" className="font-medium cursor-pointer">Task</label>
                                <span className="text-sm text-gray-500 dark:text-gray-400">A single item to check off when completed</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                             onClick={() => setType('section')}>
                            <RadioButton 
                                inputId="section" 
                                name="type" 
                                value="section" 
                                onChange={(e) => setType(e.value)} 
                                checked={type === 'section'} 
                            />
                            <div className="flex flex-col">
                                <label htmlFor="section" className="font-medium cursor-pointer">Section</label>
                                <span className="text-sm text-gray-500 dark:text-gray-400">A container for multiple tasks or subsections</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='flex justify-end gap-2 mt-4'>
                    <Button 
                        label="Cancel"
                        icon='pi pi-times-circle'
                        text
                        severity='secondary'
                        onClick={() => setVisible(false)}
                        disabled={isSubmitting}
                    />
                    <Button 
                        label={type === 'item' ? "Add task" : "Add section"}
                        type='submit'
                        severity='success'
                        icon='pi pi-check-circle'
                        disabled={!entry.title.trim() || isSubmitting}
                    />
                </div>
            </form>
        </Dialog>
        <Tooltip target=".entry-title-input" content="Press Enter to submit" position="bottom" />
    </>
}
