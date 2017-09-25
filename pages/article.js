import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Editor, { composeDecorators } from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
// import createFocusPlugin from 'draft-js-focus-plugin';
import {
  // Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js';


import ShareQRCode from '../components/ShareQRCode';
import Header from '../components/Header';
import withData from '../lib/withData';
import { articleQuery } from '../graphql/querys';
import ArticlePreview from '../components/ArticlePreview';
import AuthorPreview from '../components/AuthorPreview';
import createColorBlockPlugin from '../components/Draft/ColorBlockPlugin';
import { colorStyleMap } from '../components/Draft/ColorControls';
import {
  Aside as ArticleAttachAside,
  Bottom as ArticleAttachBottom,
} from '../components/ArticleAttach';
import Comment from '../components/Comment';
import { wechatAPI } from '../utils';

const emojiPlugin = createEmojiPlugin();
const resizeablePlugin = createResizeablePlugin();
// const focusPlugin = createFocusPlugin();
const alignmentPlugin = createAlignmentPlugin();
// const { AlignmentTool } = alignmentPlugin;
// const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  // focusPlugin.decorator,
  alignmentPlugin.decorator,
);
const imagePlugin = createImagePlugin({ decorator });

const colorBlockPlugin = createColorBlockPlugin({ decorator });
const plugins = [
  alignmentPlugin, resizeablePlugin, colorBlockPlugin,
  emojiPlugin, imagePlugin,
];

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

const styleMap = {
  CODE: {
    // backgroundColor: 'rgba(29, 31, 33, 1.00)',
    backgroundColor: '#272822',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  ...colorStyleMap,
};

class Article extends React.Component {
  static async getInitialProps({ asPath, req }) {
    let href = '';
    if (req) {
      href = `https://${req.headers.host}${asPath}`;
    } else {
      href = `${location.origin}${asPath}`;
    }
    if (process.env.NODE_ENV === 'production') {
      const res = await wechatAPI(href);
      const data = await res.json();
      return { wxConfig: data, href };
    }
    return { wxConfig: {}, href };
  }
  componentDidMount() {
    const { wxConfig, data } = this.props;
    if (wxConfig.signature && data && data.article) {
      this.configShare(wxConfig, data.article);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { wxConfig, data } = nextProps;
    if (wxConfig.signature && data && data.article) {
      this.configShare(wxConfig, data.article);
    }
  }

  configShare = (data, article) => {
    const wx = window.wx;
    wx.config(data);
    wx.ready(() => {
      wx.checkJsApi({
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'],
        success: (res) => {
          console.log(JSON.stringify(res));
        },
      });
      wx.onMenuShareTimeline({
        title: article.title, // 分享标题
        link: location.href, // 分享链接
        imgUrl: article.shareImg ? `${article.shareImg}?width=100` : '', // 分享图标
        success: () => {
          // alert('ok');
          // 用户确认分享后执行的回调函数
        },
        cancel: () => {
          // alert('cancel');
          // 用户取消分享后执行的回调函数
        },
      });
      // 分享给朋友
      wx.onMenuShareAppMessage({
        title: article.title, // 分享标题
        desc: article.description || '', // 分享描述
        link: location.href, // 分享链接
        imgUrl: article.shareImg ? `${article.shareImg}?width=100` : '', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          // alert('ok');
          // 用户确认分享后执行的回调函数
        },
        cancel: () => {
          // alert('cancel');
          // 用户取消分享后执行的回调函数
        },
      });
    });
    wx.error((res) => {
      console.error(JSON.stringify(res));
    });
  }
  render() {
    const { url, data, href } = this.props;
    let elem = <div />;
    let commentElem = <div />;
    const { loading, error, article } = data;
    if (loading) {
      elem = (
        <article className='' id='article'>
          <ArticlePreview articleId={url.query.articleId} />
        </article>
      );
    } else if (error) {
      elem = <div>{error.message}</div>;
    } else {
      const { _id, content, collectNumber, readNumber, publishDate, author,
        mark, collect, comments,
      } = article;
      const initContent = JSON.parse(content);
      const editorState = EditorState.createWithContent(convertFromRaw(initContent));
      elem = (
        <article className='' id='article'>
          <img className='banner' src={article.shareImg} alt='' />
          <div>
            <h1>{article.title}</h1>
          </div>
          <AuthorPreview articleId={_id} {...{ publishDate, readNumber }} {...author} />
          <div className='RichEditor-editor' style={{ paddingTop: 0 }}>
            <Editor
              editorKey={_id}
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              onChange={() => {}}
              spellCheck
              readOnly
              plugins={plugins}
            />
          </div>
          <ArticleAttachBottom {...{ _id, mark, collect, collectNumber }} />
          <ArticleAttachAside {...{ _id, mark, collect, collectNumber }} />
        </article>
      );
      commentElem = (
        <div className='comment'>
          <Comment articleId={_id} comments={comments} />
        </div>
      );
    }
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title={article && article.title} />
        {elem}
        {/* commentElem */}
        <ShareQRCode href={href} />
      </div>
    );
  }
}


Article.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  href: PropTypes.string.isRequired,
  wxConfig: PropTypes.object.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    article: PropTypes.object,
  }).isRequired,
};

const ArticleWithQuery = graphql(articleQuery, {
  options: (props) => {
    const variables = { articleId: props.url.query.articleId };
    return { variables };
  },
})(Article);

export default withData(ArticleWithQuery);
