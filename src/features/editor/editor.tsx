import {useEffect, useRef, useState} from "react";
import {styled} from "@mui/material/styles";

const yugStyled = styled("div")(({theme}) => ({
    "& .document-editor": {
        border: '1px solid var(--ck-color-base-border)',
        borderRadius: 7,

        /* Set vertical boundaries for the document editor. */
        maxHeight: 700,

        /* This element is a flex container for easier rendering. */
        display: 'flex',
        flexFlow: 'column nowrap'
    }
}));

const Editor = ({...props}) => {

    const {onChange, editorLoaded, name, value} = props
    const editorRef = useRef({
        CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
        DecoupledEditor: require("@ckeditor/ckeditor5-build-decoupled-document")
    });
    const {CKEditor,DecoupledEditor} = editorRef.current || {};

    useEffect(() => {
            /*DecoupledEditor
                .create( document.querySelector( '.document-editor__editable' ), {
                } )
                .then((editor:any) =>{
                    const toolbarContainer = document.querySelector( '.document-editor__toolbar' );
                    toolbarContainer?.appendChild( editor.ui.view.toolbar.element );
                    (window as any).editor = editor;

                })
                .catch( (err: any) => {
                    console.error( err );
                } );
*/

    }, [])

    return (
            <CKEditor
                onReady={ (editor: { ui: { getEditableElement: () => { (): any; new(): any; parentElement: { (): any; new(): any; insertBefore: { (arg0: any, arg1: any): void; new(): any; }; }; }; view: { toolbar: { element: any; }; }; }; }) => {
                    console.log( 'Editor is ready to use!', editor );

                    // Insert the toolbar before the editable area.
                    editor.ui.getEditableElement().parentElement.insertBefore(
                        editor.ui.view.toolbar.element,
                        editor.ui.getEditableElement()
                    );

                    //this.editor = editor;
                } }
                onError={ ( error: any, {willEditorRestart}: any ) => {
                    // If the editor is restarted, the toolbar element will be created once again.
                    // The `onReady` callback will be called again and the new toolbar will be added.
                    // This is why you need to remove the older toolbar.
                    if ( willEditorRestart ) {
                       // this.editor.ui.view.toolbar.element.remove();
                    }
                } }
                onChange={ ( event: any, editor: any ) => onChange(editor.getData())  }
                editor={ DecoupledEditor }
                data=""
               // config={  }
            />
    );
}

export default Editor
