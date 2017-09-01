import { getCookie } from '../js/cookies';

export const detectIE = () => {
  const ua = window.navigator.userAgent;
  return (ua.includes('MSIE') || ua.includes('Trident/') || ua.includes('Edge/'));
};

export const getTokenHeader = () => {
  return {
    Authorization: `cos ${getCookie('token')}`,
  };
};
