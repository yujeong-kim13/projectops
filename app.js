const PROJECTS_STORAGE_KEY = "projectops.projects.v1";
const CLIENTS_STORAGE_KEY = "projectops.clients.v1";

const PROJECT_STATUS = ["계획", "진행중", "위험", "완료", "보류"];
const CLIENT_STATUS = ["활성", "휴면", "해지"];
const VIEW_TO_PANEL = {
  list: "list",
  create: "create",
  detail: "detail",
  edit: "create",
  update: "update",
  clients: "clients",
};
const VIEW_TO_NAV = {
  list: "list",
  detail: "list",
  create: "list",
  edit: "list",
  update: "list",
  clients: "clients",
};
const FORM_MODE = {
  CREATE: "create",
  EDIT: "edit",
};
const getSafeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const fallbackSeed = Date.now().toString(36);
  const fallbackRand = Math.random().toString(36).slice(2, 10);
  return `id-${fallbackSeed}-${fallbackRand}`;
};

const elements = {
  navTabs: Array.from(document.querySelectorAll(".nav-btn")),
  viewPanels: Array.from(document.querySelectorAll("[data-view-panel]")),
  form: document.getElementById("project-form"),
  projectId: document.getElementById("project-id"),
  name: document.getElementById("project-name"),
  type: document.getElementById("project-type"),
  projectClientName: document.getElementById("client-name"),
  pm: document.getElementById("project-pm"),
  members: document.getElementById("project-members"),
  startDate: document.getElementById("start-date"),
  endDate: document.getElementById("end-date"),
  plannedManmonths: document.getElementById("planned-manmonths"),
  contractManmonths: document.getElementById("contract-manmonths"),
  usedManmonths: document.getElementById("used-manmonths"),
  expectedManmonths: document.getElementById("expected-manmonths"),
  progress: document.getElementById("project-progress"),
  progressValue: document.getElementById("progress-value"),
  status: document.getElementById("project-status"),
  risk: document.getElementById("project-risk"),
  memo: document.getElementById("project-memo"),
  formHelp: document.getElementById("form-help"),
  saveBtn: document.getElementById("save-btn"),
  resetFormBtn: document.getElementById("reset-form-btn"),
  projectFormTitle: document.getElementById("project-form-title"),
  summaryBox: document.getElementById("summary-box"),
  typeFilter: document.getElementById("type-filter"),
  statusFilter: document.getElementById("status-filter"),
  list: document.getElementById("project-list"),
  projectCardTemplate: document.getElementById("project-card-template"),
  detailEmpty: document.getElementById("project-detail-empty"),
  detail: document.getElementById("project-detail"),
  detailTitle: document.getElementById("detail-title"),
  detailType: document.getElementById("detail-type"),
  detailPeriod: document.getElementById("detail-period"),
  detailOwner: document.getElementById("detail-owner"),
  detailMembers: document.getElementById("detail-members"),
  detailManmonths: document.getElementById("detail-manmonths"),
  detailProgressValue: document.getElementById("detail-progress-value"),
  detailProgressBar: document.getElementById("detail-progress-bar"),
  detailStatus: document.getElementById("detail-status"),
  detailRisk: document.getElementById("detail-risk"),
  detailMemo: document.getElementById("detail-memo"),
  detailUpdated: document.getElementById("detail-updated"),
  openEditBtn: document.getElementById("open-edit-btn"),
  openUpdateBtn: document.getElementById("open-update-btn"),
  openDetailBtn: document.getElementById("open-detail-btn"),
  deleteBtn: document.getElementById("delete-project-btn"),
  projectSearch: document.getElementById("project-search"),
  openCreateBtn: document.getElementById("open-create-btn"),
  updateForm: document.getElementById("update-form"),
  updateDate: document.getElementById("update-date"),
  updateAuthor: document.getElementById("update-author"),
  updateContent: document.getElementById("update-content"),
  updateNextPlan: document.getElementById("update-next-plan"),
  updateRisk: document.getElementById("update-risk"),
  updateProgress: document.getElementById("update-progress"),
  updateProgressValue: document.getElementById("update-progress-value"),
  updateEmpty: document.getElementById("update-empty"),
  updateList: document.getElementById("update-list"),
  updateTemplate: document.getElementById("update-item-template"),
  clientNameOptions: document.getElementById("client-name-options"),
  clientList: document.getElementById("client-list"),
  clientCardTemplate: document.getElementById("client-card-template"),
  openClientFormBtn: document.getElementById("open-client-form-btn"),
  clientForm: document.getElementById("client-form"),
  clientId: document.getElementById("client-id"),
  clientCompanyName: document.getElementById("client-company-name"),
  clientIndustry: document.getElementById("client-industry"),
  clientManager: document.getElementById("client-manager"),
  clientContact: document.getElementById("client-contact"),
  clientStatus: document.getElementById("client-status"),
  clientNote: document.getElementById("client-note"),
  clientFormHelp: document.getElementById("client-form-help"),
  resetClientFormBtn: document.getElementById("reset-client-form-btn"),
  clientSearch: document.getElementById("client-search"),
  clientStatusFilter: document.getElementById("client-status-filter"),
  clientIndustryFilter: document.getElementById("client-industry-filter"),
};

