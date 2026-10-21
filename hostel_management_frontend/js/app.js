
/* ======================================================
   HAVEN RESIDENCE MANAGEMENT SYSTEM
   Original sample values preserved
   Browser demo storage: localStorage
   ====================================================== */

const $ = (selector, root = document) => root.querySelector(selector);
const page = document.body.dataset.page || "";

const navItems = [
  ["dashboard.html", "◫", "Dashboard", "dashboard"],
  ["students.html", "♙", "Students", "student"],
  ["hostels.html", "⌂", "Hostels", "hostel"],
  ["room-types.html", "▤", "Room Types", "room-type"],
  ["rooms.html", "⌂", "Rooms", "room"],
  ["applications.html", "▤", "Applications", "application"],
  ["allocations.html", "⇄", "Allocations", "allocation"],
  ["payments.html", "₹", "Payments", "payment"]
];

/* ---------------- ORIGINAL SAMPLE DATA ---------------- */

const seed = {
  hostel: [
    { hostelId: "1", hostelName: "Vellore Residency", hostelType: "Girls", location: "North Campus" },
    { hostelId: "2", hostelName: "Green Valley Hostel", hostelType: "Boys", location: "South Campus" },
    { hostelId: "3", hostelName: "Sapphire Hall", hostelType: "Girls", location: "East Campus" },
    { hostelId: "4", hostelName: "Cedar House", hostelType: "Boys", location: "West Campus" },
    { hostelId: "5", hostelName: "Lotus Residence", hostelType: "Girls", location: "Central Campus" },
    { hostelId: "6", hostelName: "Maple Hostel", hostelType: "Boys", location: "North Campus" },
    { hostelId: "7", hostelName: "Sunrise Hall", hostelType: "Girls", location: "East Campus" },
    { hostelId: "8", hostelName: "Oak Residency", hostelType: "Boys", location: "South Campus" },
    { hostelId: "9", hostelName: "Pearl House", hostelType: "Girls", location: "Central Campus" },
    { hostelId: "10", hostelName: "River View Hostel", hostelType: "Boys", location: "West Campus" }
  ],

  "room-type": [
    { typeId: "1", typeName: "Single", capacity: "1", hostelFee: "90000" },
    { typeId: "2", typeName: "Two Sharing", capacity: "2", hostelFee: "65000" },
    { typeId: "3", typeName: "Three Sharing", capacity: "3", hostelFee: "48000" },
    { typeId: "4", typeName: "Four Sharing", capacity: "4", hostelFee: "38000" },
    { typeId: "5", typeName: "Accessible Single", capacity: "1", hostelFee: "95000" },
    { typeId: "6", typeName: "Premium Two Sharing", capacity: "2", hostelFee: "78000" }
  ],

  student: [
    {
      name: "Aarav Sharma",
      regNo: "VIT2026012",
      email: "aarav.sharma@example.edu",
      phone: "9876543210",
      gender: "Male",
      department: "Computer Science"
    },
    {
      name: "Meera Iyer",
      regNo: "VIT2026048",
      email: "meera.iyer@example.edu",
      phone: "9876543211",
      gender: "Female",
      department: "Electronics"
    },
    {
      name: "Rohan Das",
      regNo: "VIT2026075",
      email: "rohan.das@example.edu",
      phone: "9876543212",
      gender: "Male",
      department: "Mechanical"
    }
  ],

  room: [
    {
      roomNo: "A-101",
      block: "A Block",
      roomType: "2 Sharing",
      capacity: "2",
      occupied: "1",
      status: "Partially occupied"
    },
    {
      roomNo: "A-102",
      block: "A Block",
      roomType: "Single",
      capacity: "1",
      occupied: "0",
      status: "Available"
    },
    {
      roomNo: "B-204",
      block: "B Block",
      roomType: "3 Sharing",
      capacity: "3",
      occupied: "3",
      status: "Full"
    }
  ],

  application: [
    {
      name: "Aarav Sharma",
      regNo: "VIT2026012",
      hostel: "A Block",
      roomType: "2 Sharing",
      date: "2026-10-10",
      status: "Pending"
    },
    {
      name: "Meera Iyer",
      regNo: "VIT2026048",
      hostel: "B Block",
      roomType: "Single",
      date: "2026-10-09",
      status: "Approved"
    },
    {
      name: "Rohan Das",
      regNo: "VIT2026075",
      hostel: "A Block",
      roomType: "3 Sharing",
      date: "2026-10-08",
      status: "Pending"
    }
  ],

  allocation: [
    {
      name: "Meera Iyer",
      regNo: "VIT2026048",
      hostel: "B Block",
      roomNo: "B-204",
      date: "2026-10-01",
      status: "Active"
    },
    {
      name: "Aarav Sharma",
      regNo: "VIT2026012",
      hostel: "A Block",
      roomNo: "A-101",
      date: "2026-10-04",
      status: "Active"
    },
    {
      name: "Rohan Das",
      regNo: "VIT2026075",
      hostel: "A Block",
      roomNo: "A-203",
      date: "2026-09-21",
      status: "Pending"
    }
  ],

  payment: [
    {
      name: "Meera Iyer",
      regNo: "VIT2026048",
      amount: "45000",
      date: "2026-10-01",
      method: "Online",
      status: "Paid"
    },
    {
      name: "Aarav Sharma",
      regNo: "VIT2026012",
      amount: "22500",
      date: "2026-10-05",
      method: "UPI",
      status: "Pending"
    },
    {
      name: "Rohan Das",
      regNo: "VIT2026075",
      amount: "45000",
      date: "2026-10-07",
      method: "Bank transfer",
      status: "Paid"
    }
  ]
};

