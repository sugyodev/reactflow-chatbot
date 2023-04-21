import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../../components/CustomNode';
import Navbar from '../../layout/Navbar';
import Toolbar from '../../layout/Toolbar';
import SettingBar from '../../layout/SettingBar';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Starting Point' },
    position: { x: 150, y: 155 },
  },
];
const minimapStyle = {
  height: 120,
};

let id = 0;
const getId = () => `dndnode_${id++}`;
const nodeTypes = {
  customNode: CustomNode
};

const Main = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showSettingBar, setShowSettingBar] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const selectNode = (props) => {
    setSelectedNodeData(props);
    setShowSettingBar(true);
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('type');
      const label = event.dataTransfer.getData('label');
      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

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
        data: { label: `${label}`, nodedata, setNodes, getId, selectNode, },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const exportJson = () => {
    const jsonString = JSON.stringify(nodes);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
  }

  return (
    <div className='sm:ml-64 h-full mt-16'>
      <Navbar exportJson={exportJson} />
      <ReactFlowProvider>
        <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
          // fitView
          >
            <Controls />
            <MiniMap style={minimapStyle} zoomable pannable />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      {showSettingBar
        ? <SettingBar
          setShowSettingBar={setShowSettingBar}
          selectedNodeData={selectedNodeData}
        />
        : <Toolbar />
      }
    </div>
  );
};

export default Main;
