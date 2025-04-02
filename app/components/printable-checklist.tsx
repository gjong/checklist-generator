import type {ChecklistEntry} from "~/checklist.type";
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
          font-family: Arial, sans-serif;
          color: #000;
          line-height: 1.5;
        }
        
        .print-section button,
        .print-section i.pi-pencil,
        .print-section i.pi-plus {
          display: none !important;
        }
        
        .print-task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px dotted #aaa;
          page-break-inside: avoid;
        }
        
        .print-checkbox {
          min-width: 18px;
          height: 18px;
          border: 1.5px solid #333;
          border-radius: 3px;
          display: inline-block;
          margin-left: 15px;
        }
        
        .print-item-title {
          flex: 1;
        }
        
        .print-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 24px;
          font-weight: bold;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        
        .print-section-sub {
          padding-left: 1.25rem;
        }
        
        .print-section-title {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-size: 18px;
          font-weight: bold;
          border-bottom: 1px solid #666;
          padding-bottom: 5px;
          page-break-after: avoid;
        }
        
        .print-section-main {
          margin-bottom: 1.5rem;
          page-break-inside: avoid;
        }
        
        .print-date {
          text-align: right;
          font-size: 12px;
          margin-bottom: 1rem;
          color: #444;
        }
        
        .print-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #333;
          font-size: 12px;
          text-align: center;
          color: #444;
        }
        
        @page {
          margin: 0.75in 0.5in;
        }
      }
    `}
    </style>
);


export const PrintableChecklist = () => {
    const { checklist } = useChecklist();
    const [_, forceUpdate] = useReducer(x => x + 1, 0);
    const today = new Date().toLocaleDateString();

    useEffect(() => {
        forceUpdate();
    }, [checklist])

    const renderChecklistEntry = (entry: ChecklistEntry, depth: number) => {
        if ('items' in entry) {
            // This is a section
            return (
                <div key={entry.id} className={depth === 0 ? 'print-section-main' : 'print-section-sub'}>
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
                    <div className="print-item-title">{entry.title}</div>
                    <span className="print-checkbox"></span>
                </div>
            );
        }
    };

    return <>
        <PrintStyles />
        <div className="print-section">
            <div className="print-date">Date: {today}</div>
            <h1 className="print-title">{checklist.title}</h1>
            {checklist.items.map(item => renderChecklistEntry(item, 0))}
            <div className="print-footer">
                {checklist.title} • Printed on {today}
            </div>
        </div>
    </>
};
