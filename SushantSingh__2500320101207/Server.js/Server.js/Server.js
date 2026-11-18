const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let leaves = [
    { id: 701, employeeName: "Ananya Singh", employeeCode: "EMP101", leaveType: "Casual", days: 2, status: "Pending" },
    { id: 702, employeeName: "Rahul Verma", employeeCode: "EMP102", leaveType: "Sick", days: 1, status: "Approved" },
    { id: 703, employeeName: "Simran Kaur", employeeCode: "EMP103", leaveType: "Earned", days: 3, status: "Rejected" }
];


const validLeaveTypes = ["Casual", "Sick", "Earned"];
const validStatuses = ["Pending", "Approved", "Rejected"];


function validateLeaveData(data) {
    const { employeeName, employeeCode, leaveType, days, status } = data;
    
    if (!employeeName || typeof employeeName !== 'string' || employeeName.trim() === '') {
        return "Valid employeeName is required.";
    }
    if (!employeeCode || typeof employeeCode !== 'string' || employeeCode.trim() === '') {
        return "Valid employeeCode is required.";
    }
    if (!validLeaveTypes.includes(leaveType)) {
        return "leaveType must be one of: Casual, Sick, or Earned.";
    }
    if (!Number.isInteger(days) || days <= 0) {
        return "days must be a positive integer.";
    }
    if (!validStatuses.includes(status)) {
        return "status must be one of: Pending, Approved, or Rejected.";
    }
    return null;
}


app.get('/api/leaves', (req, res) => {
    res.status(200).json(leaves);
});


app.get('/api/leaves/filter', (req, res) => {
    const { status } = req.query;
    if (!status) {
        return res.status(400).json({ message: "Status query parameter is required" });
    }
    const filtered = leaves.filter(
        leave => leave.status.toLowerCase() === status.toLowerCase()
    );
    res.status(200).json(filtered);
});


app.get('/api/leaves/pending', (req, res) => {
    const pendingLeaves = leaves.filter(leave => leave.status === "Pending");
    res.status(200).json(pendingLeaves);
});

app.get('/api/leaves/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const leave = leaves.find(item => item.id === id);
    
    if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json(leave);
});


app.post('/api/leaves', (req, res) => {
    const error = validateLeaveData(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

   
    const newId = leaves.length > 0 ? Math.max(...leaves.map(l => l.id)) + 1 : 701;

    const newLeave = {
        id: newId,
        employeeName: req.body.employeeName,
        employeeCode: req.body.employeeCode,
        leaveType: req.body.leaveType,
        days: req.body.days,
        status: req.body.status
    };

    leaves.push(newLeave);
    res.status(201).json(newLeave);
});

app.put('/api/leaves/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = leaves.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Leave request not found" });
    }

    const error = validateLeaveData(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    leaves[index] = {
        id: id,
        employeeName: req.body.employeeName,
        employeeCode: req.body.employeeCode,
        leaveType: req.body.leaveType,
        days: req.body.days,
        status: req.body.status
    };

    res.status(200).json(leaves[index]);
});


app.delete('/api/leaves/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = leaves.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Leave request not found" });
    }

    leaves.splice(index, 1);
    res.status(200).json({ message: `Leave request with ID ${id} deleted successfully.` });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
