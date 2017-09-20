import React from 'react';
import { List } from 'immutable';
import Prism from 'prismjs';
// import PropTypes from 'prop-types';

function occupySlice(targetArr, start, end, componentKey) {
  const target = targetArr;
  for (let ii = start; ii < end; ii += 1) {
    target[ii] = componentKey;
  }
}

class PrismDraftDecorator {
  // static propsTypes = {
  //   tokType: PropTypes.string.isRequired,
  //   children: PropTypes.element.isRequired,
  // };
  constructor(grammar) {
    this.grammar = grammar || Prism.languages.javascript;
    this.highlighted = {};
  }
  getDecorations = (block) => {
    const blockType = block.getType();
    const blockKey = block.getKey();
    const blockText = block.getText();
    const decorations = Array(blockText.length).fill(null);
    this.highlighted[blockKey] = {};
    if (blockType !== 'code-block') {
      return List(decorations);
    }
    console.log(blockText);
    const tokens = Prism.tokenize(blockText, this.grammar);
    console.log(tokens);
    let offset = 0;
    tokens.forEach((tok) => {
      if (typeof tok === 'string') {
        offset += tok.length;
      } else {
        const tokId = `tok${offset}`;
        const completeId = `${blockKey}-${tokId}`;
        this.highlighted[blockKey][tokId] = tok;
        occupySlice(decorations, offset, offset + tok.content.length, completeId);
        offset += tok.content.length;
      }
    });
    return List(decorations);
  }

  getComponentForKey = () => ({ tokType, children }) => (
    <span
      className={`token ${tokType}`}
    >
      {children}
    </span>
  );

  getPropsForKey(key) {
    const parts = key.split('-');
    const blockKey = parts[0];
    const tokId = parts[1];
    const token = this.highlighted[blockKey][tokId];
    return {
      tokType: token.type,
    };
  }
}

export default PrismDraftDecorator;

