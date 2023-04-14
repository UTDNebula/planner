import React from 'react';

export default function AnalyticsWrapper({
  analyticsClass,
  children,
}: {
  analyticsClass: string;
  children: React.ReactElement;
}) {
  return React.cloneElement(React.Children.only(children), {
    ...children.props,
    className: children.props.className ? `${children.props.className} ${analyticsClass}` : null,
  });
}
