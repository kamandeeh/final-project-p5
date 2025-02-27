import { createContext, useState, useEffect, useContext } from "react";

const RecordsContext = createContext(null);

export const RecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/records");

      if (!response.ok) {
        throw new Error(`Failed to fetch records: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error.message);
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <RecordsContext.Provider value={{ records, loading, fetchRecords }}>
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error("useRecords must be used within a RecordsProvider");
  }
  return context;
};

export default RecordsContext;