const demoProject = {
  id: getSafeId(),
  name: "2026 AI 기반 분석 대시보드 고도화",
  type: "고객사",
  clientName: "한빛시스템",
  pm: "김유정",
  members: ["박민수", "이도현", "최유진"],
  startDate: "2026-06-01",
  endDate: "2026-08-31",
  plannedManmonths: 14,
  contractManmonths: 16,
  usedManmonths: 4,
  expectedManmonths: 15,
  progress: 28,
  status: "진행중",
  risk: "요구사항 변경이 빈번해 일정 변동 가능성",
  memo: "1차 산출물은 데이터 적재 파이프라인 안정화 중심",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  updates: [
    {
      id: getSafeId(),
      date: "2026-05-20",
      author: "김유정",
      content: "요구사항 정리 완료 후 분석 모델 연결 구조 확정",
      nextPlan: "데이터 검증 자동화 스크립트 작성",
      riskIssue: "로그 샘플 노이즈 높음",
      progress: 28,
      createdAt: new Date().toISOString(),
    },
  ],
};

const demoClient = {
  id: getSafeId(),
  name: "한빛시스템",
  industry: "IT",
  manager: "김유정",
  contact: "02-0000-1111",
  status: "활성",
  note: "기본 고객사 샘플",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let projects = loadProjects();
let clients = loadClients();
let selectedProjectId = null;
let selectedClientId = null;
let currentView = "list";
let formMode = FORM_MODE.CREATE;
let clientFormMode = FORM_MODE.CREATE;

if (projects.length === 0) {
  projects = [demoProject];
  persistProjects();
}

if (clients.length === 0) {
  clients = [demoClient];
  persistClients();
}

initDefaults();
renderAll();
setView(currentView);

elements.form.addEventListener("submit", onSaveProject);
elements.resetFormBtn.addEventListener("click", resetProjectForm);
elements.type.addEventListener("change", syncClientField);
elements.progress.addEventListener("input", () => syncProgressLabel(elements.progress, elements.progressValue));
elements.updateProgress.addEventListener("input", () => {
  elements.updateProgressValue.textContent = `${elements.updateProgress.value}%`;
});
elements.typeFilter.addEventListener("change", renderList);
elements.projectSearch.addEventListener("input", renderList);
elements.statusFilter.addEventListener("change", renderList);
elements.updateForm.addEventListener("submit", onSaveUpdate);
elements.deleteBtn.addEventListener("click", onDeleteProject);
elements.openEditBtn.addEventListener("click", () => setView("edit"));
elements.openUpdateBtn.addEventListener("click", () => setView("update"));
elements.openDetailBtn.addEventListener("click", () => setView("detail"));
elements.openCreateBtn.addEventListener("click", () => setView("create"));
elements.clientForm.addEventListener("submit", onSaveClient);
elements.resetClientFormBtn.addEventListener("click", resetClientForm);
elements.openClientFormBtn.addEventListener("click", () => {
  selectedClientId = null;
  setClientFormMode(FORM_MODE.CREATE);
  elements.clientForm.classList.remove("hidden");
});
elements.clientSearch.addEventListener("input", renderClients);
elements.clientStatusFilter.addEventListener("change", renderClients);
elements.clientIndustryFilter.addEventListener("change", renderClients);
elements.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view || "list"));
});

