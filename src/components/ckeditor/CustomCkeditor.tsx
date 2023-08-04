import React, { Component } from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
const editorConfiguration = {
    toolbar: [
        'sourceEditing',
        'codeBlock',
        '|',
        'fontSize',
        'fontFamily',
        '|',
        'bold',
        'italic',
        'underline',
        'alignment',
        '|',
        'link',
        'insertTable',
        'insertImage',
        'specialCharacters',
        '|',
        'subscript',
        'superscript',
        'fontColor',
        'fontBackgroundColor'
    ],
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties'
        ]
    },
    fontSize: {
        options: [11, 12, 13, 14, 15, 16, 17, 18, 19]
    }
};

export default function CustomCkeditor({ html, handleChange }: any) {
    return (
        <>
            <CKEditor
                editor={Editor}
                config={editorConfiguration}
                data={html}
                onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    handleChange(data);
                }}
                // onBlur={(event, editor) => {
                //     console.log('Blur.', editor);
                // }}
                // onFocus={(event, editor) => {
                //     console.log('Focus.', editor);
                // }}
            />
            ;
        </>
    );
}
