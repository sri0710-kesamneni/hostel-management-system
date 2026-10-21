
/* =========================================================
   HAVEN RESIDENCE MANAGEMENT SYSTEM
   Frontend demonstration data only.
   Oracle integration requires a running Java backend.
   ========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const page = document.body.dataset.page || "";
const DATA_VERSION = "haven-demo-v3";

/* ---------------- NAVIGATION ---------------- */

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

/* ---------------- MASTER SAMPLE DATA ---------------- */

const hostels = [
  ["Vellore Residency", "Girls", "North Campus"],
  ["Green Valley Hostel", "Boys", "East Campus"],
  ["Sapphire Hall", "Girls", "South Campus"],
  ["Cedar House", "Boys", "West Campus"],
  ["Lotus Residence", "Girls", "Central Campus"],
  ["Maple Hostel", "Boys", "North Campus"],
  ["Sunrise Hall", "Girls", "East Campus"],
  ["Oak Residency", "Boys", "South Campus"],
  ["Pearl House", "Girls", "Central Campus"],
  ["River View Hostel", "Boys", "West Campus"]
].map((h, i) => ({
  hostelId: i + 1,
  hostelName: h[0],
  hostelType: h[1],
  location: h[2]
}));

const roomTypes = [
  ["Single", 1, 90000],
  ["Two Sharing", 2, 65000],
  ["Three Sharing", 3, 48000],
  ["Four Sharing", 4, 38000],
  ["Accessible Single", 1, 95000],
  ["Premium Two Sharing", 2, 78000]
].map((t, i) => ({
  typeId: i + 1,
  typeName: t[0],
  capacity: t[1],
  hostelFee: t[2]
}));

const departments = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Data Science",
  "Biotechnology"
];

const firstNames = [
  "Aarav", "Ananya", "Ishaan", "Diya", "Arjun",
  "Meera", "Vivaan", "Saanvi", "Aditya", "Kavya",
  "Reyansh", "Aadhya", "Krish", "Ira", "Dev",
  "Myra", "Atharv", "Pari", "Kabir", "Riya",
  "Dhruv", "Tara", "Rohan", "Nisha", "Samar",
  "Avni", "Yash", "Kiara", "Neil", "Aisha",
  "Manav", "Sara", "Om", "Ishita", "Rudra",
  "Navya", "Kian", "Pihu", "Zoya", "Ayaan"
];

const lastNames = [
  "Sharma", "Rao", "Reddy", "Nair", "Kumar",
  "Iyer", "Patel", "Gupta", "Verma", "Menon",
  "Singh", "Joshi", "Malhotra", "Desai", "Shah",
  "Kapoor", "Das", "Chawla", "Sethi", "Bansal",
  "Mishra", "Kulkarni", "Pillai", "Thomas", "Khanna",
  "Sinha", "Choudhary", "Anand", "Fernandes", "Khan",
  "Roy", "George", "Prakash", "Bose", "Jain",
  "Shetty", "Dutta", "Saxena", "Ali", "Paul"
];

const students = firstNames.map((first, i) => {
  const regNo = "STU2026" + String(i + 1).padStart(4, "0");
  const name = first + " " + lastNames[i];

  return {
    studentId: i + 1,
    regNo,
    name,
    department: departments[i % departments.length],
    yearOfStudy: (i % 4) + 1,
    phone: String(9000000001 + i),
    email: regNo.toLowerCase() + "@example.com"
  };
});

/* ---------------- ROOMS ---------------- */

const rooms = [];
const roomPrefixes = ["N", "E", "S", "W", "C"];

for (let i = 0; i < 40; i++) {
  const hostelId = Math.floor(i / 4) + 1;
  const localRoom = (i % 4) + 1;
  const typeId = (i % 4) + 1;
  const type = roomTypes.find(t => t.typeId === typeId);
  const prefix = roomPrefixes[(hostelId - 1) % roomPrefixes.length];
  const floorNumber = localRoom <= 2 ? 1 : 2;

  rooms.push({
    roomId: i + 1,
    hostelId,
    typeId,
    roomNo: `${prefix}${floorNumber}${String(localRoom).padStart(2, "0")}`,
    floorNumber
  });
}

/* ---------------- APPLICATIONS ---------------- */

