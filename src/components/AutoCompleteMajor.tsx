import Select from 'react-select';
import { FC, useRef } from 'react';
import useMajors from '@/shared/useMajors';

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
  const { majors, err } = useMajors();
  const containerRef = useRef<HTMLDivElement>(null);
  // react-select requires options to be an object, so we convert it
  const convertedOptions: any[] = majors.map((e) => ({ label: e, value: e }));
  return (
    <div {...props}>
      <div ref={containerRef} className="absolute -bottom-3 left-0 h-full w-full "></div>
      <Select
        isSearchable={true}
        isClearable={false}
        onChange={(selection) => onValueChange(selection.value ?? '')}
        onInputChange={(query) => {
          onInputChange(query);
        }}
        options={convertedOptions}
        placeholder={placeholder}
      />
    </div>
  );
};

export default AutoCompleteMajor;