function initDefaults() {
  const today = new Date().toISOString().slice(0, 10);
  elements.updateDate.value = today;
  syncClientField();
  syncProgressLabel(elements.progress, elements.progressValue);
  syncClientOptions();
}

function syncClientField() {
  elements.projectClientName.required = elements.type.value === "고객사";
}

function syncProgressLabel(input, target) {
  target.textContent = `${input.value}%`;
}

function getNextId() {
  return getSafeId();
}

function makeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function today() {
  return new Date().toISOString();
}

function onSaveProject(event) {
  event.preventDefault();

  const formData = {
    id: elements.projectId.value || getNextId(),
    name: elements.name.value.trim(),
    type: elements.type.value,
    clientName: elements.projectClientName.value.trim(),
    pm: elements.pm.value.trim(),
    members: splitCsv(elements.members.value),
    startDate: elements.startDate.value,
    endDate: elements.endDate.value,
    plannedManmonths: makeNumber(elements.plannedManmonths.value),
    contractManmonths: makeNumber(elements.contractManmonths.value),
    usedManmonths: makeNumber(elements.usedManmonths.value),
    expectedManmonths: makeNumber(elements.expectedManmonths.value),
    progress: Number(elements.progress.value),
    status: elements.status.value,
    risk: elements.risk.value.trim(),
    memo: elements.memo.value.trim(),
    updatedAt: today(),
  };

  if (!formData.name || !formData.pm || !formData.startDate || !formData.endDate) {
    return;
  }

  if (formData.type === "고객사" && !formData.clientName) {
    alert("고객사 유형에서는 고객사명을 입력해야 합니다.");
    return;
  }

  const isEdit = formMode === FORM_MODE.EDIT;
  const targetIdx = projects.findIndex((p) => p.id === formData.id);
  const shouldEdit = isEdit && targetIdx > -1;

  if (shouldEdit) {
    projects[targetIdx] = {
      ...projects[targetIdx],
      ...formData,
      createdAt: projects[targetIdx].createdAt,
      updates: projects[targetIdx].updates || [],
    };
  } else {
    projects.unshift({
      ...formData,
      createdAt: today(),
      updates: [],
    });
  }

  persistProjects();
  syncClientOptions();
  selectedProjectId = shouldEdit ? formData.id : projects[0].id;
  resetProjectForm();
  renderAll();
  setView(isEdit ? "detail" : "list");
}

function onSaveUpdate(event) {
  event.preventDefault();

  if (!selectedProjectId) {
    setView("list");
    return;
  }

  const project = projects.find((item) => item.id === selectedProjectId);
  if (!project) {
    return;
  }

  const update = {
    id: getNextId(),
    date: elements.updateDate.value,
    author: elements.updateAuthor.value.trim(),
    content: elements.updateContent.value.trim(),
    nextPlan: elements.updateNextPlan.value.trim(),
    riskIssue: elements.updateRisk.value.trim(),
    progress: Number(elements.updateProgress.value),
    createdAt: today(),
  };

  if (!update.date || !update.author || !update.content) {
    return;
  }

  project.updates.unshift(update);
  project.progress = update.progress;
  project.updatedAt = today();
  persistProjects();
  renderProjectDetail(project);
  syncProgressLabel(elements.updateProgress, elements.updateProgressValue);
  elements.updateForm.reset();
  const now = new Date().toISOString().slice(0, 10);
  elements.updateDate.value = now;
  setView("detail");
}

function onDeleteProject() {
  if (!selectedProjectId) {
    return;
  }

  const target = projects.find((p) => p.id === selectedProjectId);
  if (!target) {
    return;
  }

  if (!window.confirm(`"${target.name}" 프로젝트를 삭제하시겠습니까?`)) {
    return;
  }

  projects = projects.filter((p) => p.id !== selectedProjectId);
  selectedProjectId = null;
  persistProjects();
  renderAll();
  resetDetail();
  setView("list");
}

