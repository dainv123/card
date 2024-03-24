import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Card, Form, Input, Button, Col } from 'antd';
import { List } from 'react-virtualized';
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


const EditorModal = ({ data = {}, isModalOpen, handleOk, handleCancel, handleScrollToElement }) => {
  const aiRef = useRef(null);
  const [top, setTop] = useState('0px');
  const [left, setLeft] = useState('0px');
  const [node, setNode] = useState({ id: null, message: '', require: '' });
  const [isAI, setIsAI] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState({ key: '', items: [] });
  const [dataClone, setDataClone] = useState({ ...data });
  const [contentClass, setContentClass] = useState('');

  const onCancel = () => {
    handleCancel();
    handleScrollToElement();
  };

  const onSubmit = () => {
    handleOk(dataClone);
  };

  const onChangeAI = (e) => { 
    setNode({ id: node.id, message: node.message, require: e.target.value });
  };

  const onReset = () => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to reset this setting?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleOk({});
      }
    });
  };
  
  const rowRenderer = ({ key, index, isScrolling, style }) => {
    const item = listClone[index].text;
    
    const handleInputChange = (e) => {
      const updatedData = { ...dataClone }; 
      const keyToUpdate = listClone[index].key; 
      updatedData[keyToUpdate] = e.target.value; 
      setDataClone(updatedData); 
    };

    return (
      <div key={key} className="item" style={style} onClick={() => handleScrollToElement(listClone[index].key)}>
        <input type="text" className="form-control input-label" value={listClone[index].key} disabled />
        {
          Array.isArray(item) 
          ?
            <Button type='link' onClick={() => setSelected({ key: listClone[index].key, items: item })}>
              View detail
            </Button>
          : 
            <input type="text" className="form-control" value={item} onChange={handleInputChange} />
        }
      </div>
    );
  }

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

  const listClone = useMemo(() => Object.keys(dataClone).map(key => ({ key, text: dataClone[key] })), [dataClone]);

  useEffect(() => {
    setDataClone(prevDataClone => {
      if (prevDataClone[selected.key]) {
        return { ...prevDataClone, [selected.key]: selected.items };
      } else {
        return { ...prevDataClone, [selected.key]: selected.items };
      }
    });
  }, [selected]);

  useEffect(() => {
    setIsOpen(isModalOpen);
    setDataClone({ ...data });

  //   setTimeout(() => {
  //     if (editor) {
  //       editor.destroy();
  //     }
      
  //     if (isModalOpen && editorRef.current) {
  //       const newEditor = new JSONEditor(editorRef.current, {
  //         theme: 'bootstrap4',
  //         disable_collapse: true,
  //         disable_edit_json: true,
  //         disable_properties: true,
  //         use_name_attributes: false,
  //         schema: {
  //           properties: data
  //         }
  //       });

  //       setEditor(newEditor);

  //       newEditor.on('ready', () => {
  //         const handleClickOutside = event => {
  //           const targetSelector = '#editor-modal .card .col-md-12[data-schemapath] > div [data-schematype="string"] .form-control';

  //           if (event.target.matches(targetSelector) || event.target.closest(targetSelector)) {
  //             const sourceRect = event.target.getBoundingClientRect();
  //             const ariaLabel = event.target.getAttribute('aria-label');
  //             setNode({ id: ariaLabel, message: event.target.value , require: '' });
  //             setTop(sourceRect.top + 30 + 'px');
  //             setLeft(sourceRect.left + 'px');
  //           }

  //           if (
  //             event.target.matches(targetSelector) ||
  //             event.target.closest(targetSelector) ||
  //             (aiRef.current && aiRef.current.contains(event.target))
  //           ) {
  //             setIsAI(true);
  //           } else {
  //             setNode({ id: null, message: '', require: '' });
  //             setIsAI(false);
  //           }
  //         };

  //         document.addEventListener('mousedown', handleClickOutside);

  //         return () => {
  //           newEditor.destroy();
  //           document.removeEventListener('mousedown', handleClickOutside);
  //         };
  //       });
  //     }
  //   }, 0);
  }, [data, isModalOpen]);

 
  return (
    <Modal
      title={SETTING}
      width={'90%'}
      visible={isOpen}
      onCancel={onCancel}
      className={contentClass}
      style={{ maxWidth: '1200px' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}
      footer={[
        <Button key="back" onClick={onCancel}>
          {CANCEL}
        </Button>,
        <Button key="switch" type="danger" onClick={() => setContentClass(contentClass ? '' : 'display-below')}>
          Switch content background
        </Button>,
        <Button key="danger" type="danger" onClick={onReset}>
          {RESET_TO_DEFAULT}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          {SUBMIT}
        </Button>
      ]}
    > 
      <Col span={15}>
        <List
          className="viewport"
          width={(window.innerWidth * 0.9 > 1200 ? 1200 : window.innerWidth * 0.9) * 15 / 24 - 48}
          height={window.innerHeight - 347} 
          rowCount={listClone.length}
          rowHeight={60}
          rowRenderer={rowRenderer}
        />
      </Col>
      <Col span={9} className='viewport'>
        <>
          {
            selected.key
              ? (
                <>
                  <h4>Detail: {selected.key}</h4>
                  {
                    selected.items.map((child, index) => (
                      <Card key={index} className='margin-bottom-5'>
                        <div className='item'>
                          <div className='margin-right-5'>
                            <Col span={24} className='item margin-bottom-5'>
                              <input type="text" className="form-control input-label" value='Key' disabled /> 
                              <input 
                                type="text" 
                                className="form-control" 
                                value={child.value} 
                                onChange={(e) => {
                                  const updatedItems = [...selected.items];
                                  updatedItems[index].value = e.target.value;
                                  setSelected({ ...selected, items: updatedItems });
                                }}
                              />
                            </Col>
                            <Col span={24} className='item'>
                              <input type="text" className="form-control input-label" value='Text' disabled /> 
                              <input 
                                type="text" 
                                className="form-control" 
                                value={child.text} 
                                onChange={(e) => {
                                  const updatedItems = [...selected.items];
                                  updatedItems[index].text = e.target.value;
                                  setSelected({ ...selected, items: updatedItems });
                                }}
                              />
                            </Col>
                          </div>
                          <span
                            className='item-close'
                            onClick={() => setSelected({ ...selected, items: selected.items.filter((item, idx) => idx !== index) })}
                          >
                            &#10539;
                          </span>
                        </div>
                      </Card>
                    ))
                  }
                  <Button 
                    type="primary" 
                    onClick={() => setSelected({ ...selected, items: [...selected.items, { value: '', text: '' }] })}
                  >
                    Add
                  </Button>
                </> 
              )
              : 'No thing to select!'
          }
        </>
      </Col>
      
      {/* <div
        ref={aiRef}
        style={{ position: 'fixed', zIndex: 1, top, left, display: isAI ? 'none' : 'none' }}
      >
        <Card title={AI_FORM} style={{ width: 300 }}>
          <Form onSubmit={onSubmitAI}>
            <Form.Item
              label={ENTER_REQUIREMENT + ' ' + node.id + ':'}
              extra={REQUIRE_PROCESSING_MESSAGE}
              name="requirement"
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
      </div> */}
    </Modal>
  );
};

export default EditorModal;
