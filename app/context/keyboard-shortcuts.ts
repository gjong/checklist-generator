import { useEffect, useRef } from 'react';
import { useChecklist } from './checklist-context';

export function useKeyboardShortcuts() {
    const { checklist, updateItemStatus } = useChecklist();
    const editDialogRef = useRef<any>(null);
    const newItemDialogRef = useRef<any>(null);
    const quickAddRef = useRef<{ show: () => void }>({ show: () => {} });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle shortcuts if not in an input field
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Ctrl/Cmd + E: Edit selected item/section
            if ((e.shiftKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                editDialogRef.current?.open();
            }

            // Ctrl/Cmd + N: Add new item
            if ((e.shiftKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                newItemDialogRef.current?.open();
            }

            // Ctrl/Cmd + T: Quick add task
            if ((e.shiftKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                quickAddRef.current.show();
            }

            // Space: Toggle selected item
            if (e.key === ' ' && document.activeElement?.closest('.checklist-item')) {
                e.preventDefault();
                const itemId = document.activeElement.closest('.checklist-item')?.getAttribute('data-item-id');
                if (itemId) {
                    const item = checklist.items.find(i => i.id === itemId);
                    if (item && 'done' in item) {
                        updateItemStatus(itemId, !item.done);
                    }
                }
            }

            // Delete: Delete selected item/section
            if (e.key === 'Delete' && document.activeElement?.closest('.checklist-item, .checklist-section')) {
                e.preventDefault();
                const element = document.activeElement.closest('.checklist-item, .checklist-section');
                const deleteButton = element?.querySelector('[aria-label^="Delete"]');
                if (deleteButton instanceof HTMLElement) {
                    deleteButton.click();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [checklist, updateItemStatus]);

    return {
        editDialogRef,
        newItemDialogRef,
        quickAddRef
    };
}