/* ---------------- STORAGE ---------------- */

function getStore(key, fallback = []) {
  try {
    const saved = localStorage.getItem("haven_" + key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    console.error("Storage error:", error);
    return fallback;
  }
}

function setStore(key, value) {
  localStorage.setItem("haven_" + key, JSON.stringify(value));
}

function records(key = page) {
  return getStore(key, seed[key] || []);
}

function recordId(row) {
  return row.hostelId || row.typeId || row.regNo ||
    row.roomNo || row.name;
}

/* ---------------- UTILITIES ---------------- */

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0] || "")
    .join("")
    .toUpperCase();
}

function statusClass(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "-");
}

function dateDisplay(value) {
  if (!value) return "—";
  return escapeHtml(value);
}


function renderDashboard() {
  const students = records("student");
  const rooms = records("room");
  const applications = records("application");

  // Calculate actual bed occupancy.
  const totalCapacity = rooms.reduce(
    (sum, room) => sum + Number(room.capacity || 0), 0
  );

  const occupiedBeds = rooms.reduce(
    (sum, room) => sum + Number(room.occupied || 0), 0
  );

  const availableBeds = Math.max(0, totalCapacity - occupiedBeds);

  const occupancy = totalCapacity > 0
    ? (occupiedBeds / totalCapacity) * 100
    : 0;

  const percentage = Math.round(occupancy);

  // Update dashboard summary cards.
  if ($("#statStudents")) {
    $("#statStudents").textContent = students.length;
  }

  if ($("#statRooms")) {
    $("#statRooms").textContent = rooms.length;
  }

  if ($("#statBeds")) {
    $("#statBeds").textContent = availableBeds;
  }

  if ($("#statApplications")) {
    $("#statApplications").textContent = applications.filter(
      app => app.status.toLowerCase() === "pending"
    ).length;
  }

  // Update the occupancy donut percentage.
  if ($(".donut strong")) {
    $(".donut strong").textContent = percentage + "%";
  }

  // Update the progress bar percentage.
  if ($(".progress-caption strong")) {
    $(".progress-caption strong").textContent = percentage + "% used";
  }

  if ($(".progress > span")) {
    $(".progress > span").style.width = percentage + "%";
  }

  // Calculate room categories.
  const occupiedRooms = rooms.filter(room =>
    Number(room.occupied) >= Number(room.capacity) &&
    Number(room.capacity) > 0
  ).length;

  const partiallyFilledRooms = rooms.filter(room =>
    Number(room.occupied) > 0 &&
    Number(room.occupied) < Number(room.capacity)
  ).length;

  const emptyRooms = rooms.filter(room =>
    Number(room.occupied) === 0
  ).length;

  // Update the three legend counts.
  const legend = document.querySelectorAll(
    ".occupancy-panel .legend > div"
  );

  if (legend.length >= 3) {
    legend[0].querySelector("strong").textContent =
      occupiedRooms + " rooms";

    legend[1].querySelector("strong").textContent =
      partiallyFilledRooms + " rooms";

    legend[2].querySelector("strong").textContent =
      emptyRooms + " rooms";
  }

  // Update recent student records.
  const recent = $("#recentStudents");

  if (recent) {
    recent.innerHTML = students.slice(0, 4).map(student => {
      const allocation = records("allocation").find(item =>
        item.regNo === student.regNo &&
        item.status === "Active"
      );

      return `
        <tr>
          <td>
            <div class="student-cell">
              <span class="mini-avatar">
                ${escapeHtml(initials(student.name))}
              </span>
              <span>
                <strong>${escapeHtml(student.name)}</strong>
                <small>${escapeHtml(student.email || "")}</small>
              </span>
            </div>
          </td>
          <td>${escapeHtml(student.regNo)}</td>
          <td>${escapeHtml(allocation?.roomNo || "Not assigned")}</td>
          <td>${allocation ? "Active" : "Not allocated"}</td>
          <td>${escapeHtml(allocation?.date || "—")}</td>
        </tr>
      `;
    }).join("");
  }

  console.log({
    totalCapacity,
    occupiedBeds,
    availableBeds,
    occupancyPercentage: occupancy,
    fullRooms: occupiedRooms,
    partiallyFilledRooms,
    emptyRooms
  });
}


