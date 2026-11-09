// Единая точка входа приложения.
// Данные маршрута загружаются из data/route.json.
const STORAGE_KEYS = {
  checks: "green-route-intro-checks",
  step: "green-route-current-step",
  screen: "green-route-current-screen",
  complete: "green-route-complete"
};

let steps = [];
let routeObject = null;
let currentStepIndex = 0;
let hasCelebratedFinalStep = false;
let waitingWorker = null;
let deferredInstallPrompt = null;
let modalReturnFocus = null;
let refreshingForUpdate = false;
let touchStartX = 0;
let touchStartY = 0;
let suppressImageClick = false;

const introScreen = document.getElementById("introScreen");
const navScreen = document.getElementById("navScreen");
const introChecks = Array.from(document.querySelectorAll(".intro-check"));
const introStatus = document.getElementById("introStatus");
const startRouteButton = document.getElementById("startRouteButton");
const startOverButton = document.getElementById("startOverButton");
const resumeCard = document.getElementById("resumeCard");
const resumeText = document.getElementById("resumeText");
const timeline = document.getElementById("timeline");
const progressTitle = document.getElementById("progressTitle");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const mobileProgressTitle = document.getElementById("mobileProgressTitle");
const mobileProgressPercent = document.getElementById("mobileProgressPercent");
const mobileProgressBar = document.getElementById("mobileProgressBar");
const viewerEyebrow = document.getElementById("viewerEyebrow");
const viewer = document.getElementById("viewer");
const footerProgress = document.getElementById("footerProgress");
const stepImage = document.getElementById("stepImage");
const stepImageWebp = document.getElementById("stepImageWebp");
const stepActionOverlay = document.getElementById("stepActionOverlay");
const titleBlock = document.getElementById("titleBlock");
const stepTitle = document.getElementById("stepTitle");
const mobileActionLead = document.getElementById("mobileActionLead");
const finishNote = document.getElementById("finishNote");
const finishConfetti = document.getElementById("finishConfetti");
const stepDescription = document.getElementById("stepDescription");
const actionBox = document.getElementById("actionBox");
const stepAction = document.getElementById("stepAction");
const scriptBox = document.getElementById("scriptBox");
const stepScript = document.getElementById("stepScript");
const detailsBox = document.getElementById("detailsBox");
const stepDetails = document.getElementById("stepDetails");
const helpTriggerButton = document.getElementById("helpTriggerButton");
const helpPopover = document.getElementById("helpPopover");
const helpPopoverStep = document.getElementById("helpPopoverStep");
const helpPopoverHint = document.getElementById("helpPopoverHint");
const copySupervisorButton = document.getElementById("copySupervisorButton");
const copySupervisorButtonHelp = document.getElementById("copySupervisorButtonHelp");
const prevButton = document.getElementById("prevButton");
const restartButton = document.getElementById("restartButton");
const nextButton = document.getElementById("nextButton");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModalButton = document.getElementById("closeModalButton");
const networkBanner = document.getElementById("networkBanner");
const networkBannerText = document.getElementById("networkBannerText");
const updateBanner = document.getElementById("updateBanner");
const updateBannerText = document.getElementById("updateBannerText");
const refreshAppButton = document.getElementById("refreshAppButton");
const installBanner = document.getElementById("installBanner");
const installAppButton = document.getElementById("installAppButton");
const objectEyebrow = document.getElementById("objectEyebrow");
const routeDestinationName = document.getElementById("routeDestinationName");
const routeEstimatedTime = document.getElementById("routeEstimatedTime");
const stepCountStat = document.getElementById("stepCountStat");
const splash = document.getElementById("splash");
const SPLASH_KEY = "cosmos-splash-seen";
const isRepeatLaunch = (() => {
  try { return sessionStorage.getItem(SPLASH_KEY) === "1"; } catch (error) { return false; }
})();
const SPLASH_MIN_MS = isRepeatLaunch ? 1700 : 2900;
const bootStartedAt = Date.now();
let splashHidden = false;

// Запускает фирменную анимацию заставки (в повторном запуске — укороченную).
let markerRaf = 0;

