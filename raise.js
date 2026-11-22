// LocalStorage se complaints load karna
function getComplaintsData() {
  let data = localStorage.getItem("hostelComplaints");
  return data ? JSON.parse(data) : [];
}

// LocalStorage me data save karna
function saveComplaintsData(data) {
  localStorage.setItem("hostelComplaints", JSON.stringify(data));
}

// Alert banner dikhana
function showAlert(message, type) {
  let alertBox = document.getElementById("alertBox");
  alertBox.innerText = message;
  alertBox.className = "alert " + (type === "success" ? "alert-success" : "alert-error");
  alertBox.style.display = "block";
}

// Sabhi error messages aur red borders hataana
function clearErrors() {
  let errorEls = document.querySelectorAll(".error-msg");
  for (let i = 0; i < errorEls.length; i++) {
    errorEls[i].innerText = "";
  }

  let inputs = document.querySelectorAll("input, select, textarea");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("input-error");
  }
}

// Kisi field par error set karna
function setFieldError(fieldId, errorId, message) {
  document.getElementById(fieldId).classList.add("input-error");
  document.getElementById(errorId).innerText = message;
}

// Form inputs validate karna
function validateForm() {
  clearErrors();
  let isValid = true;

  let name = document.getElementById("studentName").value.trim();
  let regNo = document.getElementById("regNo").value.trim();
  let room = document.getElementById("roomNo").value.trim();
  let category = document.getElementById("category").value;
  let priority = document.getElementById("priority").value;
  let issue = document.getElementById("issueDesc").value.trim();

  if (name.length < 3) {
    setFieldError("studentName", "nameError", "Enter a valid student name (at least 3 letters).");
    isValid = false;
  }

  if (!/^\d{6,12}$/.test(regNo)) {
    setFieldError("regNo", "regError", "Enter a valid numeric registration number (6-12 digits).");
    isValid = false;
  }

  if (room.length < 3) {
    setFieldError("roomNo", "roomError", "Enter block and room number (e.g., BH1-304).");
    isValid = false;
  }

  if (category === "") {
    setFieldError("category", "categoryError", "Please select a category.");
    isValid = false;
  }

  if (priority === "") {
    setFieldError("priority", "priorityError", "Please select a priority level.");
    isValid = false;
  }

  if (issue.length < 10) {
    setFieldError("issueDesc", "issueError", "Issue description must be at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

// Naya unique ID generate karna
function generateComplaintId(complaints) {
  let maxNum = 100;
  for (let i = 0; i < complaints.length; i++) {
    let numPart = parseInt(complaints[i].id.replace("CMP-", ""), 10);
    if (!isNaN(numPart) && numPart > maxNum) {
      maxNum = numPart;
    }
  }
  return "CMP-" + (maxNum + 1);
}

// Agar URL me ?edit=CMP-101 aaya ho toh edit mode load karna
function loadEditModeIfNeeded() {
  let params = new URLSearchParams(window.location.search);
  let editId = params.get("edit");

  if (!editId) return;

  let complaints = getComplaintsData();
  let target = complaints.find(function (item) {
    return item.id === editId;
  });

  if (target) {
    document.getElementById("pageTitle").innerText = "Edit Complaint (" + target.id + ")";
    document.getElementById("submitBtn").innerText = "Update Complaint";
    document.getElementById("editComplaintId").value = target.id;

    document.getElementById("studentName").value = target.studentName || "";
    document.getElementById("regNo").value = target.regNo || "";
    document.getElementById("roomNo").value = target.room || "";
    document.getElementById("category").value = target.category || "";
    document.getElementById("priority").value = target.priority || "Medium";
    document.getElementById("issueDesc").value = target.issue || "";
  }
}

// Form submit handler
document.getElementById("complaintForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) {
    showAlert("Please fix the highlighted fields before submitting.", "error");
    return;
  }

  let complaints = getComplaintsData();
  let editId = document.getElementById("editComplaintId").value;

  let studentName = document.getElementById("studentName").value.trim();
  let regNo = document.getElementById("regNo").value.trim();
  let room = document.getElementById("roomNo").value.trim().toUpperCase();
  let category = document.getElementById("category").value;
  let priority = document.getElementById("priority").value;
  let issue = document.getElementById("issueDesc").value.trim();
  let today = new Date().toISOString().split("T")[0];

  if (editId) {
    for (let i = 0; i < complaints.length; i++) {
      if (complaints[i].id === editId) {
        complaints[i].studentName = studentName;
        complaints[i].regNo = regNo;
        complaints[i].room = room;
        complaints[i].category = category;
        complaints[i].priority = priority;
        complaints[i].issue = issue;
        complaints[i].updatedDate = today;
        break;
      }
    }
    saveComplaintsData(complaints);
    showAlert("Complaint " + editId + " updated successfully!", "success");
  } else {
    let newComplaint = {
      id: generateComplaintId(complaints),
      studentName: studentName,
      regNo: regNo,
      room: room,
      category: category,
      priority: priority,
      status: "Pending",
      issue: issue,
      date: today
    };

    complaints.push(newComplaint);
    saveComplaintsData(complaints);
    showAlert(
      "Complaint (" + newComplaint.id + ") submitted! Status is Pending — track it in All Complaints.",
      "success"
    );
    document.getElementById("complaintForm").reset();
  }
});

// Clear button handler
document.getElementById("resetBtn").addEventListener("click", function () {
  document.getElementById("complaintForm").reset();
  clearErrors();
  document.getElementById("alertBox").style.display = "none";
});

window.onload = function () {
  loadEditModeIfNeeded();
};