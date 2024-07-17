document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("check-button")
    .addEventListener("click", checkProducts);
});

let results = [];

async function checkProducts() {
  const urls = document
    .getElementById("product-urls")
    .value.split("\n")
    .filter((url) => url.trim());
  const resultsTbody = document.getElementById("results");
  const progressBar = document.getElementById("progress-bar");

  // Clear previous results
  results = [];
  resultsTbody.innerHTML = "";
  progressBar.style.width = "0%";

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim();
    try {
      const response = await fetch(url);
      const data = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");

      const notExistDiv = doc.querySelector("div.product-not-exist__text");
      const buyButtonDiv = doc.querySelector("div.bwPwYa");

      let status;
      if (buyButtonDiv) {
        status = "O produto está disponível";
      } else if (notExistDiv) {
        status = "O produto não existe";
      } else {
        status = "Não foi possível verificar o produto";
      }

      results.push({ url, status });
    } catch (error) {
      results.push({ url, status: "Erro ao verificar o produto" });
      console.error("Error:", error);
    }

    // Update progress bar
    const progress = ((i + 1) / urls.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Wait for 5 seconds before processing the next URL
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // Sort results to show unavailable pages first
  results.sort((a, b) => a.status.localeCompare(b.status));

  // Display results
  results.forEach((result) => {
    const resultRow = document.createElement("tr");
    const urlCell = document.createElement("td");
    const statusCell = document.createElement("td");

    const urlLink = document.createElement("a");
    urlLink.href = result.url;
    urlLink.textContent = result.url;
    urlLink.target = "_blank"; // Open link in new tab
    urlCell.appendChild(urlLink);

    statusCell.textContent = result.status;
    if (result.status === "O produto está disponível") {
      statusCell.style.color = "green";
    } else if (result.status === "O produto não existe") {
      statusCell.style.color = "red";
    } else {
      statusCell.style.color = "orange"; // For unverified status
    }

    resultRow.appendChild(urlCell);
    resultRow.appendChild(statusCell);
    resultsTbody.appendChild(resultRow);
  });
}
