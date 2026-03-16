
import React, { useState, useEffect } from "react";

export default function CommandMenu() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const commandPress = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', commandPress);
        return () => document.removeEventListener('keydown', commandPress);
    }, []);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-in fade-in zoom-in duration-200">
                <h2 className="text-lg font-bold mb-4">Command Menu</h2>
                <input className="w-full border p-2 rounded mb-4" placeholder="Type a command..." autoFocus />
                <button onClick={() => setOpen(false)} className="text-sm text-gray-500">Close (Esc)</button>
            </div>
        </div>
    );

}