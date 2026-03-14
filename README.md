# Projeto Final - Segurança em Redes Sem Fio

Este projeto foi desenvolvido como uma demonstração prática de segurança em redes sem fio, com foco em autenticação, interceptação de tráfego, adulteração de requisições e mecanismos de defesa em diferentes camadas.

A proposta central é comparar dois cenários:

- um fluxo vulnerável, em que o cliente envia dados sensíveis por HTTP e o servidor confia em informações manipuláveis vindas da requisição;
- um fluxo protegido, em que o backend valida credenciais corretamente, ignora privilégios enviados pelo cliente, aplica bloqueio por tentativas e pode operar sob HTTPS.

O projeto foi pensado para ser demonstrado com:

- navegador;
- celular conectado na mesma rede Wi-Fi;
- Burp Suite;
- Wireshark;
- painel de evidências da própria aplicação.

Este README foi expandido para servir também como base de redação do artigo, reunindo contexto teórico, objetivo, metodologia, roteiro experimental, interpretação dos resultados e estrutura sugerida para o texto acadêmico.

## 1. Resumo do projeto

Em redes sem fio, a segurança não depende de apenas um ponto de proteção. Mesmo quando a rede possui mecanismos como WPA2 ou WPA3, aplicações mal implementadas ainda podem expor credenciais, permitir adulteração de parâmetros e facilitar ataques de elevação de privilégio. Por outro lado, mesmo uma aplicação bem implementada pode ser prejudicada se trafegar sem criptografia de transporte em ambientes hostis.

Com base nisso, este projeto demonstra segurança em camadas por meio de uma aplicação web de login com dois comportamentos opostos:

- no primeiro, a autenticação é propositalmente insegura;
- no segundo, a autenticação adota controles básicos de segurança no servidor.

O experimento mostra como ferramentas de análise e interceptação, como Wireshark e Burp Suite, permitem visualizar ou modificar o tráfego, e como as contramedidas corretas impedem a exploração.

## 2. Tema e recorte acadêmico

### 2.1. Tema geral

Segurança em redes sem fio.

### 2.2. Recorte adotado

Segurança em redes sem fio analisada a partir da autenticação de usuários e da proteção do tráfego entre cliente e servidor.

### 2.3. Pergunta central de pesquisa

Como a combinação entre falhas na aplicação e ausência de proteção adequada no transporte pode comprometer a segurança em redes sem fio, e como mecanismos corretivos reduzem esse risco?

### 2.4. Hipótese do trabalho

Quando uma aplicação web trafega dados em HTTP e confia em parâmetros enviados pelo cliente, o ambiente sem fio se torna mais suscetível à interceptação e adulteração. Em contrapartida, a adoção de validação no backend, proteção por TLS e controles adicionais como bloqueio por tentativas reduz significativamente a superfície de ataque.

## 3. Objetivos

### 3.1. Objetivo geral

Demonstrar, de forma prática, como vulnerabilidades de autenticação e transporte podem afetar a segurança em redes sem fio, bem como apresentar mecanismos de mitigação aplicados em diferentes camadas.

### 3.2. Objetivos específicos

- implementar um fluxo vulnerável de autenticação para demonstrar riscos reais;
- implementar um fluxo protegido com validações no servidor;
- capturar e analisar tráfego da aplicação com Wireshark;
- interceptar e modificar requisições com Burp Suite;
- comparar o comportamento da aplicação em HTTP e HTTPS;
- registrar evidências e métricas em um painel de análise;
- produzir resultados que possam ser discutidos no artigo e na apresentação.

## 4. Justificativa

Redes sem fio são amplamente utilizadas em ambientes domésticos, acadêmicos e corporativos. Entretanto, a percepção de segurança muitas vezes se concentra apenas na senha do Wi-Fi ou no protocolo da rede, como WPA2 ou WPA3. Esse entendimento é incompleto, porque a segurança final depende também da forma como a aplicação trata autenticação, autorização, transporte e monitoramento.

