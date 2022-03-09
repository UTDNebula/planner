import React, { useState } from "react";
import DegreePicker, { DegreeState } from "./NewPlanDegreePicker";

export type DegreePickerGalleryProps = {
  degree: DegreeState[];
  handleChange: (value: DegreeState[]) => void;
};

// Validates DegreePicker component
const pickerValidate = (degree: DegreeState[]) => {
  if (degree.length < 1) {
    return false;
  }
  let element: DegreeState;
  for (element of degree) {
    if (!element.valid) {
      return false;
    }
  }
  return true;
};

export default function DegreePickerGallery({
  degree,
  handleChange,
}: DegreePickerGalleryProps) {
  let count = 0;

  // Contains the index of all degree entries & is used to render DegreePicker
  const [degreeCount, setDegreeCount] = useState(
    degree.map((value, index) => {
      return index;
    })
  );
  const [removeIndex, setRemoveIndex] = useState([]);

  const addNewDegree = () => {
    setDegreeCount([...degreeCount, degreeCount[degreeCount.length - 1] + 1]);
    handleChange([
      ...degree,
      {
        degree: "",
        degreeType: "",
        valid: false,
      },
    ]);
  };

  const handleDegreeChange = (formID: number, degreeState: DegreeState) => {
    const temp = degree;
    // Determines if DegreePicker component is valid
    if (!(formID in removeIndex)) {
      degreeState.valid =
        degreeState.degree !== "" &&
        degreeState.degree !== null &&
        degreeState.degreeType !== "";
      let index = 0;
      for (let i = 0; i < removeIndex.length; i++) {
        if (formID < removeIndex[i]) {
          break;
        } else {
          index += 1;
        }
      }
      temp[formID - index] = degreeState;
      handleChange(temp);
    }
  };

  const removePicker = (id: number) => {
    const temp = degree.filter((value, index) => {
      let test = 0;
      for (let i = 0; i < removeIndex.length; i++) {
        if (id < removeIndex[i]) {
          break;
        } else {
          test += 1;
        }
      }
      return id - test !== index;
    });
    setRemoveIndex([...removeIndex, id]);
    handleChange(temp);
  };

  return (
    <>
      <div className="flex flex-col">
        {degreeCount.map((elm, index) => {
          if (index in removeIndex) {
            count += 1;

            return (
              <DegreePicker
                id={index}
                props={{ degree: "", degreeType: "", valid: false }}
                updateChange={handleDegreeChange}
                removePicker={removePicker}
              />
            );
          } else {
            return (
              <DegreePicker
                id={index}
                props={degree[index - count]}
                updateChange={handleDegreeChange}
                removePicker={removePicker}
              />
            );
          }
        })}
      </div>
    </>
  );
}

export { pickerValidate };
