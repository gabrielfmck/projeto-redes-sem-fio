async function fetchJson(url, options) {
  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || "Falha ao enviar login.")
    error.payload = data
    throw error
  }

  return data
}

function setResult(payload, tone) {
  const box = document.getElementById("result-box")

  box.className = `result-box ${tone}`
  box.innerHTML = `
    <pre>${JSON.stringify(payload, null, 2)}</pre>
  `
}

function setTransportTip(message, tone) {
  const box = document.getElementById("transport-tip")

  if (!box) {
    return
  }

  if (!message) {
    box.textContent = ""
    return
  }

  box.className = `transport-tip ${tone}`
  box.textContent = message
}

async function handleSubmit(event) {
  event.preventDefault()

  const form = event.currentTarget
  const mode = document.body.dataset.mode
  const formData = new FormData(form)
  const payload = Object.fromEntries(formData.entries())
  const url = mode === "vulneravel" ? "/login-vulneravel" : "/login-seguro"

  try {
    const result = await fetchJson(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    setResult(result, mode === "vulneravel" ? "danger" : "safe")

    if (mode === "seguro") {
      const message =
        result.transport === "https"
          ? "Esta execucao usou HTTPS. O trafego agora fica protegido no transporte."
          : "Voce ainda esta em HTTP. Abra esta mesma pagina em https://IP_DO_PC:3443/login-seguro.html para comparar no Wireshark."

      setTransportTip(message, result.transport === "https" ? "safe" : "neutral")
    }
  } catch (error) {
    const payloadError = error.payload || { message: error.message }
    setResult(payloadError, "danger")

    if (mode === "seguro") {
      setTransportTip(
        "Falhas consecutivas no fluxo protegido ativam bloqueio temporario e aparecem no painel.",
        "neutral"
      )
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form")

  if (form) {
    form.addEventListener("submit", handleSubmit)
  }
})
