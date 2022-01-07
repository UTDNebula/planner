import React from 'react';

/**
 * This function performs search & returns relevant data
 * */
export default function useSearch({ getData, chips = [], filterBy = 'none' }) {
  const [results, setResults] = React.useState([]);

  // TODO: Insert logc for filtering w/ chips
  // TODO: Update filtering code to deal with data from Neblua API
  const updateQuery = (query: string) => {
    getData()
      .then((data) => {
        console.log(data);
        if (filterBy === 'none') {
          return data.filter((elm: string) => elm.toLowerCase().includes(query.toLowerCase()));
        } else {
          return data.filter((elm: any) =>
            elm[filterBy].toLowerCase().includes(query.toLowerCase()),
          );
        }
      })
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        console.error('Could not update query', error);
      });
  };
  return { results, updateQuery };
}