Este projeto é relevante porque demonstra, na prática, que:

- a segurança da rede não substitui a segurança da aplicação;
- a segurança da aplicação não substitui a criptografia do transporte;
- a defesa eficaz depende de múltiplas camadas funcionando em conjunto.

## 5. Fundamentação teórica resumida

Esta seção pode ser usada como base para a parte teórica do artigo.

### 5.1. Segurança em redes sem fio

Redes sem fio estão sujeitas a riscos como interceptação, acesso não autorizado, sniffing, ataques de força bruta e criação de pontos de acesso maliciosos. Protocolos como WEP, WPA, WPA2 e WPA3 surgiram para elevar o nível de segurança da comunicação entre dispositivo e roteador, principalmente na camada de enlace.

### 5.2. WEP, WPA2 e WPA3

- `WEP`
  - considerado obsoleto;
  - possui fragilidades conhecidas;
  - não deve ser utilizado em ambientes reais.

- `WPA2`
  - representou um grande avanço em relação ao WEP;
  - tornou-se padrão por muitos anos;
  - ainda depende de senhas fortes e configuração adequada.

- `WPA3`
  - amplia a proteção contra ataques de adivinhação offline;
  - oferece mecanismos mais modernos de autenticação;
  - é considerado superior ao WPA2 em cenários atuais.

### 5.3. Camadas de segurança

O projeto conversa com três camadas principais:

- `camada de enlace`
  - relacionada ao Wi-Fi, WPA2 e WPA3;
- `camada de transporte`
  - relacionada a HTTP versus HTTPS e ao uso de TLS;
- `camada de aplicação`
  - relacionada ao login, validação, autorização e confiança nos parâmetros.

### 5.4. Wireshark

O Wireshark é uma ferramenta de captura e análise de pacotes. No projeto, ele é usado para mostrar:

- a existência do tráfego na rede;
- a diferença entre tráfego legível em HTTP;
- e a dificuldade de leitura quando o transporte está protegido por HTTPS.

### 5.5. Burp Suite

O Burp Suite é uma ferramenta de interceptação e manipulação de requisições HTTP e HTTPS. No projeto, ele é usado para mostrar:

- interceptação de requisições antes do envio ao servidor;
- adulteração de parâmetros;
- comparação entre um backend inseguro e outro protegido.

### 5.6. Autenticação e autorização

O projeto também ajuda a diferenciar dois conceitos que podem ser explorados no artigo:

- `autenticação`
  - verificar se o usuário realmente é quem diz ser;
- `autorização`
  - definir o que o usuário autenticado pode fazer.

No fluxo vulnerável, o servidor falha justamente ao confiar na autorização enviada pelo cliente.

## 6. Problema demonstrado pelo projeto

O fluxo vulnerável mostra duas falhas centrais:

- os dados trafegam por HTTP, o que facilita a visualização do conteúdo em ferramentas de captura;
- o servidor aceita o parâmetro `role` enviado pelo cliente, permitindo adulteração de privilégio.

Isso faz com que um usuário comum consiga:

- ter sua senha visível no tráfego capturado;
- modificar a requisição no Burp Suite;
- simular uma elevação para `admin`.

Já o fluxo protegido foi construído para responder a essas fragilidades:

- a senha é verificada no servidor com `scrypt`;
- o `role` é imposto pelo backend;
- há bloqueio após três falhas;
- o transporte pode ser protegido com HTTPS.

## 7. Arquitetura da demonstração

O sistema possui dois componentes principais:

- `backend em Node.js com Express`;
- `frontend estático servido pela aplicação`.

### 7.1. Backend

O servidor principal está em `server.js`.

Ele implementa:

- servidor HTTP na porta `3000` por padrão;
- servidor HTTPS na porta `3443` por padrão, se houver certificado;
- rota vulnerável de login;
- rota protegida de login;
- controle de bloqueio por tentativas;
- API de métricas e eventos;
- reinicialização do estado da demo.

