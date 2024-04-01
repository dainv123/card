import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Scroller from '../../pages/Reader/Scroller';
import { Modal, Card, Form, Input, Button } from 'antd';
import { JSONEditor } from '@json-editor/json-editor';
import { 
  AI_FORM, 
  CANCEL, 
  ENTER_REQUIREMENT, 
  REQUIRE_PROCESSING_MESSAGE, 
  REQUIRE_REQUIREMENT_MESSAGE, 
  RESET_TO_DEFAULT, 
  SETTING, 
  SUBMIT,
} from '../../constants/wording';
import './style.css';

const EditorModal = ({ data = {}, isModalOpen, handleOk, handleCancel }) => {
  const aiRef = useRef(null);
  const editorRef = useRef(null);
  const [top, setTop] = useState('0px');
  const [left, setLeft] = useState('0px');
  const [node, setNode] = useState({ id: null, message: '', require: '' });
  const [isAI, setIsAI] = useState(false);
  const [editor, setEditor] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const onReset = () => {
    if (editor) {
      handleOk({});
      editor.destroy();
    }
  };

  const onCancel = () => {
    if (editor) {
      editor.destroy();
    }

    handleCancel();
  };

  const onSubmit = () => {
    if (editor) {
      const editorValue = editor.getValue();

      for (const [key, value] of Object.entries(editorValue)) {
        editorValue[key] = { default: value };
      }

      handleOk(editorValue);

      editor.destroy();
    }
  };

  const onChangeAI = (e) => { 
    setNode({ id: node.id, message: node.message, require: e.target.value });
  };

  const onSubmitAI = (event) => {
    event.preventDefault();
    // const key = process.env.EMAIL_PASSWORD;
    // const apiKey = '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';
    // const apiUrl = 'https://api.openai.com/v1/chat/completions';
    // axios.post(
    //   apiUrl,
    //   {
    //     "model": "gpt-3.5-turbo",
    //     "messages": [{"role": "user", "content": `"${node.message}" ${node.require}`}],
    //     "temperature": 0.7
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${apiKey}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // ).then(res => {
    //   const inputString = 'root[node_11]';
    //   const match = node.id.match(/\[([^[\]]+)\]/);

    //   if (match && match[1]) {
    //     const extractedContent = match[1];
    //     editor.setValue({ ...editor.getValue(), [extractedContent]: res.data.choices[0].message.content });
    //   }
    // })
  };

  useEffect(() => {
    setIsOpen(isModalOpen);
    setTimeout(() => {
      if (editor) {
        editor.destroy();
      }
      
      if (isModalOpen && editorRef.current) {
        const newEditor = new JSONEditor(editorRef.current, {
          theme: 'bootstrap4',
          disable_collapse: true,
          disable_edit_json: true,
          disable_properties: true,
          use_name_attributes: false,
          schema: {
            properties: data
          }
        });

        setEditor(newEditor);

        newEditor.on('ready', () => {
          const handleClickOutside = event => {
            const targetSelector = '#editor-modal .card .col-md-12[data-schemapath] > div [data-schematype="string"] .form-control';

            if (event.target.matches(targetSelector) || event.target.closest(targetSelector)) {
              const sourceRect = event.target.getBoundingClientRect();
              const ariaLabel = event.target.getAttribute('aria-label');
              setNode({ id: ariaLabel, message: event.target.value , require: '' });
              setTop(sourceRect.top + 30 + 'px');
              setLeft(sourceRect.left + 'px');
            }

            if (
              event.target.matches(targetSelector) ||
              event.target.closest(targetSelector) ||
              (aiRef.current && aiRef.current.contains(event.target))
            ) {
              setIsAI(true);
            } else {
              setNode({ id: null, message: '', require: '' });
              setIsAI(false);
            }
          };

          document.addEventListener('mousedown', handleClickOutside);

          return () => {
            newEditor.destroy();
            document.removeEventListener('mousedown', handleClickOutside);
          };
        });
      }
    }, 0);
  }, [data, isModalOpen]);

  
const SETTINGS = {
  itemHeight: 60,
  amount: 15,
  tolerance: 5,
  minIndex: 0,
  maxIndex: 322,
  startIndex: 0
};

const getData = (offset, limit) => {
  const start = Math.max(SETTINGS.minIndex, offset);
  const end = Math.min(offset + limit - 1, SETTINGS.maxIndex);
  const output = Object.keys(data).slice(start, end).map(key => ({ key, text: data[key] }));
  return output;
};

const rowTemplate = item => (
  <div className="item" key={item.key}>
    {
      Array.isArray(item.text) 
      ? 
        <>
          ARRAY:
          <Card>
            {item.text.map((child) => (
              <Card>
                Key: <input key={child.value} type="text" className="form-control" value={child.value} />
                Text: <input key={child.text} type="text" className="form-control" value={child.text} />
              </Card>
            ))} 
          </Card>
        </>
      : <input key={item.key} type="text" className="form-control" value={item.text} />
    }
  </div>
);

  return (
    <Modal
      title={SETTING}
      width={'90%'}
      visible={isOpen}
      onCancel={onCancel}
      style={{ maxWidth: '1200px' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}
      footer={[
        <Button key="back" onClick={onCancel}>
          {CANCEL}
        </Button>,
        <Button key="danger" type="danger" onClick={onReset}>
          {RESET_TO_DEFAULT}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          {SUBMIT}
        </Button>
      ]}
    >
      <Scroller
        get={getData}
        className="viewport"
        settings={SETTINGS}
        row={rowTemplate}
      />
      {/* <div
        ref={aiRef}
        style={{ position: 'fixed', zIndex: 1, top, left, display: isAI ? 'none' : 'none' }}
      >
        <Card title={AI_FORM} style={{ width: 300 }}>
          <Form onSubmit={onSubmitAI}>
            <Form.Item
              name="requirement"
              label={ENTER_REQUIREMENT + ' ' + node.id + ':'}
              extra={REQUIRE_PROCESSING_MESSAGE}
              rules={[{ required: true, message: REQUIRE_REQUIREMENT_MESSAGE }]}
            >
              <Input placeholder="Your requirement" onChange={onChangeAI} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {SUBMIT}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div id="editor-modal" ref={editorRef}></div> */}
    </Modal>
  );
};

export default EditorModal;
