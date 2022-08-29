import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Page = styled.div`
   display: flex;
   flex-direction: column;
   height: 100vh;
   width: 100vw;
   background-color: rgb(11, 28, 44);
`;

export const Header = styled.header`
   user-select: none;
   font-family: monospace;

   border-bottom: 1px solid #8f97a5;

   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   gap: 20px;
   font-size: 14px;
   font-weight: bold;
   padding: 0 16px;
   color: white;

   button {
      height: 24px;
      margin-left: auto;
   }

   .task-link {
      cursor: pointer;
      text-decoration: underline;
      &:hover {
         color: rgb(38, 139, 210);
      }
   }
`;

export const Main = styled.div`
   display: flex;
   flex-direction: row;
   flex-grow: 1;
   overflow: hidden;
`;
export const MainTask = styled.div`
   border-top: 1px solid #8f97a5;
   display: flex;
   min-height: 250px;
`;

export const SidebarContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: 4px;

   min-width: 200px;
   border-right: 1px solid #8f97a5;
   padding: 4px;
   font-family: monospace;
   font-size: 12px;
   color: white;
   text-align: center;
   h1 {
      display: flex;
      align-content: center;
      justify-content: center;
      line-height: 28px;
      font-size: 14px;
      //     color: rgb(38, 139, 210);
      color: rgb(191, 86, 139);
      margin: 0;
      min-height: 31px;
      margin: 0 -4px;
      border-bottom: 1px solid #8f97a5;
   }

   user-select: none;
`;

export const Sidebar = styled.div`
   display: flex;
   flex-direction: column;
   gap: 4px;

   min-width: 200px;
   padding: 4px;
   font-family: monospace;
   font-size: 12px;
   color: white;
   text-align: center;
   user-select: none;
   overflow: auto;
`;

export const SnapId = styled.button<{ active?: boolean }>`
   display: flex;
   background-color: transparent;

   align-items: center;
   justify-content: center;
   border: 1px solid #8f97a5;
   padding: 4px;
   font-family: monospace;
   font-size: 12px;
   color: white;

   &:hover {
      cursor: pointer;
      // color: rgb(38, 139, 210);
      background-color: white;
   }

   ${(props) =>
      props.active &&
      css`
         font-weight: bold;
      `}
`;

export const MainContent = styled.div`
   display: flex;
   flex-direction: column;
   flex-grow: 1;
   overflow: hidden;
   .react-json-view {
      flex-grow: 1;
      font-size: 12px;
      overflow: auto;
      padding: 4px;
   }
`;

export const Toolbar = styled.div`
   font-family: monospace;
   border-bottom: 1px solid #8f97a5;

   display: flex;
   align-content: center;
   flex-direction: row;
   gap: 8px;
   font-size: 12px;

   padding: 8px;
   color: white;

   label {
      display: inline-flex;
      align-items: center;
      margin: 0;
      line-height: 1;
      cursor: pointer;
      input {
         cursor: pointer;
      }
   }
   user-select: none;

   h1 {
      width: 200px;
      font-size: 14px;
      //  line-height: 31px;
      //color: rgb(38, 139, 210);
      color: rgb(191, 86, 139);

      text-align: center;
      margin: -8px;
      padding: 8px;
      border-right: 1px solid #8f97a5;
   }
`;

export const TaskTableContainer = styled.div`
   overflow: auto;
   font-family: monospace;

   font-size: 12px;

   padding: 8px;
   color: white;

   user-select: none;

   table {
      width: 100%;
   }
   thead {
      font-weight: bold;
   }
`;
