import React, { FC, useMemo, useState } from 'react';

const SCROLL_THRESHOLD = 0.1;

type RowLayoutProps = React.ComponentPropsWithoutRef<'li'> & {
  injectedComponent?: React.ElementType;
};

const RowLayout: FC<RowLayoutProps> = ({
  children,
  injectedComponent: InjectedComponent = () => <></>,
  ...props
}) => {
  return (
    <li className="w-full grid grid-flow-col auto-cols-fr justify-items-start relative" {...props}>
      <>
        {children}
        <InjectedComponent />
      </>
    </li>
  );
};

interface DataGridColumn<T, K> {
  title: string;
  key: K;
  valueGetter?: (value: T) => string;
}

interface DataGridProps<T, K> {
  rows: T[];
  columns: DataGridColumn<T, K>[];
  lazyLoad?: () => Promise<T[]>;
  titleComponent: React.ElementType;
  loadingComponent: React.ElementType;
  rowCellComponent: React.ElementType;
  childrenProps?: {
    headerProps?: RowLayoutProps;
    gridProps?: GridContainerProps;
    rowProps?: RowLayoutProps;
  };
}

type GridContainerProps = React.ComponentPropsWithoutRef<'section'>;

const DataGrid = <T extends { [key: string]: unknown }, K extends keyof T>({
  rows,
  columns,
  lazyLoad,
  titleComponent: Title,
  rowCellComponent: RowCell,
  loadingComponent: Loading,
  childrenProps: { headerProps, gridProps, rowProps },
}: DataGridProps<T, K>) => {
  const [isFetching, setIsFetching] = useState(false);

  const onScroll = useMemo(() => {
    return lazyLoad
      ? (((e) => {
          const scrollTop = e.currentTarget.scrollTop;
          const scrollHeight = e.currentTarget.scrollHeight;
          const ratio = 1 - scrollTop / scrollHeight;

          if (ratio < SCROLL_THRESHOLD && !isFetching) {
            setIsFetching(true);
            lazyLoad().then(() => {
              setIsFetching(false);
            });
          }
        }) as React.UIEventHandler<HTMLElement>)
      : undefined;
  }, [lazyLoad]);

  return (
    <section {...gridProps} style={{ maxHeight: '200px', overflowY: 'scroll' }} onScroll={onScroll}>
      <RowLayout {...headerProps}>
        {columns.map(({ title }, i) => (
          <Title key={`data-grid-title-${title}-${i}`}>{title}</Title>
        ))}
      </RowLayout>
      {rows.map((row, i) => {
        console.log(i);
        return (
          <RowLayout key={`row-${i}`} {...rowProps}>
            {columns.map(({ key, title, valueGetter }, i) => (
              <RowCell key={`data-grid-row-cell-${title}-${i}`}>
                {valueGetter ? valueGetter(row) : row[key]}
              </RowCell>
            ))}
          </RowLayout>
        );
      })}
      {isFetching && <Loading />}
    </section>
  );
};

export default DataGrid;
