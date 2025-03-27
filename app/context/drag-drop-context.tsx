// dnd-provider.tsx
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Preview } from 'react-dnd-preview';

// Detect touch device
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const backendOptions = {
    enableMouseEvents: true, // Allow mouse events on touch devices for better testing
};

export function DragDropProvider({ children }: { children: React.ReactNode }) {
    // Choose the right backend based on the device
    const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={backend} options={isTouchDevice() ? backendOptions : undefined}>
            {children}
            {isTouchDevice() && (
                <Preview>
                    {({ item, style }) => (
                        <div className="drag-preview" style={{ ...style, opacity: 0.7 }}>
                            { (item as any).content }
                        </div>
                    )}
                </Preview>
            )}
        </DndProvider>
    );
}