// Маркер едет ровно по кончику нарисованной линии: прогресс берём
// из stroke-dashoffset, поэтому рассинхронизация с линией невозможна.
function syncRouteMarker() {
  cancelAnimationFrame(markerRaf);
  const journey = splash ? splash.querySelector(".splash__journey") : null;
  const path = journey ? journey.querySelector(".splash__route") : null;
  const marker = journey ? journey.querySelector(".splash__motion") : null;
  if (!path || !marker) return;

  let total = 0;
  try { total = path.getTotalLength(); } catch (error) { total = 0; }
  if (!total) return;
  path.style.setProperty("--route-len", String(total));

  const tick = () => {
    if (!path.isConnected) { markerRaf = 0; return; }
    const offset = Math.abs(parseFloat(getComputedStyle(path).strokeDashoffset) || 0);
    const progress = Math.max(0, Math.min(1, (total - offset) / total));
    if (progress > 0.002) {
      const point = path.getPointAtLength(total * progress);
      marker.setAttribute("transform", "translate(" + point.x + " " + point.y + ")");
      marker.setAttribute("opacity", "1");
    }
    if (progress >= 0.999) { markerRaf = 0; return; }
    markerRaf = requestAnimationFrame(tick);
  };
  markerRaf = requestAnimationFrame(tick);
}

function startSplash() {
  if (!splash) return;
  syncRouteMarker();
  // is-playing включает саму анимацию, is-quick — ускоренный тайминг для повторного запуска.
  splash.classList.add("is-playing");
  if (isRepeatLaunch) splash.classList.add("is-quick");
  try { sessionStorage.setItem(SPLASH_KEY, "1"); } catch (error) { /* приватный режим */ }
}
startSplash();

// Прячет стартовый сплэш: не раньше минимальной длительности, чтобы анимация успела проиграться.
function hideSplash() {
  if (splashHidden) return;
  splashHidden = true;
  const wait = Math.max(0, SPLASH_MIN_MS - (Date.now() - bootStartedAt));
  setTimeout(() => {
    document.body.classList.add("is-ready");
    if (!splash) return;
    splash.classList.add("is-done");
    setTimeout(() => splash.remove(), isRepeatLaunch ? 450 : 700);
  }, wait);
}
const supervisorLabel = document.getElementById("supervisorLabel");
const supervisorNumbers = document.getElementById("supervisorNumbers");
const helpPopoverNumbers = document.getElementById("helpPopoverNumbers");
const viewerDestinationTitle = document.getElementById("viewerDestinationTitle");

const STEP_ICONS = {
  facade: '<svg viewBox="0 0 24 24"><path d="M4 20h16"/><path d="M6 20V9l6-4 6 4v11"/><path d="M10 20v-5h4v5"/></svg>',
  door: '<svg viewBox="0 0 24 24"><path d="M7 20V5h8v15"/><path d="M10 12h.01"/><path d="M15 8h4v8h-4"/></svg>',
  security: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3.3 8.6-7 10-3.7-1.4-7-5-7-10V6l7-3z"/><path d="M9.5 12l1.7 1.7 3.8-4"/></svg>',
  locker: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M12 4v16"/><path d="M14.5 12h.01"/></svg>',
  changing: '<svg viewBox="0 0 24 24"><path d="M8 5h8"/><path d="M10 5v4l-2 9"/><path d="M14 5v4l2 9"/><path d="M9 13h6"/></svg>',
  corridor: '<svg viewBox="0 0 24 24"><path d="M4 12h14"/><path d="M14 8l4 4-4 4"/></svg>',
  split: '<svg viewBox="0 0 24 24"><path d="M12 20V8"/><path d="M8 12l4-4 4 4"/><path d="M5 20h14"/></svg>',
  lift: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M12 8v8"/><path d="M9.5 10.5 12 8l2.5 2.5"/><path d="M9.5 13.5 12 16l2.5-2.5"/></svg>',
  "guest-door": '<svg viewBox="0 0 24 24"><path d="M6 20V6h9v14"/><path d="M9 12h.01"/><path d="M18 8v8"/></svg>',
  green: '<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M6.5 6.5l11 11"/><path d="M17.5 6.5l-11 11"/></svg>'
};

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn("Save failed:", e); }
}

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function updateIntroState() {
  const checkedCount = introChecks.filter(c => c.checked).length;
  const isReady = checkedCount === introChecks.length;
  introStatus.textContent = isReady
    ? "Форма в порядке"
    : checkedCount === 0
      ? "Отметь все " + introChecks.length + " пункта"
      : "Отмечено " + checkedCount + " из " + introChecks.length;
  startRouteButton.disabled = !isReady;
  const hasSavedProgress = currentStepIndex > 0;
  resumeCard.hidden = !hasSavedProgress;
  startOverButton.hidden = !hasSavedProgress;
  resumeText.textContent = "Продолжить с шага " + (currentStepIndex + 1);
  startRouteButton.textContent = hasSavedProgress
    ? "Продолжить маршрут"
    : "Открыть маршрут";
  introStatus.classList.toggle("is-ready", isReady);
  saveToStorage(STORAGE_KEYS.checks, introChecks.map(c => c.checked));
}

