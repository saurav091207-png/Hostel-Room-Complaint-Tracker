// Default sample complaints agar localStorage khali ho
const defaultComplaints = [
  {
    id: "CMP-101",
    room: "BH1-304",
    category: "Electrical",
    priority: "High",
    issue: "Ceiling fan regulator not working",
    date: "2026-11-19",
    status: "Pending"
  },
  {
    id: "CMP-102",
    room: "BH1-212",
    category: "Plumbing",
    priority: "Medium",
    issue: "Washroom tap leaking continuously",
    date: "2026-11-20",
    status: "In Progress"
  },
  {
    id: "CMP-103",
    room: "BH2-108",
    category: "Wi-Fi",
    priority: "Low",
    issue: "Low signal strength in room",
    date: "2026-11-20",
    status: "Resolved"
  }
];

// LocalStorage se complaints load karna
function loadComplaints() {
  try {
    let raw = localStorage.getItem("hostelComplaints");
    if (!raw) {
      localStorage.setItem("hostelComplaints", JSON.stringify(defaultComplaints));
      return defaultComplaints;
    }
    let parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

// Status badge ka CSS class return karna
function getStatusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "In Progress") return "in-progress";
  return "resolved";
}

// Summary cards ke counts update karna
function updateDashboardCounts(complaints) {
  let total = complaints.length;
  let pending = 0;
  let inProgress = 0;
  let resolved = 0;

  for (let i = 0; i < complaints.length; i++) {
    if (complaints[i].status === "Pending") {
      pending++;
    } else if (complaints[i].status === "In Progress") {
      inProgress++;
    } else if (complaints[i].status === "Resolved") {
      resolved++;
    }
  }

  let totalEl = document.getElementById("totalCount");
  let pendingEl = document.getElementById("pendingCount");
  let progressEl = document.getElementById("progressCount");
  let resolvedEl = document.getElementById("resolvedCount");

  if (totalEl) totalEl.innerText = total;
  if (pendingEl) pendingEl.innerText = pending;
  if (progressEl) progressEl.innerText = inProgress;
  if (resolvedEl) resolvedEl.innerText = resolved;
}

// Recent complaints table render karna
function renderRecentComplaints() {
  let complaints = loadComplaints();
  updateDashboardCounts(complaints);

  let filterSelect = document.getElementById("statusFilter");
  let selectedStatus = filterSelect ? filterSelect.value : "All";

  let filtered = complaints.filter(function (item) {
    return selectedStatus === "All" || item.status === selectedStatus;
  });

  let tbody = document.getElementById("recentTableBody");
  let emptyMsg = document.getElementById("emptyMsg");

  if (!tbody) return;
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  } else {
    if (emptyMsg) emptyMsg.style.display = "none";
  }

  // Latest complaints upar dikhane ke liye reverse order me loop
  let shown = 0;
  for (let i = filtered.length - 1; i >= 0 && shown < 6; i--) {
    let item = filtered[i];
    let badgeClass = getStatusClass(item.status);

    let row = `
      <tr>
        <td>
          <a href="details.html?id=${encodeURIComponent(item.id)}" style="color: #1d4ed8; text-decoration: none; font-weight: bold;">
            ${item.id}
          </a>
        </td>
        <td>${item.room}</td>
        <td>${item.category}</td>
        <td>${item.issue}</td>
        <td>${item.date}</td>
        <td><span class="badge ${badgeClass}">${item.status}</span></td>
      </tr>
    `;
    tbody.innerHTML += row;
    shown++;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderRecentComplaints();

  let filterSelect = document.getElementById("statusFilter");
  if (filterSelect) {
    filterSelect.addEventListener("change", renderRecentComplaints);
  }
});

// Dusre tab/page se localStorage update hone par dashboard sync karna
window.addEventListener("storage", function (e) {
  if (e.key === "hostelComplaints") {
    renderRecentComplaints();
  }
});