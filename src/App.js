import { useEffect, useState } from "react";
import API from "./api/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: ""
  });

  // ==============================
  // FETCH EMPLOYEES
  // ==============================
  const fetchEmployees = () => {
    API.get("/employees")
      .then(res => setEmployees(res.data))
      .catch(() => setError("Backend connection failed"));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ==============================
  // ADD EMPLOYEE
  // ==============================
  const addEmployee = async () => {
    try {
      await API.post("/employees", form);
      setForm({ employeeId: "", name: "", email: "", department: "" });
      fetchEmployees();
    } catch (err) {
      alert("Employee already exists or error occurred");
    }
  };

  // ==============================
  // DELETE EMPLOYEE
  // ==============================
  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete employee?")) return;

    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  // ==============================
  // CHECK IN
  // ==============================
  const handleCheckIn = async (employeeId) => {
    try {
      await API.post("/attendance/checkin", { employeeId });
      alert("Check-in successful");
    } catch {
      alert("Check-in failed");
    }
  };

  // ==============================
  // CHECK OUT
  // ==============================
  const handleCheckOut = async (employeeId) => {
    try {
      await API.post("/attendance/checkout", { employeeId });
      alert("Check-out successful");
    } catch {
      alert("Checkout failed");
    }
  };

  // ==============================
  // VIEW ATTENDANCE
  // ==============================
  const viewAttendance = async (id) => {
    const res = await API.get(`/attendance/${id}`);
    setAttendance(res.data);
    setSelectedEmp(id);
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>HRMS Lite Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= ADD FORM ================= */}
      <h2>Add Employee</h2>
      <input
        placeholder="Employee ID"
        value={form.employeeId}
        onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
      />
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Department"
        value={form.department}
        onChange={(e) => setForm({ ...form, department: e.target.value })}
      />
      <button onClick={addEmployee}>Add</button>

      {/* ================= EMPLOYEE TABLE ================= */}
      <h2>Employees</h2>
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Dept</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.employeeId}>
              <td>{emp.employeeId}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>

              <td>
                <button onClick={() => handleCheckIn(emp.employeeId)}>
                  Check In
                </button>

                <button onClick={() => handleCheckOut(emp.employeeId)}>
                  Check Out
                </button>

                <button onClick={() => viewAttendance(emp.employeeId)}>
                  View
                </button>

                <button onClick={() => deleteEmployee(emp.employeeId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ATTENDANCE ================= */}
      {selectedEmp && (
        <div style={{ marginTop: 40 }}>
          <h2>Attendance for {selectedEmp}</h2>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id}>
                  <td>{new Date(a.checkIn).toLocaleString()}</td>
                  <td>
                    {a.checkOut
                      ? new Date(a.checkOut).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
