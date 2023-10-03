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

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: '1px solid var(--color-neutral-500)',
    borderRadius: '0.375rem',
    fontSize: '14px',
    height: '46px',
    // You can add more styles as needed
  }),
  option: (provided: any) => ({
    ...provided,
    color: 'black',
  }),
  input: (provided: any) => ({
    ...provided,
    paddingLeft: '0.5rem',
    color: 'black',
  }),
  placeholder: (provided: any) => {
    return {
      ...provided,
      paddingLeft: '0.5rem',
      fontSize: '14px',
    };
  },
};

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
      <div ref={containerRef} className="absolute -bottom-3 left-0 h-full w-full"></div>
      <Select
        styles={customStyles}
        components={{
          IndicatorSeparator: () => null,
        }}
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
