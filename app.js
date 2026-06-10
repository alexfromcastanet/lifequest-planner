const STORAGE_KEY = "lifequest.tasks.v1";

const categories = {
  work: {
    label: "Work",
    color: "#2867d8",
    icon: "#icon-briefcase",
    xp: 30,
    weekTarget: 180
  },
  gym: {
    label: "Gym",
    color: "#16865f",
    icon: "#icon-dumbbell",
    xp: 40,
    weekTarget: 160
  },
  diet: {
    label: "Diet",
    color: "#c85b36",
    icon: "#icon-apple",
    xp: 25,
    weekTarget: 140
  },
  life: {
    label: "Life",
    color: "#a36b00",
    icon: "#icon-heart",
    xp: 20,
    weekTarget: 120
  }
};

const categoryList = Object.entries(categories).map(([id, value]) => ({
  id,
  ...value
}));

const templates = [
  { title: "Deep work block", category: "work", time: "09:00", xp: 35 },
  { title: "Admin cleanup", category: "work", time: "16:00", xp: 20 },
  { title: "Strength session", category: "gym", time: "18:00", xp: 45 },
  { title: "Mobility reset", category: "gym", time: "20:30", xp: 20 },
  { title: "Meal prep", category: "diet", time: "12:00", xp: 30 },
  { title: "Protein target", category: "diet", time: "", xp: 25 },
  { title: "Sleep wind down", category: "life", time: "22:00", xp: 25 },
  { title: "Plan tomorrow", category: "life", time: "21:00", xp: 20 }
];

const repeatLabels = {
  none: "One-time",
  daily: "Daily",
  weekdays: "Weekdays",
  weekly: "Weekly"
};

const achievements = [
  {
    title: "First 100 XP",
    detail: "Earn 100 total XP",
    isUnlocked: (stats) => stats.totalXP >= 100
  },
  {
    title: "Three-day streak",
    detail: "Complete quests 3 days in a row",
    isUnlocked: (stats) => stats.streak >= 3
  },
  {
    title: "Balanced day",
    detail: "Finish 3 types in one day",
    isUnlocked: (stats) => stats.todayCategories >= 3
  },
  {
    title: "Work sprint",
    detail: "Finish 5 work quests",
    isUnlocked: (stats) => stats.completedByCategory.work >= 5
  },
  {
    title: "Gym rhythm",
    detail: "Finish 5 gym quests",
    isUnlocked: (stats) => stats.completedByCategory.gym >= 5
  },
  {
    title: "Twenty done",
    detail: "Complete 20 quests",
    isUnlocked: (stats) => stats.completed >= 20
  }
];

const today = new Date();
const todayKey = toDateKey(today);

const state = {
  tasks: loadTasks(),
  selectedDate: todayKey,
  visibleMonth: new Date(today.getFullYear(), today.getMonth(), 1),
  activeView: "today",
  agendaMode: "timeline",
  filter: "all"
};

const dom = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindDom();
  renderCategorySelect();
  renderFilters();
  renderTemplates();
  syncFormDate();
  bindEvents();
  renderAll();
}

function bindDom() {
  [
    "level-number",
    "level-xp",
    "next-level-xp",
    "level-fill",
    "today-score",
    "streak-count",
    "complete-count",
    "category-board",
    "task-form",
    "task-title",
    "task-category",
    "task-date",
    "task-repeat",
    "task-time",
    "task-xp",
    "filter-row",
    "agenda-title",
    "selected-day-pill",
    "timeline-list",
    "task-list",
    "completed-menu",
    "completed-summary",
    "completed-count",
    "completed-task-list",
    "template-grid",
    "month-label",
    "calendar-grid",
    "calendar-day-title",
    "calendar-task-list",
    "calendar-completed-menu",
    "calendar-completed-summary",
    "calendar-completed-count",
    "calendar-completed-task-list",
    "week-title",
    "week-xp",
    "week-bars",
    "achievement-grid",
    "quick-add-toggle"
  ].forEach((id) => {
    dom[toCamel(id)] = document.getElementById(id);
  });
}

