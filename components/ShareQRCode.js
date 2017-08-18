import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import { hidenShareMask } from '../utils';

const DynamicQRCode = dynamic(
  import('qrcode.react'),
  {
    ssr: false,
  },
);

class ShareQRCode extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
  }
  componentDidMount() {

  }
  render() {
    const { href } = this.props;
    return (
      <div className='mask shareqrcode' id='share-mask'>
        <i className='material-icons close' role='presentation' onClick={hidenShareMask}>close</i>
        <div id='share-mask-box'>
          <DynamicQRCode value={href} size={200} />
          <p>微信扫一扫</p>
        </div>
      </div>
    );
  }
}

export default ShareQRCode;
