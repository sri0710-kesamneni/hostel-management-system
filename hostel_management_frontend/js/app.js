
/* Haven Residence Management System
   Frontend demo storage: browser localStorage.
   This version calculates dashboard figures from saved demo records.
   A hosted Java API is required for live Oracle database results.
*/

const $ = (selector, root = document) => root.querySelector(selector);
const page = document.body.dataset.page || "";

const navItems = [
  ["dashboard.html", "◫", "Dashboard", "dashboard"],
  ["students.html", "♙", "Students", "student"],
  ["rooms.html", "⌂", "Rooms", "room"],
  ["applications.html", "▤", "Applications", "application"],
  ["allocations.html", "⇄", "Allocations", "allocation"],
  ["payments.html", "₹", "Payments", "payment"]
];

function renderSidebar() {
  const el = $("#sidebar");
  if (!el) return;

  const pending = getStore("application", seed.application)
    .filter(a => String(a.status).toLowerCase() === "pending").length;

  el.innerHTML = `
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
          ${key === "application" && pending > 0
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

/* ---------------- DEMO STORAGE ---------------- */

function getStore(key, fallback = []) {
  try {
    const value = localStorage.getItem("haven_" + key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.error("Could not read saved records:", error);
    return fallback;
  }
}

function setStore(key, value) {
  localStorage.setItem("haven_" + key, JSON.stringify(value));
}

const seed = {
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
  return String(value || "").toLowerCase().replace(/\s+/g, "-");
}

function recordId(row) {
  return row.regNo || row.roomNo || row.name;
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

/* ---------------- DASHBOARD ---------------- */

function renderDashboard() {
  const students = getStore("student", seed.student);
  const rooms = getStore("room", seed.room);
  const applications = getStore("application", seed.application);
  const allocations = getStore("allocation", seed.allocation);
  const payments = getStore("payment", seed.payment);

  const number = value => Math.max(0, Number(value) || 0);

  const totalCapacity = rooms.reduce(
    (sum, room) => sum + number(room.capacity), 0
  );

  const occupiedBeds = rooms.reduce(
    (sum, room) => sum + number(room.occupied), 0
  );

  const availableBeds = Math.max(0, totalCapacity - occupiedBeds);

  const pendingApplications = applications.filter(
    app => String(app.status).toLowerCase() === "pending"
  ).length;

  const fullRooms = rooms.filter(
    room => number(room.capacity) > 0 &&
            number(room.occupied) >= number(room.capacity)
  ).length;

  const partialRooms = rooms.filter(
    room => number(room.occupied) > 0 &&
            number(room.occupied) < number(room.capacity)
  ).length;

  const emptyRooms = rooms.filter(
    room => number(room.occupied) === 0
  ).length;

  const occupancyPercent = totalCapacity > 0
    ? Math.min(100, Math.round((occupiedBeds / totalCapacity) * 100))
    : 0;

  // Dashboard summary cards.
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
    $("#statApplications").textContent = pendingApplications;
  }

  // Update the room-capacity card footer.
  const roomCardFooter = $(".stat-card:nth-child(2) .stat-foot");
  if (roomCardFooter) {
    roomCardFooter.innerHTML =
      `<span class="trend">${occupiedBeds} beds occupied</span>
       <span>${totalCapacity} total beds</span>`;
  }

  // Update occupancy percentage.
  const donutPercent = $(".donut strong");
  if (donutPercent) {
    donutPercent.textContent = occupancyPercent + "%";
  }

  const legend = document.querySelectorAll(".occupancy-panel .legend > div");
  if (legend.length >= 3) {
    legend[0].querySelector("strong").textContent =
      fullRooms + " rooms";
    legend[1].querySelector("strong").textContent =
      partialRooms + " rooms";
    legend[2].querySelector("strong").textContent =
      emptyRooms + " rooms";
  }

  const progressCaption = $(".progress-caption strong");
  if (progressCaption) {
    progressCaption.textContent = occupancyPercent + "% used";
  }

  const progressBar = $(".progress > span");
  if (progressBar) {
    progressBar.style.width = occupancyPercent + "%";
  }

  // The recent-students table uses current records and allocations.
  const body = $("#recentStudents");
  if (body) {
    const recent = [...students].slice(0, 4);

    if (recent.length === 0) {
      body.innerHTML =
        '<tr><td colspan="5">No student records found.</td></tr>';
    } else {
      body.innerHTML = recent.map(student => {
        const allocation = allocations.find(item =>
          item.regNo === student.regNo &&
          String(item.status).toLowerCase() === "active"
        );

        const room = allocation?.roomNo || "Not assigned";
        const status = allocation ? "Active" : "Not allocated";

        return `
          <tr>
            <td>
              <div class="student-cell">
                <span class="mini-avatar">
                  ${escapeHtml(initials(student.name))}
                </span>
                <span>
                  <strong>${escapeHtml(student.name)}</strong>
                  <small>${escapeHtml(student.email || "Student profile")}</small>
                </span>
              </div>
            </td>
            <td>${escapeHtml(student.regNo || "—")}</td>
            <td>${escapeHtml(room)}</td>
            <td>
              <span class="status ${statusClass(status)}">
                ${escapeHtml(status)}
              </span>
            </td>
            <td>${escapeHtml(formatDate(allocation?.date))}</td>
          </tr>
        `;
      }).join("");
    }
  }

  // Keep a useful summary for debugging in the browser console.
  console.log("Current demo dashboard summary:", {
    totalStudents: students.length,
    totalRooms: rooms.length,
    totalBedCapacity: totalCapacity,
    occupiedBeds,
    availableBeds,
    pendingApplications,
    fullRooms,
    partiallyOccupiedRooms: partialRooms,
    emptyRooms,
    totalAllocations: allocations.length,
    totalPayments: payments.length,
    paidAmount: payments
      .filter(p => String(p.status).toLowerCase() === "paid")
      .reduce((sum, p) => sum + number(p.amount), 0)
  });
}

/* ---------------- RECORD PAGES ---------------- */

const fieldDefs = {
  student: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "text", true],
    ["email", "Email address", "email", true],
    ["phone", "Phone number", "tel", true],
    ["gender", "Gender", "select", true, ["Female", "Male", "Other"]],
    ["department", "Department", "text", true]
  ],

  room: [
    ["roomNo", "Room number", "text", true],
    ["block", "Hostel block", "select", true,
      ["A Block", "B Block", "C Block", "D Block"]],
    ["roomType", "Room type", "select", true,
      ["Single", "2 Sharing", "3 Sharing", "4 Sharing"]],
    ["capacity", "Bed capacity", "number", true],
    ["occupied", "Occupied beds", "number", true],
    ["status", "Status", "select", true,
      ["Available", "Partially occupied", "Full"]]
  ],

  application: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "text", true],
    ["hostel", "Preferred hostel", "select", true,
      ["A Block", "B Block", "C Block", "D Block"]],
    ["roomType", "Room type", "select", true,
      ["Single", "2 Sharing", "3 Sharing", "4 Sharing"]],
    ["date", "Application date", "date", true],
    ["status", "Status", "select", true,
      ["Pending", "Approved", "Rejected"]]
  ],

  allocation: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "text", true],
    ["hostel", "Hostel block", "select", true,
      ["A Block", "B Block", "C Block", "D Block"]],
    ["roomNo", "Room number", "text", true],
    ["date", "Check-in date", "date", true],
    ["status", "Status", "select", true,
      ["Active", "Pending", "Completed"]]
  ],

  payment: [
    ["name", "Student name", "text", true],
    ["regNo", "Registration number", "text", true],
    ["amount", "Amount (INR)", "number", true],
    ["date", "Payment date", "date", true],
    ["method", "Payment method", "select", true,
      ["Online", "UPI", "Cash", "Bank transfer"]],
    ["status", "Status", "select", true,
      ["Paid", "Pending", "Failed"]]
  ]
};

function displayValue(key, value) {
  if (key === "amount") {
    return "₹ " + Number(value || 0).toLocaleString("en-IN");
  }
  return value ?? "—";
}

function renderRecords() {
  const body = $("#recordsBody");
  if (!body) return;

  const search = ($("#searchInput")?.value || "").toLowerCase().trim();
  const filter = $("#statusFilter")?.value || "";
  const all = records();

  const rows = all.filter(record =>
    (!search || Object.values(record).some(value =>
      String(value).toLowerCase().includes(search)
    )) &&
    (!filter || record.status === filter)
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
                   <span class="mini-avatar">
                     ${escapeHtml(initials(record.name))}
                   </span>
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

  if ($("#recordCount")) {
    $("#recordCount").textContent =
      `${rows.length} record${rows.length === 1 ? "" : "s"}`;
  }

  $("#emptyState")?.classList.toggle("hidden", rows.length > 0);

  body.querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", () =>
      openModal(button.dataset.edit)
    );
  });

  body.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () =>
      deleteRecord(button.dataset.delete)
    );
  });
}

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
        ${label}
        ${type === "select"
          ? `<select name="${key}" ${required ? "required" : ""}>
               <option value="">Choose ${label.toLowerCase()}</option>
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
               placeholder="Enter ${escapeHtml(label.toLowerCase())}">`
        }
      </label>
    `
  ).join("");

  form.dataset.editId = id ?? "";
  $("#formError").textContent = "";
  modal.classList.remove("hidden");
}

