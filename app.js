const STORAGE_KEY = "lifequest.tasks.v1";
const WORKOUT_STORAGE_KEY = "lifequest.workouts.v1";

const muscleGroups = {
  chest: { label: "Chest", color: "#b94848" },
  back: { label: "Back", color: "#2867d8" },
  legs: { label: "Legs", color: "#16865f" },
  shoulders: { label: "Shoulders", color: "#7b5bd6" },
  arms: { label: "Arms", color: "#c85b36" },
  core: { label: "Core", color: "#a36b00" },
  cardio: { label: "Cardio", color: "#0f6f68" }
};

const muscleGroupList = Object.entries(muscleGroups).map(([id, value]) => ({
  id,
  ...value
}));

const exerciseLibrary = [
  { id: "bench-press", name: "Bench Press", group: "chest", sets: 3, reps: 8 },
  { id: "incline-dumbbell-press", name: "Incline DB Press", group: "chest", sets: 3, reps: 10 },
  { id: "push-up", name: "Push-up", group: "chest", sets: 3, reps: 12 },
  { id: "lat-pulldown", name: "Lat Pulldown", group: "back", sets: 3, reps: 10 },
  { id: "seated-row", name: "Seated Row", group: "back", sets: 3, reps: 10 },
  { id: "deadlift", name: "Deadlift", group: "back", sets: 3, reps: 5 },
  { id: "squat", name: "Squat", group: "legs", sets: 3, reps: 8 },
  { id: "romanian-deadlift", name: "Romanian Deadlift", group: "legs", sets: 3, reps: 8 },
  { id: "leg-press", name: "Leg Press", group: "legs", sets: 3, reps: 10 },
  { id: "lunge", name: "Lunge", group: "legs", sets: 3, reps: 10 },
  { id: "shoulder-press", name: "Shoulder Press", group: "shoulders", sets: 3, reps: 8 },
  { id: "lateral-raise", name: "Lateral Raise", group: "shoulders", sets: 3, reps: 12 },
  { id: "face-pull", name: "Face Pull", group: "shoulders", sets: 3, reps: 12 },
  { id: "biceps-curl", name: "Biceps Curl", group: "arms", sets: 3, reps: 10 },
  { id: "triceps-pushdown", name: "Triceps Pushdown", group: "arms", sets: 3, reps: 10 },
  { id: "hammer-curl", name: "Hammer Curl", group: "arms", sets: 3, reps: 10 },
  { id: "plank", name: "Plank", group: "core", sets: 3, reps: 45 },
  { id: "cable-crunch", name: "Cable Crunch", group: "core", sets: 3, reps: 12 },
  { id: "hanging-knee-raise", name: "Hanging Knee Raise", group: "core", sets: 3, reps: 10 },
  { id: "bike", name: "Bike", group: "cardio", sets: 1, reps: 20 },
  { id: "incline-walk", name: "Incline Walk", group: "cardio", sets: 1, reps: 20 },
  { id: "rower", name: "Rower", group: "cardio", sets: 1, reps: 12 }
];

const exerciseMap = Object.fromEntries(exerciseLibrary.map((exercise) => [exercise.id, exercise]));

const workoutTypePresets = [
  {
    id: "push",
    label: "Push",
    name: "Push Day",
    groups: ["chest", "shoulders", "arms"],
    exercises: ["bench-press", "shoulder-press", "lateral-raise", "triceps-pushdown"]
  },
  {
    id: "pull",
    label: "Pull",
    name: "Pull Day",
    groups: ["back", "arms"],
    exercises: ["lat-pulldown", "seated-row", "face-pull", "biceps-curl"]
  },
  {
    id: "legs",
    label: "Legs",
    name: "Leg Day",
    groups: ["legs", "core"],
    exercises: ["squat", "romanian-deadlift", "leg-press", "plank"]
  },
  {
    id: "full",
    label: "Full Body",
    name: "Full Body",
    groups: ["chest", "back", "legs", "core"],
    exercises: ["squat", "bench-press", "seated-row", "plank"]
  },
  {
    id: "custom",
    label: "Custom",
    name: "Custom Workout",
    groups: ["chest", "back", "legs"],
    exercises: []
  }
];