function bindEvents() {
  dom.taskForm.addEventListener("submit", handleTaskSubmit);
  dom.taskCategory.addEventListener("change", () => {
    const category = categories[dom.taskCategory.value];
    dom.taskXp.value = category ? category.xp : 25;
  });
  dom.quickAddToggle.addEventListener("click", openQuickSheet);

  document.getElementById("prev-month").addEventListener("click", () => {
    state.visibleMonth = new Date(
      state.visibleMonth.getFullYear(),
      state.visibleMonth.getMonth() - 1,
      1
    );
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    state.visibleMonth = new Date(
      state.visibleMonth.getFullYear(),
      state.visibleMonth.getMonth() + 1,
      1
    );
    renderCalendar();
  });

  document.getElementById("jump-today").addEventListener("click", () => {
    selectDate(todayKey);
    state.visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setView("today");
  });

  document.getElementById("reset-demo").addEventListener("click", () => {
    const shouldReset = window.confirm("Reset to starter quests?");
    if (!shouldReset) return;
    state.tasks = seedTasks();
    state.selectedDate = todayKey;
    state.visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    state.filter = "all";
    saveTasks();
    syncFormDate();
    renderAll();
  });

  document.addEventListener("click", (event) => {
    const sheetClose = event.target.closest("[data-sheet-close]");
    if (sheetClose) {
      closeQuickSheet();
      return;
    }

    const agendaModeButton = event.target.closest("[data-agenda-mode]");
    if (agendaModeButton) {
      state.agendaMode = agendaModeButton.dataset.agendaMode;
      renderAgenda();
      return;
    }

    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      setView(viewButton.dataset.view);
      return;
    }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      state.filter = filterButton.dataset.filter;
      renderFilters();
      renderAgenda();
      renderCalendarAgenda();
      return;
    }

    const dayButton = event.target.closest(".calendar-day[data-date]");
    if (dayButton) {
      selectDate(dayButton.dataset.date);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      handleTaskAction(actionButton);
      return;
    }

    const templateButton = event.target.closest("[data-template]");
    if (templateButton) {
      addTemplateQuest(Number(templateButton.dataset.template));
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeQuickSheet();
    }
  });
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const title = dom.taskTitle.value.trim();
  if (!title) return;

  const category = categories[dom.taskCategory.value] ? dom.taskCategory.value : "work";
  const date = dom.taskDate.value || state.selectedDate;
  const xp = clamp(Number(dom.taskXp.value) || categories[category].xp, 5, 200);
  const repeat = repeatLabels[dom.taskRepeat.value] ? dom.taskRepeat.value : "none";

  state.tasks.push({
    id: createId(),
    title,
    category,
    date,
    repeat,
    time: dom.taskTime.value,
    xp,
    completed: false,
    completedAt: null,
    completions: {},
    createdAt: new Date().toISOString()
  });

  selectDate(date);
  saveTasks();
  dom.taskForm.reset();
  dom.taskCategory.value = category;
  dom.taskRepeat.value = "none";
  dom.taskXp.value = categories[category].xp;
  syncFormDate();
  closeQuickSheet();
  if (!isMobileViewport()) {
    dom.taskTitle.focus();
  }
  renderAll();
}

function handleTaskAction(button) {
  const task = state.tasks.find((item) => item.id === button.dataset.id);
  if (!task) return;
  const dateKey = button.dataset.date || state.selectedDate;

  if (button.dataset.action === "toggle") {
    setTaskCompletion(task, dateKey, !isTaskCompletedOnDate(task, dateKey));
  }

  if (button.dataset.action === "delete") {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
  }

  saveTasks();
  renderAll();
}

function addTemplateQuest(index) {
  const template = templates[index];
  if (!template) return;

  state.tasks.push({
    id: createId(),
    title: template.title,
    category: template.category,
    date: state.selectedDate,
    repeat: "none",
    time: template.time,
    xp: template.xp,
    completed: false,
    completedAt: null,
    completions: {},
    createdAt: new Date().toISOString()
  });

  saveTasks();
  renderAll();
}

function setView(view) {
  if (!["today", "calendar", "progress"].includes(view)) return;
  state.activeView = view;

  document.querySelectorAll(".view").forEach((section) => {
    section.hidden = section.id !== `${view}-view`;
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    if (button.getAttribute("role") === "tab") {
      button.setAttribute("aria-selected", String(isActive));
    }
  });

  renderAll();
}

