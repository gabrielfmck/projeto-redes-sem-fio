async function fetchJson(url, options) {
  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Falha ao consultar o servidor.")
  }

  return data
}

function renderUsers(users) {
  const tbody = document.getElementById("demo-users")

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
          <td>${user.username}</td>
          <td>${user.password}</td>
          <td>${user.role}</td>
        </tr>
      `
    )
    .join("")
}

function renderNetwork(network) {
  const box = document.getElementById("network-status")
  const items = []

  items.push(`
    <div class="network-item ${network.httpsEnabled ? "safe" : "danger"}">
      <div class="status-line">
        <strong>Localhost</strong>
        <span class="badge http">HTTP ${network.httpPort}</span>
        <span class="badge ${network.httpsEnabled ? "https" : "danger"}">
          ${network.httpsEnabled ? `HTTPS ${network.httpsPort}` : "HTTPS inativo"}
        </span>
      </div>
      <p>${network.localhostHttpUrl}</p>
      <p>${network.httpsEnabled ? network.localhostHttpsUrl : "Gere ou mantenha demo-cert.pfx para habilitar TLS."}</p>
    </div>
  `)

  if (network.localInterfaces.length === 0) {
    items.push(`
      <div class="network-item danger">
        <strong>Nenhum IPv4 externo encontrado.</strong>
        <p>Conecte o computador e o celular na mesma rede para testar do telefone.</p>
      </div>
    `)
  } else {
    items.push(
      ...network.localInterfaces.map(
        (entry) => `
          <div class="network-item neutral">
            <div class="status-line">
              <strong>${entry.name}</strong>
              <span class="badge neutral">${entry.address}</span>
            </div>
            <p>HTTP: ${entry.httpUrl}</p>
            <p>HTTPS: ${entry.httpsUrl}</p>
          </div>
        `
      )
    )
  }

  box.innerHTML = items.join("")
}

function renderMetrics(metrics) {
  const box = document.getElementById("metric-cards")

  const cards = [
    ["Fluxo vulneravel", metrics.vulnerableAttempts],
    ["Fluxo protegido", metrics.secureAttempts],
    ["Sucessos vulneraveis", metrics.vulnerableSuccess],
    ["Sucessos protegidos", metrics.secureSuccess],
    ["Falhas", metrics.failedAttempts],
    ["Bloqueios", metrics.blockedAttempts],
    ["Tamper aceito", metrics.tamperAccepted],
    ["Tamper bloqueado", metrics.tamperBlocked]
  ]

  box.innerHTML = cards
    .map(
      ([label, value]) => `
        <div class="metric-card">
          <span class="metric-label">${label}</span>
          <span class="metric-value">${value}</span>
        </div>
      `
    )
    .join("")
}

async function loadHome() {
  const payload = await fetchJson("/api/metrics")
  renderUsers(payload.demoUsers)
  renderNetwork(payload.network)
  renderMetrics(payload.metrics)
}

async function resetDemo() {
  await fetchJson("/api/reset-demo", {
    method: "POST"
  })

  await loadHome()
}

document.addEventListener("DOMContentLoaded", () => {
  const resetButton = document.getElementById("reset-demo")

  loadHome().catch((error) => {
    document.getElementById("network-status").innerHTML = `<p class="muted">${error.message}</p>`
  })

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      resetDemo().catch((error) => {
        alert(error.message)
      })
    })
  }

  setInterval(() => {
    loadHome().catch(() => {})
  }, 4000)
})