const workoutXp = {
  base: 25,
  perSet: 4,
  planBonus: 10,
  max: 160
};

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
  workouts: loadWorkoutData(),
  selectedDate: todayKey,
  visibleMonth: new Date(today.getFullYear(), today.getMonth(), 1),
  activeView: "today",
  filter: "all",
  workoutBuilder: createWorkoutBuilder("push"),
  activeWorkout: null,
  editingTime: null
};

const dom = {};
let hasInitialized = false;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

function init() {
  if (hasInitialized) return;
  hasInitialized = true;
  bindDom();
  document.body.dataset.activeView = state.activeView;
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
    "workout-week-pill",
    "active-workout-panel",
    "active-workout-title",
    "workout-session-summary",
    "active-workout-list",
    "finish-workout",
    "workout-builder-form",
    "workout-plan-name",
    "workout-type-row",
    "muscle-chip-row",
    "exercise-picker",
    "selected-exercise-list",
    "save-workout-plan",
    "workout-plan-list",
    "workout-log-list",
    "quick-add-toggle",
    "time-editor",
    "time-editor-task",
    "edit-task-time",
    "edit-apply-all-wrap",
    "edit-apply-all",
    "clear-task-time"
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
  dom.timeEditor.addEventListener("submit", handleTimeEditorSubmit);
  dom.clearTaskTime.addEventListener("click", clearEditingTaskTime);
  dom.workoutBuilderForm.addEventListener("submit", handleWorkoutPlanSubmit);
  dom.workoutPlanName.addEventListener("input", () => {
    state.workoutBuilder.name = dom.workoutPlanName.value;
  });

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
    state.workouts = seedWorkoutData();
    state.selectedDate = todayKey;
    state.visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    state.filter = "all";
    state.workoutBuilder = createWorkoutBuilder("push");
    state.activeWorkout = null;
    saveTasks();
    saveWorkoutData();
    syncFormDate();
    renderAll();
  });

  document.addEventListener("click", (event) => {
    const timeClose = event.target.closest("[data-time-close]");
    if (timeClose) {
      closeTimeEditor();
      return;
    }

    const sheetClose = event.target.closest("[data-sheet-close]");
    if (sheetClose) {
      closeQuickSheet();
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

    const workoutAction = event.target.closest("[data-workout-action]");
    if (workoutAction) {
      handleWorkoutAction(workoutAction);
      return;
    }

    const workoutTypeButton = event.target.closest("[data-workout-type]");
    if (workoutTypeButton) {
      setWorkoutBuilderType(workoutTypeButton.dataset.workoutType);
      return;
    }

    const muscleButton = event.target.closest("[data-muscle-group]");
    if (muscleButton) {
      toggleWorkoutBuilderGroup(muscleButton.dataset.muscleGroup);
      return;
    }

    const exerciseButton = event.target.closest("[data-exercise-id]");
    if (exerciseButton) {
      toggleWorkoutBuilderExercise(exerciseButton.dataset.exerciseId);
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

  document.addEventListener("input", (event) => {
    const workoutField = event.target.closest("[data-workout-field]");
    if (workoutField) {
      updateActiveWorkoutField(workoutField);
    }
  });

  document.addEventListener("change", (event) => {
    const workoutField = event.target.closest("[data-workout-field]");
    if (workoutField) {
      updateActiveWorkoutField(workoutField);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeQuickSheet();
      closeTimeEditor();
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
    timeOverrides: {},
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

  if (button.dataset.action === "edit-time") {
    openTimeEditor(task.id, dateKey);
    return;
  }

  if (button.dataset.action === "toggle") {
    setTaskCompletion(task, dateKey, !isTaskCompletedOnDate(task, dateKey));
  }

  if (button.dataset.action === "delete") {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
  }

  saveTasks();
  renderAll();
}

function openTimeEditor(taskId, dateKey) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task || !dateKey) return;

  const occurrence = getTaskOccurrence(task, dateKey);
  if (!occurrence) return;

  state.editingTime = { taskId, dateKey };
  dom.timeEditorTask.textContent = `${task.title} / ${formatDate(dateKey, {
    month: "short",
    day: "numeric"
  })}`;
  dom.editTaskTime.value = occurrence.time || "";
  dom.editApplyAll.checked = false;
  dom.editApplyAllWrap.hidden = !isRecurringTask(task);
  document.body.classList.add("time-editor-open");
  dom.timeEditor.style.setProperty("display", "grid", "important");
  window.setTimeout(() => dom.editTaskTime.focus(), 80);
}

function closeTimeEditor() {
  state.editingTime = null;
  document.body.classList.remove("time-editor-open");
  if (dom.timeEditor) {
    dom.timeEditor.style.removeProperty("display");
  }
}

function handleTimeEditorSubmit(event) {
  event.preventDefault();
  saveEditingTaskTime(dom.editTaskTime.value);
}

function clearEditingTaskTime() {
  saveEditingTaskTime("");
}

function saveEditingTaskTime(timeValue) {
  if (!state.editingTime) return;
  const task = state.tasks.find((item) => item.id === state.editingTime.taskId);
  if (!task) return;

  setTaskTime(task, state.editingTime.dateKey, timeValue, dom.editApplyAll.checked);
  saveTasks();
  closeTimeEditor();
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
    timeOverrides: {},
    createdAt: new Date().toISOString()
  });

  saveTasks();
  renderAll();
}

function setView(view) {
  if (!["today", "calendar", "workout", "progress"].includes(view)) return;
  state.activeView = view;
  document.body.dataset.activeView = view;

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
  renderWorkout();
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
  dom.timelineList.innerHTML = renderTimelineList(activeTasks, getActiveEmptyText(tasks));
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

function handleWorkoutPlanSubmit(event) {
  event.preventDefault();
  const builder = state.workoutBuilder;
  const exercises = builder.exerciseIds.map(makePlanExercise).filter(Boolean);

  if (!exercises.length) return;

  const name = dom.workoutPlanName.value.trim() || builder.name || "Gym Workout";
  const plan = {
    id: createId(),
    name,
    type: builder.type,
    groups: Array.from(builder.selectedGroups),
    exercises,
    createdAt: new Date().toISOString()
  };

  state.workouts.plans.unshift(plan);
  state.workoutBuilder = createWorkoutBuilder(builder.type);
  saveWorkoutData();
  renderWorkout();
}

function handleWorkoutAction(button) {
  const action = button.dataset.workoutAction;

  if (action === "remove-exercise") {
    removeWorkoutBuilderExercise(button.dataset.exerciseId);
    return;
  }

  if (action === "start-plan") {
    startWorkout(button.dataset.planId);
    return;
  }

  if (action === "delete-plan") {
    deleteWorkoutPlan(button.dataset.planId);
    return;
  }

  if (action === "cancel-session") {
    cancelActiveWorkout();
    return;
  }

  if (action === "finish-session") {
    finishActiveWorkout();
  }
}

function setWorkoutBuilderType(typeId) {
  state.workoutBuilder = createWorkoutBuilder(typeId);
  renderWorkoutBuilder();
}

function toggleWorkoutBuilderGroup(groupId) {
  if (!muscleGroups[groupId]) return;

  const groups = state.workoutBuilder.selectedGroups;
  if (groups.has(groupId)) {
    groups.delete(groupId);
  } else {
    groups.add(groupId);
  }

  state.workoutBuilder.type = "custom";
  renderWorkoutBuilder();
}

function toggleWorkoutBuilderExercise(exerciseId) {
  if (!exerciseMap[exerciseId]) return;

  const exercises = state.workoutBuilder.exerciseIds;
  if (exercises.includes(exerciseId)) {
    state.workoutBuilder.exerciseIds = exercises.filter((id) => id !== exerciseId);
  } else {
    state.workoutBuilder.exerciseIds = [...exercises, exerciseId];
  }

  renderWorkoutBuilder();
}

function removeWorkoutBuilderExercise(exerciseId) {
  state.workoutBuilder.exerciseIds = state.workoutBuilder.exerciseIds.filter((id) => id !== exerciseId);
  renderWorkoutBuilder();
}

function startWorkout(planId) {
  const plan = state.workouts.plans.find((item) => item.id === planId);
  if (!plan) return;

  if (state.activeWorkout) {
    const replace = window.confirm("End the current workout and start this one?");
    if (!replace) return;
  }

  state.activeWorkout = {
    id: createId(),
    planId: plan.id,
    planName: plan.name,
    startedAt: new Date().toISOString(),
    date: todayKey,
    exercises: plan.exercises.map((exercise) => {
      const last = getLastExerciseSet(exercise.id);
      const setCount = clamp(Number(exercise.sets) || 3, 1, 8);
      return {
        id: exercise.id,
        name: exercise.name,
        group: exercise.group,
        sets: Array.from({ length: setCount }, () => ({
          reps: exercise.reps || (last ? last.reps : 10),
          weight: exercise.weight || (last ? last.weight : ""),
          done: false
        }))
      };
    })
  };

  renderWorkout();
  if (dom.activeWorkoutPanel) {
    dom.activeWorkoutPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function deleteWorkoutPlan(planId) {
  const plan = state.workouts.plans.find((item) => item.id === planId);
  if (!plan) return;

  const shouldDelete = window.confirm(`Delete ${plan.name}?`);
  if (!shouldDelete) return;

  state.workouts.plans = state.workouts.plans.filter((item) => item.id !== planId);
  saveWorkoutData();
  renderWorkout();
}

function cancelActiveWorkout() {
  if (!state.activeWorkout) return;

  const shouldCancel = window.confirm("End this workout without saving it?");
  if (!shouldCancel) return;

  state.activeWorkout = null;
  renderWorkout();
}

function updateActiveWorkoutField(input) {
  if (!state.activeWorkout) return;

  const exerciseIndex = Number(input.dataset.exerciseIndex);
  const setIndex = Number(input.dataset.setIndex);
  const field = input.dataset.workoutField;
  const exercise = state.activeWorkout.exercises[exerciseIndex];
  const set = exercise && exercise.sets[setIndex];

  if (!set || !field) return;

  if (field === "done") {
    set.done = Boolean(input.checked);
    const row = input.closest(".workout-set-row");
    if (row) row.classList.toggle("is-done", set.done);
  } else {
    set[field] = input.value;
  }

  updateWorkoutSessionSummary();
}

function finishActiveWorkout() {
  if (!state.activeWorkout) return;

  const summary = getWorkoutSessionSummary(state.activeWorkout);
  if (summary.completedSets === 0) return;

  const completedAt = new Date().toISOString();
  const log = {
    id: state.activeWorkout.id,
    planId: state.activeWorkout.planId,
    planName: state.activeWorkout.planName,
    date: todayKey,
    startedAt: state.activeWorkout.startedAt,
    completedAt,
    xp: summary.xp,
    exercises: state.activeWorkout.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      group: exercise.group,
      sets: exercise.sets.map((set) => ({
        reps: clamp(Number(set.reps) || 0, 0, 500),
        weight: set.weight === "" ? "" : clamp(Number(set.weight) || 0, 0, 2000),
        done: Boolean(set.done)
      }))
    }))
  };

  rememberWorkoutTargets(log);
  state.workouts.logs.unshift(log);
  state.workouts.logs = state.workouts.logs.slice(0, 100);
  state.tasks.push(makeCompletedWorkoutTask(log));
  state.selectedDate = todayKey;
  state.activeWorkout = null;

  saveWorkoutData();
  saveTasks();
  syncFormDate();
  renderAll();
}

function renderWorkout() {
  if (!dom.workoutTypeRow) return;

  renderWorkoutOverview();
  renderWorkoutBuilder();
  renderWorkoutPlans();
  renderWorkoutSession();
  renderWorkoutLogs();
}

function renderWorkoutOverview() {
  const weekStart = getWeekStart(parseDateKey(todayKey));
  const weekEnd = addDays(weekStart, 6);
  const weekLogs = state.workouts.logs.filter((log) => {
    const date = parseDateKey(log.date || todayKey);
    return date >= weekStart && date <= weekEnd;
  });
  const xp = weekLogs.reduce((total, log) => total + Number(log.xp || 0), 0);
  dom.workoutWeekPill.textContent = `${weekLogs.length} this week / ${xp} XP`;
}

function renderWorkoutBuilder() {
  const builder = state.workoutBuilder;
  const groups = builder.selectedGroups;
  const selectedExercises = builder.exerciseIds.map((id) => exerciseMap[id]).filter(Boolean);
  const visibleExercises = exerciseLibrary.filter((exercise) => !groups.size || groups.has(exercise.group));

  if (document.activeElement !== dom.workoutPlanName) {
    dom.workoutPlanName.value = builder.name;
  }

  dom.workoutTypeRow.innerHTML = workoutTypePresets
    .map((preset) => {
      const activeClass = preset.id === builder.type ? " is-active" : "";
      return `
        <button class="builder-chip${activeClass}" type="button" data-workout-type="${preset.id}">
          ${preset.label}
        </button>
      `;
    })
    .join("");

  dom.muscleChipRow.innerHTML = muscleGroupList
    .map((group) => {
      const activeClass = groups.has(group.id) ? " is-active" : "";
      return `
        <button class="builder-chip muscle-chip${activeClass}" type="button" data-muscle-group="${group.id}" style="--muscle-color: ${group.color}">
          ${group.label}
        </button>
      `;
    })
    .join("");

  dom.exercisePicker.innerHTML = visibleExercises
    .map((exercise) => {
      const group = muscleGroups[exercise.group];
      const activeClass = builder.exerciseIds.includes(exercise.id) ? " is-selected" : "";
      return `
        <button class="exercise-chip${activeClass}" type="button" data-exercise-id="${exercise.id}" style="--muscle-color: ${group.color}">
          <strong>${escapeHtml(exercise.name)}</strong>
          <span>${group.label} / ${exercise.sets} x ${exercise.reps}</span>
        </button>
      `;
    })
    .join("");

  dom.selectedExerciseList.innerHTML = selectedExercises.length
    ? selectedExercises
        .map((exercise, index) => {
          const group = muscleGroups[exercise.group];
          return `
            <li class="selected-exercise" style="--muscle-color: ${group.color}">
              <span class="selected-number">${index + 1}</span>
              <span class="selected-copy">
                <strong>${escapeHtml(exercise.name)}</strong>
                <span>${group.label} / ${exercise.sets} x ${exercise.reps}</span>
              </span>
              <button class="icon-button delete-button" type="button" data-workout-action="remove-exercise" data-exercise-id="${exercise.id}" aria-label="Remove ${escapeHtml(exercise.name)}">
                <svg class="icon"><use href="#icon-x"></use></svg>
              </button>
            </li>
          `;
        })
        .join("")
    : `<li class="empty-state">Tap exercises to build this workout.</li>`;

  dom.saveWorkoutPlan.disabled = selectedExercises.length === 0;
}

function renderWorkoutPlans() {
  if (!state.workouts.plans.length) {
    dom.workoutPlanList.innerHTML = `<div class="empty-state">Save a workout plan to start training.</div>`;
    return;
  }

  dom.workoutPlanList.innerHTML = state.workouts.plans
    .map((plan) => {
      const summary = getWorkoutPlanSummary(plan);
      const groupLabels = plan.groups
        .map((groupId) => muscleGroups[groupId])
        .filter(Boolean)
        .map((group) => `<span>${group.label}</span>`)
        .join("");
      return `
        <article class="workout-plan-card">
          <div class="workout-card-main">
            <svg class="icon"><use href="#icon-dumbbell"></use></svg>
            <span>
              <strong>${escapeHtml(plan.name)}</strong>
              <span>${summary.exercises} moves / ${summary.sets} sets / ${summary.xp} XP</span>
            </span>
          </div>
          <div class="workout-muscles">${groupLabels}</div>
          <div class="workout-card-actions">
            <button class="secondary-button" type="button" data-workout-action="start-plan" data-plan-id="${plan.id}">
              <svg class="icon"><use href="#icon-play"></use></svg>
              Start
            </button>
            <button class="icon-button delete-button" type="button" data-workout-action="delete-plan" data-plan-id="${plan.id}" aria-label="Delete ${escapeHtml(plan.name)}">
              <svg class="icon"><use href="#icon-trash"></use></svg>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWorkoutSession() {
  const session = state.activeWorkout;

  if (!session) {
    dom.activeWorkoutPanel.hidden = true;
    dom.activeWorkoutList.innerHTML = "";
    return;
  }

  dom.activeWorkoutPanel.hidden = false;
  dom.activeWorkoutTitle.textContent = session.planName;
  dom.activeWorkoutList.innerHTML = session.exercises
    .map((exercise, exerciseIndex) => {
      const group = muscleGroups[exercise.group] || muscleGroups.legs;
      const lastSet = getLastExerciseSet(exercise.id, session.id);
      const lastText = lastSet ? `Last: ${formatExerciseSet(lastSet)}` : "No previous log";
      return `
        <article class="guided-exercise" style="--muscle-color: ${group.color}">
          <div class="guided-exercise-header">
            <span>
              <strong>${escapeHtml(exercise.name)}</strong>
              <span>${group.label} / ${lastText}</span>
            </span>
          </div>
          <div class="workout-set-list">
            ${exercise.sets
              .map((set, setIndex) => {
                const doneClass = set.done ? " is-done" : "";
                return `
                  <div class="workout-set-row${doneClass}">
                    <label class="set-check">
                      <input type="checkbox" data-workout-field="done" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" ${set.done ? "checked" : ""}>
                      <span>Set ${setIndex + 1}</span>
                    </label>
                    <label class="set-field">
                      <span>Reps</span>
                      <input type="number" min="0" max="500" inputmode="numeric" data-workout-field="reps" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" value="${escapeHtml(set.reps)}">
                    </label>
                    <label class="set-field">
                      <span>Weight</span>
                      <input type="number" min="0" max="2000" step="5" inputmode="decimal" data-workout-field="weight" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" value="${escapeHtml(set.weight)}">
                    </label>
                  </div>
                `;
              })
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  updateWorkoutSessionSummary();
}

function renderWorkoutLogs() {
  if (!state.workouts.logs.length) {
    dom.workoutLogList.innerHTML = `<div class="empty-state">Finished workouts will show up here.</div>`;
    return;
  }

  dom.workoutLogList.innerHTML = state.workouts.logs
    .slice(0, 5)
    .map((log) => {
      const summary = getWorkoutLogSummary(log);
      return `
        <article class="workout-log-card">
          <span>
            <strong>${escapeHtml(log.planName)}</strong>
            <span>${formatDate(log.date, { month: "short", day: "numeric" })} / ${summary.completedSets} sets</span>
          </span>
          <span class="xp-badge">${log.xp} XP</span>
        </article>
      `;
    })
    .join("");
}

function updateWorkoutSessionSummary() {
  if (!state.activeWorkout) return;

  const summary = getWorkoutSessionSummary(state.activeWorkout);
  dom.workoutSessionSummary.textContent = `${summary.completedSets}/${summary.totalSets} sets`;
  dom.finishWorkout.disabled = summary.completedSets === 0;
  dom.finishWorkout.innerHTML = `
    <svg class="icon"><use href="#icon-check"></use></svg>
    Finish +${summary.xp} XP
  `;
}

function getWorkoutSessionSummary(session) {
  const totalSets = session.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const completedSets = session.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter((set) => set.done).length,
    0
  );
  const allPlannedSetsDone = completedSets > 0 && completedSets === totalSets;
  const xp = clamp(
    workoutXp.base + completedSets * workoutXp.perSet + (allPlannedSetsDone ? workoutXp.planBonus : 0),
    workoutXp.base,
    workoutXp.max
  );

  return { totalSets, completedSets, xp };
}

function getWorkoutPlanSummary(plan) {
  const sets = plan.exercises.reduce((total, exercise) => total + Number(exercise.sets || 0), 0);
  const xp = clamp(workoutXp.base + sets * workoutXp.perSet + workoutXp.planBonus, workoutXp.base, workoutXp.max);
  return {
    exercises: plan.exercises.length,
    sets,
    xp
  };
}

function getWorkoutLogSummary(log) {
  const completedSets = log.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter((set) => set.done).length,
    0
  );
  return { completedSets };
}

function getLastExerciseSet(exerciseId, ignoreLogId = "") {
  for (const log of state.workouts.logs) {
    if (log.id === ignoreLogId) continue;
    const exercise = log.exercises.find((item) => item.id === exerciseId);
    if (!exercise) continue;
    const doneSet = [...exercise.sets].reverse().find((set) => set.done);
    if (doneSet) return doneSet;
  }

  return null;
}

function formatExerciseSet(set) {
  const weight = set.weight === "" ? "bodyweight" : `${set.weight} lb`;
  return `${weight} x ${set.reps}`;
}

function rememberWorkoutTargets(log) {
  const plan = state.workouts.plans.find((item) => item.id === log.planId);
  if (!plan) return;

  plan.exercises = plan.exercises.map((exercise) => {
    const loggedExercise = log.exercises.find((item) => item.id === exercise.id);
    if (!loggedExercise) return exercise;
    const lastDone = [...loggedExercise.sets].reverse().find((set) => set.done);
    if (!lastDone) return exercise;

    return {
      ...exercise,
      reps: lastDone.reps || exercise.reps,
      weight: lastDone.weight === "" ? exercise.weight : lastDone.weight
    };
  });
}

function makeCompletedWorkoutTask(log) {
  return {
    id: createId(),
    title: `${log.planName} workout`,
    category: "gym",
    date: todayKey,
    repeat: "none",
    time: toTimeInputValue(new Date()),
    xp: log.xp,
    completed: true,
    completedAt: log.completedAt,
    completions: {},
    timeOverrides: {},
    createdAt: log.completedAt
  };
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
      <button class="timeline-time time-button" type="button" data-action="edit-time" data-id="${task.id}" data-date="${occurrenceDate}" aria-label="Change time for ${escapeHtml(task.title)}">${timeLabel}</button>
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
          <button class="time-chip" type="button" data-action="edit-time" data-id="${task.id}" data-date="${occurrenceDate}" aria-label="Change time for ${escapeHtml(task.title)}">${timeLabel}</button>
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
    time: getTaskTimeOnDate(task, dateKey),
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

function getTaskTimeOnDate(task, dateKey) {
  if (isRecurringTask(task) && task.timeOverrides && Object.prototype.hasOwnProperty.call(task.timeOverrides, dateKey)) {
    return task.timeOverrides[dateKey];
  }

  return task.time || "";
}

function setTaskTime(task, dateKey, timeValue, applyAll) {
  const nextTime = timeValue || "";

  if (!isRecurringTask(task) || applyAll) {
    task.time = nextTime;
    if (applyAll) {
      task.timeOverrides = {};
    }
    return;
  }

  task.timeOverrides = task.timeOverrides || {};
  task.timeOverrides[dateKey] = nextTime;
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

function loadWorkoutData() {
  try {
    const raw = localStorage.getItem(WORKOUT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeWorkoutData(parsed);
    }
  } catch (error) {
    console.warn("Unable to load saved workouts", error);
  }

  const seeded = seedWorkoutData();
  try {
    localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(seeded));
  } catch (error) {
    console.warn("Unable to save starter workouts", error);
  }
  return seeded;
}

function normalizeWorkoutData(data) {
  const seeded = seedWorkoutData();
  const plans = Array.isArray(data && data.plans)
    ? data.plans.map(normalizeWorkoutPlan).filter(Boolean)
    : seeded.plans;
  const logs = Array.isArray(data && data.logs) ? data.logs.map(normalizeWorkoutLog).filter(Boolean) : [];

  return {
    plans: plans.length ? plans : seeded.plans,
    logs
  };
}

function normalizeWorkoutPlan(plan) {
  if (!plan || !plan.name || !Array.isArray(plan.exercises)) return null;
  const exercises = plan.exercises.map(normalizePlanExercise).filter(Boolean);
  if (!exercises.length) return null;

  return {
    id: plan.id || createId(),
    name: String(plan.name),
    type: workoutTypePresets.some((preset) => preset.id === plan.type) ? plan.type : "custom",
    groups: normalizeWorkoutGroups(plan.groups, exercises),
    exercises,
    createdAt: plan.createdAt || new Date().toISOString()
  };
}

function normalizePlanExercise(exercise) {
  if (!exercise) return null;
  const base = exerciseMap[exercise.id];
  if (!base) return null;

  return {
    id: base.id,
    name: base.name,
    group: base.group,
    sets: clamp(Number(exercise.sets) || base.sets, 1, 8),
    reps: clamp(Number(exercise.reps) || base.reps, 1, 500),
    weight: exercise.weight === "" || exercise.weight === undefined ? "" : clamp(Number(exercise.weight) || 0, 0, 2000)
  };
}

function normalizeWorkoutLog(log) {
  if (!log || !log.planName || !Array.isArray(log.exercises)) return null;

  return {
    id: log.id || createId(),
    planId: log.planId || "",
    planName: String(log.planName),
    date: log.date || todayKey,
    startedAt: log.startedAt || log.completedAt || new Date().toISOString(),
    completedAt: log.completedAt || new Date().toISOString(),
    xp: clamp(Number(log.xp) || workoutXp.base, workoutXp.base, workoutXp.max),
    exercises: log.exercises.map(normalizeLoggedExercise).filter(Boolean)
  };
}

function normalizeLoggedExercise(exercise) {
  if (!exercise || !Array.isArray(exercise.sets)) return null;
  const base = exerciseMap[exercise.id];
  if (!base) return null;

  return {
    id: base.id,
    name: base.name,
    group: base.group,
    sets: exercise.sets.map((set) => ({
      reps: clamp(Number(set.reps) || 0, 0, 500),
      weight: set.weight === "" || set.weight === undefined ? "" : clamp(Number(set.weight) || 0, 0, 2000),
      done: Boolean(set.done)
    }))
  };
}

function normalizeWorkoutGroups(groups, exercises) {
  const fromInput = Array.isArray(groups) ? groups.filter((groupId) => muscleGroups[groupId]) : [];
  const fromExercises = [...new Set(exercises.map((exercise) => exercise.group))];
  return fromInput.length ? [...new Set(fromInput)] : fromExercises;
}

function saveWorkoutData() {
  try {
    localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(state.workouts));
  } catch (error) {
    console.warn("Unable to save workouts", error);
  }
}

function seedWorkoutData() {
  return {
    plans: [
      makeWorkoutPlan("Push Day", "push"),
      makeWorkoutPlan("Pull Day", "pull"),
      makeWorkoutPlan("Leg Day", "legs")
    ],
    logs: []
  };
}

function makeWorkoutPlan(name, typeId) {
  const preset = workoutTypePresets.find((item) => item.id === typeId) || workoutTypePresets[0];
  return {
    id: createId(),
    name,
    type: preset.id,
    groups: [...preset.groups],
    exercises: preset.exercises.map(makePlanExercise).filter(Boolean),
    createdAt: new Date().toISOString()
  };
}

function makePlanExercise(exerciseId) {
  const base = exerciseMap[exerciseId];
  if (!base) return null;
  return {
    id: base.id,
    name: base.name,
    group: base.group,
    sets: base.sets,
    reps: base.reps,
    weight: ""
  };
}

function createWorkoutBuilder(typeId = "push") {
  const preset = workoutTypePresets.find((item) => item.id === typeId) || workoutTypePresets[0];
  return {
    type: preset.id,
    name: preset.name,
    selectedGroups: new Set(preset.groups),
    exerciseIds: [...preset.exercises]
  };
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
  const timeOverrides =
    task.timeOverrides && typeof task.timeOverrides === "object" && !Array.isArray(task.timeOverrides)
      ? task.timeOverrides
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
    timeOverrides,
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
    timeOverrides: {},
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

function toTimeInputValue(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
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
