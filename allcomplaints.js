// Default sample complaints agar localStorage khali ho
const defaultComplaints = [
  {
    id: "CMP-101",
    studentName: "Saurav Kumar",
    regNo: "12608110",
    room: "BH1-304",
    category: "Electrical",
    priority: "High",
    issue: "Ceiling fan regulator not working",
    date: "2026-11-19",
    status: "Pending"
  },
  {
    id: "CMP-102",
    studentName: "Rahul Sharma",
    regNo: "12607186",
    room: "BH1-212",
    category: "Plumbing",
    priority: "Medium",
    issue: "Washroom tap leaking continuously",
    date: "2026-11-20",
    status: "In Progress"
  },
  {
    id: "CMP-103",
    studentName: "Aman Verma",
    regNo: "12610905",
    room: "BH2-108",
    category: "Wi-Fi",
    priority: "Low",
    issue: "Low signal strength in room",
    date: "2026-11-20",
    status: "Resolved"
  }
];

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

function saveComplaints(list) {
  localStorage.setItem("hostelComplaints", JSON.stringify(list));
}

function getStatusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "In Progress") return "in-progress";
  return "resolved";
}

function getPriorityClass(priority) {
  if (priority === "High") return "prio-high";
  if (priority === "Medium") return "prio-medium";
  return "prio-low";
}

function updateStatus(complaintId, newStatus) {
  let complaints = loadComplaints();
  let today = new Date().toISOString().split("T")[0];

  for (let i = 0; i < complaints.length; i++) {
    if (complaints[i].id === complaintId) {
      complaints[i].status = newStatus;
      complaints[i].updatedDate = today;
      break;
    }
  }

  saveComplaints(complaints);
  renderComplaintsList();
}

function deleteComplaint(complaintId) {
  let confirmDelete = confirm("Are you sure you want to delete " + complaintId + "?");
  if (!confirmDelete) return;

  let complaints = loadComplaints();
  let updatedList = complaints.filter(function (item) {
    return item.id !== complaintId;
  });

  saveComplaints(updatedList);
  renderComplaintsList();
}

function renderComplaintsList() {
  let complaints = loadComplaints();

  let searchEl = document.getElementById("searchInput");
  let catEl = document.getElementById("categoryFilter");
  let statusEl = document.getElementById("statusFilter");

  let searchText = searchEl ? searchEl.value.trim().toLowerCase() : "";
  let selectedCategory = catEl ? catEl.value : "All";
  let selectedStatus = statusEl ? statusEl.value : "All";

  let filtered = complaints.filter(function (item) {
    let idText = String(item.id || "").toLowerCase();
    let roomText = String(item.room || "").toLowerCase();
    let issueText = String(item.issue || "").toLowerCase();
    let catText = String(item.category || "").toLowerCase();
    let nameText = String(item.studentName || "").toLowerCase();
    let regText = String(item.regNo || "").toLowerCase();

    let matchesSearch =
      searchText === "" ||
      idText.includes(searchText) ||
      roomText.includes(searchText) ||
      issueText.includes(searchText) ||
      catText.includes(searchText) ||
      nameText.includes(searchText) ||
      regText.includes(searchText);

    let matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    let matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  let tbody = document.getElementById("complaintsTableBody");
  let noDataMsg = document.getElementById("noDataMsg");
  let resultCount = document.getElementById("resultCount");

  if (!tbody) return;
  tbody.innerHTML = "";

  if (resultCount) {
    resultCount.innerText = "Showing " + filtered.length + " of " + complaints.length + " complaints";
  }

  if (filtered.length === 0) {
    if (noDataMsg) noDataMsg.style.display = "block";
    return;
  } else {
    if (noDataMsg) noDataMsg.style.display = "none";
  }

  for (let i = filtered.length - 1; i >= 0; i--) {
    let item = filtered[i];
    let badgeClass = getStatusClass(item.status || "Pending");
    let prioClass = getPriorityClass(item.priority || "Medium");

    let row = `
      <tr>
        <td>
          <a href="details.html?id=${encodeURIComponent(item.id)}" class="id-link">${item.id}</a>
        </td>
        <td>${item.room || "-"}</td>
        <td>${item.category || "-"}</td>
        <td><span class="${prioClass}">${item.priority || "Medium"}</span></td>
        <td>${item.issue || "-"}</td>
        <td>${item.date || "-"}</td>
        <td><span class="badge ${badgeClass}">${item.status || "Pending"}</span></td>
        <td>
          <div class="action-group">
            <select class="status-select" onchange="updateStatus('${item.id}', this.value)">
              <option value="Pending" ${item.status === "Pending" ? "selected" : ""}>Pending</option>
              <option value="In Progress" ${item.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option value="Resolved" ${item.status === "Resolved" ? "selected" : ""}>Resolved</option>
            </select>
            <a href="complaint-form.html?edit=${encodeURIComponent(item.id)}" class="edit-link">Edit</a>
            <button type="button" class="btn-delete" onclick="deleteComplaint('${item.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderComplaintsList();

  let searchEl = document.getElementById("searchInput");
  let catEl = document.getElementById("categoryFilter");
  let statusEl = document.getElementById("statusFilter");
  let clearBtn = document.getElementById("clearFiltersBtn");

  if (searchEl) searchEl.addEventListener("input", renderComplaintsList);
  if (catEl) catEl.addEventListener("change", renderComplaintsList);
  if (statusEl) statusEl.addEventListener("change", renderComplaintsList);

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (searchEl) searchEl.value = "";
      if (catEl) catEl.value = "All";
      if (statusEl) statusEl.value = "All";
      renderComplaintsList();
    });
  }
});