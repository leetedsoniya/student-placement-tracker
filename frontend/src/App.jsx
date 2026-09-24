import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [placementStatus, setPlacementStatus] = useState("");
  const [company, setCompany] = useState("");
  const [packageAmount, setPackageAmount] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/students")
      .then(response => response.json())
      .then(data => setStudents(data));
  }, []);

  const clearForm = () => {
    setName("");
    setEmail("");
    setBranch("");
    setCgpa("");
    setPlacementStatus("");
    setCompany("");
    setPackageAmount("");
    setShowForm(false);
    setEditingId(null);
  };

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      alert("Please enter student name.");
      return false;
    }

    if (!email.trim()) {
      alert("Please enter email.");
      return false;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email.");
      return false;
    }

    if (!branch.trim()) {
      alert("Please enter branch.");
      return false;
    }

    if (!cgpa || Number(cgpa) < 0 || Number(cgpa) > 10) {
      alert("CGPA must be between 0 and 10.");
      return false;
    }

    if (!placementStatus) {
      alert("Please select placement status.");
      return false;
    }

    return true;
  };

  const addStudent = () => {
    if (!validateForm()) {
      return;
    }

    const newStudent = {
      name,
      email,
      branch,
      cgpa: Number(cgpa),
      placementStatus,
      company,
      packageAmount: Number(packageAmount)
    };

    fetch("http://localhost:8080/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newStudent)
    })
      .then(response => response.json())
      .then(data => {
        setStudents([...students, data]);
        clearForm();
      });
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setBranch(student.branch);
    setCgpa(student.cgpa);
    setPlacementStatus(student.placementStatus || "");
    setCompany(student.company || "");
    setPackageAmount(student.packageAmount || "");
    setShowForm(true);
  };

  const updateStudent = () => {
    if (!validateForm()) {
      return;
    }

    const updatedStudent = {
      name,
      email,
      branch,
      cgpa: Number(cgpa),
      placementStatus,
      company,
      packageAmount: Number(packageAmount)
    };

    fetch(`http://localhost:8080/students/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedStudent)
    })
      .then(response => response.json())
      .then(data => {
        setStudents(
          students.map(student =>
            student.id === editingId ? data : student
          )
        );

        clearForm();
      });
  };

  const deleteStudent = (id) => {
    fetch(`http://localhost:8080/students/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setStudents(
          students.filter(student => student.id !== id)
        );
      });
  };

  const totalStudents = students.length;

  const placedStudents = students.filter(
    student =>
      student.placementStatus &&
      student.placementStatus.trim().toLowerCase() === "placed"
  ).length;

  const notPlacedStudents = students.filter(
    student =>
      !student.placementStatus ||
      student.placementStatus.trim().toLowerCase() !== "placed"
  ).length;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (student.placementStatus || "").trim().toLowerCase() ===
        statusFilter.trim().toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">

      <header>
        <h1>Student Placement Tracker</h1>
        <p>Manage student placement information</p>
      </header>

      <main>

        {/* Search and Filter */}
        <div className="search-filter">

          <input
            className="search-box"
            placeholder="Search student by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Students</option>
            <option value="Placed">Placed</option>
            <option value="Not Placed">Not Placed</option>
          </select>

        </div>

        {/* Summary */}
        <div className="summary">

          <div className="summary-card">
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>

          <div className="summary-card">
            <h3>Placed</h3>
            <p>{placedStudents}</p>
          </div>

          <div className="summary-card">
            <h3>Not Placed</h3>
            <p>{notPlacedStudents}</p>
          </div>

        </div>

        <div className="top-bar">
          <h2>Students</h2>

          <button onClick={() => setShowForm(true)}>
            + Add Student
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="form">

            <h3>
              {editingId ? "Edit Student" : "Add New Student"}
            </h3>

            <input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              placeholder="Branch"
              value={branch}
              onChange={e => setBranch(e.target.value)}
            />

            <input
              placeholder="CGPA"
              value={cgpa}
              onChange={e => setCgpa(e.target.value)}
            />

            <select
              value={placementStatus}
              onChange={e => setPlacementStatus(e.target.value)}
            >
              <option value="">Select Placement Status</option>
              <option value="Placed">Placed</option>
              <option value="Not Placed">Not Placed</option>
            </select>

            <input
              placeholder="Company"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />

            <input
              placeholder="Package (LPA)"
              value={packageAmount}
              onChange={e => setPackageAmount(e.target.value)}
            />

            <button
              onClick={editingId ? updateStudent : addStudent}
            >
              {editingId ? "Update Student" : "Add Student"}
            </button>

            <button onClick={clearForm}>
              Cancel
            </button>

          </div>
        )}

        {/* Students */}
        <div className="students">

          {filteredStudents.map(student => (

            <div className="student-card" key={student.id}>

              <h3>{student.name}</h3>

              <p>{student.email}</p>

              <p>Branch: {student.branch}</p>

              <p>CGPA: {student.cgpa}</p>

              <p>
                Status:{" "}
                <span
                  className={`status-badge ${
                    student.placementStatus?.trim().toLowerCase() === "placed"
                      ? "placed"
                      : "not-placed"
                  }`}
                >
                  {student.placementStatus || "Not Set"}
                </span>
              </p>

              <p>
                Company: {student.company || "Not Set"}
              </p>

              <p>
                Package: {student.packageAmount || 0} LPA
              </p>

              <button onClick={() => startEdit(student)}>
                Edit
              </button>

              <button onClick={() => deleteStudent(student.id)}>
                Delete
              </button>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default App;