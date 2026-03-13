const crypto = require("crypto")
const express = require("express")
const fs = require("fs")
const http = require("http")
const https = require("https")
const os = require("os")
const path = require("path")

const app = express()

const HTTP_PORT = Number(process.env.PORT || 3000)
const HTTPS_PORT = Number(process.env.HTTPS_PORT || 3443)
const CERT_PATH = process.env.DEMO_CERT_PATH || path.join(__dirname, "demo-cert.pfx")
const CERT_PASSWORD = process.env.DEMO_CERT_PASSWORD || "tcd-redes-demo"
const MAX_FAILED_ATTEMPTS = 3
const LOCK_WINDOW_MS = 60 * 1000
const EVENT_LIMIT = 40

function createPasswordRecord(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return { salt, hash }
}

function verifyPassword(password, record) {
  const candidate = crypto.scryptSync(password, record.salt, 64)
  const expected = Buffer.from(record.hash, "hex")

  return crypto.timingSafeEqual(candidate, expected)
}

const demoUsers = [
  { username: "aluno", password: "123456", role: "user", displayName: "Aluno" },
  { username: "analista", password: "wifi2026", role: "analyst", displayName: "Analista" },
  { username: "admin", password: "adminwifi", role: "admin", displayName: "Administrador" }
]

const vulnerableUsers = Object.fromEntries(
  demoUsers.map((user) => [
    user.username,
    {
      displayName: user.displayName,
      password: user.password,
      role: user.role
    }
  ])
)

const secureUsers = Object.fromEntries(
  demoUsers.map((user) => [
    user.username,
    {
      displayName: user.displayName,
      role: user.role,
      passwordRecord: createPasswordRecord(user.password)
    }
  ])
)

function createMetrics(httpsEnabled) {
  return {
    httpsEnabled,
    serverStartedAt: new Date().toISOString(),
    lastResetAt: new Date().toISOString(),
    vulnerableAttempts: 0,
    vulnerableSuccess: 0,
    secureAttempts: 0,
    secureSuccess: 0,
    failedAttempts: 0,
    blockedAttempts: 0,
    tamperAccepted: 0,
    tamperBlocked: 0
  }
}

let metrics = createMetrics(false)
const events = []
const attemptTracker = new Map()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"]
  const candidate = Array.isArray(forwarded)
    ? forwarded[0]
    : String(forwarded || req.socket.remoteAddress || req.ip || "").split(",")[0]

  return candidate.replace("::ffff:", "") || "unknown"
}

function addEvent(type, details = {}) {
  events.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    ...details
  })

  while (events.length > EVENT_LIMIT) {
    events.pop()
  }
}

function trackerKey(username, ip) {
  return `${String(username || "anon").toLowerCase()}|${ip}`
}

function getAttemptState(username, ip) {
  const key = trackerKey(username, ip)
  const current = attemptTracker.get(key)

  if (!current) {
    return { blocked: false, attemptsLeft: MAX_FAILED_ATTEMPTS }
  }

  if (current.lockUntil && current.lockUntil <= Date.now()) {
    attemptTracker.delete(key)
    return { blocked: false, attemptsLeft: MAX_FAILED_ATTEMPTS }
  }

  return {
    blocked: Boolean(current.lockUntil && current.lockUntil > Date.now()),
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - current.failCount),
    retryInSeconds: current.lockUntil
      ? Math.max(1, Math.ceil((current.lockUntil - Date.now()) / 1000))
      : 0
  }
}

function registerFailure(username, ip) {
  const key = trackerKey(username, ip)
  const current = attemptTracker.get(key) || { failCount: 0, lockUntil: 0 }

  current.failCount += 1

  if (current.failCount >= MAX_FAILED_ATTEMPTS) {
    current.lockUntil = Date.now() + LOCK_WINDOW_MS
  }

  attemptTracker.set(key, current)

  return getAttemptState(username, ip)
}

function clearFailures(username, ip) {
  attemptTracker.delete(trackerKey(username, ip))
}

function resetDemo() {
  const httpsEnabled = metrics.httpsEnabled

  metrics = createMetrics(httpsEnabled)
  attemptTracker.clear()
  events.length = 0

  addEvent("demo_reset", {
    message: "Estado da demonstracao reiniciado."
  })
}

function buildNetworkInfo() {
  const interfaces = os.networkInterfaces()
  const localInterfaces = []

  Object.entries(interfaces).forEach(([name, addresses]) => {
    ;(addresses || [])
      .filter((entry) => entry.family === "IPv4" && !entry.internal)
      .forEach((entry) => {
        localInterfaces.push({
          name,
          address: entry.address,
          httpUrl: `http://${entry.address}:${HTTP_PORT}`,
          httpsUrl: `https://${entry.address}:${HTTPS_PORT}`
        })
      })
  })

  return {
    hostname: os.hostname(),
    httpPort: HTTP_PORT,
    httpsPort: HTTPS_PORT,
    httpsEnabled: metrics.httpsEnabled,
    localhostHttpUrl: `http://localhost:${HTTP_PORT}`,
    localhostHttpsUrl: `https://localhost:${HTTPS_PORT}`,
    localInterfaces
  }
}

function getTransportLabel(req) {
  return req.secure ? "https" : "http"
}

app.get("/api/network-info", (req, res) => {
  res.json(buildNetworkInfo())
})

app.get("/api/metrics", (req, res) => {
  res.json({
    metrics,
    events,
    demoUsers,
    policy: {
      maxFailedAttempts: MAX_FAILED_ATTEMPTS,
      lockWindowSeconds: LOCK_WINDOW_MS / 1000
    },
    network: buildNetworkInfo()
  })
})

