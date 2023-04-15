import React from 'react';

/**
 * Wrapper component that injects ``analyticsClass`` class into its child
 *
 * Errors when more than 1 child
 *
 * Child component must take ``className`` props
 */
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
