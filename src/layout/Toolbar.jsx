
import React, { useState, useRef, useCallback } from 'react';
function Toolbar() {
  const onDragStart = (event, label, nodeType = 'customNode') => {
    event.dataTransfer.setData('type', nodeType);
    event.dataTransfer.setData('label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside id="sidebar-multi-level-sidebar" className="fixed top-[80px] left-0 z-40 w-64 transition-transform 
      -translate-x-full sm:translate-x-0 border-r border-gray-200" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Message')} draggable>
                <img src="imgs/message-icon.png" alt="A" width={24}/>
                <span className="ml-3">Message</span>
              </button>
            </li>
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Questions')} draggable>
                <img src="imgs/ask-icon.png" alt="A" width={24} />
                <span className="ml-3">Question</span>
              </button>
            </li>
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Options')} draggable>
                <img src="imgs/options-icon.png" alt="A" width={24} />
                <span className="ml-3">List of options</span>
              </button>
            </li>
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Quick Answers')} draggable>
                <img src="imgs/qa-icon.png" alt="A" width={24} />
                <span className="ml-3">Quick Answers</span>
              </button>
            </li>
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Answer with Text')} draggable>
                <img src="imgs/text-icon.png" alt="A" width={24} />
                <span className="ml-3">Answer with text</span>
              </button>
            </li>
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Upload Media')} draggable>
                <img src="imgs/media-icon.png" alt="A" width={24} />
                <span className="ml-3">Media</span>
              </button>
            </li>
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Talk with advisor')} draggable>
                <img src="imgs/talk-icon.png" alt="A" width={24} />
                <span className="ml-3">Talk to an advisor</span>
              </button>
            </li>
            <li>
              <button className="flex items-center p-2 py-4 text-gray-900 rounded-lg hover:shadow-md 
              hover:border-gray-200 border border-white my-3 w-full" onDragStart={(event) => onDragStart(event, 'Web Service')} draggable>
                <img src="imgs/web-icon.png" alt="A" width={24} />
                <span className="ml-3">Web service</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Toolbar;