Pontos importantes do código:

- configuração de portas e certificado em `server.js`;
- criação de hashes com `scrypt` em `server.js`;
- métricas e telemetria em `server.js`;
- rastreamento de tentativas em `server.js`;
- fluxo vulnerável em `server.js`;
- fluxo protegido em `server.js`;
- inicialização HTTP e HTTPS em `server.js`.

### 7.2. Frontend

O frontend possui três visões principais:

- página inicial;
- formulário vulnerável;
- formulário protegido;
- painel de evidências.

Arquivos principais:

- home: `public/index.html`;
- login vulnerável: `public/login-inseguro.html`;
- login protegido: `public/login-seguro.html`;
- painel: `public/painel-analise.html`;
- cliente do painel: `public/painel.js`.

### 7.3. Painel de evidências

O painel mostra:

- número de tentativas no fluxo vulnerável;
- número de tentativas no fluxo protegido;
- falhas;
- bloqueios;
- adulterações aceitas;
- adulterações bloqueadas;
- eventos com data, hora e detalhes.

Isso ajuda muito na escrita do artigo porque transforma a apresentação prática em dados observáveis.

## 8. O que a demonstração mostra na prática

### 8.1. No fluxo vulnerável

O fluxo vulnerável demonstra:

- envio de credenciais por HTTP;
- possibilidade de visualização do corpo da requisição;
- confiança indevida em dados enviados pelo cliente;
- adulteração de `role`;
- sucesso de elevação de privilégio.

### 8.2. No fluxo protegido

O fluxo protegido demonstra:

- validação de senha no lado do servidor;
- não confiança no `role` vindo do cliente;
- bloqueio temporário por repetição de erros;
- registro de eventos de segurança;
- diferença entre HTTP e HTTPS no transporte.

### 8.3. Na perspectiva do tema

Isso se encaixa no tema "segurança em redes sem fio" porque mostra que:

- uma rede sem fio insegura ou mal monitorada facilita captura de tráfego;
- um tráfego HTTP exposto aumenta o risco;
- uma aplicação mal implementada potencializa o dano;
- uma defesa em camadas reduz a exploração.

## 9. Credenciais da demonstração

- `aluno / 123456 / user`;
- `analista / wifi2026 / analyst`;
- `admin / adminwifi / admin`.

## 10. Como iniciar o projeto

1. Abra um terminal na raiz do projeto clonado.
2. Instale as dependências:

```powershell
npm install
```

3. Rode:

```powershell
npm start
```

4. Abra no navegador:

```txt
http://localhost:3000
```

5. O projeto funciona normalmente em HTTP.
6. Para habilitar HTTPS localmente, gere o certificado da demo com:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1
```

7. Depois de gerar o certificado, o servidor HTTPS também sobe em:

```txt
https://localhost:3443
```

### 10.1. Observação sobre o certificado

- o arquivo `demo-cert.pfx` deve ser gerado localmente por cada usuário;
- esse arquivo não deve ser publicado no repositório;
- o script `scripts/gerar-certificado-demo.ps1` existe justamente para criar esse certificado de forma local.

Se o HTTPS não iniciar e aparecer algo como:

```txt
HTTPS nao foi iniciado. Verifique o arquivo demo-cert.pfx e a senha configurada.
mac verify failure
```

isso significa que o servidor não conseguiu abrir o arquivo `demo-cert.pfx` com a senha esperada.

Nesse caso:

1. apague o arquivo `demo-cert.pfx`;
2. gere novamente o certificado:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1
```

3. inicie o servidor informando a senha correta do certificado:

```powershell
$env:DEMO_CERT_PASSWORD='projeto-redes-demo'
npm start
```

Importante:

