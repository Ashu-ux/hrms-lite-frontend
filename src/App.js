import { useEffect, useState } from "react";
import API from "./api/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  // Load Employees
  const fetchEmployees = () => {
    API.get("/employees")
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error(err);
        setError("Backend connection failed.");
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🟢 Check-In Function
  const handleCheckIn = async (employeeId) => {
    try {
      const response = await API.post("/attendance/checkin", { employeeId });
      alert(`Check-in successful for ${employeeId}!`);
      console.log("Attendance Record:", response.data);
    } catch (err) {
      console.error(err);
      alert("Check-in failed. Make sure the employee exists in the database.");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>HRMS Lite - Admin Dashboard</h1>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Employee List</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
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
                <button 
                  onClick={() => handleCheckIn(emp.employeeId)}
                  style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}
                >
                  Check In
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;