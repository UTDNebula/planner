import { useEffect, useState } from 'react';

const useMajors = () => {
  const [majors, setMajors] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_VALIDATOR}/get-degree-plans`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setMajors(
          data['degree_plans'].map((degree: { display_name: string }) => degree['display_name']),
        );
      });
  }, []);

  return majors;
};

export default useMajors;