- se isso acontecer, o fluxo em `HTTP` ainda pode funcionar normalmente;
- o erro afeta apenas a inicialização do `HTTPS`;
- se aparecer `Servidor HTTP rodando em http://localhost:3000`, o projeto já pode ser testado em HTTP.

### 10.2. Se a porta 3000 estiver ocupada

Use portas alternativas:

```powershell
$env:PORT='3100'
$env:HTTPS_PORT='3444'
npm start
```

## 11. Telas que vão ser usadas na apresentação

- Home:
  - `http://localhost:3000`;

- Fluxo vulnerável:
  - `http://localhost:3000/login-inseguro.html`;

- Fluxo protegido:
  - `http://localhost:3000/login-seguro.html`;

- Painel de evidências:
  - `http://localhost:3000/painel-analise.html`.

## 12. Metodologia experimental

Esta seção pode ser adaptada quase diretamente para o artigo.

### 12.1. Tipo de estudo

Estudo experimental demonstrativo, com comparação entre dois cenários de autenticação em ambiente controlado.

### 12.2. Ambiente de teste

- computador com o servidor da aplicação;
- navegador web;
- Burp Suite para interceptação;
- Wireshark para captura;
- celular conectado na mesma rede Wi-Fi.

### 12.3. Variáveis observadas

- visibilidade do conteúdo da requisição;
- possibilidade de adulteração de parâmetros;
- aceitação ou bloqueio da adulteração;
- ocorrência de bloqueio por tentativas;
- diferença de leitura do tráfego entre HTTP e HTTPS.

### 12.4. Procedimento

1. iniciar o sistema;
2. executar o fluxo vulnerável;
3. interceptar a requisição com Burp;
4. adulterar o `role`;
5. observar o sucesso da exploração;
6. capturar o tráfego com Wireshark;
7. executar o fluxo protegido;
8. repetir a tentativa de adulteração;
9. observar o bloqueio lógico no backend;
10. repetir a comparação sob HTTPS.

## 13. Ordem recomendada da apresentação

Sugestão de ordem:

1. Mostrar a página inicial e explicar o objetivo.
2. Abrir o painel de evidências em uma aba separada.
3. Demonstrar o fluxo vulnerável.
4. Demonstrar a adulteração com Burp Suite.
5. Mostrar o evento correspondente no painel.
6. Demonstrar o fluxo protegido.
7. Mostrar que o Burp intercepta, mas o backend não aceita a adulteração.
8. Demonstrar o bloqueio por tentativas.
9. Mostrar o Wireshark comparando HTTP e HTTPS.
10. Fechar explicando segurança por camadas.

## 14. Fluxo completo com Burp Suite

### 14.1. Preparação

1. Abra o Burp Suite.
2. Vá em `Proxy > Intercept`.
3. Deixe `Intercept is off` para carregar as páginas normalmente.
4. Configure o navegador para usar proxy:
   - host: `127.0.0.1`;
   - porta: `8080`.

Se for usar o navegador do próprio Burp, pode abrir por ele também.

### 14.2. Carregar a página vulnerável

1. Abra:

```txt
http://127.0.0.1:3000/login-inseguro.html
```

2. Deixe a página carregar completamente.
3. Volte ao Burp.
4. Ligue `Intercept is on`.

### 14.3. Interceptar o login vulnerável

1. Volte para o navegador.
2. Preencha:
   - `usuario = aluno`;
   - `senha = 123456`;
   - `role = user`.
3. Clique em `Enviar login vulneravel`.
4. Volte para o Burp.
5. A requisição que interessa deve ser:

```txt
POST /login-vulneravel
```

6. Na área de requisição, abra a visualização `Raw`.
7. Procure o corpo JSON no final da requisição.
8. Troque:

```json
{"usuario":"aluno","senha":"123456","role":"user"}
```

por:

```json
{"usuario":"aluno","senha":"123456","role":"admin"}
```

9. Clique em `Forward`.

### 14.4. O que deve acontecer

