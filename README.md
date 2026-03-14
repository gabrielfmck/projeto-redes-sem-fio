# Segurança em Redes Sem Fio

> Demonstração prática de segurança em redes sem fio com foco em autenticação, interceptação de tráfego, adulteração de requisições e mecanismos de defesa em diferentes camadas — criando uma análise comparativa entre fluxos vulneráveis e protegidos em autenticação web.

---

## Contexto acadêmico

Este projeto foi desenvolvido no âmbito da disciplina de **Redes de Computadores** do curso de **Bacharelado em Sistemas de Informação** da **Universidade Federal de Uberlândia (UFU)**, sob orientação do **Prof. Igor da Penha Natal**.

| | |
|---|---|
| 🏫 **Instituição** | Universidade Federal de Uberlândia — UFU, Campus Monte Carmelo |
| 📚 **Disciplina** | Redes de Computadores |
| 👨‍🏫 **Professor** | Igor da Penha Natal |

### Equipe

| Aluno | E-mail |
|-------|--------|
| Gabriel Fernandes de Jesus | gabrielfernandesj@ufu.br |
| Jonathan Davi de Aquino | jonathandavi@ufu.br |
| Matheus Marques Mendes Pereira | matheuspereira@ufu.br |

### Entregas do projeto

Este repositório contém a implementação prática que acompanha outras duas entregas:

- **Seminário** — apresentação em aula sobre o tema *Segurança em Redes Sem Fio*, abordando introdução, fundamentação teórica, funcionamento, vantagens e limitações, e a aplicação proposta
- **Artigo científico** — documento aprofundado redigido no template SBC/ACM/IEEE, detalhando o projeto, a metodologia, os resultados obtidos e as conclusões

---

## Sumário

