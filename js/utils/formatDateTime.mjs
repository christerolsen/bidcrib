export function formatDateTime(dateTimeString) {
  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = new Date(dateTimeString).toLocaleString(
    "en-GB",
    options
  );
  return formattedDate.replace(".", "");
}
