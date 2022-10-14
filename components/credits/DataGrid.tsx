import React, { useMemo, useState } from 'react';

const SCROLL_THRESHOLD = 0.1;

/**
 * @property {{Element: React.ElementType; onClick: (e: React.MouseEvent) => void;}} injectedComponent - element to be injected for each row (used for utility UI like delete and update buttons)
 */
type RowLayoutProps<T> = React.ComponentPropsWithoutRef<'li'> & {
  injectedComponent?: {
    Element: React.ElementType;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
  };
};

type InternalRowLayoutProps<T> = RowLayoutProps<T> & { row?: T };

/**
 * Internal layout component used for rows and column headers to keep them consistently justified and spaced
 */
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

/**
 * @property {DataGridColumn} columns - array of JSON objects that represent each column
 * @property {T} rows - array of JSON objects that are rendered in each row
 * @property {() => Promise<void>} lazyLoad - function called when DataGrid is scrolled to bottom
 * @property {React.ElementType} TitleComponent - custom title component
 * @property {React.ElementType} RowCellComponent - custom cell component
 * @property {React.ElementType} LoadingComponent - custom loading component
 * @property {object} childrenProps - props for column header container, individual row containers, and grid container (wraps rows, excludes column header)
 *
 */
interface DataGridProps<T, K> {
  rows: T[];
  columns: DataGridColumn<T, K>[];
  lazyLoad?: () => Promise<void>;
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

/**
 * Custom DataGrid component
 * - a CONTROLLED component, row state must be maintained by higher component
 */
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
        style={{ ...gridProps.style, overflowY: 'scroll' }}
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
