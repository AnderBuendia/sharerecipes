import { FACEBOOK_APP_ID, SITE_LANGUAGE } from '@Lib/utils/constants.utils';

const TRACKING_PARAM = '%3Fssm=';
const TRACKING_VALUE: {
  [key: string]: string;
} = {
  facebook: 'FB_CC',
  twitter: 'TW_CC',
  whatsapp: 'whatsapp',
};

export const getTracker = (type: string) => {
  return `${TRACKING_PARAM}${TRACKING_VALUE[type]}`;
};

export const getTwitter = ({
  encodedSharedUrl,
  encodedSharedText,
  sharedUrl,
  sharedText,
}: {
  encodedSharedUrl: string;
  encodedSharedText: string;
  sharedUrl: string;
  sharedText: string;
}) => ({
  iconName: 'twitter',
  href: [
    'https://twitter.com/intent/tweet?',
    'url=',
    encodedSharedUrl,
    getTracker('twitter'),
    '&text=',
    encodedSharedText,
    '&lang=',
    SITE_LANGUAGE,
  ].join(''),
  'data-param-description': sharedText,
  'data-param-href': sharedUrl,
  'data-param-text': sharedText,
  'data-param-url': sharedUrl,
});

export const getFacebook = ({
  encodedSharedUrl,
  encodedSharedText,
  sharedUrl,
  sharedText,
}: {
  encodedSharedUrl: string;
  encodedSharedText: string;
  sharedUrl: string;
  sharedText: string;
}) => {
  return {
    iconName: 'facebook',
    analytics: 'facebook',
    openLinkInWindow: true,
    href: [
      'https://www.facebook.com/dialog/share?',
      'display=popup',
      '&app_id=',
      FACEBOOK_APP_ID,
      '&href=',
      encodedSharedUrl,
      getTracker('facebook'),
      '&quote=',
      encodedSharedText,
    ].join(''),
    'data-param-app_id': FACEBOOK_APP_ID,
    'data-param-description': sharedText,
    'data-param-href': sharedUrl,
    'data-param-text': sharedText,
    'data-param-url': sharedUrl,
  };
};
