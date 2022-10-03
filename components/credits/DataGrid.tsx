import React, { useMemo, useState } from 'react';

const SCROLL_THRESHOLD = 0.1;

type RowLayoutProps<T> = React.ComponentPropsWithoutRef<'li'> & {
  injectedComponent?: {
    Element: React.ElementType;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
  };
};

type InternalRowLayoutProps<T> = RowLayoutProps<T> & { row?: T };

const RowLayout = <T extends { [key: string]: unknown }>({
  row,
  children,
  injectedComponent: { Element: InjectedComponent, onClick } = {
    Element: () => null,
    onClick: () => ({}),
  },
  ...props
}: InternalRowLayoutProps<T>) => {
  return (
    <li className="w-full grid grid-flow-col auto-cols-fr justify-items-start relative" {...props}>
      <>
        {children}
        <div onClick={(e) => onClick(e, row)}>
          <InjectedComponent />
        </div>
      </>
    </li>
  );
};

interface DataGridColumn<T, K> {
  title: string;
  key?: K;
  valueGetter?: (value: T) => string;
}

interface DataGridProps<T, K> {
  rows: T[];
  columns: DataGridColumn<T, K>[];
  lazyLoad?: () => Promise<T[]>;
  TitleComponent: React.ElementType;
  LoadingComponent: React.ElementType;
  RowCellComponent: React.ElementType;
  childrenProps?: {
    headerProps?: RowLayoutProps<T>;
    gridProps?: GridContainerProps;
    rowProps?: RowLayoutProps<T>;
  };
}

type GridContainerProps = React.ComponentPropsWithoutRef<'section'>;

const DataGrid = <T extends { [key: string]: unknown }, K extends keyof T>({
  rows,
  columns,
  lazyLoad,
  TitleComponent: Title,
  RowCellComponent: RowCell,
  LoadingComponent: Loading,
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
    <div>
      <RowLayout {...headerProps}>
        {columns.map(({ title }, i) => (
          <Title key={`data-grid-title-${title}-${i}`}>{title}</Title>
        ))}
      </RowLayout>

      <section
        {...gridProps}
        style={{ maxHeight: '200px', overflowY: 'scroll' }}
        onScroll={onScroll}
      >
        {rows.map((row, i) => {
          return (
            <RowLayout key={`row-${i}`} {...rowProps} row={row}>
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
    </div>
  );
};

export default DataGrid;