/* ---------------- FORM FIELDS ---------------- */

const fieldDefs = {
  hostel: [
    ["hostelId", "Hostel ID", "text", true],
    ["hostelName", "Hostel name", "text", true],
    ["hostelType", "Hostel type", "select", true, ["Girls", "Boys"]],
    ["location", "Location", "text", true]
  ],

  "room-type": [
    ["typeId", "Room Type ID", "text", true],
    ["typeName", "Room type name", "text", true],
    ["capacity", "Bed capacity", "number", true],
    ["hostelFee", "Hostel fee (₹)", "number", true]
  ],

  student: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "text", true],
    ["email", "Email address", "email", true],
    ["phone", "Phone number", "tel", true],
    ["gender", "Gender", "select", true, ["Male", "Female", "Other"]],
    ["department", "Department", "text", true]
  ],

  room: [
    ["roomNo", "Room number", "text", true],
    ["block", "Hostel", "select", true,
      records("hostel").map(h => h.hostelName)],
    ["roomType", "Room type", "select", true,
      records("room-type").map(t => t.typeName)],
    ["capacity", "Bed capacity", "number", true],
    ["occupied", "Occupied beds", "number", true],
    ["status", "Status", "select", true,
      ["Available", "Partially occupied", "Full"]]
  ],

  application: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "select", true,
      records("student").map(s => s.regNo)],
    ["hostel", "Preferred hostel", "select", true,
      records("hostel").map(h => h.hostelName)],
    ["roomType", "Room type", "select", true,
      records("room-type").map(t => t.typeName)],
    ["date", "Application date", "date", true],
    ["status", "Status", "select", true,
      ["Pending", "Approved", "Rejected", "Withdrawn"]]
  ],

  allocation: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "select", true,
      records("student").map(s => s.regNo)],
    ["hostel", "Hostel", "select", true,
      records("hostel").map(h => h.hostelName)],
    ["roomNo", "Room number", "select", true,
      records("room").map(r => r.roomNo)],
    ["date", "Allocation date", "date", true],
    ["status", "Status", "select", true,
      ["Active", "Pending", "Completed", "Cancelled"]]
  ],

  payment: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "select", true,
      records("student").map(s => s.regNo)],
    ["amount", "Amount (₹)", "number", true],
    ["date", "Payment date", "date", true],
    ["method", "Payment method", "select", true,
      ["Online", "UPI", "Cash", "Bank transfer"]],
    ["status", "Status", "select", true,
      ["Paid", "Pending", "Failed", "Refunded"]]
  ]
};

/* ---------------- REFERENTIAL INTEGRITY ---------------- */

