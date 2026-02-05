import { useEffect, useState } from "react";
import API from "./api/api";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [dateFilter, setDateFilter] = useState("");

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: ""
  });

  // ========================
  // LOAD EMPLOYEES
  // ========================
  const fetchEmployees = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ========================
  // ADD EMPLOYEE
  // ========================
  const addEmployee = async () => {
    if (!form.employeeId || !form.name) return alert("Fill all fields");
    await API.post("/employees", form);
    setForm({ employeeId: "", name: "", email: "", department: "" });
    fetchEmployees();
  };

  // ========================
  // CHECK IN / OUT
  // ========================
  const checkIn = async (id) => {
    await API.post("/attendance/checkin", { employeeId: id });
    alert("Checked in");
  };

  const checkOut = async (id) => {
    await API.post("/attendance/checkout", { employeeId: id });
    alert("Checked out");
  };

  // ========================
  // VIEW ATTENDANCE
  // ========================
  const viewAttendance = async (id) => {
    const res = await API.get(`/attendance/${id}`);
    setAttendance(res.data);
    setSelectedEmp(id);
  };

  // ========================
  // DELETE
  // ========================
  const deleteEmployee = async (id) => {
    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  // ========================
  // FILTER BY DATE
  // ========================
  const filteredAttendance = attendance.filter((a) => {
    if (!dateFilter) return true;
    return a.checkIn.startsWith(dateFilter);
  });

  return (
    <div className="container">
      <h1>HRMS Lite Dashboard</h1>

      {/* DASHBOARD SUMMARY */}
      <div className="summary">
        <div className="card small">
          <h3>Total Employees</h3>
          <p>{employees.length}</p>
        </div>
        <div className="card small">
          <h3>Total Records</h3>
          <p>{attendance.length}</p>
        </div>
      </div>

      {/* ADD EMPLOYEE */}
      <div className="card">
        <h2>Add Employee</h2>
        <div className="form">
          <input
            placeholder="ID"
            value={form.employeeId}
            onChange={(e) =>
              setForm({ ...form, employeeId: e.target.value })
            }
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
            placeholder="Dept"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />
          <button onClick={addEmployee}>Add</button>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="card">
        <h2>Employees</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Dept</th>
              <th>Present Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const presentDays = attendance.filter(
                (a) => a.employeeId === emp.employeeId && a.checkOut
              ).length;

              return (
                <tr key={emp.employeeId}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{presentDays}</td>
                  <td>
                    <button className="green" onClick={() => checkIn(emp.employeeId)}>Check In</button>
                    <button className="orange" onClick={() => checkOut(emp.employeeId)}>Check Out</button>
                    <button onClick={() => viewAttendance(emp.employeeId)}>View</button>
                    <button className="red" onClick={() => deleteEmployee(emp.employeeId)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ATTENDANCE VIEW */}
      {selectedEmp && (
        <div className="card">
          <h2>Attendance for {selectedEmp}</h2>

          <input
            type="date"
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <table>
            <thead>
              <tr>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.checkIn).toLocaleString()}</td>
                  <td>
                    {a.checkOut
                      ? new Date(a.checkOut).toLocaleString()
                      : "-"}
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
