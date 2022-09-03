/* TODO 
1. Pull courses from Nebula data service (maybe w/ query to get course info)
*/

export type TransferCreditCardProps = {
  id: number;
  course: string;
  removeCard: (index: number) => void;
};
export default function TransferCreditCard({
  id,
  course,
  removeCard,
}: TransferCreditCardProps): JSX.Element {
  return (
    <div className="max-w-lg w-76 bg-gray-100 shadow-lg border-b p-2">
      <div className="flex flex-row justify-between">
        <div className="flex-col">
          <h3 className="font-semibold mr-32 text-lg text-gray-700 ">{course}</h3>
          <p className="text-gray-500 mt-1 my-1">{'Insert course here'}</p>
        </div>
        <button className="inline self-start" onClick={() => removeCard(id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2 fill-current text-blue-600"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
