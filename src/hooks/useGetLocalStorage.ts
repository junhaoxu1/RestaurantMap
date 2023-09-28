import { useState, useEffect } from "react";



function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Retrieve the data from localStorage, or use the initialValue if not found.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error retrieving data from localStorage:", error);
      return initialValue;
    }
  });

  // Update the data in localStorage whenever the state changes.
  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;