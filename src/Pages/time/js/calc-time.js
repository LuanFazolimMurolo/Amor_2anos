export function getDateAndCountdown() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const day_NIV = 18;
  const baseDate = new Date(2024, 6, day_NIV, 0, 0, 0); // 18/07/2024

  // Calcula próximo dia 18 (de qualquer mês)
  let nextDay18 = new Date(
    currentYear,
    now.getMonth(),
    day_NIV,
    0,
    0,
    0
  );

  // Se o dia 18 deste mês já passou, vai para o próximo mês
  if (nextDay18 <= now) {
    nextDay18 = new Date(
      currentYear,
      now.getMonth() + 1,
      day_NIV,
      0,
      0,
      0
    );
  }

  // Calcula tempo que já passou desde 18/07/2024
  const timePassed = now - baseDate;
  let years = now.getFullYear() - baseDate.getFullYear();
  let months = now.getMonth() - baseDate.getMonth();
  const dayDifference = now.getDate() - baseDate.getDate();

  if (dayDifference < 0) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    years = 0;
    months = 0;
  }

  const yearsDecimal = `${years}.${months}`;
  const monthsPassed = years * 12 + months;
  const daysPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24));

  // Calcula tempo até o próximo dia 18
  const differenceUntilNext = nextDay18 - now;
  const daysUntil = Math.floor(differenceUntilNext / (1000 * 60 * 60 * 24));
  const hoursUntil = Math.floor(
    (differenceUntilNext / (1000 * 60 * 60)) % 24
  );
  const minutesUntil = Math.floor(
    (differenceUntilNext / (1000 * 60)) % 60
  );
  const secondsUntil = Math.floor(
    (differenceUntilNext / 1000) % 60
  );

  const currentDate = {
    fullDate: now.toLocaleDateString("pt-BR"),
    weekDay: now.toLocaleDateString("pt-BR", {
      weekday: "long"
    }),
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  };

  const age = {
    ageString: yearsDecimal,
    years,
    months,
    monthsPassed,
    daysPassed,
    baseDate
  };

  const countdown = {
    nextDay18,
    daysUntil,
    hoursUntil,
    minutesUntil,
    secondsUntil
  };

  const niverday = (day_NIV === now.getDate() )
  return {
    currentDate,
    age,
    countdown,
    niverday
  };
}