- o servidor vai aceitar `admin`;
- a tela vai mostrar que o privilégio adulterado foi aceito;
- no painel, deve aparecer um evento `vulnerable_success`;
- no painel, o campo `tamperedRoleAccepted` deve aparecer como verdadeiro.

### 14.5. O que interpretar no artigo

Esse resultado indica:

- falha de autorização;
- excesso de confiança no cliente;
- inadequação do uso de HTTP para tráfego sensível;
- aumento da superfície de ataque em ambiente sem fio.

### 14.6. O que falar nessa parte

Sugestão de fala:

"Aqui estamos interceptando a requisição na camada de aplicação. Mesmo sem conhecer a senha de admin, conseguimos mudar o parâmetro `role` antes de enviar. O servidor vulnerável confiou no cliente e aceitou a elevação de privilégio."

## 15. Fluxo completo com Burp no login protegido

### 15.1. Abrir a página protegida

1. Deixe `Intercept is off`.
2. Abra:

```txt
http://127.0.0.1:3000/login-seguro.html
```

3. Espere a página carregar.
4. Ligue `Intercept is on`.

### 15.2. Interceptar o login protegido

1. No navegador, preencha:
   - `usuario = aluno`;
   - `senha = 123456`;
   - `role = admin`.
2. Clique em `Enviar login protegido`.
3. Volte para o Burp.
4. A requisição deve ser:

```txt
POST /login-seguro
```

5. Se quiser, mantenha o corpo como está ou force novamente:

```json
{"usuario":"aluno","senha":"123456","role":"admin"}
```

6. Clique em `Forward`.

### 15.3. O que deve acontecer

- o servidor não vai conceder admin;
- a resposta vai trazer o privilégio real do usuário, normalmente `user`;
- no painel, deve aparecer `secure_role_override_blocked`.

### 15.4. O que interpretar no artigo

Esse resultado demonstra:

- validação correta no lado do servidor;
- separação adequada entre autenticação e autorização;
- resistência à manipulação de parâmetros;
- melhoria de postura de segurança na camada de aplicação.

### 15.5. O que falar nessa parte

Sugestão de fala:

"Agora a requisição ainda pode ser interceptada, mas o backend não confia no cliente. Mesmo alterando o `role`, o servidor aplica o privilégio real do usuário. Isso mostra a diferença entre apenas interceptar e realmente explorar uma falha."

## 16. Fluxo de bloqueio por tentativas

### 16.1. Como testar

1. Abra o fluxo protegido.
2. Use:
   - `usuario = aluno`;
   - `senha = errada`.
3. Envie a senha errada três vezes.
4. Tente uma quarta vez.

### 16.2. Resultado esperado

- o sistema informa bloqueio temporário;
- no painel aparecem:
  - `secure_failure`;
  - `secure_blocked`.

### 16.3. O que interpretar no artigo

Isso demonstra a adoção de um controle compensatório contra tentativa repetida de autenticação, reduzindo o risco de força bruta simples.

### 16.4. O que falar

"Aqui estamos mostrando um controle adicional de defesa. Mesmo que alguém tente várias senhas, o sistema reduz a chance de brute force com bloqueio temporário."

## 17. Fluxo completo com Wireshark

### 17.1. Preparação

1. Abra o Wireshark.
2. Escolha a interface de rede que está sendo usada:
   - geralmente a interface Wi-Fi.
3. Comece a captura.
4. Use o filtro:

```txt
tcp.port == 3000 or tcp.port == 3443
```

### 17.2. Teste HTTP

1. No navegador ou no celular, abra:

```txt
http://IP_DO_PC:3000/login-inseguro.html
```

2. Faça um login vulnerável com:
   - `usuario = aluno`;
   - `senha = 123456`;
   - `role = user`.

3. No Wireshark:
   - localize os pacotes da porta `3000`;
   - clique com o botão direito;
   - use `Follow` ou `Seguir`;
   - escolha `TCP Stream`.

### 17.3. O que deve aparecer

