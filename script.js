const internships = [
  {
    id: 1,
    role: "Frontend Developer Intern",
    company: "BrightWeb Studio",
    category: "Web Development",
    mode: "Remote",
    duration: "3 months",
    stipend: "₹8,000/month",
    skills: ["HTML", "CSS", "JavaScript"],
    deadline: "2026-11-15",
    link: "https://example.com"
  },
  {
    id: 2,
    role: "Python Developer Intern",
    company: "CodeNest Labs",
    category: "Python",
    mode: "Hybrid",
    duration: "2 months",
    stipend: "₹6,000/month",
    skills: ["Python", "OOP", "SQL"],
    deadline: "2026-11-20",
    link: "https://example.com"
  },
  {
    id: 3,
    role: "Java Developer Intern",
    company: "NextGen Software",
    category: "Java",
    mode: "On-site",
    duration: "4 months",
    stipend: "₹10,000/month",
    skills: ["Java", "OOP", "SQL"],
    deadline: "2026-11-25",
    link: "https://example.com"
  },
  {
    id: 4,
    role: "Data Science Intern",
    company: "DataSpark",
    category: "Data Science",
    mode: "Remote",
    duration: "3 months",
    stipend: "₹7,000/month",
    skills: ["Python", "Pandas", "Statistics"],
    deadline: "2026-11-10",
    link: "https://example.com"
  },
  {
    id: 5,
    role: "Software Testing Intern",
    company: "QualityFirst Tech",
    category: "Testing",
    mode: "Hybrid",
    duration: "3 months",
    stipend: "₹5,000/month",
    skills: ["Testing", "SQL", "Bug Reporting"],
    deadline: "2026-11-18",
    link: "https://example.com"
  },
  {
    id: 6,
    role: "UI Developer Intern",
    company: "PixelCraft",
    category: "Web Development",
    mode: "Remote",
    duration: "2 months",
    stipend: "Unpaid",
    skills: ["HTML", "CSS", "JavaScript"],
    deadline: "2026-12-05",
    link: "https://example.com"
  }
];

// These are demo records, not verified live vacancies.
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const modeFilter = document.getElementById("modeFilter");

const internshipList = document.getElementById("internshipList");
const applicationList = document.getElementById("applicationList");
const emptyMessage = document.getElementById("emptyMessage");

const totalCount = document.getElementById("totalCount");
const appliedCount = document.getElementById("appliedCount");
const deadlineCount = document.getElementById("deadlineCount");

const profileForm = document.getElementById("profileForm");
const resumeUrl = document.getElementById("resumeUrl");
const portfolioUrl = document.getElementById("portfolioUrl");
const profileMessage = document.getElementById("profileMessage");

let applications = JSON.parse(
  localStorage.getItem("internTrackApplications") || "{}"
);

function saveApplications() {
  localStorage.setItem(
    "internTrackApplications",
    JSON.stringify(applications)
  );
}

function getStatus(id) {
  return applications[id]?.status || "Not Applied";
}

function formatDate(dateString) {
  return new Date(dateString + "T12:00:00").toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

function renderInternships() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const mode = modeFilter.value;

  const filtered = internships.filter((internship) => {
    const searchableText = [
      internship.role,
      internship.company,
      internship.category,
      ...internship.skills
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);
    const matchesCategory =
      category === "all" || internship.category === category;
    const matchesMode =
      mode === "all" || internship.mode === mode;

    return matchesSearch && matchesCategory && matchesMode;
  });

  internshipList.replaceChildren();

  filtered.forEach((internship) => {
    const card = document.createElement("article");
    card.className = "internship-card";

    const title = document.createElement("h3");
    title.textContent = internship.role;

    const company = document.createElement("p");
    company.className = "company";
    company.textContent = internship.company;

    const details = document.createElement("p");
    details.textContent =
      `${internship.mode} · ${internship.duration} · ${internship.stipend}`;

    const tags = document.createElement("div");
    tags.className = "tags";

    internship.skills.forEach((skill) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = skill;
      tags.appendChild(tag);
    });

    const deadline = document.createElement("p");
    deadline.className = "deadline";
    deadline.textContent = "Demo deadline: " + formatDate(internship.deadline);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const trackButton = document.createElement("button");
    trackButton.className = "primary-btn";
    trackButton.textContent =
      getStatus(internship.id) === "Not Applied"
        ? "Track application"
        : "Update status";

    trackButton.addEventListener("click", () => {
      if (!applications[internship.id]) {
        applications[internship.id] = {
          status: "Saved",
          savedAt: new Date().toISOString()
        };
      }

      saveApplications();
      renderInternships();
      renderApplications();
      renderStats();
    });

    const applyLink = document.createElement("a");
    applyLink.className = "secondary-btn";
    applyLink.href = internship.link;
    applyLink.target = "_blank";
    applyLink.rel = "noopener noreferrer";
    applyLink.textContent = "Visit website";

    actions.append(trackButton, applyLink);
    card.append(title, company, details, tags, deadline, actions);
    internshipList.appendChild(card);
  });

  emptyMessage.hidden = filtered.length > 0;
}

function renderApplications() {
  applicationList.replaceChildren();

  const tracked = internships.filter(
    (internship) => applications[internship.id]
  );

  if (tracked.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent =
      "No applications tracked yet. Save an internship to begin.";
    applicationList.appendChild(message);
    return;
  }

  tracked.forEach((internship) => {
    const row = document.createElement("article");
    row.className = "application-row";

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = internship.role;

    const company = document.createElement("p");
    company.textContent = internship.company;

    info.append(title, company);

    const status = document.createElement("select");
    status.setAttribute(
      "aria-label",
      "Application status for " + internship.role
    );

    [
      "Saved",
      "Applied",
      "Interview",
      "Offer Received",
      "Rejected"
    ].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      status.appendChild(option);
    });

    status.value = getStatus(internship.id);

    status.addEventListener("change", () => {
      applications[internship.id].status = status.value;
      saveApplications();
      renderInternships();
      renderStats();
    });

    const removeButton = document.createElement("button");
    removeButton.className = "secondary-btn";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      delete applications[internship.id];
      saveApplications();
      renderInternships();
      renderApplications();
      renderStats();
    });

    const controls = document.createElement("div");
    controls.className = "card-actions";
    controls.append(status, removeButton);

    row.append(info, controls);
    applicationList.appendChild(row);
  });
}

function renderStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  totalCount.textContent = internships.length;

  appliedCount.textContent = Object.values(applications).filter(
    (application) => application.status === "Applied"
  ).length;

  deadlineCount.textContent = internships.filter((internship) => {
    const deadline = new Date(internship.deadline + "T00:00:00");
    return deadline >= today;
  }).length;
}

searchInput.addEventListener("input", renderInternships);
categoryFilter.addEventListener("change", renderInternships);
modeFilter.addEventListener("change", renderInternships);

// Load saved resume and portfolio links.
const savedProfile = JSON.parse(
  localStorage.getItem("internTrackProfile") || "{}"
);

resumeUrl.value = savedProfile.resume || "";
portfolioUrl.value = savedProfile.portfolio || "";

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profile = {
    resume: resumeUrl.value.trim(),
    portfolio: portfolioUrl.value.trim()
  };

  localStorage.setItem("internTrackProfile", JSON.stringify(profile));

  profileMessage.textContent = "Your profile links have been saved.";
});

renderInternships();
renderApplications();
renderStats();