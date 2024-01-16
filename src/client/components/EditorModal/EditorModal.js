import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'antd';
import { JSONEditor } from '@json-editor/json-editor/dist/jsoneditor.js';
import './style.css'; 

const EditorModal = ({ data = {}, isModalOpen, handleOk, handleCancel }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = () => {
    if (editor) {
      handleOk(editor.getValue());
      editor.destroy();
    }
  }

  const onCancel = () => {
    if (editor) {
      editor.destroy()
    }

    handleCancel();
  }

  useEffect(() => {
    setIsOpen(isModalOpen);
    setTimeout(() => {
      if (isModalOpen && editorRef.current) {
        const newEditor = new JSONEditor(editorRef.current, {
          theme: 'bootstrap4',
          disable_collapse: true,
          disable_edit_json: true,
          disable_properties: true,
          use_name_attributes: false,
          schema: { properties: data }
        });

        setEditor(newEditor);

        return () => {
          newEditor.destroy();
        };
      }
    }, 0);
  }, [data, isModalOpen]);

  return (
    <Modal
      title="Setting"
      visible={isOpen}
      onCancel={onCancel}
      width={'90%'}
      style={{ maxWidth: '800px' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}
      footer={[
        <Button key="back" onClick={onCancel}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>Submit</Button>
      ]}
    >
      <div id="editor-modal" ref={editorRef}></div>
    </Modal>
  );
};

export default EditorModal;
