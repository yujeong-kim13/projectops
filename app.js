const STORAGE_KEY = "projectops.projects.v1";

const form = document.getElementById("project-form");
const list = document.getElementById("project-list");
const template = document.getElementById("project-item-template");

let projects = loadProjects();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const owner = String(data.get("owner") || "").trim();
  const startDate = String(data.get("startDate") || "");
  const dueDate = String(data.get("dueDate") || "");
  const description = String(data.get("description") || "").trim();

  if (!name || !owner || !startDate || !dueDate) {
    return;
  }

  projects.unshift({
    id: crypto.randomUUID(),
    name,
    owner,
    startDate,
    dueDate,
    description,
    progress: 0,
    status: "대기",
    memo: "",
    updatedAt: new Date().toISOString(),
  });

  persist();
  form.reset();
  render();
});

function render() {
  list.innerHTML = "";

  if (projects.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "등록된 프로젝트가 없습니다.";
    list.appendChild(empty);
    return;
  }

  for (const project of projects) {
    const node = template.content.firstElementChild.cloneNode(true);

    node.querySelector(".title").textContent = project.name;
    node.querySelector(".owner").textContent = `담당: ${project.owner}`;
    node.querySelector(".period").textContent = `${project.startDate} ~ ${project.dueDate}`;
    node.querySelector(".description").textContent = project.description || "설명 없음";

    const progress = node.querySelector(".progress");
    const percent = node.querySelector(".percent");
    progress.value = String(project.progress);
    percent.textContent = `${project.progress}%`;

    progress.addEventListener("input", () => {
      percent.textContent = `${progress.value}%`;
    });

    const status = node.querySelector(".status");
    status.value = project.status;

    const memo = node.querySelector(".memo");
    memo.value = project.memo || "";

    const updatedAt = node.querySelector(".updated-at");
    updatedAt.textContent = `마지막 업데이트: ${formatDate(project.updatedAt)}`;

    node.querySelector(".save-update").addEventListener("click", () => {
      const target = projects.find((item) => item.id === project.id);
      if (!target) {
        return;
      }

      target.progress = Number(progress.value);
      target.status = status.value;
      target.memo = memo.value.trim();
      target.updatedAt = new Date().toISOString();
      persist();
      render();
    });

    list.appendChild(node);
  }
}

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
