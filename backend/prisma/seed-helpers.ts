import { LESSONS, NAMES, SURNAMES } from './seed-constants';

export function getRandomName() {
  const randomIndex = Math.floor(Math.random() * NAMES.length);
  return NAMES[randomIndex];
}

export function getRandomSurname() {
  const randomIndex = Math.floor(Math.random() * SURNAMES.length);
  return SURNAMES[randomIndex];
}

export function getRandomLesson() {
  const randomIndex = Math.floor(Math.random() * LESSONS.length);
  return LESSONS[randomIndex];
}