function applyRouteObject() {
  if (!routeObject) return;
  const numbers = routeObject.supervisor?.numbers || [];

  objectEyebrow.textContent = routeObject.type + " · " + routeObject.name;
  routeDestinationName.textContent = routeObject.destinationType + " «" + routeObject.destinationName + "»";
  routeEstimatedTime.textContent = routeObject.estimatedMinutes;
  viewerDestinationTitle.textContent = routeObject.destinationType + " " + routeObject.destinationName;
  supervisorLabel.textContent = routeObject.supervisor?.label || "Супервайзер";
  supervisorNumbers.textContent = "Внутренний номер " + numbers.join(" или ");
  helpPopoverNumbers.textContent = numbers.join(" / ");
}

function showScreen(screenName) {
  document.body.classList.toggle("guide-active", screenName === "nav");
  if (screenName !== "nav") { stopGuideVoice(); closeGuideMenu(); closeGuideInfo(); }
  if (screenName === "nav" && installBanner) installBanner.hidden = true;
  introScreen.classList.toggle("is-active", screenName === "intro");
  navScreen.classList.toggle("is-active", screenName === "nav");
  saveToStorage(STORAGE_KEYS.screen, screenName);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildTimeline() {
  timeline.innerHTML = "";
  steps.forEach((step, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "timeline-item";
    const dot = document.createElement("span");
    dot.className = "timeline-item__dot";
    dot.textContent = step.badge;
    const icon = document.createElement("span");
    icon.className = "timeline-item__icon";
    icon.innerHTML = STEP_ICONS[step.icon] || STEP_ICONS.facade;
    const content = document.createElement("span");
    const title = document.createElement("span");
    title.className = "timeline-item__title";
    title.textContent = step.shortTitle;
    const desc = document.createElement("span");
    desc.className = "timeline-item__desc";
    desc.textContent = step.action;
    content.appendChild(title);
    content.appendChild(desc);
    btn.appendChild(dot);
    btn.appendChild(icon);
    btn.appendChild(content);
    btn.addEventListener("click", () => { currentStepIndex = index; renderStep(); closeGuideMenu(); });
    timeline.appendChild(btn);
  });
}

function renderTimelineState() {
  const items = timeline.querySelectorAll(".timeline-item");
  let activeItem = null;
  items.forEach((item, index) => {
    item.classList.toggle("is-active", index === currentStepIndex);
    item.classList.toggle("is-done", index < currentStepIndex);
    if (index === currentStepIndex) activeItem = item;
  });
  if (activeItem) {
    activeItem.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }
}

function renderFinishConfetti() {
  const colors = ["#1a6a4d", "#c3a25a", "#7db79d", "#f3d993", "#d7efe2"];
  finishConfetti.innerHTML = "";
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    piece.style.left = 6 + Math.random() * 88 + "%";
    piece.style.setProperty("--delay", i * 45 + "ms");
    piece.style.setProperty("--confetti", colors[i % colors.length]);
    finishConfetti.appendChild(piece);
  }
}

function triggerFinishFeedback() {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "vibrate" in navigator) {
    navigator.vibrate([30, 45, 90]);
  }
}

