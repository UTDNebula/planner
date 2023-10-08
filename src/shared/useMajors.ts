import { useEffect, useState } from 'react';

const useMajors = () => {
  const [majors, setMajors] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_VALIDATOR}/get-degree-plans`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setMajors(data['degree_plans']);
      })
      .catch((error) => {
        console.error('An error occurred while trying to load majors:', error);
        setErr(error.message);
      });
  }, []);

  return { majors, err };
};

export default useMajors;
