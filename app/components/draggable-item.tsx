// app/components/draggable-checklist-item.tsx
import {useDrag, useDrop} from 'react-dnd';
import {ItemTypes} from '~/checklist.type';
import {type ReactNode, useRef} from 'react';
import {useChecklist} from "~/context/checklist-context";

type DraggableChecklistItemProps = {
    itemId: string;
    index: number;
    sectionId?: string;
    children?: ReactNode | ReactNode[];
};

export function DraggableItem({itemId, index, sectionId, children}: DraggableChecklistItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const {moveItem} = useChecklist();

    console.debug('Creating D&D element.', itemId, index, sectionId)
    const [{isDragging}, drag] = useDrag({
        type: `ChecklistEntry`,
        item: {id: itemId, index, sectionId, type: ItemTypes.ITEM},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        canDrop: (item, monitor) => {
            return item.sectionId === sectionId && item.id !== itemId;
        },
        accept: `ChecklistEntry`,
        drop: (item: { id: string; index: number; sectionId: string; type: string }) => {
            const dragIndex = item.index;
            const hoverIndex = index;
            moveItem(item.sectionId, dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });
    drag(drop(ref));

    return (
        <div ref={ref}
             style={{
                 opacity: isDragging ? 0.5 : 1,
                 cursor: 'move',
             }}
             className="draggable-item">
            {children}
        </div>
    );
}