function renderStep() {
  const step = steps[currentStepIndex];
  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  const isFinalStep = currentStepIndex === steps.length - 1;

  saveToStorage(STORAGE_KEYS.step, currentStepIndex);
  saveToStorage(STORAGE_KEYS.complete, false);

  viewer.classList.add("is-revealing");

  progressTitle.textContent = "Шаг " + (currentStepIndex + 1) + " из " + steps.length;
  progressPercent.textContent = progress + "%";
  progressBar.style.width = progress + "%";
  progressBar.parentElement.setAttribute("aria-valuenow", String(progress));
  mobileProgressTitle.textContent = progressTitle.textContent;
  mobileProgressPercent.textContent = progressPercent.textContent;
  mobileProgressBar.style.width = progress + "%";
  mobileProgressBar.parentElement.setAttribute("aria-valuenow", String(progress));
  viewerEyebrow.textContent = progressTitle.textContent;
  footerProgress.textContent = "Шаг " + (currentStepIndex + 1) + " из " + steps.length;

  stepImage.classList.remove("is-loaded", "is-swapping");
  // WebP в двух размерах: телефон берёт 1000px, десктоп — 1400px.
  const imageBase = String(step.image).replace(/\.jpe?g$/i, "");
  if (stepImageWebp) {
    stepImageWebp.srcset = imageBase + "-1000.webp 1000w, " + imageBase + "-1400.webp 1400w";
  }
  stepImage.src = step.image;
  // Размытая копия того же оригинального фото заполняет поля без обрезки стрелок.
  const guidePhotoFrame = stepImage.closest('.stage__frame');
  if (guidePhotoFrame) guidePhotoFrame.style.setProperty('--guide-photo-url', `url("${step.image}")`);
  stepImage.classList.add("is-swapping");
  stepImage.onload = function onImageLoaded() {
    stepImage.classList.remove("is-swapping");
    stepImage.classList.add("is-loaded");
    viewer.classList.remove("is-revealing");
  };
  if (stepImage.complete && stepImage.naturalWidth) {
    stepImage.classList.remove("is-swapping");
    stepImage.classList.add("is-loaded");
    viewer.classList.remove("is-revealing");
  }
  stepImage.alt = step.alt;
  stepImage.setAttribute("aria-label", "Открыть крупный фото для шага: " + step.shortTitle);
  titleBlock.hidden = false;
  stepTitle.textContent = step.title;
  mobileActionLead.hidden = false;
  mobileActionLead.textContent = step.action;
  finishNote.hidden = !isFinalStep;
  stepDescription.hidden = false;
  stepDescription.textContent = step.description;
  actionBox.hidden = false;
  stepAction.textContent = step.action;
  stepActionOverlay.textContent = step.action;
  detailsBox.hidden = false;
  helpPopover.hidden = true;
  helpTriggerButton.setAttribute("aria-expanded", "false");
  const previousStep = steps[currentStepIndex - 1];
  helpPopoverStep.textContent = "Вы на шаге «" + step.shortTitle + "». " + step.action;
  helpPopoverHint.textContent = previousStep
    ? "Вернитесь к ориентиру предыдущего шага: «" + previousStep.shortTitle + "». " + previousStep.description
    : "Найдите центральный фасад отеля и служебный вход STAFF ONLY.";

  if (step.script) {
    scriptBox.hidden = false;
    stepScript.textContent = step.script;
  } else {
    scriptBox.hidden = true;
    stepScript.textContent = "";
  }

  stepDetails.innerHTML = "";
  step.details.forEach(detail => {
    const li = document.createElement("li");
    li.textContent = detail;
    stepDetails.appendChild(li);
  });

  if (isFinalStep) {
    renderFinishConfetti();
    if (!hasCelebratedFinalStep) {
      triggerFinishFeedback();
      hasCelebratedFinalStep = true;
    }
  } else {
    finishConfetti.innerHTML = "";
    hasCelebratedFinalStep = false;
  }

  prevButton.disabled = currentStepIndex === 0;
  nextButton.disabled = isFinalStep;
  nextButton.textContent = isFinalStep ? "Вы на месте" : "Далее";

  renderTimelineState();
  updateGuideUI(step);
}

function restartRoute() {
  currentStepIndex = 0;
  saveToStorage(STORAGE_KEYS.complete, false);
  renderStep();
}

function moveToStep(offset) {
  const nextIndex = currentStepIndex + offset;
  if (nextIndex < 0 || nextIndex >= steps.length) return;
  currentStepIndex = nextIndex;
  renderStep();
}

function openModal() {
  modalReturnFocus = document.activeElement;
  modalImage.src = stepImage.currentSrc || stepImage.src;
  modalImage.alt = stepImage.alt;
  imageModal.hidden = false;
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeModalButton.focus();
}