function onSaveClient(event) {
  event.preventDefault();

  const clientData = {
    id: elements.clientId.value || getNextId(),
    name: elements.clientCompanyName.value.trim(),
    industry: elements.clientIndustry.value.trim() || "기타",
    manager: elements.clientManager.value.trim() || "-",
    contact: elements.clientContact.value.trim() || "-",
    status: elements.clientStatus.value,
    note: elements.clientNote.value.trim(),
    updatedAt: today(),
  };

  if (!clientData.name) {
    alert("고객사명은 필수입니다.");
    return;
  }

  const isEdit = clientFormMode === FORM_MODE.EDIT;
  const targetIdx = clients.findIndex((item) => item.id === clientData.id);
  const shouldEdit = isEdit && targetIdx > -1;

  if (shouldEdit) {
    clients[targetIdx] = {
      ...clients[targetIdx],
      ...clientData,
      createdAt: clients[targetIdx].createdAt,
    };
  } else {
    clients.unshift({
      ...clientData,
      createdAt: today(),
    });
  }

  persistClients();
  syncClientOptions();
  renderClients();
  renderSummary();
  elements.clientForm.reset();
  selectedClientId = null;
  setClientFormMode(FORM_MODE.CREATE);
}

function onDeleteClient(clientId) {
  const target = clients.find((item) => item.id === clientId);
  if (!target) {
    return;
  }

  const usedProjects = projects.filter((p) => p.type === "고객사" && p.clientName === target.name);
  if (usedProjects.length > 0) {
    const confirmed = window.confirm(`\"${target.name}\" 고객사를 삭제하면 연결된 ${usedProjects.length}개 프로젝트에서 고객사명이 비워집니다. 진행하시겠습니까?`);
    if (!confirmed) {
      return;
    }

    projects = projects.map((project) => {
      if (project.type === "고객사" && project.clientName === target.name) {
        return {
          ...project,
          clientName: "",
          updatedAt: today(),
        };
      }
      return project;
    });
  } else {
    if (!window.confirm(`\"${target.name}\" 고객사를 삭제하시겠습니까?`)) {
      return;
    }
  }

  clients = clients.filter((item) => item.id !== clientId);
  persistClients();
  persistProjects();
  syncClientOptions();
  renderClients();
  renderSummary();
  renderList();

  if (selectedClientId === clientId) {
    selectedClientId = null;
    setClientFormMode(FORM_MODE.CREATE);
    elements.clientForm.classList.add("hidden");
  }
}

function renderAll() {
  renderSummary();
  renderList();
  renderProjectDetail(getSelectedProject());
  renderClients();
}

function renderSummary() {
  const total = projects.length;
  const client = projects.filter((p) => p.type === "고객사").length;
  const internal = projects.filter((p) => p.type === "사내").length;
  const risk = projects.filter((p) => p.status === "위험").length;
  const totalManmonths = projects.reduce((acc, p) => acc + makeNumber(p.contractManmonths), 0);
  const activeClient = clients.filter((c) => c.status === "활성").length;

  elements.summaryBox.innerHTML = `
    <span>총 프로젝트: ${total}</span>
    <span>고객사: ${client}</span>
    <span>사내: ${internal}</span>
    <span>위험 상태: ${risk}</span>
    <span>계약 맨먼스: ${totalManmonths.toFixed(1)}</span>
    <span>활성 고객사: ${activeClient}</span>
  `;
}