const applications = students.map((student, i) => ({
  applicationId: i + 1,
  studentId: student.studentId,
  name: student.name,
  regNo: student.regNo,
  hostelId: (i % 10) + 1,
  hostel: hostels[i % 10].hostelName,
  preferredTypeId: (i % 4) + 1,
  roomType: roomTypes[i % 4].typeName,
  date: `2026-${i < 30 ? "06" : "07"}-${String((i % 28) + 1).padStart(2, "0")}`,
  status: i < 30 ? "APPROVED" :
    i < 36 ? "PENDING" :
    i < 38 ? "REJECTED" : "WITHDRAWN"
}));

/* ---------------- ALLOCATIONS ---------------- */

const allocations = applications.slice(0, 30).map((app, i) => {
  const room = rooms[i];
  const hostel = hostels.find(h => h.hostelId === room.hostelId);

  return {
    allocationId: i + 1,
    applicationId: app.applicationId,
    roomId: room.roomId,
    studentId: app.studentId,
    name: app.name,
    regNo: app.regNo,
    hostelId: hostel.hostelId,
    hostel: hostel.hostelName,
    roomNo: room.roomNo,
    date: "2026-07-01",
    checkInDate: "2026-07-10",
    checkOutDate: "",
    status: "ACTIVE"
  };
});

/* ---------------- PAYMENTS ---------------- */

const payments = allocations.map((allocation, i) => {
  const app = applications.find(
    a => a.applicationId === allocation.applicationId
  );
  const type = roomTypes.find(t => t.typeId === app.preferredTypeId);

  return {
    paymentId: i + 1,
    allocationId: allocation.allocationId,
    name: allocation.name,
    regNo: allocation.regNo,
    amount: type.hostelFee,
    date: `2026-07-${String((i % 28) + 1).padStart(2, "0")}`,
    method: ["Online", "UPI", "Card", "Cash"][i % 4],
    status: [4, 7, 11, 16, 19, 23, 27, 30].includes(i + 1)
      ? "PENDING" : "PAID"
  };
});

/* ---------------- SEED DATA ---------------- */

const seed = {
  student: students,
  hostel: hostels,
  "room-type": roomTypes,
  room: rooms.map((room, i) => {
    const type = roomTypes.find(t => t.typeId === room.typeId);
    const hostel = hostels.find(h => h.hostelId === room.hostelId);
    const occupied = i < 30 ? Math.min(1, type.capacity) : 0;

    return {
      ...room,
      hostel: hostel.hostelName,
      roomType: type.typeName,
      capacity: type.capacity,
      occupied,
      status: occupied === 0 ? "Available" :
        occupied >= type.capacity ? "Full" : "Partially occupied"
    };
  }),
  application: applications,
  allocation: allocations,
  payment: payments
};

/* ---------------- STORAGE INITIALIZATION ---------------- */

function initializeDemoData() {
  try {
    if (localStorage.getItem("haven_data_version") !== DATA_VERSION) {
      Object.keys(seed).forEach(key => {
        localStorage.setItem("haven_" + key, JSON.stringify(seed[key]));
      });
      localStorage.setItem("haven_data_version", DATA_VERSION);
    }
  } catch (error) {
    console.error("Demo data could not be initialized:", error);
  }
}

function getStore(key) {
  try {
    const saved = localStorage.getItem("haven_" + key);
    return saved === null ? (seed[key] || []) : JSON.parse(saved);
  } catch (error) {
    console.error("Could not read " + key, error);
    return seed[key] || [];
  }
}

function setStore(key, value) {
  localStorage.setItem("haven_" + key, JSON.stringify(value));
}

/* ---------------- HELPERS ---------------- */

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[ch]);
}

function statusClass(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "-");
}

function recordId(row) {
  return row.studentId ?? row.hostelId ?? row.typeId ??
    row.roomId ?? row.applicationId ?? row.allocationId ??
    row.paymentId ?? row.regNo ?? row.roomNo;
}

function initials(name) {
  return String(name || "?").split(/\s+/).slice(0, 2)
    .map(part => part[0] || "").join("").toUpperCase();
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? value :
    d.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
}

function displayValue(key, value) {
  if (["amount", "hostelFee"].includes(key)) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
  }
  if (["date", "checkInDate", "checkOutDate"].includes(key)) {
    return formatDate(value);
  }
  return value ?? "—";
}

/* ---------------- SIDEBAR ---------------- */

