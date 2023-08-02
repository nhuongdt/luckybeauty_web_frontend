// import 'regenerator-runtime/runtime';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold, Italic, Underline, Subscript, Superscript } from '@ckeditor/ckeditor5-basic-styles';
import {
    Table,
    TableProperties,
    TableToolbar,
    TableColumnResize,
    TableCellProperties
} from '@ckeditor/ckeditor5-table';
import Link from '@ckeditor/ckeditor5-link/src/link';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Font } from '@ckeditor/ckeditor5-font';
import {
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageInsert,
    ImageUpload,
    PictureEditing
} from '@ckeditor/ckeditor5-image';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { Alignment } from '@ckeditor/ckeditor5-alignment';

import {
    SpecialCharacters,
    SpecialCharactersEssentials
} from '@ckeditor/ckeditor5-special-characters';

export default function CustomCkeditor({ html, handleChange }: any) {
    function SpecialCharactersEmoji(editor: any) {
        editor.plugins.get('SpecialCharacters').addItems(
            'Emoji',
            [
                { title: 'smiley face', character: '😊' },
                { title: 'rocket', character: '🚀' },
                { title: 'wind blowing face', character: '🌬️' },
                { title: 'floppy disk', character: '💾' },
                { title: 'heart', character: '❤️' }
            ],
            { label: 'Emoticons' }
        );
    }
    const editorConfiguration = {
        baseFloatZIndex: 400001,
        plugins: [
            CodeBlock,
            Alignment,
            Essentials,
            Bold,
            Italic,
            Underline,
            Subscript,
            Superscript,
            Paragraph,
            Font,
            Table,
            TableToolbar,
            TableProperties,
            TableColumnResize,
            TableCellProperties,
            Link,
            Image,
            ImageInsert,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            PictureEditing,
            ImageUpload,
            SourceEditing,
            SpecialCharacters,
            SpecialCharactersEssentials,
            SpecialCharactersEmoji
        ],
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
        },
        image: {
            toolbar: [
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                '|'
            ]
        }
    };
    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                data={html}
                config={editorConfiguration}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    handleChange(data);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </>
    );
}
