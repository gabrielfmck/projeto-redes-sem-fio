async function fetchJson(url, options) {
  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Falha ao consultar o painel.")
  }

  return data
}

function renderMetrics(metrics) {
  const box = document.getElementById("metric-cards")
  const cards = [
    ["Vulneravel", metrics.vulnerableAttempts],
    ["Protegido", metrics.secureAttempts],
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

function renderNetwork(network) {
  const box = document.getElementById("network-summary")

  box.innerHTML = `
    <div class="status-line">
      <span class="badge http">HTTP ${network.httpPort}</span>
      <span class="badge ${network.httpsEnabled ? "https" : "danger"}">
        ${network.httpsEnabled ? `HTTPS ${network.httpsPort}` : "HTTPS inativo"}
      </span>
    </div>
    <p class="muted">Use o endereco IPv4 do computador no celular. O HTTPS fica melhor para comparar a diferenca no Wireshark.</p>
  `
}

function pickTone(type) {
  if (type.startsWith("vulnerable")) {
    return "danger"
  }

  if (type.startsWith("secure")) {
    return "safe"
  }

  return "neutral"
}

function renderEventDetails(event) {
  const ignoredKeys = new Set(["id", "timestamp", "type"])
  const entries = Object.entries(event).filter(([key]) => !ignoredKeys.has(key))

  if (entries.length === 0) {
    return "<p class=\"muted\">Sem detalhes extras.</p>"
  }

  return `
    <dl>
      ${entries
        .map(
          ([key, value]) => `
            <dt>${key}</dt>
            <dd>${String(value)}</dd>
          `
        )
        .join("")}
    </dl>
  `
}

function renderEvents(events) {
  const box = document.getElementById("event-list")

  if (events.length === 0) {
    box.innerHTML = "<p class=\"muted\">Ainda nao ha eventos registrados.</p>"
    return
  }

  box.innerHTML = events
    .map(
      (event) => `
        <article class="event-card ${pickTone(event.type)}">
          <div class="event-head">
            <span class="event-type">${event.type}</span>
            <span class="badge neutral">${new Date(event.timestamp).toLocaleString("pt-BR")}</span>
          </div>
          ${renderEventDetails(event)}
        </article>
      `
    )
    .join("")
}

async function loadPanel() {
  const payload = await fetchJson("/api/metrics")
  renderMetrics(payload.metrics)
  renderNetwork(payload.network)
  renderEvents(payload.events)
}

document.addEventListener("DOMContentLoaded", () => {
  loadPanel().catch((error) => {
    document.getElementById("event-list").innerHTML = `<p class="muted">${error.message}</p>`
  })

  document.getElementById("reset-demo").addEventListener("click", async () => {
    try {
      await fetchJson("/api/reset-demo", {
        method: "POST"
      })

      await loadPanel()
    } catch (error) {
      alert(error.message)
    }
  })

  setInterval(() => {
    loadPanel().catch(() => {})
  }, 3000)
})
