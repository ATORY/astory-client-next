import dynamic from 'next/dynamic';
import React from 'react';

const ReactQuill = dynamic(
  import('react-quill'),
  {
    ssr: false,
    loading: () => <div>初始化编辑器。。。</div>,
  },
);

export default ReactQuill;