function validateRecord(type, data, oldId = "") {
  const students = records("student");
  const hostels = records("hostel");
  const types = records("room-type");
  const rooms = records("room");
  const applications = records("application");
  const allocations = records("allocation");
  const payments = records("payment");

  if (type === "room") {
    if (!hostels.some(h => h.hostelName === data.block)) {
      return "Foreign-key error: select an existing hostel.";
    }

    const roomType = types.find(t => t.typeName === data.roomType);
    if (!roomType) {
      return "Foreign-key error: select an existing room type.";
    }

    if (Number(data.capacity) !== Number(roomType.capacity)) {
      return "Room capacity must match the selected room type.";
    }

    if (Number(data.occupied) > Number(data.capacity)) {
      return "Occupied beds cannot exceed room capacity.";
    }
  }

  if (type === "application") {
    const student = students.find(s => s.regNo === data.regNo);
    if (!student) {
      return "Foreign-key error: select an existing student.";
    }

    if (!hostels.some(h => h.hostelName === data.hostel)) {
      return "Foreign-key error: select an existing hostel.";
    }

    if (!types.some(t => t.typeName === data.roomType)) {
      return "Foreign-key error: select an existing room type.";
    }

    data.name = student.name;
  }

  if (type === "allocation") {
    const student = students.find(s => s.regNo === data.regNo);
    if (!student) {
      return "Foreign-key error: select an existing student.";
    }

    const room = rooms.find(r => r.roomNo === data.roomNo);
    if (!room) {
      return "Foreign-key error: select an existing room.";
    }

    if (room.block !== data.hostel) {
      return "The selected room does not belong to that hostel.";
    }

    const approved = applications.some(a =>
      a.regNo === data.regNo && a.status === "Approved"
    );

    if (!approved) {
      return "Approve the student's application before allocating a room.";
    }

    const duplicate = allocations.some(a =>
      a.regNo === data.regNo &&
      a.status === "Active" &&
      a.regNo !== oldId
    );

    if (duplicate) {
      return "This student already has an active allocation.";
    }

    data.name = student.name;
  }

  if (type === "payment") {
    const student = students.find(s => s.regNo === data.regNo);
    if (!student) {
      return "Foreign-key error: select an existing student.";
    }

    const hasAllocation = allocations.some(a =>
      a.regNo === data.regNo && a.status === "Active"
    );

    if (!hasAllocation) {
      return "A payment must belong to a student with an active allocation.";
    }

    if (Number(data.amount) <= 0) {
      return "Payment amount must be greater than zero.";
    }

    data.name = student.name;
  }

  return "";
}

/* ---------------- PREVENT INVALID DELETIONS ---------------- */

function deletionError(type, row) {
  const applications = records("application");
  const allocations = records("allocation");
  const payments = records("payment");
  const rooms = records("room");

  if (type === "hostel" &&
      rooms.some(r => r.block === row.hostelName)) {
    return "Cannot delete this hostel because rooms refer to it.";
  }

  if (type === "room-type" &&
      rooms.some(r => r.roomType === row.typeName)) {
    return "Cannot delete this room type because rooms refer to it.";
  }

  if (type === "room-type" &&
      applications.some(a => a.roomType === row.typeName)) {
    return "Cannot delete this room type because applications refer to it.";
  }

  if (type === "student" &&
      applications.some(a => a.regNo === row.regNo)) {
    return "Cannot delete this student because applications refer to them.";
  }

  if (type === "student" &&
      allocations.some(a => a.regNo === row.regNo)) {
    return "Cannot delete this student because allocations refer to them.";
  }

  if (type === "student" &&
      payments.some(p => p.regNo === row.regNo)) {
    return "Cannot delete this student because payments refer to them.";
  }

  if (type === "room" &&
      allocations.some(a => a.roomNo === row.roomNo)) {
    return "Cannot delete this room because an allocation refers to it.";
  }

  if (type === "application" &&
      allocations.some(a =>
        a.regNo === row.regNo && a.status === "Active")) {
    return "Cannot delete this application while an active allocation depends on it.";
  }

  if (type === "allocation" &&
      payments.some(p => p.regNo === row.regNo)) {
    return "Cannot delete this allocation while payment records depend on it.";
  }

  return "";
}

/* ---------------- RENDER TABLE ---------------- */