function renderSidebar() {
  const sidebar = $("#sidebar");
  if (!sidebar) return;

  const pending = getStore("application").filter(
    a => String(a.status).toLowerCase() === "pending"
  ).length;

  sidebar.innerHTML = `
    <a class="brand" href="dashboard.html">
      <span class="brand-mark">H</span>
      <span>haven<span class="brand-dot">.</span></span>
    </a>
    <div class="nav-label">WORKSPACE</div>
    <nav class="nav-list">
      ${navItems.map(([href, icon, label, key]) => `
        <a class="nav-link ${page === key ? "active" : ""}" href="${href}">
          <span class="nav-icon">${icon}</span>
          <span>${label}</span>
          ${key === "application" && pending
            ? `<span class="nav-count">${pending}</span>` : ""}
        </a>
      `).join("")}
    </nav>
    <div class="sidebar-bottom">
      <div class="help-card">
        <strong>Need a hand?</strong>
        <p>Find tips for managing your residence and student records.</p>
        <a href="#" id="helpLink">Visit help centre ↗</a>
      </div>
      <div class="sidebar-user">
        <div class="avatar">AD</div>
        <div><strong>Administrator</strong><span>Residence manager</span></div>
        <a class="logout" href="login.html" title="Sign out">↗</a>
      </div>
    </div>`;

  $("#helpLink")?.addEventListener("click", event => {
    event.preventDefault();
    alert("Contact your project administrator for help.");
  });
}

/* ---------------- DASHBOARD ---------------- */

