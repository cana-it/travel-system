import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
const TinyMCEComp = ({
    onSelected = () => { },
    Level = 0,
    Values = '<h5>Enter Content</h5>',
    height = 300
}) => {

    const { quill, quillRef } = useQuill();
    useEffect(() => {
        if (quill) {
            quill.on('text-change', () => {
                const text = quill.root.innerHTML;
                onSelected(text);
            });

            let initialContent = quill.clipboard.convert(Values);
            quill.setContents(initialContent, 'silent');

        }

    }, [quill]);

    useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(Values);
            onSelected(Values);
        }
    }, [Values]);

    return (
        <>
            <div className="row" style={{ width: '100%', backgroundColor: 'while', position: 'relative' }}>
                <div ref={quillRef} style={{ width: '100%', height: height + 'px' }} />
            </div>
        </>

    )
}


export const TinyMCE = React.memo(TinyMCEComp)