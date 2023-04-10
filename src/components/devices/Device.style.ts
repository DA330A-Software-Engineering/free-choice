import { css } from '@emotion/css';

export const deviceStyle = css`
  margin: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  border-radius: 10px;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 200px;
  height: 100px;
`;

export const deviceButton = css`
  width: 100px;
  height: 100px;
  margin: 0;
  padding: 0;
  background-color: #fff;
  border: none;
  border-radius: 10px;
`;

export const loadingStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;