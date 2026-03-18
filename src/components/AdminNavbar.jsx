function AdminNavbar() {
  return (
    <div className="bg-black text-white p-4 flex justify-between">

      <h1 className="font-bold text-lg">
        Admin Panel 👑
      </h1>

      <div className="flex gap-4">
        <a href="/admin">Dashboard</a>
        <a href="/admin/users">Users</a>
      </div>

    </div>
  );
}

export default AdminNavbar;