function openQuickSheet() {
  document.body.classList.add("quick-sheet-open");
  dom.taskForm.classList.add("is-open");
  dom.taskForm.style.setProperty("display", "grid", "important");
  dom.quickAddToggle.setAttribute("aria-expanded", "true");
  window.setTimeout(() => dom.taskTitle.focus(), 120);
}

function closeQuickSheet() {
  document.body.classList.remove("quick-sheet-open");
  if (dom.taskForm) {
    dom.taskForm.classList.remove("is-open");
    dom.taskForm.style.removeProperty("display");
  }
  if (dom.quickAddToggle) {
    dom.quickAddToggle.setAttribute("aria-expanded", "false");
  }
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function selectDate(dateKey) {
  state.selectedDate = dateKey;
  const date = parseDateKey(dateKey);
  state.visibleMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  syncFormDate();
  renderAll();
}

function renderAll() {
  renderStats();
  renderCategoryBoard();
  renderAgenda();
  renderCalendar();
  renderCalendarAgenda();
  renderProgress();
}

function renderCategorySelect() {
  dom.taskCategory.innerHTML = categoryList
    .map((category) => `<option value="${category.id}">${category.label}</option>`)
    .join("");
  dom.taskCategory.value = "work";
  dom.taskXp.value = categories.work.xp;
}

function renderFilters() {
  const chips = [
    { id: "all", label: "All", color: "#181c23" },
    ...categoryList.map((category) => ({
      id: category.id,
      label: category.label,
      color: category.color
    }))
  ];

  dom.filterRow.innerHTML = chips
    .map((chip) => {
      const activeClass = chip.id === state.filter ? " is-active" : "";
      return `
        <button class="filter-chip${activeClass}" type="button" data-filter="${chip.id}" style="--category-color: ${chip.color}">
          ${chip.label}
        </button>
      `;
    })
    .join("");
}

function renderTemplates() {
  dom.templateGrid.innerHTML = templates
    .map((template, index) => {
      const category = categories[template.category];
      return `
        <button class="template-button" type="button" data-template="${index}" style="--category-color: ${category.color}">
          <svg class="icon"><use href="${category.icon}"></use></svg>
          <span class="template-copy">
            <strong>${escapeHtml(template.title)}</strong>
            <span>${category.label} / ${template.xp} XP</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderStats() {
  const stats = getStats();
  const level = getLevel(stats.totalXP);
  const todayTasks = getTasksForDate(todayKey, "all");
  const todayDone = todayTasks.filter((task) => task.completed).length;
  const todayScore = todayTasks.length ? Math.round((todayDone / todayTasks.length) * 100) : 0;

  dom.levelNumber.textContent = String(level.level);
  dom.levelXp.textContent = `${stats.totalXP} XP`;
  dom.nextLevelXp.textContent = `${level.remaining} to next`;
  dom.levelFill.style.width = `${level.percent}%`;
  dom.todayScore.textContent = `${todayScore}%`;
  dom.streakCount.textContent = `${stats.streak} ${stats.streak === 1 ? "day" : "days"}`;
  dom.completeCount.textContent = String(stats.completed);
}

function renderCategoryBoard() {
  const weekStart = getWeekStart(parseDateKey(todayKey));
  const weekEnd = addDays(weekStart, 6);

  dom.categoryBoard.innerHTML = categoryList
    .map((category) => {
      const weekTasks = getTaskOccurrencesForRange(weekStart, weekEnd, category.id);
      const done = weekTasks.filter((task) => task.completed);
      const xp = sumXp(done);

      return `
        <div class="category-row" style="--category-color: ${category.color}">
          <svg class="icon"><use href="${category.icon}"></use></svg>
          <span class="category-copy">
            <strong>${category.label}</strong>
            <span>${done.length}/${weekTasks.length || 0} quests this week</span>
          </span>
          <span class="category-xp">${xp} XP</span>
        </div>
      `;
    })
    .join("");
}

function renderAgenda() {
  const tasks = getTasksForDate(state.selectedDate, state.filter);
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const completedXp = sumXp(completedTasks);
  const completed = completedTasks.length;

  dom.agendaTitle.textContent = formatDate(state.selectedDate, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
  dom.selectedDayPill.textContent = `${completed}/${tasks.length} / ${completedXp} XP`;
  document.querySelectorAll("[data-agenda-mode]").forEach((button) => {
    const isActive = button.dataset.agendaMode === state.agendaMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  dom.timelineList.classList.toggle("is-hidden", state.agendaMode !== "timeline");
  dom.taskList.classList.toggle("is-hidden", state.agendaMode !== "list");
  dom.timelineList.innerHTML = renderTimelineList(activeTasks, getActiveEmptyText(tasks));
  dom.taskList.innerHTML = renderTaskList(activeTasks, getActiveEmptyText(tasks));
  renderCompletedMenu({
    menu: dom.completedMenu,
    summary: dom.completedSummary,
    count: dom.completedCount,
    list: dom.completedTaskList,
    tasks: completedTasks,
    label: state.selectedDate === todayKey ? "Daily completed tasks" : "Completed tasks"
  });
}

function renderCalendar() {
  const month = state.visibleMonth;
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const cells = [];

  dom.monthLabel.textContent = month.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  for (let index = 0; index < 42; index += 1) {
    const date = addDays(gridStart, index);
    const key = toDateKey(date);
    const dayTasks = getTasksForDate(key, "all");
    const doneCount = dayTasks.filter((task) => task.completed).length;
    const categoryDots = [...new Set(dayTasks.map((task) => task.category))].slice(0, 5);
    const classNames = ["calendar-day"];

    if (date.getMonth() !== month.getMonth()) classNames.push("is-muted");
    if (key === todayKey) classNames.push("is-today");
    if (key === state.selectedDate) classNames.push("is-selected");

    cells.push(`
      <button class="${classNames.join(" ")}" type="button" data-date="${key}" aria-label="${formatDate(key, {
        weekday: "long",
        month: "long",
        day: "numeric"
      })}, ${dayTasks.length} quests">
        <span class="day-number">${date.getDate()}</span>
        <span class="dot-row">
          ${categoryDots
            .map((categoryId) => {
              const category = categories[categoryId];
              return `<span class="task-dot" style="--category-color: ${category.color}"></span>`;
            })
            .join("")}
        </span>
        <span class="day-count">${doneCount}/${dayTasks.length}</span>
      </button>
    `);
  }

  dom.calendarGrid.innerHTML = cells.join("");
}

function renderCalendarAgenda() {
  const tasks = getTasksForDate(state.selectedDate, state.filter);
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  dom.calendarDayTitle.textContent = formatDate(state.selectedDate, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
  dom.calendarTaskList.innerHTML = renderTaskList(activeTasks, getActiveEmptyText(tasks, "No quests on the selected day."));
  renderCompletedMenu({
    menu: dom.calendarCompletedMenu,
    summary: dom.calendarCompletedSummary,
    count: dom.calendarCompletedCount,
    list: dom.calendarCompletedTaskList,
    tasks: completedTasks,
    label: "Completed tasks"
  });
}

function renderCompletedMenu({ menu, summary, count, list, tasks, label }) {
  if (!menu || !summary || !count || !list) return;

  summary.textContent = label;
  count.textContent = String(tasks.length);
  list.innerHTML = renderTaskList(tasks, "No completed quests.");
  menu.hidden = tasks.length === 0;
  if (tasks.length === 0) {
    menu.open = false;
  }
}

function getActiveEmptyText(tasks, emptyText = "No quests for this day.") {
  if (tasks.length && tasks.every((task) => task.completed)) {
    return "All quests completed.";
  }

  return emptyText;
}

function renderProgress() {
  const stats = getStats();
  const weekStart = getWeekStart(parseDateKey(todayKey));
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const dailyTarget = 120;
  const weekXp = weekDays.reduce((total, date) => {
    const tasks = getTasksForDate(toDateKey(date), "all").filter((task) => task.completed);
    return total + sumXp(tasks);
  }, 0);

  dom.weekTitle.textContent = `${formatDate(toDateKey(weekStart), {
    month: "short",
    day: "numeric"
  })} - ${formatDate(toDateKey(addDays(weekStart, 6)), {
    month: "short",
    day: "numeric"
  })}`;
  dom.weekXp.textContent = `${weekXp} XP`;

  dom.weekBars.innerHTML = weekDays
    .map((date) => {
      const key = toDateKey(date);
      const completed = getTasksForDate(key, "all").filter((task) => task.completed);
      const xp = sumXp(completed);
      const percent = Math.min(100, Math.round((xp / dailyTarget) * 100));
      return `
        <div class="week-row">
          <span class="week-label">${date.toLocaleDateString(undefined, { weekday: "short" })}</span>
          <span class="week-track"><span class="week-fill" style="width: ${percent}%"></span></span>
          <span class="week-xp">${xp} XP</span>
        </div>
      `;
    })
    .join("");

  dom.achievementGrid.innerHTML = achievements
    .map((achievement) => {
      const unlocked = achievement.isUnlocked(stats);
      const className = unlocked ? "achievement" : "achievement is-locked";
      return `
        <div class="${className}">
          <svg class="icon"><use href="${unlocked ? "#icon-trophy" : "#icon-flag"}"></use></svg>
          <span>
            <strong>${achievement.title}</strong>
            <span>${achievement.detail}</span>
          </span>
        </div>
      `;
    })
    .join("");
}

function renderTaskList(tasks, emptyText) {
  if (!tasks.length) {
    return `<li class="empty-state">${emptyText}</li>`;
  }

  return tasks.map(renderTaskItem).join("");
}

function renderTimelineList(tasks, emptyText) {
  if (!tasks.length) {
    return `<li class="empty-state">${emptyText}</li>`;
  }

  return tasks.map(renderTimelineItem).join("");
}

function renderTimelineItem(task) {
  const category = categories[task.category] || categories.work;
  const completeClass = task.completed ? " is-complete" : "";
  const statusText = task.completed ? "Mark incomplete" : "Mark complete";
  const timeLabel = task.time ? formatTime(task.time) : "Anytime";
  const occurrenceDate = task.occurrenceDate || task.date;
  const repeatLabel = task.repeat && task.repeat !== "none" ? repeatLabels[task.repeat] : "";

  return `
    <li class="timeline-item${completeClass}" style="--category-color: ${category.color}">
      <span class="timeline-time">${timeLabel}</span>
      <div class="timeline-card">
        <button class="task-check" type="button" data-action="toggle" data-id="${task.id}" data-date="${occurrenceDate}" aria-label="${statusText}: ${escapeHtml(task.title)}">
          <svg class="icon"><use href="#icon-check"></use></svg>
        </button>
        <span class="task-body">
          <strong class="task-title">${escapeHtml(task.title)}</strong>
          <span class="task-meta">
            <span>${category.label}</span>
            ${task.completed ? "<span>Completed</span>" : ""}
            ${repeatLabel ? `<span>${repeatLabel}</span>` : ""}
          </span>
        </span>
        <span class="xp-badge">${task.xp} XP</span>
        <button class="icon-button delete-button" type="button" data-action="delete" data-id="${task.id}" aria-label="Delete: ${escapeHtml(task.title)}">
          <svg class="icon"><use href="#icon-trash"></use></svg>
        </button>
      </div>
    </li>
  `;
}

function renderTaskItem(task) {
  const category = categories[task.category] || categories.work;
  const completeClass = task.completed ? " is-complete" : "";
  const statusText = task.completed ? "Mark incomplete" : "Mark complete";
  const timeLabel = task.time ? formatTime(task.time) : "Anytime";
  const occurrenceDate = task.occurrenceDate || task.date;
  const repeatLabel = task.repeat && task.repeat !== "none" ? repeatLabels[task.repeat] : "";

  return `
    <li class="task-item${completeClass}" style="--category-color: ${category.color}">
      <button class="task-check" type="button" data-action="toggle" data-id="${task.id}" data-date="${occurrenceDate}" aria-label="${statusText}: ${escapeHtml(task.title)}">
        <svg class="icon"><use href="#icon-check"></use></svg>
      </button>
      <span class="task-body">
        <strong class="task-title">${escapeHtml(task.title)}</strong>
        <span class="task-meta">
          <span>${category.label}</span>
          <span>${timeLabel}</span>
          ${task.completed ? "<span>Completed</span>" : ""}
          ${repeatLabel ? `<span>${repeatLabel}</span>` : ""}
        </span>
      </span>
      <span class="xp-badge">${task.xp} XP</span>
      <button class="icon-button delete-button" type="button" data-action="delete" data-id="${task.id}" aria-label="Delete: ${escapeHtml(task.title)}">
        <svg class="icon"><use href="#icon-trash"></use></svg>
      </button>
    </li>
  `;
}

function getTasksForDate(dateKey, filter) {
  return state.tasks
    .map((task) => getTaskOccurrence(task, dateKey))
    .filter(Boolean)
    .filter((task) => filter === "all" || task.category === filter)
    .sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
      if (a.time && b.time && a.time !== b.time) return a.time.localeCompare(b.time);
      if (a.time && !b.time) return -1;
      if (!a.time && b.time) return 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

function getTaskOccurrence(task, dateKey) {
  if (!taskOccursOnDate(task, dateKey)) return null;
  return {
    ...task,
    occurrenceDate: dateKey,
    completed: isTaskCompletedOnDate(task, dateKey),
    completedAt: getTaskCompletedAt(task, dateKey)
  };
}

function getTaskOccurrencesForRange(startDate, endDate, categoryId = "all") {
  const occurrences = [];
  let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  while (cursor <= endDate) {
    const dateKey = toDateKey(cursor);
    occurrences.push(...getTasksForDate(dateKey, categoryId));
    cursor = addDays(cursor, 1);
  }

  return occurrences;
}

function getCompletedOccurrences() {
  const completed = [];

  state.tasks.forEach((task) => {
    if (isRecurringTask(task)) {
      Object.keys(task.completions || {}).forEach((dateKey) => {
        const occurrence = getTaskOccurrence(task, dateKey);
        if (occurrence && occurrence.completed) {
          completed.push(occurrence);
        }
      });
      return;
    }

    if (task.completed) {
      completed.push(getTaskOccurrence(task, task.date) || { ...task, occurrenceDate: task.date });
    }
  });

  return completed;
}

function taskOccursOnDate(task, dateKey) {
  if (!task.date || dateKey < task.date) return false;
  if (!isRecurringTask(task)) return task.date === dateKey;

  const date = parseDateKey(dateKey);
  const start = parseDateKey(task.date);

  if (task.repeat === "daily") return true;
  if (task.repeat === "weekdays") {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  }
  if (task.repeat === "weekly") return date.getDay() === start.getDay();

  return task.date === dateKey;
}

function isRecurringTask(task) {
  return Boolean(task.repeat && task.repeat !== "none");
}

function isTaskCompletedOnDate(task, dateKey) {
  if (isRecurringTask(task)) {
    return Boolean(task.completions && task.completions[dateKey] && task.completions[dateKey].completed);
  }

  return Boolean(task.completed);
}

function getTaskCompletedAt(task, dateKey) {
  if (isRecurringTask(task)) {
    return task.completions && task.completions[dateKey] ? task.completions[dateKey].completedAt : null;
  }

  return task.completedAt || null;
}

function setTaskCompletion(task, dateKey, completed) {
  if (isRecurringTask(task)) {
    task.completions = task.completions || {};
    if (completed) {
      task.completions[dateKey] = {
        completed: true,
        completedAt: new Date().toISOString()
      };
    } else {
      delete task.completions[dateKey];
    }
    return;
  }

  task.completed = completed;
  task.completedAt = completed ? new Date().toISOString() : null;
}

function getStats() {
  const completedTasks = getCompletedOccurrences();
  const todayDone = getTasksForDate(todayKey, "all").filter((task) => task.completed);
  const completedByCategory = categoryList.reduce((accumulator, category) => {
    accumulator[category.id] = completedTasks.filter((task) => task.category === category.id).length;
    return accumulator;
  }, {});

  return {
    totalXP: sumXp(completedTasks),
    completed: completedTasks.length,
    streak: getStreak(),
    todayCategories: new Set(todayDone.map((task) => task.category)).size,
    completedByCategory
  };
}

function getLevel(totalXp) {
  let level = 1;
  let xpIntoLevel = totalXp;
  let nextLevel = 450;

  while (xpIntoLevel >= nextLevel) {
    xpIntoLevel -= nextLevel;
    level += 1;
    nextLevel = 450 + (level - 1) * 150;
  }

  return {
    level,
    remaining: nextLevel - xpIntoLevel,
    percent: Math.round((xpIntoLevel / nextLevel) * 100)
  };
}

function getStreak() {
  let cursor = parseDateKey(todayKey);
  let count = 0;

  if (!hasCompletedQuest(toDateKey(cursor))) {
    const yesterday = addDays(cursor, -1);
    if (!hasCompletedQuest(toDateKey(yesterday))) return 0;
    cursor = yesterday;
  }

  while (hasCompletedQuest(toDateKey(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }

  return count;
}

function hasCompletedQuest(dateKey) {
  return getTasksForDate(dateKey, "all").some((task) => task.completed);
}

function sumXp(tasks) {
  return tasks.reduce((total, task) => total + Number(task.xp || 0), 0);
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeTask).filter(Boolean);
      }
    }
  } catch (error) {
    console.warn("Unable to load saved tasks", error);
  }

  const seeded = seedTasks();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch (error) {
    console.warn("Unable to save starter tasks", error);
  }
  return seeded;
}

function normalizeTask(task) {
  if (!task || !task.title || !task.date) return null;
  const category = categories[task.category] ? task.category : "work";
  const repeat = repeatLabels[task.repeat] ? task.repeat : "none";
  const completions =
    task.completions && typeof task.completions === "object" && !Array.isArray(task.completions)
      ? task.completions
      : {};

  if (repeat !== "none" && task.completed && !completions[task.date]) {
    completions[task.date] = {
      completed: true,
      completedAt: task.completedAt || new Date().toISOString()
    };
  }

  return {
    id: task.id || createId(),
    title: String(task.title),
    category,
    date: task.date,
    repeat,
    time: task.time || "",
    xp: clamp(Number(task.xp) || categories[category].xp, 5, 200),
    completed: repeat === "none" ? Boolean(task.completed) : false,
    completedAt: task.completedAt || null,
    completions,
    createdAt: task.createdAt || new Date().toISOString()
  };
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch (error) {
    console.warn("Unable to save tasks", error);
  }
}

function seedTasks() {
  const yesterdayKey = toDateKey(addDays(today, -1));
  const tomorrowKey = toDateKey(addDays(today, 1));
  const twoDaysAgoKey = toDateKey(addDays(today, -2));

  return [
    makeTask("Plan top three work wins", "work", todayKey, "08:30", 25, true, "daily"),
    makeTask("90-minute focus block", "work", todayKey, "10:00", 35, false),
    makeTask("Strength workout", "gym", todayKey, "18:00", 45, false),
    makeTask("Protein-forward dinner", "diet", todayKey, "19:30", 25, false, "weekdays"),
    makeTask("Pack gym bag", "life", tomorrowKey, "07:30", 15, false),
    makeTask("Meal prep base", "diet", tomorrowKey, "12:00", 30, false),
    makeTask("Walk and mobility", "gym", yesterdayKey, "18:30", 25, true),
    makeTask("Shutdown routine", "life", yesterdayKey, "21:30", 20, true),
    makeTask("Inbox zero sprint", "work", twoDaysAgoKey, "16:00", 25, true)
  ];
}

function makeTask(title, category, date, time, xp, completed, repeat = "none") {
  const completions = {};
  if (repeat !== "none" && completed) {
    completions[date] = {
      completed: true,
      completedAt: new Date().toISOString()
    };
  }

  return {
    id: createId(),
    title,
    category,
    date,
    repeat,
    time,
    xp,
    completed: repeat === "none" ? completed : false,
    completedAt: completed ? new Date().toISOString() : null,
    completions,
    createdAt: new Date().toISOString()
  };
}

function syncFormDate() {
  if (dom.taskDate) {
    dom.taskDate.value = state.selectedDate;
  }
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function getWeekStart(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  return copy;
}

function formatDate(dateKey, options) {
  return parseDateKey(dateKey).toLocaleDateString(undefined, options);
}

function formatTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    };
    return map[char];
  });
}

function toCamel(id) {
  return id.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
