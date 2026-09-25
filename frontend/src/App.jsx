import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [placementStatus, setPlacementStatus] = useState("");
  const [company, setCompany] = useState("");
  const [packageAmount, setPackageAmount] = useState("");

  // Load students
  const loadStudents = () => {
    setLoading(true);

    fetch("http://localhost:8080/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load students");
        }

        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setError("");
        setLoading(false);
      })
      .catch(() => {
        setError(
          "Unable to load students. Please make sure the backend is running."
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Clear form
  const clearForm = () => {
    setName("");
    setEmail("");
    setBranch("");
    setCgpa("");
    setPlacementStatus("");
    setCompany("");
    setPackageAmount("");
    setEditingId(null);
    setShowForm(false);
  };

  // Validation
  const validateForm = () => {
    if (!name.trim()) {
      alert("Please enter student name.");
      return false;
    }

    if (!email.trim()) {
      alert("Please enter email.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
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

    if (placementStatus === "Placed" && !company.trim()) {
      alert("Please enter company name for placed student.");
      return false;
    }

    if (packageAmount && Number(packageAmount) < 0) {
      alert("Package cannot be negative.");
      return false;
    }

    return true;
  };

  // Add student
  const addStudent = () => {
    if (!validateForm()) {
      return;
    }

    const newStudent = {
      name: name.trim(),
      email: email.trim(),
      branch: branch.trim(),
      cgpa: Number(cgpa),
      placementStatus: placementStatus,
      company: company.trim(),
      packageAmount: packageAmount ? Number(packageAmount) : 0
    };

    fetch("http://localhost:8080/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newStudent)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add student");
        }

        return response.json();
      })
      .then((data) => {
        setStudents((previousStudents) => [
          ...previousStudents,
          data
        ]);

        clearForm();
      })
      .catch(() => {
        alert("Unable to add student.");
      });
  };

  // Start editing
  const startEdit = (student) => {
    setEditingId(student.id);

    setName(student.name || "");
    setEmail(student.email || "");
    setBranch(student.branch || "");
    setCgpa(student.cgpa ?? "");
    setPlacementStatus(student.placementStatus || "");
    setCompany(student.company || "");
    setPackageAmount(student.packageAmount ?? "");

    setShowForm(true);
  };

  // Update student
  const updateStudent = () => {
    if (!validateForm()) {
      return;
    }

    if (!editingId) {
      alert("No student selected for editing.");
      return;
    }

    const updatedStudent = {
      name: name.trim(),
      email: email.trim(),
      branch: branch.trim(),
      cgpa: Number(cgpa),
      placementStatus: placementStatus,
      company: company.trim(),
      packageAmount: packageAmount ? Number(packageAmount) : 0
    };

    fetch(`http://localhost:8080/students/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedStudent)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update student");
        }

        return response.json();
      })
      .then((updatedStudentFromServer) => {
        setStudents((previousStudents) =>
          previousStudents.map((student) =>
            student.id === editingId
              ? updatedStudentFromServer
              : student
          )
        );

        clearForm();
      })
      .catch((error) => {
        console.error(error);
        alert("Unable to update student.");
      });
  };

  // Delete student
  const deleteStudent = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(`http://localhost:8080/students/${id}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete student");
        }

        setStudents((previousStudents) =>
          previousStudents.filter((student) => student.id !== id)
        );
      })
      .catch(() => {
        alert("Unable to delete student.");
      });
  };

  // Summary
  const totalStudents = students.length;

  const placedStudents = students.filter(
    (student) =>
      student.placementStatus &&
      student.placementStatus.trim().toLowerCase() === "placed"
  ).length;

  const notPlacedStudents = students.filter(
    (student) =>
      !student.placementStatus ||
      student.placementStatus.trim().toLowerCase() !== "placed"
  ).length;

  // Search + filter
  const filteredStudents = students.filter((student) => {
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

        {loading && <p>Loading students...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <>

            {/* Search and Filter */}

            <div className="search-filter">

              <input
                className="search-box"
                placeholder="Search student by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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

            {/* Top Bar */}

            <div className="top-bar">

              <h2>Students</h2>

              <button
                onClick={() => {
                  clearForm();
                  setShowForm(true);
                }}
              >
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
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  placeholder="Branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="CGPA"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                />

                <select
                  value={placementStatus}
                  onChange={(e) =>
                    setPlacementStatus(e.target.value)
                  }
                >
                  <option value="">
                    Select Placement Status
                  </option>

                  <option value="Placed">
                    Placed
                  </option>

                  <option value="Not Placed">
                    Not Placed
                  </option>
                </select>

                <input
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Package (LPA)"
                  value={packageAmount}
                  onChange={(e) =>
                    setPackageAmount(e.target.value)
                  }
                />

                <button
                  onClick={
                    editingId
                      ? updateStudent
                      : addStudent
                  }
                >
                  {editingId
                    ? "Update Student"
                    : "Add Student"}
                </button>

                <button onClick={clearForm}>
                  Cancel
                </button>

              </div>
            )}

            {/* Student Cards */}

            <div className="students">

              {filteredStudents.length === 0 && (
                <p>No students found.</p>
              )}

              {filteredStudents.map((student) => (

                <div
                  className="student-card"
                  key={student.id}
                >

                  <h3>{student.name}</h3>

                  <p>{student.email}</p>

                  <p>
                    Branch: {student.branch}
                  </p>

                  <p>
                    CGPA: {student.cgpa}
                  </p>

                  <p>
                    Status:{" "}

                    <span
                      className={`status-badge ${
                        student.placementStatus
                          ?.trim()
                          .toLowerCase() === "placed"
                          ? "placed"
                          : "not-placed"
                      }`}
                    >
                      {student.placementStatus ||
                        "Not Set"}
                    </span>
                  </p>

                  <p>
                    Company:{" "}
                    {student.company || "Not Set"}
                  </p>

                  <p>
                    Package:{" "}
                    {student.packageAmount || 0} LPA
                  </p>

                  <button
                    onClick={() =>
                      startEdit(student)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteStudent(student.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          </>
        )}

      </main>

    </div>
  );
}

export default App;