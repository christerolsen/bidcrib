export default function getCurrentPage() {
  const currentPage = window.location.pathname.toLowerCase();

  if (currentPage === "/" || currentPage.includes("index")) {
    return "index";
  } else if (currentPage.includes("register")) {
    return "register";
  } else if (currentPage.includes("signin")) {
    return "signin";
  } else if (currentPage.includes("profile")) {
    return "profile";
  } else if (currentPage.includes("listing")) {
    return "listing";
  } else if (currentPage.includes("about")) {
    return "about";
  } else {
    return "unknown"; // default or handle additional cases as needed
  }
}