app.post("/api/reset-demo", (req, res) => {
  resetDemo()

  res.json({
    ok: true,
    message: "Demonstracao reiniciada com sucesso."
  })
})

app.post("/login-vulneravel", (req, res) => {
  const username = String(req.body.usuario || "").trim().toLowerCase()
  const password = String(req.body.senha || "")
  const clientRole = String(req.body.role || "").trim().toLowerCase()
  const ip = getClientIp(req)
  const user = vulnerableUsers[username]

  metrics.vulnerableAttempts += 1

  if (!user || user.password !== password) {
    metrics.failedAttempts += 1

    addEvent("vulnerable_failure", {
      ip,
      username,
      providedPassword: password,
      providedRole: clientRole || "none",
      transport: getTransportLabel(req)
    })

    return res.status(401).json({
      ok: false,
      mode: "vulneravel",
      message: "Login falhou. No fluxo vulneravel ate a senha digitada fica registrada na analise.",
      transport: getTransportLabel(req)
    })
  }

  const acceptedRole = clientRole || user.role
  const roleTampered = Boolean(clientRole && clientRole !== user.role)

  metrics.vulnerableSuccess += 1

  if (roleTampered) {
    metrics.tamperAccepted += 1
  }

  addEvent("vulnerable_success", {
    ip,
    username,
    acceptedRole,
    realRole: user.role,
    providedPassword: password,
    tamperedRoleAccepted: roleTampered,
    transport: getTransportLabel(req)
  })

  return res.json({
    ok: true,
    mode: "vulneravel",
    username,
    acceptedRole,
    realRole: user.role,
    transport: getTransportLabel(req),
    message: roleTampered
      ? "Falha explorada: o servidor confiou no role enviado pelo cliente."
      : "Login aceito no fluxo vulneravel."
  })
})

app.post("/login-seguro", (req, res) => {
  const username = String(req.body.usuario || "").trim().toLowerCase()
  const password = String(req.body.senha || "")
  const claimedRole = String(req.body.role || "").trim().toLowerCase()
  const ip = getClientIp(req)

  metrics.secureAttempts += 1

  const attemptState = getAttemptState(username, ip)

  if (attemptState.blocked) {
    metrics.blockedAttempts += 1

    addEvent("secure_blocked", {
      ip,
      username,
      claimedRole: claimedRole || "none",
      retryInSeconds: attemptState.retryInSeconds,
      transport: getTransportLabel(req)
    })

    return res.status(429).json({
      ok: false,
      mode: "seguro",
      message: `Conta temporariamente bloqueada por ${attemptState.retryInSeconds}s devido a multiplas falhas.`,
      retryInSeconds: attemptState.retryInSeconds,
      transport: getTransportLabel(req)
    })
  }

  const user = secureUsers[username]
  const valid = Boolean(user && verifyPassword(password, user.passwordRecord))

  if (!valid) {
    metrics.failedAttempts += 1
    const nextState = registerFailure(username, ip)

    addEvent("secure_failure", {
      ip,
      username,
      claimedRole: claimedRole || "none",
      attemptsLeft: nextState.attemptsLeft,
      transport: getTransportLabel(req)
    })

    return res.status(401).json({
      ok: false,
      mode: "seguro",
      message: nextState.blocked
        ? `Senha incorreta. A conta foi bloqueada por ${nextState.retryInSeconds}s.`
        : `Senha incorreta. Restam ${nextState.attemptsLeft} tentativa(s) antes do bloqueio.`,
      attemptsLeft: nextState.attemptsLeft,
      retryInSeconds: nextState.retryInSeconds || 0,
      transport: getTransportLabel(req)
    })
  }

  clearFailures(username, ip)

  const roleTampered = Boolean(claimedRole && claimedRole !== user.role)

  metrics.secureSuccess += 1

  if (roleTampered) {
    metrics.tamperBlocked += 1

    addEvent("secure_role_override_blocked", {
      ip,
      username,
      claimedRole,
      enforcedRole: user.role,
      transport: getTransportLabel(req)
    })
  }

  addEvent("secure_success", {
    ip,
    username,
    enforcedRole: user.role,
    claimedRole: claimedRole || "none",
    transport: getTransportLabel(req)
  })

  return res.json({
    ok: true,
    mode: "seguro",
    username,
    assignedRole: user.role,
    claimedRole: claimedRole || null,
    transport: getTransportLabel(req),
    httpsEnabled: metrics.httpsEnabled,
    message:
      getTransportLabel(req) === "https"
        ? "Login seguro validado. Senha verificada com scrypt, role forjado bloqueado e trafego protegido por TLS."
        : "Login seguro validado na aplicacao. Para proteger o trafego no Wireshark, abra esta mesma pagina via HTTPS."
  })
})

const httpServer = http.createServer(app)

httpServer.listen(HTTP_PORT, () => {
  console.log(`Servidor HTTP rodando em http://localhost:${HTTP_PORT}`)
})

if (fs.existsSync(CERT_PATH)) {
  try {
    const httpsServer = https.createServer(
      {
        pfx: fs.readFileSync(CERT_PATH),
        passphrase: CERT_PASSWORD
      },
      app
    )

    httpsServer.listen(HTTPS_PORT, () => {
      metrics.httpsEnabled = true
      console.log(`Servidor HTTPS rodando em https://localhost:${HTTPS_PORT}`)
    })
  } catch (error) {
    console.log("HTTPS nao foi iniciado. Verifique o arquivo demo-cert.pfx e a senha configurada.")
    console.log(error.message)
  }
} else {
  console.log("HTTPS desativado. Gere demo-cert.pfx para habilitar a comparacao com TLS.")
}

addEvent("demo_started", {
  message: "Servidor iniciado para a demonstracao de seguranca em redes sem fio."
})
