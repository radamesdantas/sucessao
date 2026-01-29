import { AppData, Mentee, Module, CCEScore, CheckIn, Contact, Challenge, Project } from './types';
import { MODULES, BEHAVIOR_MODULES, CHALLENGES, PROJECTS } from './data';
import { sheetsGet, sheetsSet, sheetsDelete, isSheetsEnabled } from './api';

const MENTEES_KEY = 'sucessao_mentees';
const CURRENT_MENTEE_KEY = 'sucessao_current_mentee';

function getStorageKey(menteeId: string): string {
  return `sucessao_app_data_${menteeId}`;
}

function getSheetsKey(menteeId: string): string {
  return `data_${menteeId}`;
}

function getDefaultData(): AppData {
  return {
    modules: MODULES.map((m) => ({ ...m, weeks: m.weeks.map((w) => ({ ...w })) })),
    behaviorModules: BEHAVIOR_MODULES.map((m) => ({ ...m, weeks: m.weeks.map((w) => ({ ...w })) })),
    cceScores: [],
    checkIns: [],
    contacts: [],
    challenges: CHALLENGES.map((c) => ({ ...c })),
    projects: PROJECTS.map((p) => ({ ...p, deliverables: p.deliverables.map((d) => ({ ...d })) })),
  };
}

function ensureBehaviorModules(data: AppData): AppData {
  if (!data.behaviorModules) {
    data.behaviorModules = BEHAVIOR_MODULES.map((m) => ({ ...m, weeks: m.weeks.map((w) => ({ ...w })) }));
  }
  return data;
}

// --- Sheets sync helpers (fire-and-forget) ---

function pushMenteesToSheets(mentees: Mentee[]) {
  if (isSheetsEnabled()) {
    sheetsSet('mentees', mentees);
  }
}

function pushDataToSheets(menteeId: string, data: AppData) {
  if (isSheetsEnabled()) {
    sheetsSet(getSheetsKey(menteeId), data);
  }
}

// --- Mentee management ---

export function loadMentees(): Mentee[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MENTEES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Mentee[];
  } catch {
    return [];
  }
}

export function saveMentees(mentees: Mentee[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENTEES_KEY, JSON.stringify(mentees));
  pushMenteesToSheets(mentees);
}

export function getCurrentMenteeId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_MENTEE_KEY);
}

export function setCurrentMenteeId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id === null) {
    localStorage.removeItem(CURRENT_MENTEE_KEY);
  } else {
    localStorage.setItem(CURRENT_MENTEE_KEY, id);
  }
}

export function deleteMentee(menteeId: string): void {
  if (typeof window === 'undefined') return;
  const mentees = loadMentees().filter((m) => m.id !== menteeId);
  saveMentees(mentees);
  localStorage.removeItem(getStorageKey(menteeId));
  if (getCurrentMenteeId() === menteeId) {
    setCurrentMenteeId(null);
  }
  if (isSheetsEnabled()) {
    sheetsDelete(getSheetsKey(menteeId));
  }
}

// --- Pull from Sheets (async, used on mount) ---

export async function pullMenteesFromSheets(): Promise<Mentee[] | null> {
  if (!isSheetsEnabled()) return null;
  const data = await sheetsGet('mentees');
  if (Array.isArray(data) && data.length > 0) {
    localStorage.setItem(MENTEES_KEY, JSON.stringify(data));
    return data as Mentee[];
  }
  return null;
}

export async function pullDataFromSheets(menteeId: string): Promise<AppData | null> {
  if (!isSheetsEnabled()) return null;
  const data = await sheetsGet(getSheetsKey(menteeId));
  if (data && typeof data === 'object') {
    const appData = ensureBehaviorModules(data as AppData);
    localStorage.setItem(getStorageKey(menteeId), JSON.stringify(appData));
    return appData;
  }
  return null;
}

// --- App data (per mentee) ---

export function loadData(menteeId: string): AppData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const raw = localStorage.getItem(getStorageKey(menteeId));
    if (!raw) return getDefaultData();
    return ensureBehaviorModules(JSON.parse(raw) as AppData);
  } catch {
    return getDefaultData();
  }
}

export function saveData(menteeId: string, data: AppData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(menteeId), JSON.stringify(data));
  pushDataToSheets(menteeId, data);
}

export function updateModule(menteeId: string, moduleId: number, updates: Partial<Module>): AppData {
  const data = loadData(menteeId);
  const idx = data.modules.findIndex((m) => m.id === moduleId);
  if (idx !== -1) {
    data.modules[idx] = { ...data.modules[idx], ...updates };
  }
  saveData(menteeId, data);
  return data;
}

export function updateBehaviorModule(menteeId: string, moduleId: number, updates: Partial<Module>): AppData {
  const data = loadData(menteeId);
  const idx = data.behaviorModules.findIndex((m) => m.id === moduleId);
  if (idx !== -1) {
    data.behaviorModules[idx] = { ...data.behaviorModules[idx], ...updates };
  }
  saveData(menteeId, data);
  return data;
}

export function addCCEScore(menteeId: string, score: CCEScore): AppData {
  const data = loadData(menteeId);
  data.cceScores.push(score);
  saveData(menteeId, data);
  return data;
}

export function addCheckIn(menteeId: string, checkIn: CheckIn): AppData {
  const data = loadData(menteeId);
  data.checkIns.push(checkIn);
  saveData(menteeId, data);
  return data;
}

export function addContact(menteeId: string, contact: Contact): AppData {
  const data = loadData(menteeId);
  data.contacts.push(contact);
  saveData(menteeId, data);
  return data;
}

export function updateContact(menteeId: string, contactId: string, updates: Partial<Contact>): AppData {
  const data = loadData(menteeId);
  const idx = data.contacts.findIndex((c) => c.id === contactId);
  if (idx !== -1) {
    data.contacts[idx] = { ...data.contacts[idx], ...updates };
  }
  saveData(menteeId, data);
  return data;
}

export function deleteContact(menteeId: string, contactId: string): AppData {
  const data = loadData(menteeId);
  data.contacts = data.contacts.filter((c) => c.id !== contactId);
  saveData(menteeId, data);
  return data;
}

export function updateChallenge(menteeId: string, challengeId: number, updates: Partial<Challenge>): AppData {
  const data = loadData(menteeId);
  const idx = data.challenges.findIndex((c) => c.id === challengeId);
  if (idx !== -1) {
    data.challenges[idx] = { ...data.challenges[idx], ...updates };
  }
  saveData(menteeId, data);
  return data;
}

export function updateProject(menteeId: string, projectId: number, updates: Partial<Project>): AppData {
  const data = loadData(menteeId);
  const idx = data.projects.findIndex((p) => p.id === projectId);
  if (idx !== -1) {
    data.projects[idx] = { ...data.projects[idx], ...updates };
  }
  saveData(menteeId, data);
  return data;
}
