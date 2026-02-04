import { useEffect, useState } from "react";
import API from "./api/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/employees")
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load employees. Backend may not be running.");
        // Mock data for demonstration
        setEmployees([
          { employeeId: 1, name: "John Doe", department: "HR" },
          { employeeId: 2, name: "Jane Smith", department: "IT" }
        ]);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>HRMS Lite</h1>

      <h2>Employees</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.employeeId}>
            {emp.name} - {emp.department}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
