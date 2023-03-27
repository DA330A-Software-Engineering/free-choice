import { css } from '@emotion/css';

export const toggleDeviceStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.5rem;
`;


export const iconStyle = css`
  font-size: 3rem;
`;

export const nameStyle = css`
  margin-left: 0.5rem;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 10rem;
`;
