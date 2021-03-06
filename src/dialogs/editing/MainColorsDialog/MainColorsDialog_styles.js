import styled from 'styled-components';
import Dialog from 'material-ui/Dialog';
import ChromePicker from 'react-color/lib/components/chrome/Chrome';
import { colorPalette } from '../../../utils/constants/styles';

export const StyledDialog = styled(Dialog)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0 !important;
  padding-bottom: 90px !important;
  padding-left: ${props => props.isSidebar ? '120px' : 0};
  width: ${props => props.isSidebar ? 'calc(100vw - 120px)' : '100vw'};

  > div > div {
    box-sizing: border-box;
    width: 400px !important;
    max-width: unset !important;
  }

  /* Dialog title */
  > div > div > div > h3 {
    padding: 30px 24px 20px !important;
    font-weight: 500 !important;
    color: ${colorPalette.primary1Color} !important;
  }

  /* Dialog content */
  > div > div > div > div:first-of-type {
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-end;
    border: none !important;
    padding-bottom: 0 !important;

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: ${colorPalette.textColor};
    }
  }

  /* Dialog buttons container */
  > div > div > div > div:last-of-type {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 90px;
    padding: 0 24px !important;

    button span {
      font-size: 16px !important;
    }

    /* Dialog cancel button */
    button:first-of-type {
      margin-right: 15px !important;
    }
  }
`;

export const Form = styled.form`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-height: 60px;
`;

export const StyledChromePicker = styled(ChromePicker)`
  z-index: 1000;
  position: absolute !important;
  top: 160px;
  left: ${props => props.moveRight};
`;

export const Cover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const ColorValue = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  border-radius: 2px;
  margin-right: 10px;
  border: 3px solid #fff;
  background-color: ${props => props.color};
  outline: ${props => props.selected ? `2px solid ${colorPalette.accent1Color}` : 'none'};

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    cursor: pointer;
  }
`;
