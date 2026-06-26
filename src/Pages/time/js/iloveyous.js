export async function getTodayIloveyou() {
  const response = await fetch("/api/iloveyous/today");

  if (!response.ok) {
    throw new Error("Erro ao buscar palavra do dia.");
  }

  return response.json();
}