function closeModal() {
  imageModal.hidden = true;
  imageModal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
  document.body.classList.remove("modal-open");
  if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
  modalReturnFocus = null;
}

function restoreState() {
  // Каждый новый запуск: обязательная проверка формы и маршрут с первого шага.
  currentStepIndex = 0;
  saveToStorage(STORAGE_KEYS.step, 0);
  saveToStorage(STORAGE_KEYS.complete, false);
  showScreen("intro");
}

function setNetworkBannerState(isOnline) {
  if (isOnline) {
    networkBanner.hidden = true;
    return;
  }
  networkBannerText.textContent = "Оффлайн-режим активен. Маршрут и фото будут открываться без сети.";
  networkBanner.hidden = false;
}

function updateNetworkState() {
  setNetworkBannerState(navigator.onLine);
}

function showUpdateBanner(message) {
  updateBannerText.textContent = message || "Доступна новая версия маршрута. Обновите страницу.";
  updateBanner.hidden = false;
}

function hideUpdateBanner() {
  updateBanner.hidden = true;
}

async function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  try { await deferredInstallPrompt.userChoice; } catch (e) { }
  deferredInstallPrompt = null;
  installBanner.hidden = true;
}

function handleWaitingServiceWorker(worker) {
  waitingWorker = worker;
  showUpdateBanner("Доступна новая версия маршрута. Нажмите «Обновить».");
}

async function applyAppUpdate() {
  if (waitingWorker) {
    refreshingForUpdate = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
    return;
  }
  window.location.reload();
}

function requestBackgroundWarmUp() {
  if (!("serviceWorker" in navigator)) return;
  const send = () => {
    navigator.serviceWorker.ready
      .then(registration => {
        const worker = registration.active || navigator.serviceWorker.controller;
        if (worker) worker.postMessage({ type: "WARM_UP" });
      })
      .catch(() => {});
  };
  // Фоновая догрузка фото и аудио — только когда страница простаивает.
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(send, { timeout: 4000 });
  } else {
    setTimeout(send, 2500);
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  // По file:// service worker зарегистрировать нельзя — тихо пропускаем.
  if (window.location.protocol === "file:") return;

  // Просим браузер не вычищать кеш: офлайн-маршрут должен оставаться доступным.
  if (navigator.storage && typeof navigator.storage.persist === "function") {
    navigator.storage.persist().catch(() => {});
  }
  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshingForUpdate) window.location.reload();
    });
    if (registration.waiting) {
      handleWaitingServiceWorker(registration.waiting);
    }
    registration.addEventListener("updatefound", () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;
      installingWorker.addEventListener("statechange", () => {
        if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
          handleWaitingServiceWorker(installingWorker);
        }
      });
    });

    // Проверяем обновления, когда пользователь возвращается в приложение:
    // иначе старая сборка из кеша живёт до перезапуска браузера.
    let lastUpdateCheck = Date.now();
    const checkForUpdate = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastUpdateCheck < 60000) return;
      lastUpdateCheck = Date.now();
      registration.update().catch(() => {});
    };
    document.addEventListener("visibilitychange", checkForUpdate);
    window.addEventListener("focus", checkForUpdate);
  } catch (error) {
    console.warn("SW registration failed:", error);
  }
}

