'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/home');
        setData(response.data.users); // Assuming the data is an array of users
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      router.push('/signin'); // Redirect to the sign-in page if no user data
    }

    fetchData();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    router.push('/signin'); // Redirect to the sign-in page
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete('/api/home/delete', { data: { id: userId } });
      setData(data.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        {user ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user.user?.firstName}!</h1>
            <div className="space-y-2 mb-6">
              <p className="text-lg text-gray-700">Last Name: {user.user?.lastName}</p>
              <p className="text-lg text-gray-700">Email: {user.user?.email}</p>
              <p className="text-lg text-gray-700">Age: {user.user?.age}</p>
              <p className="text-lg text-gray-700">Birthday: {new Date(user.user?.birthday).toLocaleDateString()}</p>
              <p className="text-lg text-gray-700">Status: {user.user?.status}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Guest!</h1>
        )}

        {data.length > 0 && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Data:</h2>
            <ul className="space-y-2">
              {data.map((user) => (
                <div key={user._id} className="bg-pink-200 p-2 rounded-lg shadow-sm">
                  <div className="text-lg bg-slate-500 p-2 rounded-lg justify-center">
                    {/* <p>ID: {user._id}</p> */}
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                    <p>Age: {user.age}</p>
                    <p>Birthday: {new Date(user.birthday).toLocaleDateString()}</p>
                    <p>Status: {user.status}</p>
                    <p>Email: {user.email}</p>
                    <p>Is Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
                    <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
                    <p>Updated At: {new Date(user.updatedAt).toLocaleString()}</p>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="w-full bg-blue-400 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
