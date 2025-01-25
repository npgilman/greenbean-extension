document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const inputBox = document.querySelector("textarea");
    if (inputBox) {
      inputBox.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          chrome.runtime.sendMessage({ action: "incrementQueryCount" });
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
