import { hidenLoginMask, showLoginMask,
  showShareMask, hidenShareMask,
} from './loginMask';
import { showAuthorIntro, hideAuthorInfo } from './authorIntro';
import wechatAPI from './wechatAPI';
import { submitEmailAPI, submitNewPWDAPI } from './pwdChange';

export {
  showShareMask,
  hidenShareMask,
  hidenLoginMask,
  showLoginMask,
  showAuthorIntro,
  hideAuthorInfo,
  wechatAPI,
  submitEmailAPI,
  submitNewPWDAPI,
};
