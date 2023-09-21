import Autocomplete from '@mui/material/Autocomplete';
import Select from 'react-select';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
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
  const CustomPopper = useCallback(
    (props) => {
      if (!containerRef.current) {
        return <div></div>;
      }
      const { width } = containerRef.current.getBoundingClientRect();
      return (
        <Popper
          {...props}
          placement="bottom"
          anchorEl={containerRef.current}
          className="z-[9999] overflow-hidden rounded-[10px] text-sm shadow-lg"
          style={{
            width: width,
            border: options.length > 0 ? '1px solid #EDEFF7' : 'none',
          }}
        />
      );
    },
    [containerRef, options.length],
  );

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
