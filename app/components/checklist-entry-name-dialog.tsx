import {type Ref, useImperativeHandle, useState} from "react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export function ChecklistEntryNameDialog({ ref, value, callback }: { ref: Ref<any>, value?: string, callback?: (updated: string) => void}) {
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState(value)

    useImperativeHandle(ref, () => ({
        open() {
            setVisible(true)
        }
    }));

    const onSubmit = () => {
        callback?.(title || '')
        setVisible(false)
    }

    return <>
        <Dialog header="Change the name"
                className='w-[35rem]'
                visible={ visible } onHide={() => setVisible(false)}>
            <label className='font-bold text-gray-700 dark:text-gray-200 mb-2'>Change the name of this checklist item.</label>
            <InputText value={ title }
                       className='w-full'
                       onChange={ e => setTitle(e.currentTarget.value) }/>

            <div className='flex justify-end gap-2 mt-4'>
                <Button label="Cancel"
                        icon='pi pi-times-circle'
                        text
                        severity='secondary'
                        onClick={() => setVisible(false)}/>
                <Button label="Save"
                        onClick={ onSubmit }
                        severity='success'
                        icon='pi pi-check-circle' />
            </div>
        </Dialog>
    </>
}