function renderRecords() {
  const body = $("#recordsBody");
  if (!body) return;

  const search = ($("#searchInput")?.value || "").toLowerCase().trim();
  const filter = $("#statusFilter")?.value || "";

  const rows = records().filter(row => {
    const matchesSearch = !search ||
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(search)
      );

    const filterValue = page === "hostel"
      ? row.hostelType
      : page === "room-type"
        ? ""
        : row.status;

    return matchesSearch && (!filter || filterValue === filter);
  });

  const fields = fieldDefs[page] || [];

  body.innerHTML = rows.map(row => `
    <tr>
      ${fields.map(([key]) => `
        <td>
          ${key === "status"
            ? `<span class="status ${statusClass(row[key])}">
                 ${escapeHtml(row[key] || "—")}
               </span>`
            : key === "name"
              ? `<div class="student-cell">
                   <span class="mini-avatar">${escapeHtml(initials(row.name))}</span>
                   <strong>${escapeHtml(row[key] || "—")}</strong>
                 </div>`
              : key === "hostelFee" || key === "amount"
                ? "₹ " + Number(row[key] || 0).toLocaleString("en-IN")
                : escapeHtml(row[key] ?? "—")}
        </td>
      `).join("")}
      <td>
        <div class="table-actions">
          <button type="button" class="table-action"
            data-edit="${escapeHtml(recordId(row))}">Edit</button>
          <button type="button" class="table-action delete"
            data-delete="${escapeHtml(recordId(row))}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  if ($("#recordCount")) {
    $("#recordCount").textContent =
      `${rows.length} record${rows.length === 1 ? "" : "s"}`;
  }

  $("#emptyState")?.classList.toggle("hidden", rows.length !== 0);

  body.querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.edit));
  });

  body.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => deleteRecord(button.dataset.delete));
  });
}

/* ---------------- ADD / EDIT FORM ---------------- */

function openModal(id = "") {
  const form = $("#recordForm");
  const fields = $("#formFields");
  const modal = $("#modalBackdrop");

  if (!form || !fields || !modal) return;

  const row = id
    ? records().find(r => String(recordId(r)) === String(id))
    : null;

  const labels = {
    hostel: "Hostel",
    "room-type": "Room Type",
    student: "Student",
    room: "Room",
    application: "Application",
    allocation: "Allocation",
    payment: "Payment"
  };

  $("#modalTitle").textContent =
    `${row ? "Edit" : "Add"} ${labels[page] || "Record"}`;

  fields.innerHTML = (fieldDefs[page] || []).map(
    ([key, label, type, required, options]) => {
      if (type === "select") {
        return `
          <label>${label}
            <select name="${key}" ${required ? "required" : ""}>
              <option value="">Choose ${label.toLowerCase()}</option>
              ${(options || []).map(option => `
                <option value="${escapeHtml(option)}"
                  ${String(row?.[key] ?? "") === String(option)
                    ? "selected" : ""}>
                  ${escapeHtml(option)}
                </option>
              `).join("")}
            </select>
          </label>`;
      }

      return `
        <label>${label}
          <input name="${key}" type="${type}"
            value="${escapeHtml(row?.[key] ?? "")}"
            ${required ? "required" : ""}
            ${type === "number" ? 'min="0"' : ""}>
        </label>`;
    }
  ).join("");

  form.dataset.editId = id;
  if ($("#formError")) $("#formError").textContent = "";
  modal.classList.remove("hidden");
}

function closeModal() {
  $("#modalBackdrop")?.classList.add("hidden");
}

function saveRecord(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const errorBox = $("#formError");
  const oldId = form.dataset.editId || "";

  const fail = message => {
    if (errorBox) errorBox.textContent = message;
    else alert(message);
  };

  if (errorBox) errorBox.textContent = "";

  const list = records();

  if (page === "hostel" && list.some(row =>
    (row.hostelId === data.hostelId ||
     row.hostelName.toLowerCase() === data.hostelName.toLowerCase()) &&
    row.hostelId !== oldId
  )) {
    fail("This hostel ID or name already exists.");
    return;
  }

  if (page === "room-type" && list.some(row =>
    (row.typeId === data.typeId ||
     row.typeName.toLowerCase() === data.typeName.toLowerCase()) &&
    row.typeId !== oldId
  )) {
    fail("This room type ID or name already exists.");
    return;
  }

  if (page === "student" && list.some(row =>
    row.regNo === data.regNo && row.regNo !== oldId
  )) {
    fail("This registration number already exists.");
    return;
  }

  if (page === "room" && list.some(row =>
    row.roomNo === data.roomNo && row.roomNo !== oldId
  )) {
    fail("This room number already exists.");
    return;
  }

  if (page === "room") {
    const roomType = records("room-type").find(
      t => t.typeName === data.roomType
    );

    if (!roomType) {
      fail("Select an existing room type.");
      return;
    }

    data.capacity = String(roomType.capacity);
    data.status = Number(data.occupied) === 0
      ? "Available"
      : Number(data.occupied) >= Number(data.capacity)
        ? "Full" : "Partially occupied";
  }

  const relationshipProblem = validateRecord(page, data, oldId);

  if (relationshipProblem) {
    fail(relationshipProblem);
    return;
  }

  const next = oldId
    ? list.map(row =>
        String(recordId(row)) === String(oldId) ? data : row
      )
    : [data, ...list];

  setStore(page, next);
  closeModal();
  renderRecords();
}

/* ---------------- DELETE RECORD ---------------- */

function deleteRecord(id) {
  const row = records().find(
    item => String(recordId(item)) === String(id)
  );

  if (!row) return;

  const problem = deletionError(page, row);

  if (problem) {
    alert(problem);
    return;
  }

  if (!confirm("Are you sure you want to delete this record?")) return;

  setStore(page, records().filter(
    item => String(recordId(item)) !== String(id)
  ));

  renderRecords();
}

/* ---------------- DASHBOARD ---------------- */

function renderDashboard() {
  const students = records("student");
  const rooms = records("room");
  const applications = records("application");

  const capacity = rooms.reduce(
    (sum, room) => sum + Number(room.capacity || 0), 0
  );

  const occupied = rooms.reduce(
    (sum, room) => sum + Number(room.occupied || 0), 0
  );

  const available = Math.max(0, capacity - occupied);

  if ($("#statStudents")) $("#statStudents").textContent = students.length;
  if ($("#statRooms")) $("#statRooms").textContent = rooms.length;
  if ($("#statBeds")) $("#statBeds").textContent = available;

  if ($("#statApplications")) {
    $("#statApplications").textContent = applications.filter(
      a => a.status.toLowerCase() === "pending"
    ).length;
  }

  const recent = $("#recentStudents");
  if (recent) {
    recent.innerHTML = students.slice(0, 4).map(student => {
      const allocation = records("allocation").find(a =>
        a.regNo === student.regNo && a.status === "Active"
      );

      return `
        <tr>
          <td>
            <div class="student-cell">
              <span class="mini-avatar">${escapeHtml(initials(student.name))}</span>
              <span>
                <strong>${escapeHtml(student.name)}</strong>
                <small>${escapeHtml(student.email)}</small>
              </span>
            </div>
          </td>
          <td>${escapeHtml(student.regNo)}</td>
          <td>${escapeHtml(allocation?.roomNo || "Not assigned")}</td>
          <td>${allocation ? "Active" : "Not allocated"}</td>
          <td>${dateDisplay(allocation?.date)}</td>
        </tr>`;
    }).join("");
  }

  const percentage = capacity ? Math.round(occupied / capacity * 100) : 0;

  if ($(".donut strong")) $(".donut strong").textContent = percentage + "%";
  if ($(".progress-caption strong")) {
    $(".progress-caption strong").textContent = percentage + "% used";
  }
  if ($(".progress > span")) {
    $(".progress > span").style.width = percentage + "%";
  }
}

/* ---------------- LOGIN ---------------- */

function setupLogin() {
  const form = $("#loginForm");
  if (!form) return;

  $("#togglePassword")?.addEventListener("click", () => {
    const input = $("#password");
    input.type = input.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = $("#email")?.value.trim();
    const password = $("#password")?.value;
    const message = $("#loginMessage");

    if (!email || !password) {
      if (message) message.textContent = "Please complete both fields.";
      return;
    }

    sessionStorage.setItem("haven_demo_user", email);

    if (message) message.textContent = "Opening dashboard...";

    location.href = "dashboard.html";
  });
}

/* ---------------- INITIALIZE ---------------- */

function setupPage() {
  renderSidebar();

  $("#menuToggle")?.addEventListener("click", () => {
    $("#sidebar")?.classList.toggle("open");
  });

  if (page === "dashboard") {
    renderDashboard();
    return;
  }

  if (!fieldDefs[page]) return;

  renderRecords();

  $("#searchInput")?.addEventListener("input", renderRecords);
  $("#statusFilter")?.addEventListener("change", renderRecords);
  $("#addRecordBtn")?.addEventListener("click", () => openModal());
  $("#closeModal")?.addEventListener("click", closeModal);
  $("#cancelModal")?.addEventListener("click", closeModal);

  $("#modalBackdrop")?.addEventListener("click", event => {
    if (event.target.id === "modalBackdrop") closeModal();
  });

  $("#recordForm")?.addEventListener("submit", saveRecord);
}

document.addEventListener("DOMContentLoaded", () => {
  setupLogin();
  setupPage();
});
