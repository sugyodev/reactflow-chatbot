import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode(props) {
  const [showToolbar, setShowToolbar] = useState(false);
  const wrapperRef = useRef(null);

  const { id, xPos, yPos, data } = props;
  const { setNodes, label, getId, selectNode, nodedata } = data;

  /**
   * Delete noe by click trash
   */
  const deleteNodeById = () => {
    setNodes(nds => nds.filter(node => node.id !== id));
  };

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowToolbar(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(wrapperRef);

  /**
   * Add new node by click +
   */
  const addNewNode = () => {
    const position = {
      x: xPos + 10,
      y: yPos + 10,
    };

    let nodedata = {};
    switch (label) {
      case 'Message':
        nodedata['content'] = '';
        break;
      case 'Questions':
        nodedata['qa_q'] = '';
        nodedata['qa_a'] = '';
        break;
      case 'Options':
        nodedata['option_header'] = '';
        nodedata['option_footer'] = '';
        nodedata['option_content'] = '';
        nodedata['data'] = [];
        break;
      case 'Quick Answers':
        nodedata['qu_header'] = '';
        nodedata['qu_footer'] = '';
        nodedata['qu_content'] = '';
        nodedata['qu_data'] = [];
        break;
      case 'Answer with Text':
        nodedata['answer_content'] = '';
        nodedata['answer_buttons'] = [];
        break;
      case 'Upload Media':
        nodedata['media_type'] = '';
        nodedata['media_name'] = '';
        nodedata['media_content'] = null;
        break;
      case 'Talk with advisor':
        nodedata['advisor_name'] = 'Vladyslav Anisimov';
        break;
      case 'Web Service':
        nodedata['api_url'] = 'https://example...';
        nodedata['api_method'] = 'GET';
        nodedata['api_headers'] = [];
        nodedata['api_params'] = [];
        nodedata['api_res_variable'] = null;
        nodedata['api_res_data'] = null;
        break;
      default:
        break;
    }
    const edgeStyle = {
      stroke: '#ccc',
      strokeWidth: 2,
      strokeDasharray: '5 5',
    };
    const newNode = {
      id: getId(),
      type: 'customNode',
      position,
      data: { label: `${label}`, setNodes, getId, selectNode, nodedata },
      style: edgeStyle,
      animated: true,
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbar(false);
  };

  /**
   * When click node handler
   */
  const onSelectedNode = () => {
    setShowToolbar(true)
    selectNode(props);
  };
  /**
   * Select ratio option in node
   */
  const selectOption = (s_no, o_no) => {
    nodedata.data[s_no].selectedOption = o_no;
    setNodes(nds =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            nodedata: { ...nodedata }
          }
        }
        return node;
      })
    );
  };

  return (
    <>
      {
        showToolbar &&
        <div className='flex absolute -top-6 border border-gray-400 rounded-full p-1 px-2' style={{ fontSize: 10 }} ref={wrapperRef}>
          <i className='fa fa-trash cursor-pointer' onClick={deleteNodeById}></i>
          <i className='fa fa-plus cursor-pointer ml-2' onClick={addNewNode}></i>
        </div>
      }
      <div className='border border-gray-500 rounded bg-white cursor-pointer w-44' onClick={onSelectedNode}>
        <p className="text-xs font-bold border-b border-gray-500 p-2 flex">
          {label === 'Message' && <img src="imgs/message-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label === 'Questions' && <img src="imgs/ask-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label === 'Options' && <img src="imgs/options-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label === 'Quick Answers' && <img src="imgs/qa-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label === 'Answer with Text' && <img src="imgs/text-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label === 'Upload Media' && <img src="imgs/media-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label === 'Talk with advisor' && <img src="imgs/talk-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label === 'Web Service' && <img src="imgs/web-icon.png" className='h-5 mr-2' alt="A" width={20} />}
          {label}
        </p>

        <div className='text-xs max-w-44 break-words h-fit'>
          {
            label === 'Message' &&
            <div className='p-2'>
              <Handle type="target" position={Position.Top} id='message' />
              {
                nodedata.content
                  ? <div dangerouslySetInnerHTML={{ __html: nodedata.content }}></div>
                  : <p className='text-[#aaa]'><i>no messages</i><br /></p>
              }
              <Handle type="source" position={Position.Bottom} id="message" />
            </div>
          }

          {
            label === 'Questions' &&
            <div className='p-2'>
              <Handle type="target" position={Position.Top} id='question' />
              {
                nodedata.qa_q
                  ? <div dangerouslySetInnerHTML={{ __html: nodedata.qa_q }}></div>
                  : <p className='text-[#aaa]'><i>no questions</i><br /></p>
              }
              <Handle type="source" position={Position.Bottom} id="question" />
            </div>
          }

          {
            label === 'Options' &&
            <div className=''>
              <Handle type="target" position={Position.Top} id='options' />
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.option_header ? nodedata?.option_header : 'Default Header'}</h1>
              <div className=''>
                {
                  nodedata.data.length > 0
                    ?
                    nodedata.data.map((section, s_no) => {
                      let t_no = 0;
                      if (s_no > 0) {
                        for (let i = 0; i < s_no; i++) {
                          t_no += nodedata.data[i].data.length;
                        }
                      }
                      return (
                        <div key={s_no}>
                          <div className='text-[#0894b5] text-xs font-[500] my-[6px] px-1'>{section.name}</div>
                          {section.data.map((option, o_no) => (
                            <div className='w-full flex justify-between cursor-pointer hover:bg-[#eee] p-1 px-2' onClick={() => selectOption(s_no, o_no)} key={o_no} >
                              <p>{option}</p>
                              <input type="radio" className='w-2' checked={section.selectedOption === o_no} />
                              <Handle
                                type="source"
                                position={Position.Right}
                                id={`option${s_no}-${o_no}`}
                                style={{ top: (t_no + o_no + 1) * 24 + 78 + (s_no * 28), background: '#555' }}
                              />
                              <Handle
                                type="target"
                                position={Position.Left}
                                id={`option${s_no}-${o_no}`}
                                style={{ top: (t_no + o_no + 1) * 24 + 78 + (s_no * 28), background: '#555' }}
                              />
                            </div>
                          ))}

                        </div>
                      )
                    })
                    :
                    <></>
                }
              </div>
              <div className=''>
                {
                  nodedata.option_content
                    ? <div dangerouslySetInnerHTML={{ __html: nodedata.option_content }} className="border-t p-2 border-gray-300"></div>
                    : <p className='text-[#aaa] p-2 border-t border-gray-300'><i>no content</i><br /></p>
                }
              </div>
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.option_footer ? nodedata?.option_footer : 'Default Footer'}</h1>
              <Handle type="source" position={Position.Bottom} id="options" />
            </div>
          }

          {
            label === 'Quick Answers' &&
            <div className=''>
              <Handle type="target" position={Position.Top} id='quick-answer' />
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.qu_header ? nodedata?.qu_header : 'Default Header'}</h1>
              <div className=''>
                {
                  nodedata.qu_data.length > 0
                    ?
                    nodedata.qu_data.map((data, no) => (
                      <div key={no} className='m-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 rounded my-1 focus:ring-4 focus:ring-gray-200 text-xs px-4 py-1 border-b border-gray-500'>
                        <span>{data.name}</span>
                        <Handle
                          type="source"
                          position={Position.Right}
                          id={`quick-answer-${no}`}
                          style={{ top: (no + 1) * 31 + 46, background: '#555' }}
                        />
                        <Handle
                          type="target"
                          position={Position.Left}
                          id={`quick-answer-${no}`}
                          style={{ top: (no + 1) * 31 + 46, background: '#555' }}
                        />
                      </div>
                    ))
                    :
                    <></>
                }
              </div>
              <div className=''>
                {
                  nodedata.qu_content
                    ? <div dangerouslySetInnerHTML={{ __html: nodedata.qu_content }} className="border-gray-400 border-t p-2"></div>
                    : <p className='text-[#aaa] border-gray-400 border-t p-2'><i>no content</i></p>
                }
              </div>
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.qu_footer ? nodedata?.qu_footer : 'Default Footer'}</h1>
              <Handle type="source" position={Position.Bottom} id="quick-answer" />
            </div>
          }

          {
            label === 'Answer with Text' &&
            <div className=''>
              <Handle type="target" position={Position.Top} id='answer-with-text' />
              <div className=''>
                {
                  nodedata.answer_buttons.length > 0
                    ?
                    nodedata.answer_buttons.map((data, no) => (
                      <div key={no} className='m-2 text-gray-900 bg-white border border-[#9d174d] focus:outline-none hover:bg-[#9d174d] rounded my-1 hover:text-white text-[#9d174d] text-xs px-4 py-[5px]'>
                        <span>{data.name}</span>
                        <Handle
                          type="source"
                          position={Position.Right}
                          id={`answer-text-${no}`}
                          style={{ top: (no + 1) * 32 + 24, background: '#555' }}
                        />
                        <Handle
                          type="target"
                          position={Position.Left}
                          id={`answer-text-${no}`}
                          style={{ top: (no + 1) * 32 + 24, background: '#555' }}
                        />
                      </div>
                    ))
                    :
                    <></>
                }
              </div>
              {
                nodedata.answer_content
                  ? <div dangerouslySetInnerHTML={{ __html: nodedata.answer_content }} className='border-t border-gray-300 p-2'></div>
                  : <p className='text-[#aaa] border-t p-2 border-gray-300'><i>no answer</i><br /></p>
              }
              <Handle type="source" position={Position.Bottom} id="answer-with-text" />
            </div>
          }

          {
            label === 'Upload Media' &&
            <div className=''>
              <Handle type="target" position={Position.Top} id='media' />
              {
                nodedata.media_content
                  ?
                  <div className='relative border rounded p-2'>
                    {
                      nodedata.media_type === 'video' ?
                        <video className='w-full h-auto rounded' controls>
                          <source src={URL.createObjectURL(nodedata.media_content)} type="video/mp4" />
                        </video>
                        :
                        nodedata.media_type === 'image'
                          ? <img src={URL.createObjectURL(nodedata.media_content)} className='w-full h-auto rounded' alt='B' />
                          : <div className='p-2 py-4 text-xs'>{nodedata.media_name}</div>
                    }
                  </div>
                  :
                  <div className='w-full h-full border-0 bg-[#F0F2F4] py-6 rounded-b' >
                    <div className="flex flex-col items-center justify-center w-fit h-auto z-[5] relative mx-auto rounded-lg cursor-pointer bg-white hover:bg-[#fafafa]">
                      <img src={'/imgs/empty-img.png'} className='border-0 rounded-lg w-8' />
                    </div>
                    <p className='text-center text-[#555]'><i>Empty</i></p>
                  </div>
              }
              <Handle type="source" position={Position.Bottom} id="media" />
            </div>
          }

          {
            label === 'Talk with advisor' &&
            <div className='p-2'>
              <Handle type="target" position={Position.Top} id='talk-to-advisor' />
              {
                <p className='text-[#555]'>Talk with <strong>Vladyslav</strong> (advisor)</p>
              }
              <Handle type="source" position={Position.Bottom} id="talk-to-advisor" />
            </div>
          }

          {
            label === 'Web Service' &&
            <div className='p-2'>
              <Handle type="target" position={Position.Top} id='web-service' />
              <p className='text-[#555]'>Service API</p>
              <p className='mt-1 text-sm'>{nodedata.api_url}</p>
              <Handle type="source" position={Position.Bottom} id="web-service" />
            </div>
          }

        </div>
      </div>
    </>
  );
}

export default memo(CustomNode);