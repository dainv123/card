import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'antd';
import { JSONEditor } from '@json-editor/json-editor/dist/jsoneditor.js';
import './style.css'; 

const EditorModal = ({ data = {}, isModalOpen, handleOk, handleCancel }) => {
  const aiRef = useRef(null);
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState({ node: null, message: '' });

  const onSubmit = () => {
    if (editor) {
      handleOk(editor.getValue());
      editor.destroy();
    }
  }

  const onReset = () => {
    if (editor) {
      handleOk({});
      editor.destroy();
    }
  }

  const onCancel = () => {
    if (editor) {
      editor.destroy()
    }

    handleCancel();
  }

  const onShowAI = (node) => {
    setCurrentNode({ node, message: '' });
  }

  const onCloseAI = (node) => {
    setCurrentNode({ node: null, message: '' });
  }

  const onChangeAI = () => {

  }

  const onSubmitAI = () => {
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    // axios.post(
    //   apiUrl,
    //   {
    //     "model": "gpt-3.5-turbo",
    //     "messages": [{"role": "user", "content": currentNode.message}],
    //     "temperature": 0.7
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${apiKey}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // ).then(res => {

    // })
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

        newEditor.on('ready',() => {
          const inputElements = document.querySelectorAll('#editor-modal .card .col-md-12[data-schemapath] > div [data-schematype="string"] .form-control');

          inputElements.forEach(inputElement => {
            inputElement.addEventListener('focus', (event) => {
              const sourceRect = event.target.getBoundingClientRect();
              aiRef.current.style.position = 'fixed';
              aiRef.current.style.zIndex = '1';
              aiRef.current.style.left = sourceRect.left + 'px';
              aiRef.current.style.top = sourceRect.top + 30 + 'px';

              const ariaLabel = event.target.getAttribute('aria-label');

              const extractedValue = ariaLabel.substring(ariaLabel.lastIndexOf('_') + 1);

              onShowAI(extractedValue)
            });
          });
        });

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
        <Button key="back">Generate by AI (soon)</Button>,
        <Button key="back" onClick={onReset}>Reset to default</Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>Submit</Button>
      ]}
    >
      <div ref={aiRef}>
        <span>{currentNode.node}</span>
        <textarea onChange={onChangeAI}></textarea>
        <Button onClick={onSubmitAI}>Submit</Button>
      </div>
      <div id="editor-modal" ref={editorRef}></div>
    </Modal>
  );
};

export default EditorModal;
