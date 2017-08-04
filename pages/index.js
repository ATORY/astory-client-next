import Header from '../components/Header';
// import Submit from '../components/Submit'
import ArticleList from '../components/ArticleList';
import withData from '../lib/withData';


const Index = withData((props) => (
  <div>
    <Header pathname={props.url.pathname} />
    <ArticleList />
  </div>
));

export default Index;
