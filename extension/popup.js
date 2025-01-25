document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "getQueryCount" }, (response) => {
    document.getElementById("query-count").textContent = response.queryCount;
  });
});
