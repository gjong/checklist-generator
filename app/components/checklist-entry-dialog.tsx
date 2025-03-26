import {type FormEvent, type Ref, useImperativeHandle, useState} from "react";
import type {ChecklistEntry, ChecklistItem, ChecklistSection} from "~/checklist.type";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {RadioButton} from "primereact/radiobutton";

export function ChecklistEntryDialog({ ref, callback }: { ref: Ref<any>, callback?: (updated: ChecklistEntry) => void}) {
    const [visible, setVisible] = useState(false)
    const [entry, setEntry] = useState(() => ({
        id: crypto.randomUUID(),
        title: ''
    }))
    const [type, setType] = useState('item')

    useImperativeHandle(ref, () => ({
        open() {
            setEntry({
                id: crypto.randomUUID(),
                title: ''
            })
            setVisible(true)
        }
    }));

    const onSubmit = (event: FormEvent) => {
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

        event.preventDefault()
        return false
    }

    return <>
        <Dialog header="Add a new entry"
                className='w-[35rem]'
                visible={ visible } onHide={() => setVisible(false)}>
            <form onSubmit={ onSubmit } action="#">
                <label className='font-bold text-gray-700 dark:text-gray-200 mb-2'>The name of the entry</label>
                <InputText value={ entry.title }
                           className='w-full'
                           autoFocus={ true }
                           onChange={ e => setEntry({ ...entry, title: e.currentTarget.value }) }/>

                <div className="flex flex-col flex-wrap gap-1 mt-4">
                    <label className='font-bold text-gray-700 dark:text-gray-200 mb-2'>What type of entry is this?</label>
                    <div className="flex align-items-center">
                        <RadioButton inputId="section" name="type" value="item" onChange={(e) => setType(e.value)} checked={type === 'item'} />
                        <label htmlFor="section" className="ml-2">New task to complete</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="item" name="type" value="section" onChange={(e) => setType(e.value)} checked={type === 'section'} />
                        <label htmlFor="item" className="ml-2">New section</label>
                    </div>
                </div>
                <div className='flex justify-end gap-2 mt-4'>
                    <Button label="Cancel"
                            icon='pi pi-times-circle'
                            text
                            severity='secondary'
                            onClick={() => setVisible(false)}/>
                    <Button label="Create entry"
                            type='submit'
                            severity='success'
                            icon='pi pi-check-circle' />
                </div>
            </form>
        </Dialog>
    </>
}
