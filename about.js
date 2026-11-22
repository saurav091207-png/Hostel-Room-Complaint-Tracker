// LocalStorage se live complaint counts nikal kar About page par dikhana
function showLiveProjectStats() {
  let raw = localStorage.getItem("hostelComplaints");
  let complaints = raw ? JSON.parse(raw) : [];

  let total = complaints.length;
  let resolved = 0;

  for (let i = 0; i < complaints.length; i++) {
    if (complaints[i].status === "Resolved") {
      resolved++;
    }
  }

  let statsText = document.getElementById("liveStatsText");
  if (statsText) {
    statsText.innerText =
      "Live Tracker Status: " + total + " total complaints logged, " + resolved + " resolved.";
  }
}

// Team member card par click karne par active highlight dikhana
function setupTeamCardClick() {
  let memberCards = document.querySelectorAll(".member-box");

  for (let i = 0; i < memberCards.length; i++) {
    memberCards[i].style.cursor = "pointer";
    memberCards[i].addEventListener("click", function () {
      for (let j = 0; j < memberCards.length; j++) {
        memberCards[j].style.borderColor = "#e5e7eb";
        memberCards[j].style.backgroundColor = "#f9fafb";
      }
      this.style.borderColor = "#2563eb";
      this.style.backgroundColor = "#eff6ff";
    });
  }
}

window.onload = function () {
  showLiveProjectStats();
  setupTeamCardClick();
};