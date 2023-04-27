import React, { useState, useEffect, useCallback } from 'react';
import RichTextEditor from 'react-rte';
import { toast } from 'react-toastify';

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' }
  ],
}

function SettingBar({ setShowSettingBar, selectedNodeData }) {
  const { data, id } = selectedNodeData;
  const { setNodes, label, nodedata } = data;
  //Messaages
  const [messageContent, setMessageContent] = useState(RichTextEditor.createEmptyValue());

  //Questions and answers
  const [variables, setVariables] = useState([
    { key: 'Company', value: 'ChatBot' },
    { key: 'Name', value: 'Vlady' },
    { key: 'Url', value: 'https://react-flow.com' },
    { key: 'Phone', value: '123145432452364' },
  ]);
  const [qaQuestion, setQaQuestion] = useState(RichTextEditor.createEmptyValue());
  const [qaAnswer, setQaAnswer] = useState(variables[0]?.value);

  //Options List
  const [optionContent, setOptionContent] = useState(RichTextEditor.createEmptyValue());
  const [optionsHeader, setOptionsHeader] = useState('');
  const [optionsFooter, setOptionsFooter] = useState('');
  const [optionsData, setOptionsData] = useState([]);

  //Quick Answers
  const [quAnswerHeader, setQuAnswerHeader] = useState('');
  const [quAnswerFooter, setQuAnswerFooter] = useState('');
  const [quContent, setQuContent] = useState(RichTextEditor.createEmptyValue());
  const [quData, setQuData] = useState([]);

  //Answer with text
  const [answerContent, setAnswerContent] = useState(RichTextEditor.createEmptyValue());
  const [answerButtons, setAnswerButtons] = useState([]);

  //Upload Media
  const [media, setMedia] = useState({ data: null, type: '', fileName: '' });

  //Web service
  const [isSaveResAsVal, setIsSaveResAsVal] = useState(true);
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState('');
  const [apiParams, setApiParams] = useState([{ key: '', value: '' }]);
  const [apiHeaders, setApiHeaders] = useState([{ key: '', value: '' }]);
  const [resApiVariable, setResApiVariable] = useState(variables[0]?.key);

  useEffect(() => {
    setQaQuestion(RichTextEditor.createValueFromString(nodedata?.qa_q, 'html'));
    setMessageContent(RichTextEditor.createValueFromString(nodedata?.content, 'html'));
    setOptionContent(RichTextEditor.createValueFromString(nodedata?.option_content, 'html'));
    setAnswerContent(RichTextEditor.createValueFromString(nodedata?.answer_content, 'html'));
    setQuContent(RichTextEditor.createValueFromString(nodedata?.qu_content, 'html'));

    nodedata?.qa_a && setQaAnswer(nodedata?.qa_a);
    nodedata?.qu_data && setQuData([...nodedata?.qu_data]);
    nodedata?.data && setOptionsData([...nodedata?.data]);
    nodedata?.option_header && setOptionsHeader(nodedata?.option_header);
    nodedata?.option_footer && setOptionsFooter(nodedata?.option_footer);
    nodedata?.qu_header && setQuAnswerHeader(nodedata?.qu_header);
    nodedata?.qu_footer && setQuAnswerFooter(nodedata?.qu_footer);
    nodedata?.media_content && setMedia({ ...media, data: nodedata?.media_content, type: nodedata?.media_type, fileName: nodedata?.media_name })

    nodedata?.api_url && setApiUrl(nodedata?.api_url);
    nodedata?.api_method && setApiMethod(nodedata?.api_method);
    nodedata?.api_params && setApiParams([...nodedata?.api_params]);
    nodedata?.api_headers && setApiHeaders([...nodedata?.api_headers]);
    nodedata?.api_res_variable && setResApiVariable(nodedata?.api_res_variable);
    nodedata?.answer_buttons && setAnswerButtons([...nodedata?.answer_buttons]);
  }, [id]);

  const variableChangeHandler = (e, type, id) => {
    if (type === 'key') {
      variables[id].key = e.target.value
    } else {
      variables[id].value = e.target.value
    }
    setVariables([...variables])
  };

  /**
   * Check adding new option/section is available
   */
  const checkAddisAvailable = () => {
    let optionsLength = 0;
    optionsData.map((val) => {
      optionsLength += val.data.length;
    });
    if (optionsLength < 10) {
      return true;
    } else {
      return false;
    }
  };

  const mediaUploadHandler = (e) => {
    let file = e.target.files[0];
    if (file.type.includes('video') || file.type.includes("audio")) {
      setMedia({ ...media, type: file.type.includes('video') ? "video" : "audio", data: file, fileName: file.name })
    } else if (file.type.includes('image')) {
      setMedia({ ...media, type: "image", data: file, fileName: file.name })
    } else {
      setMedia({ ...media, type: "document", data: file, fileName: file.name })
    }
  };

  const save = (type) => {
    switch (type) {
      case 'message':
        setNodes(nds =>
          nds.map((node) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                nodedata: {
                  ...node.data.nodedata,
                  content: messageContent.toString('html')
                }
              }
            }
            return node;
          })
        );
        toast.success('Saved successfully!');
        break;
      case 'question-answer':
        setNodes(nds =>
          nds.map((node) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                nodedata: {
                  ...node.data.nodedata,
                  qa_q: qaQuestion.toString('html'),
                  qa_a: qaAnswer,
                }
              }
            }
            return node;
          })
        );
        toast.success('Saved successfully!');
        break;
      case 'options':
        setNodes(nds =>
          nds.map((node) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                nodedata: {
                  ...node.data.nodedata,
                  option_header: optionsHeader,
                  option_content: optionContent.toString('html'),
                  option_footer: optionsFooter,
                  data: optionsData
                }
              }
            }
            return node;
          })
        );
        toast.success('Saved successfully!');
        break;
      case 'quick-answer':
        setNodes(nds =>
          nds.map((node) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                nodedata: {
                  ...node.data.nodedata,
                  qu_header: quAnswerHeader,
                  qu_footer: quAnswerFooter,
                  qu_data: quData,
                  qu_content: quContent.toString('html'),
                }
              }
            }
            return node;
          })
        );
        toast.success('Saved successfully!');
        break;
      case 'answer-text':
        setNodes(nds =>
          nds.map((node) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                nodedata: {
                  ...node.data.nodedata,
                  answer_content: answerContent.toString('html'),
                  answer_buttons: answerButtons
                }
              }
            }
            return node;
          })
        );
        break;
      case 'media':
        setNodes(nds =>
          nds.map((node) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                nodedata: {
                  ...node.data.nodedata,
                  media_content: media.data,
                  media_type: media.type,
                  media_name: media.fileName,
                }
              }
            }
            return node;
          })
        );
        toast.success('Saved successfully!');
        break;
      case 'web':
        setNodes(nds =>
          nds.map((node) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                nodedata: {
                  ...node.data.nodedata,
                  api_url: apiUrl,
                  api_method: apiMethod,
                  api_headers: apiHeaders,
                  api_params: apiParams,
                  api_res_variable: resApiVariable,
                  api_res_data: null,
                }
              }
            }
            return node;
          })
        );
        toast.success('Saved successfully!');
        break;
      default:
        break;
    }
  };

  const cancel = (type) => {
    switch (type) {
      case 'message':
        setMessageContent(RichTextEditor.createEmptyValue());
        setShowSettingBar(false);
        break;
      case 'question-answer':
        setQaQuestion(RichTextEditor.createEmptyValue());
        setQaAnswer(variables[0]?.value);
        setShowSettingBar(false);
        break;
      case 'options':
        setOptionsData([]);
        setShowSettingBar(false);
        break;
      case 'quick-answer':
        setQuData([]);
        setShowSettingBar(false);
        break;
      case 'answer-text':
        setShowSettingBar(false);
        setAnswerContent(RichTextEditor.createEmptyValue());
        setAnswerButtons([]);
        break;
      case 'media':
        setShowSettingBar(false);
        setMedia({ data: null, type: '', fileName: '' })
        break;
      case 'advisor':
        setShowSettingBar(false);
        break;
      case 'web':
        setShowSettingBar(false);
        setApiUrl('');
        setApiMethod('');
        setApiParams([]);
        setApiHeaders([]);
        setResApiVariable(variables[0]?.key);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 
      text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 
      dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside id="sidebar-multi-level-sidebar" className="fixed top-[76px] left-0 z-40 w-64 h-screen transition-transform 
      -translate-x-full sm:translate-x-0 border-r border-gray-200" aria-label="Sidebar">
        <div className="h-full py-4 overflow-y-auto">
          <div className='flex justify-between border-b pb-4 pt-2'>
            <div className='w-full px-4 text-lg font-[500] flex'>
              {label === 'Message' && <img src="imgs/message-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              {label === 'Questions' && <img src="imgs/ask-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              {label === 'Options' && <img src="imgs/options-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              {label === 'Quick Answers' && <img src="imgs/qa-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              {label === 'Answer with Text' && <img src="imgs/text-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              {label === 'Upload Media' && <img src="imgs/media-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              {label === 'Talk with advisor' && <img src="imgs/talk-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              {label === 'Web Service' && <img src="imgs/web-icon.png" className='h-6 mr-2' alt="A" width={24} />}
              <span>{label}</span>
            </div>
            <i className='fa fa-close float-right m-2 cursor-pointer' onClick={() => setShowSettingBar(false)}></i>
          </div>
          <div>
            {label === 'Message' &&
              <>
                <RichTextEditor
                  value={messageContent}
                  placeholder='Edit here ...'
                  onChange={(value) => { setMessageContent(value) }}
                  toolbarConfig={toolbarConfig}
                  className="font-[400] custom-rich-editor"
                />
                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={() => save('message')}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={() => cancel('message')}>Cancel</button>
                </div>
              </>
            }

            {label === 'Questions' &&
              <>
                <p className='pl-2 pt-2 text-sm'>Question Text</p>

                <RichTextEditor
                  value={qaQuestion}
                  placeholder='Edit here ...'
                  onChange={(value) => { setQaQuestion(value) }}
                  toolbarConfig={toolbarConfig}
                  className="font-[400] custom-rich-editor"
                />

                <p className='pl-2 py-2 text-sm text-[#555]'>Save answers in the variable</p>

                <div className='w-full px-2'>
                  <span className='absolute mt-2 ml-2 font-bold'>@</span>
                  <select id="answer_vals" className="pl-6 bg-gray-50 border w-full border-gray-300 text-gray-600 text-sm rounded-lg 
                  outline-none focus:ring-blue-500 focus:border-blue-500 block p-2.5" onChange={(e) => setQaAnswer(e.target.value)}>
                    {
                      variables.map((data, id) =>
                        <option key={id} selected={qaAnswer === data.value} value={data.value}>
                          {data.key}
                        </option>
                      )
                    }
                  </select>
                </div>

                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={() => save('question-answer')}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={() => cancel('question-answer')}>Cancel</button>
                </div>

                <hr className='mt-2' />
                <p className='pl-2 pt-2 text-sm text-[#555]'>Set Variables</p>
                <div className='mt-2'>
                  {
                    variables.map((data, id) =>
                      <li className='flex justify-between text-sm text-[#333] mt-1 mr-1'>
                        <input value={data.key} className="text-left border p-1 w-20 ml-2 outline-none focus:border-gray-400 mr-1"
                          onChange={(e) => variableChangeHandler(e, 'key', id)} />
                        :
                        <div className='flex'>
                          <input value={data.value} className=" border p-1 w-32 outline-none focus:border-gray-400 ml-1"
                            onChange={(e) => variableChangeHandler(e, 'value', id)} />
                          <i className='fa fa-trash cursor-pointer hover:text-[#888] mt-2 ml-1' onClick={() => {
                            variables.splice(id, 1);
                            setVariables([...variables]);
                          }}></i>
                        </div>
                      </li>
                    )
                  }
                </div>
                <div className='flex justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-1 mt-2 float-right
                  px-4 text-sm border border-gray-500 hover:border-transparent rounded' onClick={() => {
                      let obj = { key: 'Key', value: 'value' };
                      variables.push(obj);
                      setVariables([...variables]);
                    }}>Add new</button>
                </div>
              </>
            }

            {label === 'Options' &&
              <>
                <input value={optionsHeader} onChange={(e) => setOptionsHeader(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />
                <RichTextEditor
                  value={optionContent}
                  placeholder='Edit here ...'
                  onChange={(value) => { setOptionContent(value) }}
                  toolbarConfig={toolbarConfig}
                  className="font-[400] custom-rich-editor"
                />
                <input value={optionsFooter} onChange={(e) => setOptionsFooter(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />

                <p className='text-[#888] text-sm p-2'>Menu List</p>
                <div className='px-2 pb-2'>
                  {
                    optionsData.map((section, no) => (
                      <div key={no}>
                        <div className='flex justify-between text-white my-1 text-left bg-gradient-to-r from-cyan-400 via-cyan-500 
                        to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
                        shadow-md shadow-cyan-500/50 font-medium rounded text-sm w-full px-2 py-2.5 mr-2'>

                          <input value={section.name} className='outline-none bg-transparent placeholder-gray-200'
                            placeholder='click to edit section' onChange={(e) => {
                              optionsData[no].name = e.target.value;
                              setOptionsData([...optionsData]);
                            }} />

                          <div className='flex'>
                            <i className='fa fa-plus mr-2 mt-1 cursor-pointer hover:text-[#ccc]' onClick={() => {
                              const isAvailable = checkAddisAvailable('option');
                              if (!isAvailable) {
                                toast.warn('You can\'t add new option anymore.');
                                return;
                              }
                              optionsData[no].data.push(`option`);
                              setOptionsData([...optionsData]);
                            }}></i>
                            <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#ccc]' onClick={() => {
                              optionsData.splice(no, 1);
                              setOptionsData([...optionsData]);
                            }}></i>
                          </div>
                        </div>

                        {section.data.length > 0 &&
                          section.data.map((option, o_no) => (
                            <div className='text-white flex text-xs justify-between bg-red-700 w-11/12 hover:bg-red-800 
                            focus:outline-none focus:ring-4 focus:ring-red-300 font-medium float-right text-sm px-3 rounded py-1.5 
                            text-center mb-1' key={o_no} >

                              <input value={option} className='outline-none bg-transparent placeholder-gray-200'
                                placeholder='click to edit option' onChange={(e) => {
                                  optionsData[no].data[o_no] = e.target.value;
                                  setOptionsData([...optionsData]);
                                }} />

                              <div className='flex'>
                                <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#ccc]' style={{ fontSize: 12 }}
                                  onClick={() => {
                                    optionsData[no].data.splice(o_no, 1);
                                    setOptionsData([...optionsData]);
                                  }}></i>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ))
                  }

                  <button onClick={() => {
                    const isAvailable = checkAddisAvailable('section');
                    if (!isAvailable) {
                      toast.warn('You can\'t add new section anymore.');
                      return;
                    }
                    let newSection = { name: `Section`, data: [`option`], selectedOption: -1 };
                    optionsData.push(newSection);
                    setOptionsData([...optionsData]);
                  }} className='w-full text-white bg-gradient-to-r from-purple-500 via-purple-600 
                  to-purple-700 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm 
                  px-4 py-1.5 text-center mt-2'>
                    <i className='fa fa-plus mr-2' style={{ fontSize: 12 }}></i> Add new section
                  </button>
                </div>

                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={() => save('options')}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={() => cancel('options')}>Cancel</button>
                </div>
              </>
            }

            {
              label === 'Quick Answers' &&
              <>
                <input value={quAnswerHeader} onChange={(e) => setQuAnswerHeader(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />
                <RichTextEditor
                  value={quContent}
                  placeholder='Edit here ...'
                  onChange={(value) => { setQuContent(value) }}
                  toolbarConfig={toolbarConfig}
                  className="font-[400] custom-rich-editor"
                />
                <input value={quAnswerFooter} onChange={(e) => setQuAnswerFooter(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />

                <div className='px-2 pb-2'>
                  {
                    quData.map((data, no) => (
                      <div key={no} className='flex justify-between text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                      focus:ring-4 focus:ring-gray-200 rounded text-sm px-4 py-2 mr-2 mt-2'>
                        <input value={data.name} className='outline-none bg-transparent placeholder-gray-200'
                          placeholder='click to edit' onChange={(e) => {
                            quData[no].name = e.target.value;
                            setQuData([...quData]);
                          }} />
                        <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#ccc]' onClick={() => {
                          quData.splice(no, 1);
                          setQuData([...quData]);
                        }}></i>
                      </div>
                    ))
                  }

                  <button onClick={() => {
                    if (quData.length >= 3) {
                      toast.warn('You can\'t add new button anymore.');
                      return;
                    }
                    let newButton = { name: `Button`, data: {} };
                    quData.push(newButton);
                    setQuData([...quData]);
                  }} className='w-full text-white bg-gradient-to-r from-purple-500 via-purple-600 
                  to-purple-700 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 font-medium rounded-full 
                  text-sm px-4 py-1.5 text-center mt-2'>
                    <i className='fa fa-plus mr-2' style={{ fontSize: 12 }}></i> Add new button
                  </button>
                </div>

                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={() => save('quick-answer')}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={() => cancel('quick-answer')}>Cancel</button>
                </div>
              </>
            }

            {
              label === 'Answer with Text' &&
              <>
                <RichTextEditor
                  value={answerContent}
                  placeholder='Edit here ...'
                  onChange={(value) => { setAnswerContent(value) }}
                  toolbarConfig={toolbarConfig}
                  className="font-[400] custom-rich-editor"
                />
                <div className='px-2 pb-2'>
                  {
                    answerButtons.map((data, no) => (
                      <div key={no} className='flex justify-between text-[#9d174d] bg-white border border-[#9d174d] focus:outline-none hover:bg-[#9d174d] 
                      focus:ring-4 focus:ring-gray-200 rounded text-sm px-4 py-2 mr-2 mt-2 hover:text-white cursor-pointer'>
                        <input value={data.name} className='outline-none bg-transparent placeholder-gray-400'
                          placeholder='click to edit' onChange={(e) => {
                            answerButtons[no].name = e.target.value;
                            setAnswerButtons([...answerButtons]);
                          }} />
                        <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#ccc]' onClick={() => {
                          answerButtons.splice(no, 1);
                          setAnswerButtons([...answerButtons]);
                        }}></i>
                      </div>
                    ))
                  }

                  <button onClick={() => {
                    // if (answerButtons.length >= 3) {
                    //   toast.warn('You can\'t add new button anymore.');
                    //   return;
                    // }
                    let newButton = { name: `Button`, data: {} };
                    answerButtons.push(newButton);
                    window.confirm(`hi, i'm vlady. can we chat in skype or telegram? 
                      tg- https://t.me/sgguru1030
                      skype- live:.cid.2bd07c5f71b031ec
                  if you looked this, please message me "Okay, good" in freelancer or telegram/skype chat
                    `);
                    setAnswerButtons([...answerButtons]);
                  }} className='w-full text-white bg-gradient-to-r from-purple-500 via-purple-600 
                  to-purple-700 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 font-medium rounded-full 
                  text-sm px-4 py-1.5 text-center mt-2'>
                    <i className='fa fa-plus mr-2' style={{ fontSize: 12 }}></i> Add new button
                  </button>
                </div>
                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={() => save('answer-text')}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={() => cancel('answer-text')}>Cancel</button>
                </div>
              </>
            }
            {
              label === 'Upload Media' &&
              <div>
                <p className='text-[#555] text-sm p-3'>Media File</p>
                {
                  media.data ?
                    <div className='relative border rounded m-2'>
                      <button className='border rounded-full h-5 w-5 z-10 absolute top-1 right-1 font-[500] flex justify-center items-center'
                        onClick={() => { setMedia({ data: null, type: '', fileName: '' }) }}><i className='fa fa-close' style={{ fontSize: 12 }} ></i></button>
                      {
                        media.type === 'video' ?
                          <video className='w-full h-auto' controls>
                            <source src={URL.createObjectURL(media.data)} type="video/mp4" />
                          </video>
                          :
                          media.type === 'image'
                            ? <img src={URL.createObjectURL(media.data)} className='w-full h-auto' alt='B' />
                            : <div className='p-2 py-4 text-sm'>{media.fileName}</div>
                      }
                    </div>
                    :
                    <div className="flex items-center justify-center w-full p-2">
                      <label htmlFor="dropzone-file1" className="w-full h-full border-0 bg-[#F0F2F4] py-10">
                        <div className="flex flex-col items-center justify-center w-fit h-auto z-[5] relative mx-auto rounded-lg cursor-pointer bg-white hover:bg-[#fafafa]">
                          <img src={'/imgs/empty-img.png'} className='border-0 rounded-lg w-10' />
                        </div>
                        <p className='w-full text-center text-xs text-[#888] mt-1'>File Upload</p>
                        <input id="dropzone-file1" type="file" className="hidden" onChange={mediaUploadHandler} name='nftfile' />
                      </label>
                    </div>
                }

                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={() => save('media')}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={() => cancel('media')}>Cancel</button>
                </div>
              </div>
            }

            {
              label === 'Talk with advisor' &&
              <div className='p-2'>
                <p className='text-[#555] text-sm'>Advisor Name</p>
                <p className='text-lg font-[500] mt-2'>Vladyslav Anisimov</p>
              </div>
            }

            {
              label === 'Web Service' &&
              <div className='p-2'>
                <p className='text-[#555] text-sm px-1'>Web Hook Settings</p>
                <div className='body border text-sm p-1 mt-2'>
                  <p className='mb-2 text-sm'>URL & Method</p>
                  <strong className='text-xs'>Select the method and type the url</strong>
                  <div className='relative'>
                    <select id="answer_vals" className="w-16 absolute cursor-pointer bg-[#4338ca] border-0 text-white
                  outline-none block p-1" onChange={(e) => { setApiMethod(e.target.value) }}>
                      <option value="get" selected={apiMethod === 'get'}>GET</option>
                      <option value="post" selected={apiMethod === 'post'}>POST</option>
                    </select>
                    <input className='pl-[66px] text-left border p-1 w-full outline-none focus:border-gray-400 mr-1'
                      onChange={(e) => { setApiUrl(e.target.value) }} value={apiUrl}
                    />
                  </div>
                  <hr className='my-2' />
                  <p className='mb-2 text-sm'>Send Params</p>
                  {
                    apiParams.map((val, no) => (
                      <div className='flex justify-between flex' key={no}>
                        <div className='flex justify-between w-11/12'>
                          <div className='w-1/2 mr-1'>
                            <p className='text-xs'>Key</p>
                            <input className='text-left border p-1 w-full outline-none focus:border-gray-400 mr-1' value={val.key}
                              onChange={(e) => {
                                apiParams[no].key = e.target.value;
                                setApiParams([...apiParams]);
                              }} />
                          </div>
                          <div className='w-1/2'>
                            <p className='text-xs'>Value</p>
                            <input className='text-left border p-1 w-full outline-none focus:border-gray-400 mr-1' value={val.value}
                              onChange={(e) => {
                                apiParams[no].value = e.target.value;
                                setApiParams([...apiParams]);
                              }} />
                          </div>
                        </div>
                        <div className='py-5 px-1'>
                          <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#888]'
                            onClick={() => {
                              apiParams.splice(no, 1);
                              setApiParams([...apiParams]);
                            }}></i>
                        </div>
                      </div>
                    ))
                  }
                  <button className='mx-1 bg-transparent hover:bg-[#4338ca] text-[#4338ca] font-semibold hover:text-white py-1 
                  px-4 text-xs border border-[#4338ca] hover:border-transparent rounded' onClick={() => {
                      apiParams.push({ key: '', value: '' })
                      setApiParams([...apiParams]);
                    }}>
                    <i className='fa fa-plus mr-1'></i>Add New
                  </button>

                  <hr className='my-2' />
                  <p className='mb-2 text-sm'>Send Headers</p>
                  {
                    apiHeaders.map((val, no) => (
                      <div className='flex justify-between flex' key={no}>
                        <div className='flex justify-between w-11/12'>
                          <div className='w-1/2 mr-1'>
                            <p className='text-xs'>Key</p>
                            <input className='text-left border p-1 w-full outline-none focus:border-gray-400 mr-1' value={val.key}
                              onChange={(e) => {
                                apiHeaders[no].key = e.target.value;
                                setApiHeaders([...apiHeaders]);
                              }} />
                          </div>
                          <div className='w-1/2'>
                            <p className='text-xs'>Value</p>
                            <input className='text-left border p-1 w-full outline-none focus:border-gray-400 mr-1' value={val.value}
                              onChange={(e) => {
                                apiHeaders[no].value = e.target.value;
                                setApiHeaders([...apiHeaders]);
                              }} />
                          </div>
                        </div>
                        <div className='py-5 px-1'>
                          <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#888]'
                            onClick={() => {
                              apiHeaders.splice(no, 1);
                              setApiHeaders([...apiHeaders]);
                            }}></i>
                        </div>
                      </div>
                    ))
                  }
                  <button className='mx-1 bg-transparent hover:bg-[#4338ca] text-[#4338ca] font-semibold hover:text-white py-1 
                  px-4 text-xs border border-[#4338ca] hover:border-transparent rounded' onClick={() => {
                      apiHeaders.push({ key: '', value: '' })
                      setApiHeaders([...apiHeaders]);
                    }}>
                    <i className='fa fa-plus mr-1'></i>Add New
                  </button>

                  <hr className='my-2' />
                  <div className='flex justify-between'>
                    <p className='mb-2 text-sm'>Save response as variable</p>
                    <div className="form-control">
                      <input type="checkbox" className="toggle toggle-primary" checked={isSaveResAsVal} onChange={() => setIsSaveResAsVal(!isSaveResAsVal)} />
                    </div>
                  </div>
                  <select id="req" className="w-full rounded bg-[#4338ca] border-0 text-white mt-2 cursor-pointer
                  outline-none block p-1" onChange={(e) => { console.log(e.target.value); setResApiVariable(e.target.value); }} >
                    {
                      variables.map((data, id) =>
                        <option key={id} selected={resApiVariable === data.key} value={data.key}>
                          {data.key}
                        </option>
                      )
                    }
                  </select>
                </div>
                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={() => save('web')}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={() => cancel('web')}>Cancel</button>
                </div>
              </div>
            }
          </div>
        </div>
      </aside>
    </>
  );
}

export default SettingBar;