1. [Resumo do projeto](#1-resumo-do-projeto)
2. [Tema e recorte acadêmico](#2-tema-e-recorte-acadêmico)
3. [Objetivos](#3-objetivos)
4. [Justificativa](#4-justificativa)
5. [Fundamentação teórica](#5-fundamentação-teórica)
6. [Problema demonstrado pelo projeto](#6-problema-demonstrado-pelo-projeto)
7. [Arquitetura da demonstração](#7-arquitetura-da-demonstração)
8. [O que a demonstração mostra na prática](#8-o-que-a-demonstração-mostra-na-prática)
9. [Credenciais da demonstração](#9-credenciais-da-demonstração)
10. [Como iniciar o projeto](#10-como-iniciar-o-projeto)
11. [Telas](#11-telas)
12. [Metodologia](#12-metodologia)
13. [Fluxo completo com Burp Suite](#13-fluxo-completo-com-burp-suite)
14. [Fluxo completo com Burp no login protegido](#14-fluxo-completo-com-burp-no-login-protegido)
15. [Fluxo de bloqueio por tentativas](#15-fluxo-de-bloqueio-por-tentativas)
16. [Fluxo completo com Wireshark](#16-fluxo-completo-com-wireshark)
17. [Comparação HTTP vs HTTPS no Wireshark](#17-comparação-http-vs-https-no-wireshark)
18. [Teste no celular](#18-teste-no-celular)
19. [Como usar o painel](#19-como-usar-o-painel)
20. [Resultados esperados](#20-resultados-esperados)
21. [Discussão de resultados](#21-discussão-de-resultados)
22. [Limitações do projeto](#22-limitações-do-projeto)
23. [Melhorias futuras](#23-melhorias-futuras)
24. [Problemas comuns e como resolver](#24-problemas-comuns-e-como-resolver)

---

## 1. Resumo do projeto

A proposta central é comparar dois cenários:

| Cenário | Descrição |
|---------|-----------|
| **Fluxo vulnerável** | O cliente envia dados sensíveis por HTTP e o servidor confia em informações manipuláveis vindas da requisição |
| **Fluxo protegido** | O backend valida credenciais corretamente, ignora privilégios enviados pelo cliente, aplica bloqueio por tentativas e pode operar sob HTTPS |

Em redes sem fio, a segurança não depende de apenas um ponto de proteção. Mesmo quando a rede possui mecanismos como WPA2 ou WPA3, aplicações mal implementadas ainda podem expor credenciais, permitir adulteração de parâmetros e facilitar ataques de elevação de privilégio. Por outro lado, mesmo uma aplicação bem implementada pode ser prejudicada se trafegar sem criptografia de transporte em ambientes hostis.

O projeto foi pensado para ser demonstrado com:

- 🌐 Navegador
- 📱 Celular conectado na mesma rede Wi-Fi
- 📊 Painel de evidências da própria aplicação
- 🔍 Burp Suite
- 📡 Wireshark

---

## 2. Tema e recorte acadêmico

### 2.1. Tema geral

Segurança em redes sem fio.

### 2.2. Recorte adotado

Segurança em redes sem fio analisada a partir da autenticação de usuários e da proteção do tráfego entre cliente e servidor.

### 2.3. Pergunta central de pesquisa

> Como a combinação entre falhas na aplicação e ausência de proteção adequada no transporte pode comprometer a segurança em redes sem fio, e como mecanismos corretivos reduzem esse risco?

### 2.4. Hipótese do trabalho

Quando uma aplicação web trafega dados em HTTP e confia em parâmetros enviados pelo cliente, o ambiente sem fio se torna mais suscetível a interceptação e adulteração. Em contrapartida, a adoção de validação no backend, proteção por TLS e controles adicionais como bloqueio por tentativas reduz significativamente a superfície de ataque.

---

## 3. Objetivos

### 3.1. Objetivo geral

Demonstrar, de forma prática, como vulnerabilidades de autenticação e transporte podem afetar a segurança em redes sem fio, bem como apresentar mecanismos de mitigação aplicados em diferentes camadas.

### 3.2. Objetivos específicos

- Implementar um fluxo vulnerável de autenticação para demonstrar riscos reais
- Implementar um fluxo protegido com validações no servidor
- Capturar e analisar tráfego da aplicação com Wireshark
- Interceptar e modificar requisições com Burp Suite
- Comparar o comportamento da aplicação em HTTP e HTTPS
- Registrar evidências e métricas em um painel de análise
- Produzir resultados que possam ser discutidos

---

## 4. Justificativa

Redes sem fio são amplamente utilizadas em ambientes domésticos, acadêmicos e corporativos. Entretanto, a percepção de segurança muitas vezes se concentra apenas na senha do Wi-Fi ou no protocolo da rede, como WPA2 ou WPA3. Esse entendimento é incompleto, porque a segurança final depende também da forma como a aplicação trata autenticação, autorização, transporte e monitoramento.

Este projeto é relevante porque demonstra, na prática, que:

> ⚠️ A segurança da rede **não substitui** a segurança da aplicação.  
> ⚠️ A segurança da aplicação **não substitui** a criptografia do transporte.  
> ✅ A defesa eficaz depende de **múltiplas camadas** funcionando em conjunto.

---

## 5. Fundamentação teórica

### 5.1. Segurança em redes sem fio

Redes sem fio estão sujeitas a riscos como interceptação, acesso não autorizado, sniffing, ataques de força bruta e criação de pontos de acesso maliciosos. Protocolos como WEP, WPA, WPA2 e WPA3 surgiram para elevar o nível de segurança da comunicação entre dispositivo e roteador, principalmente na camada de enlace.

### 5.2. WEP, WPA2 e WPA3

| Protocolo | Status | Características |
|-----------|--------|-----------------|
| **WEP** | ❌ Obsoleto | Possui fragilidades conhecidas; não deve ser utilizado em ambientes reais |
| **WPA2** | ⚠️ Legado | Representou grande avanço em relação ao WEP; ainda depende de senhas fortes e configuração adequada |
| **WPA3** | ✅ Recomendado | Amplia a proteção contra ataques de adivinhação offline; oferece mecanismos mais modernos de autenticação |

### 5.3. Camadas de segurança

O projeto conversa com três camadas principais:

| Camada | Tecnologias |
|--------|-------------|
| **Enlace** | Wi-Fi, WPA2, WPA3 |
| **Transporte** | HTTP vs HTTPS, TLS |
| **Aplicação** | Login, validação, autorização, confiança nos parâmetros |

### 5.4. Wireshark

O Wireshark é uma ferramenta de captura e análise de pacotes. No projeto, ele é usado para mostrar:

- A existência do tráfego na rede
- A diferença entre tráfego legível em HTTP
- A dificuldade de leitura quando o transporte está protegido por HTTPS

### 5.5. Burp Suite

O Burp Suite é uma ferramenta de interceptação e manipulação de requisições HTTP e HTTPS. No projeto, ele é usado para mostrar:

- Interceptação de requisições antes do envio ao servidor
- Adulteração de parâmetros
- Comparação entre um backend inseguro e outro protegido

### 5.6. Autenticação e autorização

O projeto também ajuda a diferenciar dois conceitos que podem ser explorados no artigo:

| Conceito | Definição |
|----------|-----------|
| **Autenticação** | Verificar se o usuário realmente é quem diz ser |
| **Autorização** | Definir o que o usuário autenticado pode fazer |

> No fluxo vulnerável, o servidor falha justamente ao confiar na **autorização** enviada pelo cliente.

---

## 6. Problema demonstrado pelo projeto

### Fluxo vulnerável — falhas centrais

- Os dados trafegam por HTTP, o que facilita a visualização do conteúdo em ferramentas de captura
- O servidor aceita o parâmetro `role` enviado pelo cliente, permitindo adulteração de privilégio

Isso faz com que um usuário comum consiga:

- Ter sua senha visível no tráfego capturado
- Modificar a requisição no Burp Suite
- Simular uma elevação para `admin`

### Fluxo protegido — contramedidas

- A senha é verificada no servidor com `scrypt`
- O `role` é imposto pelo backend
- Há bloqueio após três falhas
- O transporte pode ser protegido com HTTPS

---

## 7. Arquitetura da demonstração

O sistema possui dois componentes principais: **backend em Node.js com Express** e **frontend estático** servido pela aplicação.

### 7.1. Backend

O servidor principal está em `server.js` e implementa:

| Funcionalidade | Descrição |
|----------------|-----------|
| Servidor HTTP | Porta `3000` por padrão |
| Servidor HTTPS | Porta `3443` por padrão, se houver certificado |
| Rotas de login | Vulnerável e protegida |
| Controle de bloqueio | Por número de tentativas |
| API de métricas | Eventos e telemetria |
| Reset de estado | Reinicialização da demo |

**Pontos importantes do código em `server.js`:**

- Configuração de portas e certificado
- Criação de hashes com `scrypt`
- Métricas e telemetria
- Rastreamento de tentativas
- Fluxo vulnerável e fluxo protegido
- Inicialização HTTP e HTTPS

### 7.2. Frontend

| Tela | Arquivo |
|------|---------|
| Página inicial | `public/index.html` |
| Login vulnerável | `public/login-inseguro.html` |
| Login protegido | `public/login-seguro.html` |
| Painel de evidências | `public/painel-analise.html` |
| Cliente do painel | `public/painel.js` |

### 7.3. Painel de evidências

O painel mostra:

- Número de tentativas nos fluxos vulnerável e protegido
- Falhas e bloqueios registrados
- Adulterações aceitas e bloqueadas
- Eventos com data, hora e detalhes

---

## 8. O que a demonstração mostra na prática

### 8.1. No fluxo vulnerável

- Envio de credenciais por HTTP
- Possibilidade de visualização do corpo da requisição
- Confiança indevida em dados enviados pelo cliente
- Adulteração de `role`
- Sucesso de elevação de privilégio

### 8.2. No fluxo protegido

- Validação de senha no lado do servidor
- Não confiança no `role` vindo do cliente
- Bloqueio temporário por repetição de erros
- Registro de eventos de segurança
- Diferença entre HTTP e HTTPS no transporte

A demonstração mostra que:

- Uma rede sem fio insegura ou mal monitorada facilita captura de tráfego
- Um tráfego HTTP exposto aumenta o risco
- Uma aplicação mal implementada potencializa o dano
- Uma defesa em camadas reduz a exploração

---

## 9. Credenciais da demonstração

| Usuário | Senha | Perfil |
|---------|-------|--------|
| `aluno` | `123456` | `user` |
| `analista` | `wifi2026` | `analyst` |
| `admin` | `adminwifi` | `admin` |

---

## 10. Como iniciar o projeto

### Instalação e execução básica

1. Abra um terminal na raiz do projeto clonado
2. Execute:

```powershell
npm install
npm start
```

3. Acesse no navegador:

```
http://localhost:3000
```

> O projeto funciona normalmente em HTTP a partir desse ponto.

---

### Habilitando HTTPS localmente

Para habilitar HTTPS, gere o certificado da demo com:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1
```

Depois de gerar o certificado, o servidor HTTPS também sobe em:

```
https://localhost:3443
```

---

### 10.1. Observação sobre o certificado

O arquivo `demo-cert.pfx` deve ser gerado localmente por cada usuário. O script `scripts/gerar-certificado-demo.ps1` existe justamente para criar esse certificado de forma local.

**Se o HTTPS não iniciar e aparecer algo como:**

```
HTTPS nao foi iniciado. Verifique o arquivo demo-cert.pfx e a senha configurada.
mac verify failure
```

Isso significa que o servidor não conseguiu abrir o arquivo `demo-cert.pfx` com a senha esperada.

**Solução:**

1. Apague o arquivo `demo-cert.pfx`
2. Gere novamente o certificado:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1
```

3. Inicie o servidor informando a senha correta:

```powershell
$env:DEMO_CERT_PASSWORD='projeto-redes-demo'
npm start
```

> **Importante:** se isso acontecer, o fluxo em HTTP ainda pode funcionar normalmente. O erro afeta apenas a inicialização do HTTPS. Se aparecer `Servidor HTTP rodando em http://localhost:3000`, o projeto já pode ser testado em HTTP.

---

### 10.2. Se a porta 3000 estiver ocupada

Use portas alternativas:

```powershell
$env:PORT='3100'
$env:HTTPS_PORT='3444'
npm start
```

---

## 11. Telas

| Tela | URL |
|------|-----|
| Home | `http://localhost:3000` |
| Fluxo vulnerável | `http://localhost:3000/login-inseguro.html` |
| Fluxo protegido | `http://localhost:3000/login-seguro.html` |
| Painel de evidências | `http://localhost:3000/painel-analise.html` |

---

## 12. Metodologia

### 12.1. Tipo de estudo

Estudo experimental demonstrativo, com comparação entre dois cenários de autenticação em ambiente controlado.

### 12.2. Ambiente de teste

- Computador com o servidor da aplicação
- Navegador web
- Burp Suite para interceptação
- Wireshark para captura
- Celular conectado na mesma rede Wi-Fi

### 12.3. Variáveis observadas

- Visibilidade do conteúdo da requisição
- Possibilidade de adulteração de parâmetros
- Aceitação ou bloqueio da adulteração
- Ocorrência de bloqueio por tentativas
- Diferença de leitura do tráfego entre HTTP e HTTPS

### 12.4. Procedimento

1. Iniciar o sistema
2. Executar o fluxo vulnerável
3. Interceptar a requisição com Burp
4. Adulterar o `role`
5. Observar o sucesso da exploração
6. Capturar o tráfego com Wireshark
7. Executar o fluxo protegido
8. Repetir a tentativa de adulteração
9. Observar o bloqueio lógico no backend
10. Repetir a comparação sob HTTPS

---

## 13. Fluxo completo com Burp Suite

### 13.1. Preparação

1. Abra o Burp Suite
2. Vá em `Proxy > Intercept`
3. Deixe `Intercept is off` para carregar as páginas normalmente
4. Configure o navegador para usar proxy:
   - **Host:** `127.0.0.1`
   - **Porta:** `8080`

> Se for usar o navegador do próprio Burp, pode abrir por ele também.

---

### 13.2. Carregar a página vulnerável

1. Abra:

```
http://127.0.0.1:3000/login-inseguro.html
```

2. Deixe a página carregar completamente
3. Volte ao Burp
4. Ligue `Intercept is on`

---

### 13.3. Interceptar o login vulnerável

1. Volte para o navegador e preencha:
   - `usuario = aluno`
   - `senha = 123456`
   - `role = user`
2. Clique em **Enviar login vulneravel**
3. Volte para o Burp — a requisição que interessa deve ser `POST /login-vulneravel`
4. Na área de requisição, abra a visualização `Raw`
5. Localize o corpo JSON no final da requisição e troque:

```json
{"usuario":"aluno","senha":"123456","role":"user"}
```

por:

```json
{"usuario":"aluno","senha":"123456","role":"admin"}
```

6. Clique em **Forward**

---

### 13.4. O que deve acontecer

O servidor vai aceitar `admin` e a tela vai mostrar que o privilégio adulterado foi aceito. No painel de resultado da requisição, deve aparecer:

```json
{
  "ok": true,
  "mode": "vulneravel",
  "username": "aluno",
  "acceptedRole": "admin",
  "realRole": "user",
  "transport": "http",
  "message": "Falha explorada: o servidor confiou no role enviado pelo cliente."
}
```

---

### 13.5. O que interpretar

Esse resultado indica:

- Falha de autorização
- Excesso de confiança no cliente
- Inadequação do uso de HTTP para tráfego sensível
- Aumento da superfície de ataque em ambiente sem fio

> 💡 Aqui estamos interceptando a requisição na camada de aplicação. Mesmo sem conhecer a senha de admin, conseguimos mudar o parâmetro `role` antes de enviar. O servidor vulnerável confiou no cliente e aceitou a elevação de privilégio.

---

## 14. Fluxo completo com Burp no login protegido

### 14.1. Abrir a página protegida

1. Deixe `Intercept is off`
2. Abra:

```
http://127.0.0.1:3000/login-seguro.html
```

3. Espere a página carregar
4. Ligue `Intercept is on`

---

### 14.2. Interceptar o login protegido

1. No navegador, preencha:
   - `usuario = aluno`
   - `senha = 123456`
   - `role = admin`
2. Clique em **Enviar login protegido**
3. Volte para o Burp — a requisição deve ser `POST /login-seguro`
4. Se quiser, mantenha o corpo como está ou force novamente:

```json
{"usuario":"aluno","senha":"123456","role":"admin"}
```

5. Clique em **Forward**

---

### 14.3. O que deve acontecer

O servidor não vai conceder admin. A resposta vai trazer o privilégio real do usuário. No painel, deve aparecer:

```json
{
  "ok": true,
  "mode": "seguro",
  "username": "aluno",
  "assignedRole": "user",
  "claimedRole": "admin",
  "transport": "https",
  "httpsEnabled": true,
  "message": "Login seguro validado. Senha verificada com scrypt, role forjado bloqueado e trafego protegido por TLS."
}
```

---

### 14.4. O que está acontecendo

Esse resultado demonstra:

- Validação correta no lado do servidor
- Separação adequada entre autenticação e autorização
- Resistência à manipulação de parâmetros
- Melhoria de postura de segurança na camada de aplicação

> 💡 Agora a requisição ainda pode ser interceptada, mas o backend não confia no cliente. Mesmo alterando o `role`, o servidor aplica o privilégio real do usuário. Isso mostra a diferença entre apenas interceptar e realmente explorar uma falha.

---

## 15. Fluxo de bloqueio por tentativas

### 15.1. Como testar

1. Abra o fluxo protegido
2. Use:
   - `usuario = aluno`
   - `senha = errada`
3. Envie a senha errada três vezes
4. Tente uma quarta vez

---

### 15.2. Resultado esperado

O sistema informa bloqueio temporário. No painel, deve aparecer:

```json
{
  "ok": false,
  "mode": "seguro",
  "message": "Conta temporariamente bloqueada por 60s devido a multiplas falhas.",
  "retryInSeconds": 60,
  "transport": "https"
}
```

```
Falhas consecutivas no fluxo protegido ativam bloqueio temporario e aparecem no painel.
```

> 💡 Aqui estamos mostrando um controle adicional de defesa. Mesmo que alguém tente várias senhas, o sistema reduz a chance de brute force com bloqueio temporário.

---

## 16. Fluxo completo com Wireshark

### 16.1. Preparação

1. Abra o Wireshark
2. Escolha a interface de rede que está sendo usada (geralmente a interface Ethernet)
3. Comece a captura
4. Use o filtro:

```
tcp.port == 3000 or tcp.port == 3443
```

---

### 16.2. Teste HTTP

1. No navegador ou no celular, abra:

```
http://IPV4_DO_PC:3000/login-inseguro.html
```

> Para encontrar seu IPv4, vá em **Configurações > Rede e Internet > Ethernet** e copie o endereço IPv4 `192.168.X.X`.

2. Faça um login vulnerável com:
   - `usuario = aluno`
   - `senha = 123456`
   - `role = user`

3. No Wireshark:
   - Localize os pacotes da porta `3000`
   - Clique com o botão direito
   - Use `Follow` ou `Seguir`
   - Escolha `Fluxo TCP`

---

### 16.3. O que deve aparecer

No fluxo HTTP, o conteúdo do login pode aparecer legível, incluindo campos como `usuario`, `senha` e `role`.

Esse resultado mostra que:

- O tráfego existe em claro do ponto de vista do transporte
- Um observador com acesso ao meio pode analisar o conteúdo
- O problema se agrava em redes sem fio abertas, mal configuradas ou monitoradas

> 💡 No HTTP, o tráfego passa sem proteção de transporte. O Wireshark consegue capturar e reconstruir o conteúdo da requisição, o que mostra o risco em redes sem fio sem proteção adequada.

---

## 17. Comparação HTTP vs HTTPS no Wireshark

### 17.1. Teste HTTPS

1. Abra no navegador:

```
https://IP_DO_PC:3443/login-seguro.html
```

2. Se aparecer aviso do certificado, aceite para fins de demonstração
3. Faça login com:
   - `usuario = aluno`
   - `senha = 123456`

---

### 17.2. O que observar

- Os pacotes continuam existindo
- O Wireshark ainda mostra que houve comunicação
- Mas o conteúdo da senha e do corpo **não aparece em texto claro** como no HTTP

Esse resultado sustenta a ideia de que:

- A criptografia de transporte **não elimina** o tráfego
- Ela **protege o conteúdo** do tráfego
- A defesa no transporte complementa, mas não substitui, a defesa na aplicação

> 💡 Aqui ainda existe tráfego na rede, mas o conteúdo está protegido por TLS. Isso mostra a diferença entre enxergar que houve comunicação e conseguir ler o conteúdo da comunicação.

---

## 18. Teste no celular

### 18.1. Preparação

1. Descubra o IPv4 do computador nas configurações
2. Conecte o celular e o computador na **mesma rede Wi-Fi**
3. No celular, abra:

```
http://IPV4_DO_PC:3000
```

---

### 18.2. Com Burp no celular

Se quiser interceptar o celular pelo Burp:

1. Nas configurações do Wi-Fi do celular, habilite **proxy manual**
2. **Host do proxy:** IP do computador
3. **Porta:** `8080`
4. Abra a página no celular
5. Intercepte normalmente no Burp

> **Observação:** para HTTP, isso costuma funcionar direto. Para HTTPS, normalmente é necessário instalar o certificado CA do Burp no dispositivo.

> 💡 O uso do celular aproxima a demonstração de um ambiente real de rede sem fio.

---

## 19. Como usar o painel

O `painel-analise.html` é uma fonte de evidência observacional do experimento, ajudando a documentar:

- Quantidade de tentativas
- Sucesso ou falha das explorações
- Ocorrência de bloqueio
- Diferença entre os dois fluxos

---

## 20. Resultados esperados

| Cenário | Resultado |
|---------|-----------|
| Fluxo vulnerável — adulteração do `role` | ✅ Aceita pelo servidor |
| Fluxo vulnerável — tráfego em HTTP | ✅ Visualizável no Wireshark |
| Fluxo protegido — adulteração do `role` | ❌ Bloqueada pelo servidor |
| Fluxo protegido — senha incorreta repetida | ❌ Bloqueio após 3 tentativas |
| HTTPS — conteúdo do tráfego | 🔒 Não exposto como no HTTP |

---

## 21. Discussão de resultados

### 21.1. Segurança em camadas

O projeto mostra que a segurança de redes sem fio não pode ser reduzida ao protocolo Wi-Fi. Mesmo em um ambiente com proteção no acesso sem fio, uma aplicação mal implementada pode permitir exploração.

### 21.2. Limite das ferramentas

Burp Suite e Wireshark não são "o problema"; eles são instrumentos de análise. O problema real está na implementação insegura e na falta de boas práticas.

### 21.3. Importância do backend

Confiar em parâmetros enviados pelo cliente representa erro conceitual grave. Privilégios devem ser definidos pelo servidor com base na identidade validada.

### 21.4. Importância do transporte

Mesmo um fluxo de login com validação correta ainda se beneficia de HTTPS, pois a proteção do transporte reduz a exposição do conteúdo trafegado.

---

## 22. Limitações do projeto

- Trata-se de um ambiente controlado de laboratório
- O sistema é uma simulação didática, não uma aplicação corporativa completa
- O certificado HTTPS utilizado na demo é self-signed
- Não foram explorados ataques mais avançados de camada física ou de enlace
- O foco foi autenticação, autorização e transporte

---

## 23. Melhorias futuras

- Incluir demonstrações relacionadas a WPA2 e WPA3
- Simular um captive portal malicioso
- Integrar logs persistentes em banco de dados
- Adicionar autenticação multifator
- Comparar diferentes algoritmos e políticas de senha
- Ampliar o estudo para cenários com access point falso

---

## 24. Problemas comuns e como resolver

### ❓ A página não carrega quando o Burp está ligado

**Causa:** o `Intercept` está segurando os requests GET da página.

**Solução:**
1. Deixe `Intercept is off` para carregar a página
2. Ligue o `Intercept` só na hora de enviar o formulário

---

### ❓ O Burp não intercepta nada

**Verifique:**
- Se o navegador está usando proxy `127.0.0.1:8080`
- Se o `Intercept is on` está ligado

---

### ❓ O HTTPS mostra aviso no navegador

Isso é **esperado** porque o certificado da demo é self-signed.

---

### ❓ O celular não acessa o site

**Verifique:**
- Se o celular e o computador estão na mesma rede
- Se o IP usado é o IPv4 correto do computador
- Se firewall ou antivírus não estão bloqueando a porta

## Referências
 
KUROSE, James F.; ROSS, Keith W. **Redes de Computadores e a Internet: Uma Abordagem Top-Down**. 8. ed. São Paulo: Pearson, 2021.

NATAL, Igor da Penha. **Material de aula da disciplina de Redes de Computadores**. Universidade Federal de Uberlândia, Campus Monte Carmelo, 2025.
 
---
 
## Agradecimentos
 
Agradecemos ao **Prof. Igor da Penha Natal** pela orientação, pelos materiais disponibilizados e pelo suporte durante o desenvolvimento deste projeto, no âmbito da disciplina de Redes de Computadores da Universidade Federal de Uberlândia.
 
---
 
## Licença
 
Este projeto foi desenvolvido para fins estritamente **educacionais e acadêmicos**. O código, os fluxos vulneráveis e as demonstrações presentes neste repositório têm como único objetivo ilustrar conceitos de segurança em redes sem fio em ambiente controlado.
 
Não utilize este projeto em ambientes de produção ou para fins maliciosos.
 
Distribuído sob a licença [MIT](https://opensource.org/licenses/MIT).
