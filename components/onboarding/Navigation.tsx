import React from "react";

export interface NavigationProps {
  navigationProps: NavigationStateProps;
  validate: boolean[];
  currentPage: number;
  changePage: React.Dispatch<React.SetStateAction<number>>;
}
export type NavigationStateProps = {
  personal: boolean;
  honors: boolean;
  credits: boolean;
};

export default function Navigation({
  navigationProps,
  validate,
  currentPage,
  changePage,
}: NavigationProps): JSX.Element {
  const canNavigate = (index: number) => {
    // Check if current valid
    if (index > currentPage) {
      if (!validate[currentPage]) {
        alert("Warning: 1 or more fields missing");
        return false;
      }
      // Check if all previous pages valid
      for (let i = currentPage + 1; i < index; i++) {
        if (!validate[i]) {
          alert("Warning: Can't go to this page");
          return false;
        }
      }
    }
    changePage(index);
    return true;
  };
  return (
    <div className="h-28 mb-8 flex justify-center items-center text-white ">
      <button
        className={`flex flex-col items-center border-4 border-navigation-dark ${
          navigationProps.personal ? "bg-navigation-dark" : "bg-navigation"
        } rounded-full w-24 h-24`}
        onClick={() => canNavigate(3)}
      >
        <div className="text-base p-top mt-2"> Step 1 </div>
        <div className="text-sm m-0 p-0"> Personal </div>
        <div className="text-sm -my-1 p-0"> Information </div>
      </button>

      <svg width="150">
        <line
          x1="0"
          y1="75"
          x2="150"
          y2="75"
          stroke="#C8D1F3"
          strokeWidth="6"
        />
      </svg>

      <button
        className={`flex flex-col items-center border-4 border-navigation-dark ${
          navigationProps.honors ? "bg-navigation-dark" : "bg-navigation"
        } rounded-full w-24 h-24`}
        onClick={() => canNavigate(4)}
      >
        <div className="text-base p-top mt-2"> Step 2 </div>
        <div className="text-sm m-0 p-0"> Scholarships </div>
        <div className="text-sm -my-1 p-0"> &quot; Honors </div>
      </button>

      <svg width="150">
        <line
          x1="0"
          y1="75"
          x2="150"
          y2="75"
          stroke="#C8D1F3"
          strokeWidth="6"
        />
      </svg>
      <button
        className={`flex flex-col items-center border-4 border-navigation-dark ${
          navigationProps.credits ? "bg-navigation-dark" : "bg-navigation"
        } rounded-full w-24 h-24`}
        onClick={() => canNavigate(5)}
      >
        <div className="text-base p-top mt-2"> Step 3 </div>
        <div className="text-sm m-0 p-0"> Transferred </div>
        <div className="text-sm -my-1 p-0"> Credits </div>
      </button>
    </div>
  );
}