function renderDashboard() {
  const students = getStore("student");
  const rooms = getStore("room");
  const applications = getStore("application");
  const allocations = getStore("allocation");
  const payments = getStore("payment");

  const totalBeds = rooms.reduce((n, r) => n + Number(r.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((n, r) => n + Number(r.occupied || 0), 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const pending = applications.filter(
    a => String(a.status).toLowerCase() === "pending"
  ).length;

  if ($("#statStudents")) $("#statStudents").textContent = students.length;
  if ($("#statRooms")) $("#statRooms").textContent = rooms.length;
  if ($("#statBeds")) $("#statBeds").textContent = availableBeds;
  if ($("#statApplications")) $("#statApplications").textContent = pending;

  // Update the existing cards by their visible labels if they lack IDs.
  document.querySelectorAll(".stat-card").forEach(card => {
    const label = (card.querySelector(".stat-label, .stat-title, p")?.textContent ||
      card.textContent).toLowerCase();

    const value = card.querySelector(".stat-value, h2, h3, .stat-number");

    if (!value) return;
    if (label.includes("total students")) value.textContent = students.length;
    if (label.includes("total rooms")) value.textContent = rooms.length;
    if (label.includes("available beds")) value.textContent = availableBeds;
    if (label.includes("pending applications")) value.textContent = pending;
  });

  const recentBody = $("#recentStudents");
  if (recentBody) {
    recentBody.innerHTML = students.slice(0, 4).map(student => {
      const allocation = allocations.find(a =>
        a.studentId === student.studentId &&
        String(a.status).toLowerCase() === "active"
      );

      return `<tr>
        <td><div class="student-cell">
          <span class="mini-avatar">${escapeHtml(initials(student.name))}</span>
          <span><strong>${escapeHtml(student.name)}</strong>
          <small>${escapeHtml(student.email)}</small></span>
        </div></td>
        <td>${escapeHtml(student.regNo)}</td>
        <td>${escapeHtml(allocation?.roomNo || "Not assigned")}</td>
        <td>${escapeHtml(allocation ? "Active" : "Not allocated")}</td>
        <td>${escapeHtml(formatDate(allocation?.date))}</td>
      </tr>`;
    }).join("");
  }

  const total = totalBeds ? Math.round(occupiedBeds / totalBeds * 100) : 0;
  if ($(".donut strong")) $(".donut strong").textContent = total + "%";
  if ($(".progress-caption strong")) {
    $(".progress-caption strong").textContent = total + "% used";
  }
  if ($(".progress > span")) $(".progress > span").style.width = total + "%";

  console.log("Haven demo counts", {
    students: students.length,
    hostels: getStore("hostel").length,
    roomTypes: getStore("room-type").length,
    rooms: rooms.length,
    applications: applications.length,
    allocations: allocations.length,
    payments: payments.length,
    totalBeds, occupiedBeds, availableBeds, pendingApplications: pending
  });
}

/* ---------------- TABLE FIELD DEFINITIONS ---------------- */

const fieldDefs = {
  student: [
    ["studentId", "Student ID", "number", true],
    ["regNo", "Registration number", "text", true],
    ["name", "Student name", "text", true],
    ["department", "Department", "text", true],
    ["yearOfStudy", "Year of study", "number", true],
    ["phone", "Phone", "tel", true],
    ["email", "Email", "email", true]
  ],
  hostel: [
    ["hostelId", "Hostel ID", "number", true],
    ["hostelName", "Hostel name", "text", true],
    ["hostelType", "Hostel type", "select", true, ["Girls", "Boys"]],
    ["location", "Location", "text", true]
  ],
  "room-type": [
    ["typeId", "Type ID", "number", true],
    ["typeName", "Type name", "text", true],
    ["capacity", "Capacity", "number", true],
    ["hostelFee", "Hostel fee (₹)", "number", true]
  ],
  room: [
    ["roomId", "Room ID", "number", true],
    ["hostelId", "Hostel ID", "number", true],
    ["typeId", "Type ID", "number", true],
    ["roomNo", "Room number", "text", true],
    ["floorNumber", "Floor number", "number", true],
    ["capacity", "Capacity", "number", true],
    ["occupied", "Occupied beds", "number", true],
    ["status", "Status", "select", true,
      ["Available", "Partially occupied", "Full"]]
  ],
  application: [
    ["applicationId", "Application ID", "number", true],
    ["studentId", "Student ID", "number", true],
    ["hostelId", "Preferred hostel ID", "number", true],
    ["preferredTypeId", "Room type ID", "number", true],
    ["date", "Application date", "date", true],
    ["status", "Status", "select", true,
      ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"]]
  ],
  allocation: [
    ["allocationId", "Allocation ID", "number", true],
    ["applicationId", "Application ID", "number", true],
    ["roomId", "Room ID", "number", true],
    ["date", "Allocation date", "date", true],
    ["checkInDate", "Check-in date", "date", true],
    ["checkOutDate", "Check-out date", "date", false],
    ["status", "Status", "select", true,
      ["ACTIVE", "COMPLETED", "CANCELLED"]]
  ],
  payment: [
    ["paymentId", "Payment ID", "number", true],
    ["allocationId", "Allocation ID", "number", true],
    ["amount", "Amount (₹)", "number", true],
    ["date", "Payment date", "date", true],
    ["status", "Payment status", "select", true,
      ["PAID", "PENDING", "FAILED", "REFUNDED"]],
    ["method", "Payment method", "select", true,
      ["Online", "UPI", "Card", "Cash"]]
  ]
};

/* ---------------- RECORD TABLE ---------------- */

function records() {
  return getStore(page);
}

function renderRecords() {
  const body = $("#recordsBody");
  if (!body) return;

  const query = ($("#searchInput")?.value || "").toLowerCase().trim();
  const filter = $("#statusFilter")?.value || "";
  const fields = fieldDefs[page] || [];

  const visible = records().filter(record => {
    const matchesSearch = !query ||
      Object.values(record).some(value =>
        String(value ?? "").toLowerCase().includes(query)
      );

    const matchesFilter = !filter ||
      String(page === "hostel" ? record.hostelType : record.status) === filter;

    return matchesSearch && matchesFilter;
  });

  body.innerHTML = visible.map(record => `
    <tr>
      ${fields.map(([key]) => `<td>${
        key === "status"
          ? `<span class="status ${statusClass(record[key])}">${escapeHtml(record[key])}</span>`
          : key === "name"
            ? `<div class="student-cell"><span class="mini-avatar">${escapeHtml(initials(record.name))}</span><strong>${escapeHtml(record.name)}</strong></div>`
            : escapeHtml(displayValue(key, record[key]))
      }</td>`).join("")}
      <td><div class="table-actions">
        <button type="button" class="table-action" data-edit="${escapeHtml(recordId(record))}">Edit</button>
        <button type="button" class="table-action delete" data-delete="${escapeHtml(recordId(record))}">Delete</button>
      </div></td>
    </tr>`).join("");

  if (!visible.length) {
    body.innerHTML = `<tr><td colspan="${fields.length + 1}">No matching records. Try another search or add a record.</td></tr>`;
  }

  if ($("#recordCount")) {
    $("#recordCount").textContent =
      `${visible.length} record${visible.length === 1 ? "" : "s"}`;
  }

  body.querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.edit));
  });

  body.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => deleteRecord(button.dataset.delete));
  });
}

/* ---------------- ADD / EDIT ---------------- */

