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
  const [qaQuestion, setQaQuestion] = useState(RichTextEditor.createEmptyValue());
  const [qaAnswer, setQaAnswer] = useState(RichTextEditor.createEmptyValue());

  //Options List
  const [optionsHeader, setOptionsHeader] = useState('');
  const [optionsFooter, setOptionsFooter] = useState('');
  const [optionsData, setOptionsData] = useState([]);

  //Quick Answers
  const [quAnswerHeader, setQuAnswerHeader] = useState('');
  const [quAnswerFooter, setQuAnswerFooter] = useState('');
  const [quData, setQuData] = useState([]);

  useEffect(() => {
    setMessageContent(RichTextEditor.createValueFromString(nodedata?.content, 'html'));

    setQaQuestion(RichTextEditor.createValueFromString(nodedata?.qa_q, 'html'));
    nodedata?.qa_a && setQaAnswer(nodedata?.qa_a);

    nodedata?.option_header && setOptionsHeader(nodedata?.option_header);
    nodedata?.option_footer && setOptionsFooter(nodedata?.option_footer);
    nodedata?.data && setOptionsData(nodedata?.data);

    nodedata?.qu_data && setQuData(nodedata?.qu_data);
    nodedata?.qu_header && setQuAnswerHeader(nodedata?.qu_header);
    nodedata?.qu_footer && setQuAnswerFooter(nodedata?.qu_footer);
  }, [id]);

  /**
   * Save Message
   */
  const saveMessage = () => {
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
  };

  /**
   * Cancel Message
   */
  const cancelMessage = () => {
    setMessageContent(RichTextEditor.createEmptyValue());
    setShowSettingBar(false);
  };
  ///////////////////////////////////////////////////////////////////
  /**
   * Save Questions and Answers
   */
  const saveQA = () => {
    setNodes(nds =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            nodedata: {
              ...node.data.nodedata,
              qa_q: qaQuestion.toString('html'),
              qa_a: qaAnswer
            }
          }
        }
        return node;
      })
    );
  };

  /**
   * Cancel Questions and Answers
   */
  const cancelQA = () => {
    setQaQuestion(RichTextEditor.createEmptyValue());
    setQaAnswer(RichTextEditor.createEmptyValue());
    setShowSettingBar(false);
  };

  /////////////////////////////////////////////////////////////////////
  /**
   * Add new section
   */
  const addNewSection = () => {
    const isAvailable = checkAddisAvailable('section');
    if (!isAvailable) {
      toast.warn('You can\'t add new section anymore.');
      return;
    }
    let newSection = { name: `Section`, data: [`option`], selectedOption: -1 };
    optionsData.push(newSection);
    setOptionsData([...optionsData]);
  };

  /**
   * Delete section
   */
  const deleteSection = (no) => {
    optionsData.splice(no, 1);
    setOptionsData([...optionsData]);
  };

  /**
   * Section name edit handler
   */
  const sectionNameChange = (e, no) => {
    optionsData[no].name = e.target.value;
    setOptionsData([...optionsData]);
  };

  /**
   * Add new option
   */
  const addNewOption = (no) => {
    const isAvailable = checkAddisAvailable('option');
    if (!isAvailable) {
      toast.warn('You can\'t add new option anymore.');
      return;
    }
    optionsData[no].data.push(`option`);
    setOptionsData([...optionsData]);
  };

  /**
   * Delete option
   */
  const deleteOption = (no, o_no) => {
    optionsData[no].data.splice(o_no, 1);
    setOptionsData([...optionsData]);
  };

  /**Option edit handler */
  const optionChange = (e, no, o_no) => {
    optionsData[no].data[o_no] = e.target.value;
    setOptionsData([...optionsData]);
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

  /**
   * Save options
   */
  const saveOptionsList = () => {
    setNodes(nds =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            nodedata: {
              ...node.data.nodedata,
              option_header: optionsHeader,
              option_footer: optionsFooter,
              data: optionsData
            }
          }
        }
        return node;
      })
    );
  };

  /**
   * Cancel options 
   */
  const cancelOptionsList = () => {
    setOptionsData([]);
    setShowSettingBar(false);
  };

  ////////////////////////////////////////////////////////////
  /**
   *  Add new Quick Answer Button
   * @returns 
   */
  const addNewQuButton = () => {
    if (quData.length >= 3) {
      toast.warn('You can\'t add new button anymore.');
      return;
    }
    let newButton = { name: `Button`, data: {} };
    quData.push(newButton);
    setQuData([...quData]);
  };

  /**
   * Delete Quick Answer button
   */
  const deleteQuButton = (no) => {
    quData.splice(no, 1);
    setQuData([...quData]);
  };

  /**
   * Save Quick Answer Data
   */
  const saveQudata = () => {
    setNodes(nds =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            nodedata: {
              ...node.data.nodedata,
              qu_header: quAnswerHeader,
              qu_footer: quAnswerFooter,
              qu_data: quData
            }
          }
        }
        return node;
      })
    );
  };

  /**
   * Cancel Quick Answer Data
   */
  const cancelQudata = () => {
    setQuData([]);
    setShowSettingBar(false);
  };

  /**
   * Quick Answer button name edit handler
   */
  const quButonNameChange = (e, no) => {
    quData[no].name = e.target.value;
    setQuData([...quData]);
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
        <div className="h-full py-4 overflow-y-auto -mt-2">
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
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={saveMessage}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={cancelMessage}>Cancel</button>
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

                <p className='pl-2 pt-2 text-sm'>Save answers in the variable</p>

                <div className='w-full px-2'>
                  <span className='absolute mt-2 ml-2 font-bold'>@</span>
                  <select id="answer_vals" class="pl-6 bg-gray-50 border w-full border-gray-300 text-gray-600 text-sm rounded-lg 
                  outline-none focus:ring-blue-500 focus:border-blue-500 block p-2.5" onChange={(e) => setQaAnswer(e.target.value)}>
                    <option value="name" selected={qaAnswer === 'name'}>Name</option>
                    <option value="email" selected={qaAnswer === 'email'}>Email</option>
                    <option value="company" selected={qaAnswer === 'company'}>Company</option>
                    <option value="phone" selected={qaAnswer === 'phone'}>Phone</option>
                  </select>
                </div>

                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={saveQA}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={cancelQA}>Cancel</button>
                </div>
              </>
            }

            {label === 'Options' &&
              <>
                <input value={optionsHeader} onChange={(e) => setOptionsHeader(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />
                <div className='px-2 pb-2'>
                  {
                    optionsData.map((section, no) => (
                      <div key={no}>
                        <div className='flex justify-between text-white my-1 text-left bg-gradient-to-r from-cyan-400 via-cyan-500 
                        to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
                        shadow-md shadow-cyan-500/50 font-medium rounded text-sm w-full px-2 py-2.5 mr-2'>

                          <input value={section.name} className='outline-none bg-transparent placeholder-gray-200'
                            placeholder='click to edit section' onChange={(e) => sectionNameChange(e, no)} />

                          <div className='flex'>
                            <i className='fa fa-plus mr-2 mt-1 cursor-pointer hover:text-[#ccc]' onClick={() => addNewOption(no)}></i>
                            <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#ccc]' onClick={() => deleteSection(no)}></i>
                          </div>
                        </div>

                        {section.data.length > 0 &&
                          section.data.map((option, o_no) => (
                            <div className='text-white flex text-xs justify-between bg-red-700 w-11/12 hover:bg-red-800 
                            focus:outline-none focus:ring-4 focus:ring-red-300 font-medium float-right text-sm px-3 rounded py-1.5 
                            text-center mb-1' key={o_no} >

                              <input value={option} className='outline-none bg-transparent placeholder-gray-200'
                                placeholder='click to edit option' onChange={(e) => optionChange(e, no, o_no)} />

                              <div className='flex'>
                                <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#ccc]' style={{ fontSize: 12 }}
                                  onClick={() => deleteOption(no, o_no)}></i>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ))
                  }

                  <button onClick={addNewSection} className='w-full text-white bg-gradient-to-r from-purple-500 via-purple-600 
                  to-purple-700 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm 
                  px-4 py-1.5 text-center mt-2'>
                    <i className='fa fa-plus mr-2' style={{ fontSize: 12 }}></i> Add new section
                  </button>
                </div>

                <input value={optionsFooter} onChange={(e) => setOptionsFooter(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />

                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={saveOptionsList}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={cancelOptionsList}>Cancel</button>
                </div>
              </>
            }

            {label === 'Quick Answers' &&
              <>
                <input value={quAnswerHeader} onChange={(e) => setQuAnswerHeader(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />

                <div className='px-2 pb-2'>
                  {
                    quData.map((data, no) => (
                      <div key={no} className='flex justify-between focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 
                      font-medium rounded text-sm px-4 py-2 mr-2 mt-2'>
                        <input value={data.name} className='outline-none bg-transparent placeholder-gray-200'
                          placeholder='click to edit' onChange={(e) => quButonNameChange(e, no)} />
                        <i className='fa fa-trash mt-1 cursor-pointer hover:text-[#ccc]' onClick={() => deleteQuButton(no)}></i>
                      </div>
                    ))
                  }

                  <button onClick={addNewQuButton} className='w-full text-white bg-gradient-to-r from-purple-500 via-purple-600 
                  to-purple-700 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 font-medium rounded-full 
                  text-sm px-4 py-1.5 text-center mt-2'>
                    <i className='fa fa-plus mr-2' style={{ fontSize: 12 }}></i> Add new button
                  </button>
                </div>

                <input value={quAnswerFooter} onChange={(e) => setQuAnswerFooter(e.target.value)} placeholder="click to edit footer"
                  className='bg-[#336699] text-white w-full text-sm p-1 py-2 outline-none font-semibold placeholder-slate-400' />

                <div className='flex mt-2 justify-end'>
                  <button className='mx-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-blue-500 hover:border-transparent rounded' onClick={saveQudata}>Save</button>
                  <button className='mx-1 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 
                  px-4 text-sm border border-red-500 hover:border-transparent rounded mr-2' onClick={cancelQudata}>Cancel</button>
                </div>
              </>
            }
          </div>
        </div>
      </aside>
    </>
  );
}

export default SettingBar;