No fluxo HTTP, o conteúdo do login pode aparecer legível, incluindo campos como:

- `usuario`;
- `senha`;
- `role`.

### 17.4. O que interpretar no artigo

Esse resultado mostra que:

- o tráfego existe em claro do ponto de vista do transporte;
- um observador com acesso ao meio pode analisar o conteúdo;
- o problema se agrava em redes sem fio abertas, mal configuradas ou monitoradas.

### 17.5. O que falar

"No HTTP, o tráfego passa sem proteção de transporte. O Wireshark consegue capturar e reconstruir o conteúdo da requisição, o que mostra o risco em redes sem fio sem proteção adequada."

## 18. Comparação HTTP vs HTTPS no Wireshark

### 18.1. Teste HTTPS

1. Abra no navegador:

```txt
https://IP_DO_PC:3443/login-seguro.html
```

2. Se aparecer aviso do certificado, aceite para fins de demonstração.
3. Faça login com:
   - `usuario = aluno`;
   - `senha = 123456`.

### 18.2. O que observar

- os pacotes continuam existindo;
- o Wireshark ainda mostra que houve comunicação;
- mas o conteúdo da senha e do corpo não aparece em texto claro como no HTTP.

### 18.3. O que interpretar no artigo

Esse resultado sustenta a ideia de que:

- a criptografia de transporte não elimina o tráfego;
- ela protege o conteúdo do tráfego;
- a defesa no transporte complementa, mas não substitui, a defesa na aplicação.

### 18.4. O que falar

"Aqui ainda existe tráfego na rede, mas o conteúdo está protegido por TLS. Isso mostra a diferença entre enxergar que houve comunicação e conseguir ler o conteúdo da comunicação."

## 19. Teste no celular

### 19.1. Preparação

1. Descubra o IPv4 do computador na página inicial.
2. Conecte o celular e o computador na mesma rede Wi-Fi.
3. No celular, abra:

```txt
http://IP_DO_PC:3000
```

### 19.2. Com Burp no celular

Se quiser interceptar o celular pelo Burp:

1. Nas configurações do Wi-Fi do celular, habilite proxy manual.
2. Host do proxy:
   - IP do computador.
3. Porta:
   - `8080`.
4. Abra a página no celular.
5. Intercepte normalmente no Burp.

Observação:

- para HTTP, isso costuma funcionar direto;
- para HTTPS, normalmente precisa instalar o certificado CA do Burp no dispositivo.

### 19.3. Valor acadêmico do teste no celular

O uso do celular aproxima a demonstração de um ambiente real de rede sem fio, tornando o experimento mais convincente para o artigo e para a banca.

## 20. O que mostrar no painel de evidências

Durante a apresentação, deixem a página do painel aberta:

```txt
http://localhost:3000/painel-analise.html
```

Eventos importantes para mostrar:

- `vulnerable_success`;
- `secure_success`;
- `secure_role_override_blocked`;
- `secure_failure`;
- `secure_blocked`.

Métricas importantes:

- `tamperAccepted`;
- `tamperBlocked`;
- `failedAttempts`;
- `blockedAttempts`.

### 20.1. Como usar o painel no artigo

O painel pode ser citado como fonte de evidência observacional do experimento, ajudando a documentar:

- quantidade de tentativas;
- sucesso ou falha das explorações;
- ocorrência de bloqueio;
- diferença entre os dois fluxos.

## 21. Resultados esperados

Uma forma objetiva de escrever os resultados no artigo é organizar assim:

- no fluxo vulnerável, a adulteração do parâmetro `role` foi aceita pelo servidor;
- no fluxo vulnerável, os dados trafegaram em HTTP e puderam ser visualizados com mais facilidade;
- no fluxo protegido, a adulteração do `role` não foi aceita;
- no fluxo protegido, houve bloqueio após três tentativas com senha incorreta;
- no HTTPS, o conteúdo do tráfego não ficou exposto no Wireshark da mesma forma que no HTTP.

