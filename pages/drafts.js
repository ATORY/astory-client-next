import React from 'react';
// import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      editor: false,
    };
    // this.onChange = (editorState) => this.setState({editorState});
  }
  componentDidMount() {
    this.setState({
      editor: true,
    });
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  render() {
    return (
      <div>
        {
          this.state.editor ?
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
            /> :
            null
        }
      </div>
    );
  }
}

export default MyEditor;