function renderList() {
  const typeFilter = elements.typeFilter.value;
  const statusFilter = elements.statusFilter.value;
  const searchText = (elements.projectSearch.value || "").trim().toLowerCase();
  const filtered = projects.filter((project) => {
    if (typeFilter && project.type !== typeFilter) {
      return false;
    }
    if (statusFilter && project.status !== statusFilter) {
      return false;
    }
    if (searchText) {
      const searchable = [
        project.name,
        project.pm,
        project.clientName,
        (project.members || []).join(" "),
        project.memo,
        project.risk,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(searchText)) {
        return false;
      }
    }
    return true;
  });

  elements.list.innerHTML = "";

  if (filtered.length === 0) {
    elements.list.innerHTML = "<p class=\"empty-state\">조건에 맞는 프로젝트가 없습니다.</p>";
    return;
  }

  const sorted = [...filtered].sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  for (const project of sorted) {
    const node = elements.projectCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".pc-title").textContent = project.name;
    node.querySelector(".chip").textContent = project.type;
    const clientText = project.type === "고객사" ? `고객사: ${project.clientName || "-"}` : "사내 프로젝트";
    node.querySelector(".pc-client").textContent = clientText;
    node.querySelector(".pc-period").textContent = `기간: ${project.startDate} ~ ${project.endDate}`;
    node.querySelector(".pc-members").textContent = `PM: ${project.pm} / 참여: ${project.members.join(", ") || "-"}`;
    node.querySelector(".pc-manmonths").textContent = `계획/계약 맨먼스: ${project.plannedManmonths} / ${project.contractManmonths}`;
    node.querySelector(".pc-progress-val").textContent = `${project.progress}%`;
    node.querySelector(".pc-progress-bar").style.width = `${project.progress}%`;

    const selectBtn = node.querySelector(".select-btn");
    const editBtn = node.querySelector(".edit-btn");
    const updateBtn = node.querySelector(".update-btn");
    selectBtn.addEventListener("click", () => {
      selectedProjectId = project.id;
      renderProjectDetail(project);
      setView("detail");
    });

    editBtn.addEventListener("click", () => {
      selectedProjectId = project.id;
      fillFormForEdit(project);
    });

    updateBtn.addEventListener("click", () => {
      selectedProjectId = project.id;
      renderProjectDetail(project);
      setView("update");
    });

    elements.list.appendChild(node);
  }
}

function renderProjectDetail(project) {
  if (!project) {
    selectedProjectId = null;
    resetDetail();
    return;
  }

  elements.detailEmpty.classList.add("hidden");
  elements.detail.classList.remove("hidden");

  elements.detailTitle.textContent = project.name;
  elements.detailType.textContent = `${project.type} / 상태: ${project.status}`;
  elements.detailPeriod.textContent = `기간: ${project.startDate} ~ ${project.endDate}`;
  elements.detailOwner.textContent = `PM: ${project.pm}`;
  elements.detailMembers.textContent = `참여 인력: ${project.members.join(", ") || "미정"}`;
  elements.detailManmonths.textContent = `계획/계약/사용/예상 맨먼스: ${project.plannedManmonths} / ${project.contractManmonths} / ${project.usedManmonths} / ${project.expectedManmonths}`;
  elements.detailProgressValue.textContent = `${project.progress}%`;
  elements.detailProgressBar.style.width = `${project.progress}%`;
  elements.detailStatus.textContent = `상태: ${project.status}`;
  elements.detailRisk.textContent = `리스크: ${project.risk || "-"}`;
  elements.detailMemo.textContent = `메모: ${project.memo || "-"}`;
  elements.detailUpdated.textContent = `최종 수정: ${formatDateTime(project.updatedAt || project.createdAt)}`;

  elements.updateAuthor.value = project.pm;
  elements.updateDate.value = new Date().toISOString().slice(0, 10);
  elements.openEditBtn.disabled = false;
  elements.openUpdateBtn.disabled = false;

  renderUpdates(project);
  syncUpdateFormState();
}

function renderUpdates(project) {
  elements.updateList.innerHTML = "";

  if (!project.updates || project.updates.length === 0) {
    elements.updateList.innerHTML = "<p class=\"empty-state\">아직 진행사항이 없습니다.</p>";
    return;
  }

  for (const update of project.updates) {
    const item = elements.updateTemplate.content.firstElementChild.cloneNode(true);
    item.querySelector(".update-title").textContent = `${update.author} / 진척률 ${update.progress}%`;
    item.querySelector(".update-date").textContent = formatDate(update.date);
    item.querySelector(".update-content").textContent = `이번 내용: ${update.content}`;
    item.querySelector(".update-next").textContent = `다음 계획: ${update.nextPlan || "-"}`;
    item.querySelector(".update-risk").textContent = `이슈/리스크: ${update.riskIssue || "-"}`;
    item.querySelector(".update-progress").textContent = `변경 반영 진척률: ${update.progress}%`;
    elements.updateList.appendChild(item);
  }
}

