import React from 'react';

/**
 * This function performs search & returns relevant data
 * */
export default function useSearch({ getData, chips = [], filterBy = 'none' }) {
  const [results, setResults] = React.useState([]);

  const getResults = () => {
    return results;
  };

  // TODO: Insert logc for filtering w/ chips
  // TODO: Update filtering code to deal with data from Neblua API
  const updateQuery = (query: string) => {
    getData()
      .then((data) => {
        if (filterBy === 'none') {
          const f = data.filter((elm: string) => elm.toLowerCase().includes(query.toLowerCase()));
          return f.slice(0, 20);
        } else {
          const f = data.filter((elm: any) =>
            elm[filterBy].toLowerCase().includes(query.toLowerCase()),
          );
          return f.slice(0, 20);
        }
      })
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        console.error('Could not update query', error);
      });
  };
  return { results, getResults, updateQuery };
}
