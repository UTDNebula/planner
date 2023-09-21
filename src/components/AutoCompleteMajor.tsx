import Select from 'react-select';
import { FC, useCallback, useRef } from 'react';

interface AutoCompleteMajorProps extends React.ComponentPropsWithoutRef<'div'> {
  onValueChange: (value: string) => void;
  onInputChange: (query: string) => void;
  options: string[];
  autoFocus?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const AutoCompleteMajor: FC<AutoCompleteMajorProps & React.ComponentPropsWithoutRef<'button'>> = ({
  onValueChange,
  onInputChange,
  options,
  autoFocus,
  placeholder = 'Major',
  defaultValue = '',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // react-select requires options to be an object, so we convert it
  const convertedOptions: any[] = [];
  options.forEach(function (element) {
    convertedOptions.push({ label: element, value: element });
  });

  return (
    <div {...props}>
      <div ref={containerRef} className="absolute -bottom-3 left-0 h-full w-full "></div>
      <Select
        isSearchable={true}
        isClearable={false}
        onChange={(value) => onValueChange(value.value ?? '')}
        onInputChange={(query) => {
          onInputChange(query);
        }}
        options={convertedOptions}
      />
    </div>
  );
};

export default AutoCompleteMajor;