function fillFormForEdit(project) {
  if (!project) {
    return;
  }
  selectedProjectId = project.id;
  setProjectFormValues(project);
  setFormMode(FORM_MODE.EDIT);
  elements.projectId.scrollIntoView({ behavior: "smooth", block: "start" });
  setView("edit");
}

function setProjectFormValues(project) {
  elements.projectId.value = project.id;
  elements.name.value = project.name;
  elements.type.value = project.type;
  elements.projectClientName.value = project.clientName || "";
  elements.pm.value = project.pm;
  elements.members.value = (project.members || []).join(", ");
  elements.startDate.value = project.startDate;
  elements.endDate.value = project.endDate;
  elements.plannedManmonths.value = String(project.plannedManmonths);
  elements.contractManmonths.value = String(project.contractManmonths);
  elements.usedManmonths.value = String(project.usedManmonths);
  elements.expectedManmonths.value = String(project.expectedManmonths);
  elements.progress.value = String(project.progress);
  elements.status.value = project.status;
  elements.risk.value = project.risk || "";
  elements.memo.value = project.memo || "";
  syncClientField();
  syncProgressLabel(elements.progress, elements.progressValue);
}

function setFormMode(mode) {
  formMode = mode;
  const isEdit = mode === FORM_MODE.EDIT;
  elements.projectFormTitle.textContent = isEdit ? "프로젝트 수정" : "프로젝트 등록";
  elements.formHelp.textContent = isEdit ? "수정 모드" : "등록 모드";
  elements.saveBtn.textContent = isEdit ? "수정 저장" : "프로젝트 저장";
}

function resetProjectForm() {
  elements.form.reset();
  elements.projectId.value = "";
  setFormMode(FORM_MODE.CREATE);
  initDefaults();
}

function resetDetail() {
  elements.detailEmpty.classList.remove("hidden");
  elements.detail.classList.add("hidden");
  elements.updateList.innerHTML = "";
  elements.openEditBtn.disabled = true;
  elements.openUpdateBtn.disabled = true;
  selectedProjectId = null;
}

function syncUpdateFormState() {
  const hasProject = Boolean(getSelectedProject());
  elements.updateEmpty.classList.toggle("hidden", hasProject);
  elements.updateForm.classList.toggle("hidden", !hasProject);
  if (hasProject) {
    elements.updateForm.reset();
    elements.updateDate.value = new Date().toISOString().slice(0, 10);
    elements.updateAuthor.value = getSelectedProject()?.pm || "";
    syncProgressLabel(elements.updateProgress, elements.updateProgressValue);
  }
}

function renderClients() {
  const searchText = (elements.clientSearch.value || "").trim().toLowerCase();
  const statusFilter = elements.clientStatusFilter.value;
  const industryFilter = elements.clientIndustryFilter.value;

  const filtered = clients.filter((client) => {
    if (statusFilter && client.status !== statusFilter) {
      return false;
    }
    if (industryFilter && client.industry !== industryFilter) {
      return false;
    }
    if (searchText) {
      const searchable = [client.name, client.industry, client.manager, client.contact, client.note]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(searchText)) {
        return false;
      }
    }
    return true;
  });

  elements.clientList.innerHTML = "";

  if (filtered.length === 0) {
    elements.clientList.innerHTML = "<p class=\"empty-state\">조건에 맞는 고객사가 없습니다.</p>";
    return;
  }

  const sorted = [...filtered].sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  for (const client of sorted) {
    const node = elements.clientCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".client-title").textContent = client.name;
    node.querySelectorAll(".chip")[0].textContent = client.status;
    node.querySelector(".client-industry").textContent = `업종: ${client.industry || "-"}`;
    node.querySelector(".client-manager").textContent = `담당자: ${client.manager || "-"}`;
    node.querySelector(".client-contact").textContent = `연락처: ${client.contact || "-"}`;
    node.querySelector(".client-note").textContent = client.note || "-";

    const useBtn = node.querySelector(".client-use-btn");
    const editBtn = node.querySelector(".client-edit-btn");
    const deleteBtn = node.querySelector(".client-delete-btn");

    useBtn.addEventListener("click", () => {
      elements.type.value = "고객사";
      elements.projectClientName.value = client.name;
      syncClientField();
      setView("create");
    });

    editBtn.addEventListener("click", () => {
      selectedClientId = client.id;
      fillClientFormForEdit(client);
    });

    deleteBtn.addEventListener("click", () => {
      onDeleteClient(client.id);
    });

    elements.clientList.appendChild(node);
  }
}

