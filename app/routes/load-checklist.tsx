import type { Route } from "./+types/load-checklist"
import {FileUpload, type FileUploadHandlerEvent} from "primereact/fileupload";
import type {Checklist} from "~/checklist.type";
import {useMemo, useState} from "react";
import {Divider} from "primereact/divider";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {useNavigate} from "react-router";
import {confirmDialog} from "primereact/confirmdialog";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Load existing checklist" },
        { name: "description", content: "Load existing checklist from disk." },
    ];
}

function loadChecklistFromStorage(): Checklist[] {
    const loadedChecklists: Checklist[] = []
    for (const key of Object.keys(localStorage)) {
        const value = localStorage.getItem(key)
        if (value && value.startsWith('{')) {
            const potentialChecklist = JSON.parse(value)
            if (potentialChecklist.id) {
                loadedChecklists.push(potentialChecklist)
            }
        }
    }
    return loadedChecklists;
}

export default function LoadChecklist() {
    const [reload, setReload] = useState(false)
    const localStoredLists = useMemo(() => loadChecklistFromStorage(), [reload])
    const navigate = useNavigate()

    const onNewListClick = () => {
        const newChecklistId = crypto.randomUUID()
        localStorage.setItem(newChecklistId, JSON.stringify({
          id: newChecklistId,
          title: 'New Checklist',
          items: []
        }))
        navigate(`/checklist/${newChecklistId}`)
    }

    const handleChecklistDelete = (checklist: Checklist) => {
        confirmDialog({
            message: 'Are you sure you want to delete "' + checklist.title + '"?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            accept() {
                localStorage.removeItem(checklist.id);
                setReload(!reload)
            },
            footer: x => {
                return <>
                    <Button label='cancel' text severity='secondary' icon='pi pi-times-circle' onClick={ x.reject }/>
                    <Button label='delete' text severity='danger' icon='pi pi-trash' onClick={ x.accept }/>
                </>
            }
        })
    };

    const createTitle = (title: string) => {
        return <>
            <h1 className="leading-6 text-gray-700 dark:text-gray-200 text-center text-xl pb-2 mb-2 border-b-2 border-gray-200/60 dark:border-gray-700/60">
                {title}
            </h1>
        </>
    }

    return <>
        <h1 className="leading-6 text-gray-700 dark:text-gray-200 text-center text-3xl mb-0">
            Manage Your Checklists
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card title={ createTitle("Saved Checklists") } className="">
                <div className="p-2">
                    {localStoredLists.length > 0 ? (
                        <div className="space-y-4">
                            {localStoredLists.map((checklist) => (
                                <Card key={checklist.id} className="border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-200 px-4">
                                            {checklist.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button
                                                icon="pi pi-trash"
                                                severity="danger"
                                                outlined
                                                onClick={() => handleChecklistDelete(checklist)}
                                                tooltip="Delete checklist" />
                                            <Button
                                                icon="pi pi-check"
                                                severity="success"
                                                label='Load'
                                                onClick={() => navigate(`/checklist/${checklist.id}`)}
                                                tooltip="Load checklist"/>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <i className="pi pi-inbox text-4xl mb-4 text-gray-400"></i>
                            <p className="text-gray-600 dark:text-gray-400">No saved checklists found.</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                Create a new checklist or upload one from your device.
                            </p>
                        </div>
                    )}
                </div>
            </Card>
            <Card title={ createTitle("Import Checklists") } className="">
                <div className="p-2">
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                        Upload a previously exported checklist file (.json format).
                    </p>

                    <FileUpload
                        mode="advanced"
                        accept=".checklist"
                        maxFileSize={1000000}
                        chooseLabel="Select File"
                        className="w-full"
                        customUpload={ true }
                        uploadHandler={(event: FileUploadHandlerEvent) => {
                            const file = event.files[0]
                            const reader = new FileReader()
                            reader.readAsText(file)
                            reader.onload = (e) => {
                                const checklist = JSON.parse(e.target?.result as string)
                                console.log(checklist)
                                if (checklist.id) {
                                    localStorage.setItem(checklist.id, JSON.stringify(checklist))
                                    navigate(`/checklist/${checklist.id}`)
                                }
                            }
                        }}
                        emptyTemplate={
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                <i className="pi pi-cloud-upload text-4xl mb-4 text-gray-400"></i>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Drag and drop your checklist file here or click to browse
                                </p>
                            </div>
                        }
                    />

                    <Divider align="center">
                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
                    </Divider>

                    <div className="text-center">
                        <Button
                            label="Create New Checklist"
                            icon="pi pi-plus"
                            severity="info"
                            className="w-full md:w-auto"
                            onClick={ onNewListClick } />
                    </div>
                </div>
            </Card>
        </div>
    </>
}
