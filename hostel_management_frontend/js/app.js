
/* ==========================================================
   HAVEN RESIDENCE MANAGEMENT SYSTEM
   Frontend demo version
   Data storage: browser localStorage
   A hosted Java API is required for live Oracle integration.
   ========================================================== */

const $ = (selector, root = document) => root.querySelector(selector);
const page = document.body.dataset.page || "";

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

/* ---------------- STORAGE ---------------- */

function getStore(key, fallback = []) {
  try {
    const saved = localStorage.getItem("haven_" + key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    console.error("Could not read demo data:", error);
    return fallback;
  }
}

function setStore(key, value) {
  localStorage.setItem("haven_" + key, JSON.stringify(value));
}

/* ---------------- SAMPLE DATA ---------------- */

const seed = {
  hostel: [
    { hostelId: 1, hostelName: "Vellore Residency", hostelType: "Girls", location: "North Campus" },
    { hostelId: 2, hostelName: "Green Valley Hostel", hostelType: "Boys", location: "East Campus" },
    { hostelId: 3, hostelName: "Sapphire Hall", hostelType: "Girls", location: "South Campus" },
    { hostelId: 4, hostelName: "Cedar House", hostelType: "Boys", location: "West Campus" },
    { hostelId: 5, hostelName: "Lotus Residence", hostelType: "Girls", location: "Central Campus" },
    { hostelId: 6, hostelName: "Maple Hostel", hostelType: "Boys", location: "North Campus" },
    { hostelId: 7, hostelName: "Sunrise Hall", hostelType: "Girls", location: "East Campus" },
    { hostelId: 8, hostelName: "Oak Residency", hostelType: "Boys", location: "South Campus" },
    { hostelId: 9, hostelName: "Pearl House", hostelType: "Girls", location: "West Campus" },
    { hostelId: 10, hostelName: "River View Hostel", hostelType: "Boys", location: "Central Campus" }
  ],

  "room-type": [
    { typeId: 1, typeName: "Single", capacity: 1, hostelFee: 90000 },
    { typeId: 2, typeName: "Two Sharing", capacity: 2, hostelFee: 65000 },
    { typeId: 3, typeName: "Three Sharing", capacity: 3, hostelFee: 48000 },
    { typeId: 4, typeName: "Four Sharing", capacity: 4, hostelFee: 38000 },
    { typeId: 5, typeName: "Accessible Single", capacity: 1, hostelFee: 95000 },
    { typeId: 6, typeName: "Premium Two Sharing", capacity: 2, hostelFee: 78000 }
  ],

  student: [
    ["Aarav Sharma", "STU2026001", "Computer Science", 1],
    ["Ananya Rao", "STU2026002", "Computer Science", 1],
    ["Ishaan Reddy", "STU2026003", "Information Technology", 2],
    ["Diya Nair", "STU2026004", "Electronics", 1],
    ["Arjun Kumar", "STU2026005", "Mechanical Engineering", 3],
    ["Meera Iyer", "STU2026006", "Computer Science", 2],
    ["Vivaan Patel", "STU2026007", "Electrical Engineering", 1],
    ["Saanvi Gupta", "STU2026008", "Biotechnology", 2],
    ["Aditya Verma", "STU2026009", "Computer Science", 3],
    ["Kavya Menon", "STU2026010", "Civil Engineering", 1],
    ["Reyansh Singh", "STU2026011", "Information Technology", 2],
    ["Aadhya Joshi", "STU2026012", "Computer Science", 1],
    ["Krish Malhotra", "STU2026013", "Electronics", 3],
    ["Ira Desai", "STU2026014", "Data Science", 2],
    ["Dev Shah", "STU2026015", "Mechanical Engineering", 1],
    ["Myra Kapoor", "STU2026016", "Computer Science", 2],
    ["Atharv Das", "STU2026017", "Electrical Engineering", 3],
    ["Pari Chawla", "STU2026018", "Information Technology", 1],
    ["Kabir Sethi", "STU2026019", "Computer Science", 2],
    ["Riya Bansal", "STU2026020", "Biotechnology", 1],
    ["Dhruv Mishra", "STU2026021", "Data Science", 2],
    ["Tara Kulkarni", "STU2026022", "Computer Science", 3],
    ["Rohan Pillai", "STU2026023", "Civil Engineering", 1],
    ["Nisha Thomas", "STU2026024", "Electronics", 2],
    ["Samar Khanna", "STU2026025", "Information Technology", 3],
    ["Avni Sinha", "STU2026026", "Computer Science", 1],
    ["Yash Choudhary", "STU2026027", "Mechanical Engineering", 2],
    ["Kiara Anand", "STU2026028", "Data Science", 1],
    ["Neil Fernandes", "STU2026029", "Computer Science", 3],
    ["Aisha Khan", "STU2026030", "Electrical Engineering", 2],
    ["Manav Roy", "STU2026031", "Information Technology", 1],
    ["Sara George", "STU2026032", "Computer Science", 2],
    ["Om Prakash", "STU2026033", "Civil Engineering", 3],
    ["Ishita Bose", "STU2026034", "Biotechnology", 1],
    ["Rudra Jain", "STU2026035", "Computer Science", 2],
    ["Navya Shetty", "STU2026036", "Electronics", 1],
    ["Kian Dutta", "STU2026037", "Data Science", 3],
    ["Pihu Saxena", "STU2026038", "Information Technology", 2],
    ["Zoya Ali", "STU2026039", "Computer Science", 1],
    ["Ayaan Bose", "STU2026040", "Mechanical Engineering", 2]
  ].map((s, i) => ({
    studentId: i + 1,
    regNo: s[1],
    name: s[0],
    department: s[2],
    yearOfStudy: s[3],
    phone: String(9000000001 + i),
    email: s[1].toLowerCase() + "@example.com"
  })),

  room: [],

  application: [],

  allocation: [],

  payment: []
};

/* ---------------- GENERATE MATCHING DEMO RECORDS ---------------- */

// The SQL sample contains four rooms per hostel.
// Room type IDs alternate between Single and Two Sharing.
const roomNumbers = [
  ["N-101", "N-102", "N-103", "N-104"],
  ["E-201", "E-202", "E-203", "E-204"],
  ["S-101", "S-102", "S-103", "S-104"],
  ["W-201", "W-202", "W-203", "W-204"],
  ["C-101", "C-102", "C-103", "C-104"],
  ["N-201", "N-202", "N-203", "N-204"],
  ["E-101", "E-102", "E-103", "E-104"],
  ["S-201", "S-202", "S-203", "S-204"],
  ["W-101", "W-102", "W-103", "W-104"],
  ["C-201", "C-202", "C-203", "C-204"]
];

seed.room = roomNumbers.flatMap((numbers, hostelIndex) =>
  numbers.map((roomNo, roomIndex) => {
    const roomId = hostelIndex * 4 + roomIndex + 1;
    const typeId = roomIndex % 2 === 0 ? 1 : 2;
    const type = seed["room-type"].find(t => t.typeId === typeId);

    return {
      roomId,
      hostelId: hostelIndex + 1,
      hostel: seed.hostel[hostelIndex].hostelName,
      typeId,
      roomNo,
      roomType: type.typeName,
      capacity: type.capacity,
      occupied: roomId <= 30 ? 1 : 0,
      status: roomId <= 30 ? "Partially occupied" : "Available"
    };
  })
);

seed.application = seed.student.map((student, index) => ({
  applicationId: index + 1,
  studentId: student.studentId,
  name: student.name,
  regNo: student.regNo,
  date: `2026-${index < 30 ? "06" : "07"}-${String(index < 30 ? index + 1 : index - 29).padStart(2, "0")}`,
  preferredTypeId: (index % 4) + 1,
  roomType: seed["room-type"][index % 4].typeName,
  status: index < 30 ? "APPROVED" :
    index < 36 ? "PENDING" :
    index < 38 ? "REJECTED" : "PENDING"
}));

seed.allocation = seed.application.slice(0, 30).map((application, index) => ({
  allocationId: index + 1,
  applicationId: application.applicationId,
  studentId: application.studentId,
  name: application.name,
  regNo: application.regNo,
  roomId: index + 1,
  roomNo: seed.room[index].roomNo,
  hostel: seed.hostel[seed.room[index].hostelId - 1].hostelName,
  date: "2026-07-01",
  checkInDate: "2026-07-10",
  checkOutDate: "",
  status: "ACTIVE"
}));

seed.payment = seed.allocation.map((allocation, index) => {
  const fee = [90000, 65000, 48000, 38000][index % 4];

  return {
    paymentId: index + 1,
    allocationId: allocation.allocationId,
    name: allocation.name,
    regNo: allocation.regNo,
    amount: fee,
    date: `2026-07-${String(11 + Math.floor(index / 4)).padStart(2, "0")}`,
    method: ["Online", "UPI", "Card", "Online"][index % 4],
    status: [4, 7, 11, 16, 19, 23, 27, 30].includes(index + 1)
      ? "PENDING"
      : "PAID"
  };
});

/* ---------------- HELPERS ---------------- */

function records() {
  return getStore(page, seed[page] || []);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function statusClass(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function recordId(row) {
  return row.studentId ??
    row.hostelId ??
    row.typeId ??
    row.roomId ??
    row.applicationId ??
    row.allocationId ??
    row.paymentId ??
    row.regNo ??
    row.roomNo ??
    row.name;
}

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0] || "")
    .join("")
    .toUpperCase();
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value + "T00:00:00");

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
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

  const pending = getStore("application", seed.application)
    .filter(a => String(a.status).toLowerCase() === "pending").length;

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
            ? `<span class="nav-count">${pending}</span>`
            : ""}
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
        <div>
          <strong>Administrator</strong>
          <span>Residence manager</span>
        </div>
        <a class="logout" href="login.html" title="Sign out">↗</a>
      </div>
    </div>
  `;

  $("#helpLink")?.addEventListener("click", event => {
    event.preventDefault();
    alert("Contact your project administrator for help.");
  });
}

/* ---------------- DASHBOARD ---------------- */

function renderDashboard() {
  const students = getStore("student", seed.student);
  const rooms = getStore("room", seed.room);
  const applications = getStore("application", seed.application);
  const allocations = getStore("allocation", seed.allocation);
  const payments = getStore("payment", seed.payment);

  const totalCapacity = rooms.reduce((sum, r) => sum + Number(r.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + Number(r.occupied || 0), 0);
  const availableBeds = Math.max(0, totalCapacity - occupiedBeds);

  const pending = applications.filter(
    a => String(a.status).toLowerCase() === "pending"
  ).length;

  const fullRooms = rooms.filter(r => Number(r.occupied) >= Number(r.capacity)).length;
  const partialRooms = rooms.filter(r => Number(r.occupied) > 0 && Number(r.occupied) < Number(r.capacity)).length;
  const emptyRooms = rooms.filter(r => Number(r.occupied) === 0).length;

  const percent = totalCapacity
    ? Math.round(occupiedBeds / totalCapacity * 100)
    : 0;

  if ($("#statStudents")) $("#statStudents").textContent = students.length;
  if ($("#statRooms")) $("#statRooms").textContent = rooms.length;
  if ($("#statBeds")) $("#statBeds").textContent = availableBeds;
  if ($("#statApplications")) $("#statApplications").textContent = pending;

  const footer = $(".stat-card:nth-child(2) .stat-foot");
  if (footer) {
    footer.innerHTML = `<span class="trend">${occupiedBeds} beds occupied</span>
                        <span>${totalCapacity} total beds</span>`;
  }

  if ($(".donut strong")) $(".donut strong").textContent = percent + "%";

  const legend = document.querySelectorAll(".occupancy-panel .legend > div");
  if (legend.length >= 3) {
    legend[0].querySelector("strong").textContent = fullRooms + " rooms";
    legend[1].querySelector("strong").textContent = partialRooms + " rooms";
    legend[2].querySelector("strong").textContent = emptyRooms + " rooms";
  }

  if ($(".progress-caption strong")) {
    $(".progress-caption strong").textContent = percent + "% used";
  }

  if ($(".progress > span")) {
    $(".progress > span").style.width = percent + "%";
  }

  const recentBody = $("#recentStudents");
  if (recentBody) {
    recentBody.innerHTML = students.slice(0, 4).map(student => {
      const allocation = allocations.find(a =>
        a.regNo === student.regNo &&
        String(a.status).toLowerCase() === "active"
      );

      return `
        <tr>
          <td><div class="student-cell">
            <span class="mini-avatar">${escapeHtml(initials(student.name))}</span>
            <span><strong>${escapeHtml(student.name)}</strong>
            <small>${escapeHtml(student.email)}</small></span>
          </div></td>
          <td>${escapeHtml(student.regNo)}</td>
          <td>${escapeHtml(allocation?.roomNo || "Not assigned")}</td>
          <td>${allocation ? "Active" : "Not allocated"}</td>
          <td>${escapeHtml(formatDate(allocation?.date))}</td>
        </tr>`;
    }).join("");
  }

  console.log("Haven dashboard summary", {
    students: students.length,
    hostels: getStore("hostel", seed.hostel).length,
    roomTypes: getStore("room-type", seed["room-type"]).length,
    rooms: rooms.length,
    applications: applications.length,
    allocations: allocations.length,
    payments: payments.length,
    availableBeds
  });
}

/* ---------------- FORM FIELD DEFINITIONS ---------------- */

const fieldDefs = {
  student: [
    ["studentId", "Student ID", "number", true],
    ["regNo", "Registration number", "text", true],
    ["name", "Student name", "text", true],
    ["department", "Department", "text", true],
    ["yearOfStudy", "Year of study", "number", true],
    ["phone", "Phone number", "tel", true],
    ["email", "Email address", "email", true]
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
    ["hostelFee", "Hostel fee (₹/year)", "number", true]
  ],

  room: [
    ["roomId", "Room ID", "number", true],
    ["hostelId", "Hostel ID", "number", true],
    ["typeId", "Type ID", "number", true],
    ["roomNo", "Room number", "text", true],
    ["floorNumber", "Floor number", "number", true],
    ["capacity", "Capacity", "number", true],
    ["occupied", "Occupied beds", "number", true],
    ["status", "Status", "select", true, ["Available", "Partially occupied", "Full"]]
  ],

  application: [
    ["applicationId", "Application ID", "number", true],
    ["studentId", "Student ID", "number", true],
    ["date", "Application date", "date", true],
    ["preferredTypeId", "Preferred type ID", "number", true],
    ["status", "Status", "select", true, ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"]]
  ],

  allocation: [
    ["allocationId", "Allocation ID", "number", true],
    ["applicationId", "Application ID", "number", true],
    ["roomId", "Room ID", "number", true],
    ["date", "Allocation date", "date", true],
    ["checkInDate", "Check-in date", "date", true],
    ["checkOutDate", "Check-out date", "date", false],
    ["status", "Status", "select", true, ["ACTIVE", "COMPLETED", "CANCELLED"]]
  ],

  payment: [
    ["paymentId", "Payment ID", "number", true],
    ["allocationId", "Allocation ID", "number", true],
    ["amount", "Amount (₹)", "number", true],
    ["date", "Payment date", "date", true],
    ["status", "Payment status", "select", true, ["PAID", "PENDING", "FAILED", "REFUNDED"]],
    ["method", "Payment method", "select", true, ["Online", "UPI", "Card", "Cash"]]
  ]
};

/* ---------------- TABLE RENDERING ---------------- */

function renderRecords() {
  const body = $("#recordsBody");
  if (!body) return;

  const search = ($("#searchInput")?.value || "").toLowerCase().trim();
  const filter = $("#statusFilter")?.value || "";
  const all = records();

  const rows = all.filter(record =>
    (!search || Object.values(record).some(value =>
      String(value ?? "").toLowerCase().includes(search)
    )) &&
    (!filter || String(record.status) === filter)
  );

  const keys = fieldDefs[page] || [];

  body.innerHTML = rows.map(record => `
    <tr>
      ${keys.map(([key]) => `
        <td>
          ${key === "status"
            ? `<span class="status ${statusClass(record[key])}">
                 ${escapeHtml(record[key] || "—")}
               </span>`
            : key === "name"
              ? `<div class="student-cell">
                   <span class="mini-avatar">${escapeHtml(initials(record.name))}</span>
                   <strong>${escapeHtml(record[key] || "—")}</strong>
                 </div>`
              : escapeHtml(displayValue(key, record[key]))}
        </td>
      `).join("")}
      <td>
        <div class="table-actions">
          <button type="button" class="table-action"
            data-edit="${escapeHtml(recordId(record))}">Edit</button>
          <button type="button" class="table-action delete"
            data-delete="${escapeHtml(recordId(record))}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="${keys.length + 1}">
      No records found. Use the Add button to create a record.
    </td></tr>`;
  }

  if ($("#recordCount")) {
    $("#recordCount").textContent =
      `${rows.length} record${rows.length === 1 ? "" : "s"}`;
  }

  $("#emptyState")?.classList.toggle("hidden", rows.length > 0);

  body.querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.edit));
  });

  body.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => deleteRecord(button.dataset.delete));
  });
}

/* ---------------- ADD / EDIT MODAL ---------------- */

function openModal(id = null) {
  const modal = $("#modalBackdrop");
  const form = $("#recordForm");
  const fields = $("#formFields");

  if (!modal || !form || !fields) return;

  const row = id
    ? records().find(record => String(recordId(record)) === String(id))
    : null;

  const labels = {
    student: "student",
    hostel: "hostel",
    "room-type": "room type",
    room: "room",
    application: "application",
    allocation: "allocation",
    payment: "payment"
  };

  $("#modalTitle").textContent =
    (row ? "Edit " : "Add ") + (labels[page] || "record");

  fields.innerHTML = (fieldDefs[page] || []).map(
    ([key, label, type, required, options]) => `
      <label>
        ${escapeHtml(label)}
        ${type === "select"
          ? `<select name="${key}" ${required ? "required" : ""}>
               <option value="">Choose ${escapeHtml(label.toLowerCase())}</option>
               ${options.map(option => `
                 <option value="${escapeHtml(option)}"
                   ${row && String(row[key]) === option ? "selected" : ""}>
                   ${escapeHtml(option)}
                 </option>
               `).join("")}
             </select>`
          : `<input name="${key}" type="${type}"
               value="${escapeHtml(row?.[key] ?? "")}"
               ${required ? "required" : ""}
               ${type === "number" ? 'min="0"' : ""}
               ${key === "checkOutDate" ? "" : ""}
               placeholder="Enter ${escapeHtml(label.toLowerCase())}">`
        }
      </label>
    `
  ).join("");

  form.dataset.editId = id ?? "";
  if ($("#formError")) $("#formError").textContent = "";
  modal.classList.remove("hidden");
}

function closeModal() {
  $("#modalBackdrop")?.classList.add("hidden");
}

/* ---------------- DELETE ---------------- */

function deleteRecord(id) {
  const row = records().find(
    record => String(recordId(record)) === String(id)
  );

  if (!row) {
    alert("Record not found.");
    return;
  }

  if (!confirm("Delete this record from the browser demo?")) return;

  const next = records().filter(
    record => String(recordId(record)) !== String(id)
  );

  setStore(page, next);
  renderRecords();
}

/* ---------------- SAVE / VALIDATE ---------------- */

function saveRecord(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const error = $("#formError");

  if (error) error.textContent = "";

  const fail = message => {
    if (error) error.textContent = message;
    else alert(message);
  };

  // Convert numeric fields from strings to numbers.
  for (const [key, value] of Object.entries(data)) {
    if (value !== "" && [
      "studentId", "yearOfStudy", "hostelId", "typeId",
      "capacity", "hostelFee", "roomId", "floorNumber",
      "occupied", "applicationId", "studentId",
      "preferredTypeId", "allocationId", "applicationId",
      "paymentId", "allocationId", "amount"
    ].includes(key)) {
      data[key] = Number(value);
    }
  }

  if (page === "student") {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      fail("Enter a valid email address.");
      return;
    }

    if (records().some(r =>
      r.regNo === data.regNo &&
      String(recordId(r)) !== String(form.dataset.editId)
    )) {
      fail("This registration number already exists.");
      return;
    }
  }

  if (page === "hostel" &&
      records().some(r =>
        r.hostelName.toLowerCase() === data.hostelName.toLowerCase() &&
        String(recordId(r)) !== String(form.dataset.editId)
      )) {
    fail("This hostel name already exists.");
    return;
  }

  if (page === "room-type") {
    if (Number(data.capacity) < 1 || Number(data.hostelFee) < 0) {
      fail("Capacity must be at least 1 and the fee cannot be negative.");
      return;
    }

    if (records().some(r =>
      r.typeName.toLowerCase() === data.typeName.toLowerCase() &&
      String(recordId(r)) !== String(form.dataset.editId)
    )) {
      fail("This room type already exists.");
      return;
    }
  }

  if (page === "room") {
    if (Number(data.capacity) < 1) {
      fail("Room capacity must be at least 1.");
      return;
    }

    if (Number(data.occupied) > Number(data.capacity)) {
      fail("Occupied beds cannot exceed room capacity.");
      return;
    }

    if (records().some(r =>
      r.roomNo === data.roomNo &&
      String(recordId(r)) !== String(form.dataset.editId)
    )) {
      fail("This room number already exists.");
      return;
    }

    data.status = Number(data.occupied) === 0
      ? "Available"
      : Number(data.occupied) >= Number(data.capacity)
        ? "Full"
        : "Partially occupied";
  }

  if (page === "payment" && Number(data.amount) <= 0) {
    fail("Payment amount must be greater than zero.");
    return;
  }

  const list = records();
  const id = form.dataset.editId;

  const next = id
    ? list.map(record =>
        String(recordId(record)) === String(id) ? data : record
      )
    : [data, ...list];

  setStore(page, next);
  closeModal();
  renderRecords();
}

/* ---------------- LOGIN DEMO ---------------- */

function setupLogin() {
  const form = $("#loginForm");
  if (!form) return;

  $("#togglePassword")?.addEventListener("click", () => {
    const input = $("#password");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    $("#togglePassword").textContent = show ? "Hide" : "Show";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = $("#email").value.trim();
    const password = $("#password").value;
    const message = $("#loginMessage");

    if (!email || !password) {
      message.textContent = "Please complete both fields.";
      return;
    }

    // Demo sign-in only. No server authentication is performed.
    sessionStorage.setItem("haven_demo_user", email);
    message.style.color = "#4c805c";
    message.textContent = "Demo sign-in successful. Opening dashboard…";

    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 350);
  });
}

/* ---------------- PAGE INITIALIZATION ---------------- */

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