function closeModal() {
  $("#modalBackdrop")?.classList.add("hidden");
}

function deleteRecord(id) {
  const row = records().find(
    record => String(recordId(record)) === String(id)
  );

  if (!row) {
    alert("This record could not be found.");
    return;
  }

  const label = row.name || row.roomNo || row.regNo || id;

  if (!confirm(`Are you sure you want to delete "${label}"?`)) {
    return;
  }

  const next = records().filter(
    record => String(recordId(record)) !== String(id)
  );

  setStore(page, next);
  renderRecords();

  alert("Record deleted from this browser's demo data.");
}

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

  if (page === "student" &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    fail("Enter a valid email address.");
    return;
  }

  if (page === "room") {
    const capacity = Number(data.capacity);
    const occupied = Number(data.occupied);

    if (capacity <= 0) {
      fail("Room capacity must be greater than zero.");
      return;
    }

    if (occupied > capacity) {
      fail("Occupied beds cannot exceed room capacity.");
      return;
    }

    if (occupied < 0) {
      fail("Occupied beds cannot be negative.");
      return;
    }

    data.status = occupied === 0
      ? "Available"
      : occupied >= capacity
        ? "Full"
        : "Partially occupied";
  }

  if (page === "payment" && Number(data.amount) <= 0) {
    fail("Payment amount must be greater than zero.");
    return;
  }

  const list = records();
  const id = form.dataset.editId;

  if (page === "student" &&
      list.some(record =>
        record.regNo === data.regNo && record.regNo !== id
      )) {
    fail("A student with this registration number already exists.");
    return;
  }

  if (page === "room" &&
      list.some(record =>
        record.roomNo === data.roomNo && record.roomNo !== id
      )) {
    fail("This room number already exists.");
    return;
  }

  const next = id
    ? list.map(record =>
        String(recordId(record)) === String(id) ? data : record
      )
    : [data, ...list];

  setStore(page, next);
  closeModal();
  renderRecords();
}

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

    // DEMO ONLY: this does not verify the password with the server.
    sessionStorage.setItem("haven_demo_user", email);
    message.style.color = "#4c805c";
    message.textContent = "Demo sign-in successful. Opening dashboard…";

    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 350);
  });
}

function setupPage() {
  renderSidebar();

  $("#menuToggle")?.addEventListener("click", () =>
    $("#sidebar")?.classList.toggle("open")
  );

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