function openModal(id = null) {
  const modal = $("#modalBackdrop");
  const form = $("#recordForm");
  const fields = $("#formFields");
  if (!modal || !form || !fields) return;

  const old = id == null ? null : records().find(
    record => String(recordId(record)) === String(id)
  );

  const titles = {
    student: "student",
    hostel: "hostel",
    "room-type": "room type",
    room: "room",
    application: "application",
    allocation: "allocation",
    payment: "payment"
  };

  $("#modalTitle").textContent =
    (old ? "Edit " : "Add ") + (titles[page] || "record");

  fields.innerHTML = fieldDefs[page].map(
    ([key, label, type, required, options]) => `
      <label>${escapeHtml(label)}
        ${type === "select"
          ? `<select name="${key}" ${required ? "required" : ""}>
              ${options.map(option => `<option value="${escapeHtml(option)}"
                ${old && String(old[key]) === option ? "selected" : ""}>
                ${escapeHtml(option)}</option>`).join("")}
             </select>`
          : `<input name="${key}" type="${type}"
              value="${escapeHtml(old?.[key] ?? "")}"
              ${required ? "required" : ""}
              ${type === "number" ? 'min="0"' : ""}>`}
      </label>`
  ).join("");

  form.dataset.editId = id ?? "";
  if ($("#formError")) $("#formError").textContent = "";
  modal.classList.remove("hidden");
}

function closeModal() {
  $("#modalBackdrop")?.classList.add("hidden");
}

function deleteRecord(id) {
  const list = records();
  const record = list.find(r => String(recordId(r)) === String(id));
  if (!record) return;

  if (!confirm("Delete this record from the demo website?")) return;

  setStore(page, list.filter(r => String(recordId(r)) !== String(id)));
  renderRecords();
}

function saveRecord(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const error = $("#formError");
  if (error) error.textContent = "";

  const data = Object.fromEntries(new FormData(form).entries());
  const numberFields = new Set([
    "studentId", "yearOfStudy", "hostelId", "typeId", "capacity",
    "hostelFee", "roomId", "floorNumber", "occupied",
    "applicationId", "preferredTypeId", "allocationId", "paymentId",
    "amount"
  ]);

  Object.keys(data).forEach(key => {
    if (numberFields.has(key) && data[key] !== "") {
      data[key] = Number(data[key]);
    }
  });

  const fail = message => {
    if (error) error.textContent = message;
    else alert(message);
  };

  if (page === "room-type" &&
      (data.capacity < 1 || data.hostelFee < 0)) {
    fail("Capacity must be at least 1 and fee cannot be negative.");
    return;
  }

  if (page === "room" &&
      (data.capacity < 1 || data.occupied > data.capacity)) {
    fail("Check the capacity and occupied-bed values.");
    return;
  }

  if (page === "payment" && data.amount <= 0) {
    fail("Payment amount must be greater than zero.");
    return;
  }

  const list = records();
  const editId = form.dataset.editId;

  const idKey = {
    student: "studentId",
    hostel: "hostelId",
    "room-type": "typeId",
    room: "roomId",
    application: "applicationId",
    allocation: "allocationId",
    payment: "paymentId"
  }[page];

  const duplicate = list.some(record =>
    String(record[idKey]) === String(data[idKey]) &&
    String(recordId(record)) !== String(editId)
  );

  if (duplicate) {
    fail("This ID already exists. Please use a different ID.");
    return;
  }

  const updated = editId
    ? list.map(record =>
        String(recordId(record)) === String(editId) ? data : record
      )
    : [data, ...list];

  setStore(page, updated);
  closeModal();
  renderRecords();
}

/* ---------------- LOGIN DEMO ---------------- */

function setupLogin() {
  const form = $("#loginForm");
  if (!form) return;

  $("#togglePassword")?.addEventListener("click", () => {
    const input = $("#password");
    input.type = input.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!$("#email")?.value.trim() || !$("#password")?.value) {
      if ($("#loginMessage")) {
        $("#loginMessage").textContent = "Enter your email and password.";
      }
      return;
    }

    // Demonstration only; this is not secure server authentication.
    sessionStorage.setItem("haven_demo_user", $("#email").value.trim());
    window.location.href = "dashboard.html";
  });
}

/* ---------------- INITIALIZATION ---------------- */

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
  $("#recordForm")?.addEventListener("submit", saveRecord);

  $("#modalBackdrop")?.addEventListener("click", event => {
    if (event.target.id === "modalBackdrop") closeModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDemoData();
  setupLogin();
  setupPage();
});
