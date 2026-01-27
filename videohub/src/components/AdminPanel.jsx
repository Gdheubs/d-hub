import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) console.error(error);
    else setUsers(data);
    setLoading(false);
  };

  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    if (error) console.error(error);
    else fetchUsers();
  };

  const deleteUser = async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (error) console.error(error);
    else fetchUsers();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <select value={user.role} onChange={(e) => updateUserRole(user.id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="support">Support</option>
                  <option value="technical">Technical</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;