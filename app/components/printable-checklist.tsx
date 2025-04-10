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
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #333;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
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
          border-bottom: 1px dotted #ccc;
          page-break-inside: avoid;
        }
        
        .print-checkbox {
          min-width: 20px;
          height: 20px;
          border: 2px solid #333;
          border-radius: 4px;
          display: inline-block;
          margin-left: 15px;
          position: relative;
          background-color: #fff;
        }
        
        .print-item-title {
          flex: 1;
          font-size: 14px;
        }
        
        .print-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 28px;
          font-weight: bold;
          color: #222;
          border-bottom: 2px solid #333;
          padding-bottom: 12px;
          position: relative;
        }
        
        .print-title:after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 2px;
          background-color: #333;
        }
        
        .print-section-sub {
          padding-left: 1.5rem;
          margin-left: 0.5rem;
          border-left: 1px solid #eee;
        }
        
        .print-section-title {
          margin-top: 1.75rem;
          margin-bottom: 1.25rem;
          font-size: 18px;
          font-weight: bold;
          color: #222;
          border-bottom: 1px solid #666;
          padding-bottom: 6px;
          page-break-after: avoid;
        }
        
        /* Improved styling for nested sections */
        .print-section-sub .print-section-title {
          font-size: 16px;
          margin-top: 1.25rem;
          margin-bottom: 1rem;
          color: #333;
          border-bottom: 1px solid #ccc;
          padding-bottom: 4px;
        }
        
        .print-section-sub .print-section-sub .print-section-title {
          font-size: 14px;
          margin-top: 1rem;
          margin-bottom: 0.75rem;
          color: #444;
          border-bottom: 1px solid #ddd;
          padding-bottom: 3px;
        }
        
        .print-section-main {
          margin-bottom: 2rem;
          page-break-inside: avoid;
          background-color: #fff;
          padding: 0.5rem;
          border-radius: 4px;
        }
        
        .print-date {
          text-align: right;
          font-size: 12px;
          margin-bottom: 1.5rem;
          color: #555;
          font-style: italic;
        }
        
        .print-footer {
          margin-top: 3rem;
          padding-top: 1rem;
          border-top: 1px solid #ddd;
          font-size: 12px;
          text-align: center;
          color: #666;
        }
        
        @page {
          margin: 0.75in 0.75in;
          size: A4;
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
