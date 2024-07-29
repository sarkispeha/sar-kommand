import { useEffect, useState } from "react";

interface FetchState<T> {
  data: null | T;
  isLoading: boolean;
}
// The `FetchState<T>` interface defines the shape of the state returned by the
// `useFetch` hook. It ensures that the hook's return value always includes two specific properties: `data`, and
// `isLoading`. The `data` property is of type `T` or `null`, meaning it can be either the fetched data
// (of generic type `T`) or `null` if no data is available yet.  By using the generic
// type `T`, `FetchState<T>` allows the `useFetch` hook to be flexible and type-safe, accommodating any data
// structure specified by the consuming component.

const useFetch = <T>(url: string): FetchState<T> => {
  const [data, setData] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setData(data);
        }
      } catch (error) {
        console.warn("Error from useFetch: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading };
};

export default useFetch;