function initEventListeners() {
  introChecks.forEach(checkbox => {
    checkbox.addEventListener("change", updateIntroState);
  });

  startRouteButton.addEventListener("click", () => {
    if (startRouteButton.disabled) return;
    showScreen("nav");
    updateGuideUI(steps[currentStepIndex]);
  });

  startOverButton.addEventListener("click", () => {
    currentStepIndex = 0;
    renderStep();
    updateIntroState();
  });

  prevButton.addEventListener("click", () => {
    if (currentStepIndex > 0) {
      currentStepIndex -= 1;
      renderStep();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentStepIndex < steps.length - 1) {
      currentStepIndex += 1;
      renderStep();
    }
  });

  restartButton.addEventListener("click", restartRoute);
  refreshAppButton.addEventListener("click", applyAppUpdate);
  installAppButton.addEventListener("click", installApp);

  helpTriggerButton.addEventListener("click", () => {
    helpPopover.hidden = !helpPopover.hidden;
    helpTriggerButton.setAttribute("aria-expanded", String(!helpPopover.hidden));
  });

  [copySupervisorButton, copySupervisorButtonHelp].filter(Boolean).forEach(button => {
    const originalLabel = button.textContent;
    button.addEventListener("click", async () => {
      const value = routeObject?.supervisor?.numbers?.join(" / ") || "2753 / 2747";
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = "Скопировано";
      } catch (error) {
        button.textContent = value;
      }
      setTimeout(() => button.textContent = originalLabel, 1800);
    });
  });

  stepImage.addEventListener("click", () => {
    if (suppressImageClick) {
      suppressImageClick = false;
      return;
    }
    openModal();
  });
  stepImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal();
    }
  });

  stepImage.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  stepImage.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;
    suppressImageClick = true;
    moveToStep(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  closeModalButton.addEventListener("click", closeModal);
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!imageModal.hidden && event.key === "Tab") {
      event.preventDefault();
      closeModalButton.focus();
      return;
    }
    if (event.key === "Escape" && !imageModal.hidden) {
      closeModal();
      return;
    }
    if (event.key === "Escape" && !helpPopover.hidden) {
      helpPopover.hidden = true;
      helpTriggerButton.setAttribute("aria-expanded", "false");
      return;
    }
    if (!navScreen.classList.contains("is-active")) return;
    if (event.key === "ArrowRight" && currentStepIndex < steps.length - 1) {
      currentStepIndex += 1;
      renderStep();
    }
    if (event.key === "ArrowLeft" && currentStepIndex > 0) {
      currentStepIndex -= 1;
      renderStep();
    }
  });

  window.addEventListener("online", updateNetworkState);
  window.addEventListener("offline", updateNetworkState);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installBanner.hidden = navScreen.classList.contains("is-active");
  });
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installBanner.hidden = true;
  });

  document.addEventListener("click", (event) => {
    if (helpPopover.hidden) return;
    const insidePopover = helpPopover.contains(event.target);
    const onTrigger = helpTriggerButton.contains(event.target);
    if (!insidePopover && !onTrigger) {
      helpPopover.hidden = true;
      helpTriggerButton.setAttribute("aria-expanded", "false");
    }
  });
}

