import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export const fixDate = (date: Date) => {
  const timezoneOffset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - timezoneOffset);
  return date;
};

export function makeDateFriendlyToDataBase(staraData: Date) {
  const date = new Date(staraData);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  return date;
}

export const getDzisiaj = () => {
  const dzienx = new Date().getDate();
  const dzien = dzienx < 10 ? "0" + dzienx : dzienx;
  const miesiacx = new Date().getMonth() + 1;
  const miesiac = miesiacx < 10 ? "0" + miesiacx : miesiacx;
  const rok = new Date().getFullYear();
  const dzisiaj = dzien + "." + miesiac + "." + rok + "r.";
  return dzisiaj;
};

export function createDateFromString(dateString?: string) {
  // Split the string into month and year
  if (!dateString) {
    return new Date();
  }

  const [month, year] = dateString.split(".").map(Number);

  return fixDate(new Date(year, month - 1));
}

export function numerTygodniaNaString(numerTygodnia: number) {
  switch (numerTygodnia) {
    case 0:
      return "Niedziela";
    case 1:
      return "Poniedziałek";
    case 2:
      return "Wtorek";
    case 3:
      return "Środa";
    case 4:
      return "Czwartek";
    case 5:
      return "Piątek";
    case 6:
      return "Sobota";
    default:
      return "Nieznany dzień";
  }
}

export function formatujSlowoCwiczenieWgLiczby(liczba: number) {
  if (liczba === 1) {
    return "ćwiczenie";
  }

  const ostatniaCyfra = parseFloat(liczba.toString().at(-1) ?? "0");

  if (
    (liczba > 20 || liczba < 10) &&
    ostatniaCyfra >= 2 &&
    ostatniaCyfra <= 4
  ) {
    return "ćwiczenia";
  }

  return "ćwiczeń";
}
