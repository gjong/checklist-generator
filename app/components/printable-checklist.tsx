import type {Checklist, ChecklistEntry} from "~/checklist.type";
import {useChecklist} from "~/context";
import {useEffect, useReducer} from "react";

const PrintStyles = () => (
    <style type="text/css" media="print">
        {`
      @media print {
        body * {
          visibility: hidden;
        }
        
        .print-section, .print-section * {
          visibility: visible;
        }
        
        .print-section {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        
        .print-section button,
        .print-section i.pi-pencil,
        .print-section i.pi-plus {
          display: none !important;
        }
        
        .print-task-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: .5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px dotted #ccc;
        }
        
        .print-checkbox {
          width: 20px;
          height: 20px;
          border: 1px solid #000;
          display: inline-block;
        }
        
        .print-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 24px;
        }
        
        .print-section-sub {
            padding-left: .5rem;
        }
        
        .print-section-title {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-size: 16px;
          font-weight: bold;
        }
        
        @page {
          margin: 0.5in;
        }
      }
    `}
    </style>
);


export const PrintableChecklist = () => {
    const { checklist } = useChecklist();
    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        forceUpdate();
    }, [checklist])

    const renderChecklistEntry = (entry: ChecklistEntry, depth: number) => {
        if ('items' in entry) {
            // This is a section
            return (
                <div key={entry.id} className={ depth === 0 ? 'print-section-main' : 'print-section-sub'}>
                    <h3 className="print-section-title">{entry.title}</h3>
                    <div>
                        {entry.items.map(item => renderChecklistEntry(item, depth + 1))}
                    </div>
                </div>
            );
        } else {
            // This is a task item
            return (
                <div key={entry.id} className="print-task-item">
                    <div>{entry.title}</div>
                    <span className="print-checkbox"></span>
                </div>
            );
        }
    };

    return <>
        <PrintStyles />
        <div className="print-section">
            <h1 className="print-title">{checklist.title}</h1>
            {checklist.items.map(item => renderChecklistEntry(item, 0))}
        </div>
    </>
};
