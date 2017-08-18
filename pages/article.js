import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Header from '../components/Header';
import withData from '../lib/withData';
import { articleQuery } from '../graphql/querys';
import ArticlePreview from '../components/ArticlePreview';
import AuthorPreview from '../components/AuthorPreview';
import {
  Aside as ArticleAttachAside,
  Bottom as ArticleAttachBottom,
} from '../components/ArticleAttach';
import Comment from '../components/Comment';
import { wechatAPI } from '../utils';

class Article extends React.Component {
  static async getInitialProps({ asPath, req }) {
    let href = '';
    if (req) {
      href = `https://${req.headers.host}${asPath}`;
    } else {
      href = `${location.origin}${asPath}`;
    }
    const res = await wechatAPI(href);
    const data = await res.json();
    return { wxConfig: data };
  }
  componentDidMount() {
    // this.configShare();
    const { wxConfig, data } = this.props;
    if (wxConfig && data && data.article) {
      this.configShare(wxConfig, data.article);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { wxConfig, data } = nextProps;
    if (wxConfig && data && data.article) {
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
    // }).catch(console.error);
  }
  render() {
    const { url, data } = this.props;
    let elem = <div />;
    let commentElem = <div />;
    const { loading, error, article } = data;
    if (loading) {
      elem = (
        <article className='ql-container ql-snow' id='article'>
          <ArticlePreview articleId={url.query.articleId} />
        </article>
      );
    } else if (error) {
      elem = <div>{error.message}</div>;
    } else {
      const { _id, content, collectNumber, readNumber, publishDate, author,
        mark, collect, comments,
      } = article;
      elem = (
        <article className='ql-container ql-snow' id='article'>
          <AuthorPreview articleId={_id} {...{ publishDate, readNumber }} {...author} />
          <div className='ql-editor'>
            <div dangerouslySetInnerHTML={{ __html: content }} />
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
        {commentElem}
      </div>
    );
  }
}


Article.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
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