## 22. Discussão sugerida para o artigo

Vocês podem discutir os resultados sob estes eixos:

### 22.1. Segurança em camadas

O projeto mostra que a segurança de redes sem fio não pode ser reduzida ao protocolo Wi-Fi. Mesmo em um ambiente com proteção no acesso sem fio, uma aplicação mal implementada pode permitir exploração.

### 22.2. Limite das ferramentas

Burp Suite e Wireshark não são "o problema"; eles são instrumentos de análise. O problema real está na implementação insegura e na falta de boas práticas.

### 22.3. Importância do backend

Confiar em parâmetros enviados pelo cliente representa erro conceitual grave. Privilégios devem ser definidos pelo servidor com base na identidade validada.

### 22.4. Importância do transporte

Mesmo um fluxo de login com validação correta ainda se beneficia de HTTPS, pois a proteção do transporte reduz a exposição do conteúdo trafegado.

## 23. Limitações do projeto

Para o artigo, vale mencionar com honestidade algumas limitações:

- trata-se de um ambiente controlado de laboratório;
- o sistema é uma simulação didática, não uma aplicação corporativa completa;
- o certificado HTTPS utilizado na demo é self-signed;
- não foram explorados ataques mais avançados de camada física ou de enlace;
- o foco foi autenticação, autorização e transporte.

Mencionar limitações fortalece o texto acadêmico, porque mostra consciência metodológica.

## 24. Trabalhos futuros

Vocês podem sugerir como extensão:

- incluir demonstrações relacionadas a WPA2 e WPA3;
- simular um captive portal malicioso;
- integrar logs persistentes em banco de dados;
- adicionar autenticação multifator;
- comparar diferentes algoritmos e políticas de senha;
- ampliar o estudo para cenários com access point falso.

## 25. Estrutura sugerida para o artigo

Uma estrutura possível:

1. Introdução.
2. Fundamentação teórica.
3. Metodologia.
4. Desenvolvimento do protótipo.
5. Experimentos realizados.
6. Análise dos resultados.
7. Limitações e trabalhos futuros.
8. Conclusão.

## 26. Texto-base para a introdução

Vocês podem adaptar algo como:

"A crescente utilização de redes sem fio em ambientes pessoais, acadêmicos e corporativos torna a segurança dessas infraestruturas um tema de elevada relevância. Embora protocolos como WPA2 e WPA3 contribuam para a proteção do acesso à rede, a segurança final percebida pelo usuário depende também da forma como as aplicações tratam autenticação, autorização e transporte de dados. Nesse contexto, este trabalho apresenta uma demonstração prática de segurança em redes sem fio com foco em um sistema de login web, comparando um fluxo vulnerável e um fluxo protegido. Utilizando as ferramentas Burp Suite e Wireshark, foi possível observar como credenciais e parâmetros podem ser interceptados e adulterados em um cenário inseguro, bem como analisar o efeito de mecanismos corretivos como validação no backend, bloqueio por tentativas e uso de HTTPS."

## 27. Texto-base para a metodologia

Vocês podem adaptar algo como:

"O trabalho foi desenvolvido como um estudo experimental em ambiente controlado. Para isso, foi implementada uma aplicação web com dois fluxos de autenticação: um propositalmente vulnerável e outro com controles de segurança aplicados no servidor. O ambiente de teste foi composto por um computador executando a aplicação, um navegador web, um dispositivo móvel conectado à mesma rede sem fio, a ferramenta Burp Suite para interceptação e manipulação de requisições e o Wireshark para captura e análise do tráfego. Os experimentos envolveram a submissão de credenciais, a modificação de parâmetros de autorização, a observação do comportamento do backend e a comparação entre tráfego HTTP e HTTPS."

## 28. Texto-base para a análise dos resultados

Vocês podem adaptar algo como:

