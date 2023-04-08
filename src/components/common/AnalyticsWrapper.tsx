import { FC } from 'react';

export default function AnalyticsWrapper({
  analyticsClass,
  children,
}: {
  analyticsClass: string;
  children: React.ReactElement;
}) {
  return <div className={`${analyticsClass} h-full w-full`}>{children}</div>;
}
