import { GetServerSideProps, GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

interface PlanDetailPageProps {
  planId: string;
}

export default function PlanDetailPage({ planId }: PlanDetailPageProps): JSX.Element {
  return <div>{planId}</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {};
};