function fillClientFormForEdit(client) {
  if (!client) {
    return;
  }

  selectedClientId = client.id;
  setClientFormValues(client);
  setClientFormMode(FORM_MODE.EDIT);
  elements.clientForm.classList.remove("hidden");
}

function setClientFormValues(client) {
  elements.clientId.value = client.id;
  elements.clientCompanyName.value = client.name;
  elements.clientIndustry.value = client.industry || "";
  elements.clientManager.value = client.manager || "";
  elements.clientContact.value = client.contact || "";
  elements.clientStatus.value = client.status;
  elements.clientNote.value = client.note || "";
}

function setClientFormMode(mode) {
  clientFormMode = mode;
  const isEdit = mode === FORM_MODE.EDIT;
  elements.clientFormHelp.textContent = isEdit ? "고객사 수정 모드" : "고객사 등록 모드";
}

function resetClientForm() {
  elements.clientForm.reset();
  elements.clientId.value = "";
  setClientFormMode(FORM_MODE.CREATE);
  selectedClientId = null;
}

function syncClientOptions() {
  if (!elements.clientNameOptions) {
    return;
  }
  const candidates = [...clients]
    .filter((client) => client.status === "활성")
    .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));

  elements.clientNameOptions.innerHTML = candidates
    .map((client) => `<option value="${client.name}">`)
    .join("");
}

function setView(view) {
  const resolvedPanel = VIEW_TO_PANEL[view] || "list";
  const navView = VIEW_TO_NAV[view] || "list";
  currentView = view;

  elements.navTabs.forEach((tab) => {
    const active = tab.dataset.view === navView;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-current", active ? "page" : "false");
  });
  elements.viewPanels.forEach((panel) => {
    const show = panel.dataset.viewPanel === resolvedPanel;
    panel.classList.toggle("hidden", !show);
  });

  if (view === "create") {
    selectedProjectId = null;
    setFormMode(FORM_MODE.CREATE);
    elements.projectId.value = "";
    elements.form.reset();
    initDefaults();
  }

  if (view === "clients") {
    elements.clientForm.classList.add("hidden");
    setClientFormMode(FORM_MODE.CREATE);
    renderClients();
  }

  if (view === "edit") {
    if (!selectedProjectId) {
      setView("list");
      return;
    }
    const project = getSelectedProject();
    if (!project) {
      setView("list");
      return;
    }
    setProjectFormValues(project);
    setFormMode(FORM_MODE.EDIT);
  }

  if (view === "detail") {
    const project = getSelectedProject();
    if (!project) {
      setView("list");
      return;
    }
    renderProjectDetail(project);
    elements.openUpdateBtn.disabled = false;
  }

  if (view === "update") {
    const project = getSelectedProject();
    if (!project) {
      setView("list");
      return;
    }
    elements.openUpdateBtn.disabled = false;
    elements.openDetailBtn.disabled = false;
    syncUpdateFormState();
  }

  if (view === "list") {
    renderList();
  }
}

function getSelectedProject() {
  if (!selectedProjectId) {
    return null;
  }
  return projects.find((p) => p.id === selectedProjectId) || null;
}

function splitCsv(value) {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function persistProjects() {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function persistClients() {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
}

function loadProjects() {
  const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        ...item,
        members: Array.isArray(item.members) ? item.members : [],
        updates: Array.isArray(item.updates) ? item.updates : [],
        progress: Number.isFinite(Number(item.progress)) ? Number(item.progress) : 0,
      }));
  } catch {
    console.warn("Failed to parse project data from localStorage. Resetting saved data.");
    return [];
  }
}

function loadClients() {
  const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        ...item,
        status: CLIENT_STATUS.includes(item.status) ? item.status : "활성",
      }));
  } catch {
    console.warn("Failed to parse client data from localStorage. Resetting saved data.");
    return [];
  }
}

function formatDate(value) {
  if (!value) {
    return "-";
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("ko-KR").format(d);
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}
