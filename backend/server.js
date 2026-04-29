const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin:"*"
}));
app.use(express.json());



// ==============================
// ROOT TEST
// ==============================
app.get("/", (req, res) => {
  res.send("HRMS Lite Backend is running");
});

 

//  Add Employee
app.post("/employees", async (req, res) => {
  try {
    const { employeeId, name, email, department } = req.body;

    if (!employeeId || !name || !email || !department) {
      return res.status(400).json({ error: "All fields required" });
    }

    const employee = await prisma.employee.create({
      data: { employeeId, name, email, department }
    });

    res.status(201).json(employee);

  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Employee already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

//  Get all employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { name: "asc" }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

//  Delete employee
app.delete("/employees/:id", async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { employeeId: req.params.id }
    });

    res.json({ message: "Employee deleted" });

  } catch {
    res.status(404).json({ error: "Employee not found" });
  }
});


// ==============================
// ATTENDANCE ROUTES
// ==============================

//  Check-in
app.post("/attendance/checkin", async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID required" });
    }

    const record = await prisma.attendance.create({
      data: {
        employeeId,
        checkIn: new Date()
      }
    });

    res.status(201).json(record);

  } catch (error) {
    res.status(500).json({ error: "Check-in failed" });
  }
});

//  Check-out
app.post("/attendance/checkout", async (req, res) => {
  try {
    const { employeeId } = req.body;

    const active = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkOut: null
      },
      orderBy: { checkIn: "desc" }
    });

    if (!active) {
      return res.status(404).json({ error: "No active check-in found" });
    }

    const updated = await prisma.attendance.update({
      where: { id: active.id },
      data: { checkOut: new Date() }
    });

    res.json(updated);

  } catch {
    res.status(500).json({ error: "Checkout failed" });
  }
});

//  Get attendance by employee
app.get("/attendance/:employeeId", async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { employeeId: req.params.employeeId },
      orderBy: { checkIn: "desc" }
    });

    res.json(records);

  } catch {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});


// ==============================
// SERVER START
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
