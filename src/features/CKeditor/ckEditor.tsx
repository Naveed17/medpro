import {useEffect, useRef} from "react";

const CkEditor = ({...props}) => {

    const {onChange, editorLoaded, name, value} = props
    const editorRef = useRef({
        CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
        DecoupledEditor: require("@ckeditor/ckeditor5-build-decoupled-document")
    });
    const {CKEditor, DecoupledEditor} = editorRef.current || {};

    return (
        <CKEditor
            onReady={(editor: { ui: { getEditableElement: () => { (): any; new(): any; parentElement: { (): any; new(): any; insertBefore: { (arg0: any, arg1: any): void; new(): any; }; }; }; view: { toolbar: { element: any; }; }; }; }) => {
                editor.ui.getEditableElement().parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.getEditableElement()
                );
            }}
            onError={(error: any, {willEditorRestart}: any) => {
                if (willEditorRestart) {

                 }
            }}
            onChange={(event: any, editor: any) => onChange(editor.getData())}
            editor={DecoupledEditor}
            data={value}
        />
    );
}

export default CkEditor
