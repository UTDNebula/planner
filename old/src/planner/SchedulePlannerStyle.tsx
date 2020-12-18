import styled from 'styled-components';

const SchedulerHeader = styled.header`
  height: 64px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: orange;
  font-weight: bold;
  font-size: 24px;
`;

const SemesterListWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow-y: scroll;
  overflow-x: auto;
`;

const GrowContainer = styled.div`
  flex-grow: 1;
`;

const PlannerWindow = styled.main`
  display: flex;
  height: 100%;
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export { SchedulerHeader, SemesterListWrapper, GrowContainer, PlannerWindow, Wrapper };
