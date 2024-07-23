// app/profile/page.js
'use client'; // Ensure this component is a client-side component

import { useState } from 'react';

export default function ProfilePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hello');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <button onClick={fetchData}>Load Profile Data</button>
      {loading && <p>Loading...</p>}
      <div>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index}>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Age:</strong> {item.age}</p>
              <hr />
            </div>
          ))
        ) : (
          !loading && <p>No data available</p>
        )}
      </div>
    </div>
  );
}