// Загружает маршрут из data/route.json, а если fetch недоступен
// (открытие index.html напрямую по file:// или офлайн-первый запуск) —
// берёт встроенную копию из data/route.js (window.ROUTE_DATA).
async function loadRouteData() {
  const inline = window.ROUTE_DATA && Array.isArray(window.ROUTE_DATA.steps) ? window.ROUTE_DATA : null;
  // При открытии по file:// браузер блокирует fetch локальных файлов — сразу берём встроенную копию.
  if (window.location.protocol === "file:" && inline) {
    console.info("[main] запуск без сервера — использую встроенные данные data/route.js");
    return inline;
  }
  try {
    const res = await fetch("./data/route.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("route.json: HTTP " + res.status);
    return await res.json();
  } catch (firstError) {
    // Один повтор: помогает на нестабильном мобильном соединении.
    try {
      const retry = await fetch("./data/route.json", { cache: "reload" });
      if (retry.ok) return await retry.json();
    } catch (retryError) { /* офлайн — уходим во встроенную копию */ }
    if (inline) {
      console.info("[main] route.json недоступен, использую встроенные данные data/route.js");
      return inline;
    }
    throw firstError;
  }
}

async function boot() {
  try {
    const data = await loadRouteData();
    if (!Array.isArray(data.steps) || data.steps.length === 0) {
      throw new Error("route.json: steps empty");
    }
    steps = data.steps;
    routeObject = data.object;
    // Ориентиров может быть больше, чем шагов: объединённые шаги помечены бейджем вида "5-6".
    const totalPoints = steps.reduce((sum, step) => {
      const parts = String(step.badge == null ? "" : step.badge).split("-").filter(Boolean);
      return sum + Math.max(parts.length, 1);
    }, 0);
    if (stepCountStat) stepCountStat.textContent = String(totalPoints);

    initEventListeners();
    initGuideControls();
    applyRouteObject();
    buildTimeline();
    restoreState();
    renderStep();
    updateIntroState();
    updateNetworkState();
    registerServiceWorker();
    requestBackgroundWarmUp();
    hideSplash();
    hideUpdateBanner();
  } catch (error) {
    console.warn("[main] Failed to boot:", error, error && error.stack ? String(error.stack).split("\n").slice(0,6).join(" | ") : "");
    showBootError();
    hideSplash();
  }
}

function showBootError() {
  introScreen.classList.add("is-active");
  navScreen.classList.remove("is-active");
  const panel = document.querySelector(".intro-panel");
  if (!panel) return;

  panel.replaceChildren();
  const title = document.createElement("h2");
  title.textContent = "Маршрут не загрузился";
  const message = document.createElement("p");
  message.textContent = window.location.protocol === "file:"
    ? "Не удалось прочитать данные маршрута. Проверьте, что рядом с index.html есть папка data с файлами route.json и route.js, или запустите open-route.command в папке проекта."
    : "Проверьте соединение и попробуйте ещё раз. Если сеть недоступна, откройте приложение после первого онлайн-запуска.";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "button button--primary";
  retry.textContent = "Повторить загрузку";
  retry.addEventListener("click", () => window.location.reload());
  panel.append(title, message, retry);
  retry.focus();
}


/* ══════════════════════════════════════════════════
   COSMOS GUIDE · мобильно-фото навигация и голосовые подсказки
   ElevenLabs MP3 озвучка офлайн после загрузки PWA; TTS только запасной вариант.
   ══════════════════════════════════════════════════ */
let guideVoiceEnabled = false;
let guideSpeechSequence = 0;
let guideFallbackStartedSequence = -1;
const guideAudioPlayer = new Audio();
guideAudioPlayer.preload = 'auto';
const guideStepCounter = document.getElementById('guideStepCounter');
const guideProgressFill = document.getElementById('guideProgressFill');
const guideAudioButton = document.getElementById('guideAudioButton');
const guideMenuButton = document.getElementById('guideMenuButton');
const guideMenu = document.getElementById('guideMenu');
const guideMenuBackdrop = document.getElementById('guideMenuBackdrop');
const guideMoreButton = document.getElementById('guideMoreButton');
const guideInfoSheet = document.getElementById('guideInfoSheet');
const guideInfoBackdrop = document.getElementById('guideInfoBackdrop');
const guideInfoClose = document.getElementById('guideInfoClose');
const guideInfoBack = document.getElementById('guideInfoBack');

function closeGuideMenu() {
  if (!guideMenu) return;
  guideMenu.classList.remove('is-open');
  guideMenuBackdrop.hidden = true;
  guideMenuButton.setAttribute('aria-expanded', 'false');
  guideMenuButton.setAttribute('aria-label', 'Открыть список шагов');
}
function toggleGuideMenu() {
  if (!guideMenu) return;
  const open = !guideMenu.classList.contains('is-open');
  guideMenu.classList.toggle('is-open', open);
  guideMenuBackdrop.hidden = !open;
  guideMenuButton.setAttribute('aria-expanded', String(open));
  guideMenuButton.setAttribute('aria-label', open ? 'Закрыть список шагов' : 'Открыть список шагов');
}
function closeGuideInfo() {
  if (!guideInfoSheet) return;
  guideInfoSheet.hidden = true;
  guideInfoBackdrop.hidden = true;
}
function openGuideInfo() {
  if (!guideInfoSheet || !steps.length) return;
  const step = steps[currentStepIndex];
  document.getElementById('guideInfoTitle').textContent = step.title;
  document.getElementById('guideInfoAction').textContent = step.action;
  const list = document.getElementById('guideInfoDetails');
  list.replaceChildren();
  (step.details || []).forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    list.appendChild(li);
  });
  const script = document.getElementById('guideInfoScript');
  script.hidden = !step.script;
  document.getElementById('guideInfoScriptText').textContent = step.script || '';
  document.getElementById('guideInfoContact').textContent = (routeObject?.supervisor?.numbers || []).join(' / ');
  guideInfoBackdrop.hidden = false;
  guideInfoSheet.hidden = false;
  guideInfoClose.focus();
}
function stopGuideVoice() {
  guideSpeechSequence++;
  guideAudioPlayer.onerror = null;
  guideAudioPlayer.pause();
  try { guideAudioPlayer.currentTime = 0; } catch (_) { /* no media loaded yet */ }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
function setGuideAudioState() {
  guideAudioButton.classList.toggle('is-on', guideVoiceEnabled);
  guideAudioButton.setAttribute('aria-pressed', String(guideVoiceEnabled));
  guideAudioButton.setAttribute('aria-label', guideVoiceEnabled ? 'Выключить аудиогид ElevenLabs' : 'Включить аудиогид ElevenLabs');
  guideAudioButton.title = guideVoiceEnabled ? 'Аудиогид включён · голос Stanislav' : 'Включить аудиогид · голос Stanislav';
}
function speakGuideFallback(sequence) {
  if (guideFallbackStartedSequence === sequence || !guideVoiceEnabled || sequence !== guideSpeechSequence) return;
  guideFallbackStartedSequence = sequence;
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
    guideAudioButton.title = 'Запись не загружена. Проверьте файлы assets/audio/';
    return;
  }
  const step = steps[currentStepIndex];
  const speech = new SpeechSynthesisUtterance(`Шаг ${currentStepIndex + 1} из ${steps.length}. ${step.title}. ${step.action}`);
  speech.lang = 'ru-RU';
  speech.rate = .90;
  speech.pitch = 1;
  try {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase() === 'ru-ru') || voices.find(v => v.lang.toLowerCase().startsWith('ru'));
    if (voice) speech.voice = voice;
    if (sequence === guideSpeechSequence) {
      guideAudioButton.title = 'MP3 недоступен — используется голос браузера';
      window.speechSynthesis.speak(speech);
    }
  } catch (error) { console.warn('[guide] Запасной голос недоступен:', error); }
}
function speakGuideStep() {
  stopGuideVoice();
  if (!guideVoiceEnabled || !steps.length) return;
  const sequence = guideSpeechSequence;
  const audioPath = `./assets/audio/step-${String(currentStepIndex + 1).padStart(2, '0')}.mp3`;
  guideAudioPlayer.onerror = () => {
    if (sequence !== guideSpeechSequence) return;
    console.warn('[guide] ElevenLabs MP3 не загрузился:', audioPath);
    speakGuideFallback(sequence);
  };
  guideAudioPlayer.src = audioPath;
  guideAudioPlayer.load();
  const playPromise = guideAudioPlayer.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(error => {
      if (sequence !== guideSpeechSequence || error?.name === 'AbortError') return;
      if (error?.name === 'NotAllowedError') {
        console.info('[guide] Для воспроизведения нужен пользовательский жест.');
        guideVoiceEnabled = false;
        setGuideAudioState();
        guideAudioButton.title = 'Нажмите ещё раз для запуска аудио';
        return;
      }
      console.warn('[guide] Невозможно воспроизвести MP3:', error);
      speakGuideFallback(sequence);
    });
  }
}
function updateGuideUI(step) {
  if (!step || !steps.length) return;
  guideStepCounter.innerHTML = `${String(currentStepIndex + 1).padStart(2, '0')} <span>/ ${String(steps.length).padStart(2, '0')}</span>`;
  guideProgressFill.style.width = Math.round(100 * (currentStepIndex + 1) / steps.length) + '%';
  closeGuideInfo();
  if (guideVoiceEnabled && navScreen.classList.contains('is-active')) speakGuideStep();
}
function initGuideControls() {
  guideMenuButton.addEventListener('click', toggleGuideMenu);
  guideMenuBackdrop.addEventListener('click', closeGuideMenu);
  guideMoreButton.addEventListener('click', openGuideInfo);
  guideInfoClose.addEventListener('click', closeGuideInfo);
  guideInfoBack.addEventListener('click', closeGuideInfo);
  guideInfoBackdrop.addEventListener('click', closeGuideInfo);
  guideAudioButton.addEventListener('click', () => {
    guideVoiceEnabled = !guideVoiceEnabled;
    setGuideAudioState();
    if (guideVoiceEnabled) speakGuideStep();
    else stopGuideVoice();
  });
  window.addEventListener('pagehide', stopGuideVoice);
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!guideInfoSheet.hidden) { event.stopPropagation(); closeGuideInfo(); guideMoreButton.focus(); }
    else if (guideMenu.classList.contains('is-open')) { event.stopPropagation(); closeGuideMenu(); guideMenuButton.focus(); }
  }, true);
  setGuideAudioState();
}

boot();
