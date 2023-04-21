import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode(props) {
  const [showToolbar, setShowToolbar] = useState(false);

  const { id, xPos, yPos, data } = props;
  const { setNodes, label, getId, selectNode, nodedata } = data;

  /**
   * Delete noe by click trash
   */
  const deleteNodeById = () => {
    setNodes(nds => nds.filter(node => node.id !== id));
  };

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
        nodedata['data'] = [];
        break;
      case 'Quick Answers':
        nodedata['qu_header'] = '';
        nodedata['qu_footer'] = '';
        nodedata['qu_data'] = [];
        break;
      default:
        break;
    }
    const newNode = {
      id: getId(),
      type: 'customNode',
      position,
      data: { label: `${label}`, setNodes, getId, selectNode, nodedata },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbar(false);
  };

  /**
   * When click node handler
   */
  const onSelectedNode = () => {
    setShowToolbar(!showToolbar)
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
      <Handle type="target" position={Position.Top} />
      {showToolbar &&
        <div className='flex absolute -top-6 border border-gray-400 rounded-full p-1 px-2' style={{ fontSize: 10 }}>
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

        <div className='text-xs max-w-44 break-words max-h-36 h-full overflow-y-auto'>
          {label === 'Message' &&
            <div className='p-2'>{nodedata.content
              ? <div dangerouslySetInnerHTML={{ __html: nodedata.content }}></div>
              : <p className='text-[#aaa]'>no messages<br /></p>
            }
            </div>
          }

          {label === 'Questions' &&
            <div className='p-2'>{nodedata.qa_q
              ? <div dangerouslySetInnerHTML={{ __html: nodedata.qa_q }}></div>
              : <p className='text-[#aaa]'>no questions<br /></p>
            }
            </div>
          }

          {label === 'Options' &&
            <div className=''>
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.option_header ? nodedata?.option_header : 'Default Header'}</h1>
              <div className=''>
                {nodedata.data.length > 0
                  ?
                  nodedata.data.map((section, s_no) => (
                    <div key={s_no}>
                      <div className='text-[#0894b5] text-xs font-[500] my-[6px] px-1'>{section.name}</div>
                      {section.data.map((option, o_no) => (
                        <div className='w-full flex justify-between my-1 cursor-pointer hover:bg-[#eee] p-1 px-2' onClick={() => selectOption(s_no, o_no)} key={o_no} >
                          <p>{option}</p>
                          <input type="radio" className='w-2' checked={section.selectedOption === o_no} />
                        </div>
                      ))}
                    </div>
                  ))
                  :
                  <p className='text-[#aaa] p-2'>
                    no options
                  </p>
                }
              </div>
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.option_footer ? nodedata?.option_footer : 'Default Footer'}</h1>
            </div>
          }

          {label === 'Quick Answers' &&
            <div className=''>
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.qu_header ? nodedata?.qu_header : 'Default Header'}</h1>
              <div className=''>
                {nodedata.qu_data.length > 0
                  ?
                  nodedata.qu_data.map((data, no) => (
                    <div key={no} className='focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 
                    font-medium text-sm px-4 py-2 border-b border-gray-500'>
                      <span>{data.name}</span>
                    </div>
                  ))
                  :
                  <p className='text-[#aaa] p-2'>
                    no buttons
                  </p>
                }
              </div>
              <h1 className='bg-[#336699] p-1 text-center text-white'>{nodedata?.qu_footer ? nodedata?.qu_footer : 'Default Footer'}</h1>
            </div>
          }
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default memo(CustomNode);