"Os resultados mostraram que, no fluxo vulnerável, o servidor aceitou o privilégio adulterado enviado pelo cliente, evidenciando uma falha de autorização. Além disso, a comunicação realizada por HTTP permitiu maior exposição do conteúdo trafegado na captura de rede. Em contrapartida, no fluxo protegido, a tentativa de modificação do privilégio não foi aceita, uma vez que o backend passou a impor o papel real do usuário autenticado. Adicionalmente, o sistema implementou bloqueio temporário após repetidas falhas de autenticação, reduzindo a superfície para ataques de tentativa e erro. Na comparação entre HTTP e HTTPS, observou-se que a proteção do transporte dificultou a leitura do conteúdo da comunicação, reforçando a importância da segurança em camadas."

## 29. Texto-base para a conclusão

Vocês podem adaptar algo como:

"Conclui-se que a segurança em redes sem fio depende da integração entre mecanismos de proteção na rede, no transporte e na aplicação. O experimento demonstrou que falhas na implementação de autenticação e autorização podem comprometer o sistema mesmo quando existem mecanismos de segurança em outras camadas. Por outro lado, a adoção de validações no servidor, bloqueio por tentativas e HTTPS contribui significativamente para reduzir a exploração. Dessa forma, o trabalho evidencia que a segurança deve ser tratada de maneira multicamadas, articulando protocolos de rede e boas práticas de desenvolvimento seguro."

## 30. Roteiro curto de fala

Exemplo de roteiro:

1. "Nosso projeto demonstra segurança em redes sem fio em múltiplas camadas."
2. "Primeiro mostramos uma aplicação vulnerável, em que o cliente consegue alterar a requisição."
3. "Com o Burp Suite, interceptamos o login e trocamos o `role` para `admin`."
4. "O servidor vulnerável aceita essa alteração, o que representa uma falha de confiança no lado do cliente."
5. "Depois mostramos a versão protegida, em que o backend valida corretamente e ignora o `role` adulterado."
6. "Também mostramos bloqueio por tentativas para reduzir ataques de força bruta."
7. "No Wireshark, comparamos HTTP e HTTPS para mostrar a diferença entre tráfego legível e tráfego protegido por TLS."
8. "Assim, conectamos segurança na aplicação, no transporte e na rede sem fio."

## 31. Problemas comuns e como resolver

### A página não carrega quando o Burp está ligado

Causa:

- o `Intercept` está segurando os requests GET da página.

Solução:

1. deixe `Intercept is off` para carregar a página;
2. ligue o `Intercept` só na hora de enviar o formulário.

### O Burp não intercepta nada

Verifique:

- se o navegador está usando proxy `127.0.0.1:8080`;
- se o `Intercept is on` está ligado.

### O HTTPS mostra aviso no navegador

Isso é esperado porque o certificado da demo é self-signed.

### O celular não acessa o site

Verifique:

- se o celular e o computador estão na mesma rede;
- se o IP usado é o IPv4 correto do computador;
- se firewall ou antivírus não estão bloqueando a porta.

## 32. Lista de evidências para capturar e colocar no artigo

Sugestão de prints ou figuras:

1. página inicial do projeto;
2. tela do fluxo vulnerável;
3. Burp interceptando `POST /login-vulneravel`;
4. corpo da requisição antes e depois da mudança de `role`;
5. resposta aceitando `admin`;
6. painel registrando `vulnerable_success`;
7. tela do fluxo protegido;
8. Burp interceptando `POST /login-seguro`;
9. resposta protegida com `assignedRole: user`;
10. painel registrando `secure_role_override_blocked`;
11. painel mostrando `secure_blocked`;
12. Wireshark com fluxo HTTP;
13. Wireshark com fluxo HTTPS.

## 33. Arquivos úteis do projeto

- gerador do certificado: `scripts/gerar-certificado-demo.ps1`;
- servidor principal: `server.js`;
- painel de evidências: `public/painel-analise.html`.
