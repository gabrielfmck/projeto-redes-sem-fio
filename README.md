# Projeto Final - Seguranca em Redes Sem Fio

Este projeto foi desenvolvido como uma demonstracao pratica de seguranca em redes sem fio, com foco em autenticacao, interceptacao de trafego, adulteracao de requisicoes e mecanismos de defesa em diferentes camadas.

A proposta central e comparar dois cenarios:

- um fluxo vulneravel, em que o cliente envia dados sensiveis por HTTP e o servidor confia em informacoes manipulaveis vindas da requisicao
- um fluxo protegido, em que o backend valida credenciais corretamente, ignora privilegios enviados pelo cliente, aplica bloqueio por tentativas e pode operar sob HTTPS

O projeto foi pensado para ser demonstrado com:

- navegador
- celular conectado na mesma rede Wi-Fi
- Burp Suite
- Wireshark
- painel de evidencias da propria aplicacao

Este README foi expandido para servir tambem como base de redacao do artigo, reunindo contexto teorico, objetivo, metodologia, roteiro experimental, interpretacao dos resultados e estrutura sugerida para o texto academico.

## 1. Resumo do projeto

Em redes sem fio, a seguranca nao depende de apenas um ponto de protecao. Mesmo quando a rede possui mecanismos como WPA2 ou WPA3, aplicacoes mal implementadas ainda podem expor credenciais, permitir adulteracao de parametros e facilitar ataques de elevacao de privilegio. Por outro lado, mesmo uma aplicacao bem implementada pode ser prejudicada se trafegar sem criptografia de transporte em ambientes hostis.

Com base nisso, este projeto demonstra seguranca em camadas por meio de uma aplicacao web de login com dois comportamentos opostos:

- no primeiro, a autenticacao e propositalmente insegura
- no segundo, a autenticacao adota controles basicos de seguranca no servidor

O experimento mostra como ferramentas de analise e interceptacao, como Wireshark e Burp Suite, permitem visualizar ou modificar o trafego, e como as contramedidas corretas impedem a exploracao.

## 2. Tema e recorte academico

### 2.1. Tema geral

Seguranca em redes sem fio.

### 2.2. Recorte adotado

Seguranca em redes sem fio analisada a partir da autenticacao de usuarios e da protecao do trafego entre cliente e servidor.

### 2.3. Pergunta central de pesquisa

Como a combinacao entre falhas na aplicacao e ausencia de protecao adequada no transporte pode comprometer a seguranca em redes sem fio, e como mecanismos corretivos reduzem esse risco?

### 2.4. Hipotese do trabalho

Quando uma aplicacao web trafega dados em HTTP e confia em parametros enviados pelo cliente, o ambiente sem fio se torna mais suscetivel a interceptacao e adulteracao. Em contrapartida, a adocao de validacao no backend, protecao por TLS e controles adicionais como bloqueio por tentativas reduz significativamente a superficie de ataque.

## 3. Objetivos

### 3.1. Objetivo geral

Demonstrar, de forma pratica, como vulnerabilidades de autenticacao e transporte podem afetar a seguranca em redes sem fio, bem como apresentar mecanismos de mitigacao aplicados em diferentes camadas.

### 3.2. Objetivos especificos

- implementar um fluxo vulneravel de autenticacao para demonstrar riscos reais
- implementar um fluxo protegido com validacoes no servidor
- capturar e analisar trafego da aplicacao com Wireshark
- interceptar e modificar requisicoes com Burp Suite
- comparar o comportamento da aplicacao em HTTP e HTTPS
- registrar evidencias e metricas em um painel de analise
- produzir resultados que possam ser discutidos no artigo e na apresentacao

## 4. Justificativa

Redes sem fio sao amplamente utilizadas em ambientes domesticos, academicos e corporativos. Entretanto, a percepcao de seguranca muitas vezes se concentra apenas na senha do Wi-Fi ou no protocolo da rede, como WPA2 ou WPA3. Esse entendimento e incompleto, porque a seguranca final depende tambem da forma como a aplicacao trata autenticacao, autorizacao, transporte e monitoramento.

Este projeto e relevante porque demonstra, na pratica, que:

- a seguranca da rede nao substitui a seguranca da aplicacao
- a seguranca da aplicacao nao substitui a criptografia do transporte
- a defesa eficaz depende de multiplas camadas funcionando em conjunto

## 5. Fundamentacao teorica resumida

Esta secao pode ser usada como base para a parte teorica do artigo.

### 5.1. Seguranca em redes sem fio

Redes sem fio estao sujeitas a riscos como interceptacao, acesso nao autorizado, sniffing, ataques de forca bruta e criacao de pontos de acesso maliciosos. Protocolos como WEP, WPA, WPA2 e WPA3 surgiram para elevar o nivel de seguranca da comunicacao entre dispositivo e roteador, principalmente na camada de enlace.

### 5.2. WEP, WPA2 e WPA3

- `WEP`
  - considerado obsoleto
  - possui fragilidades conhecidas
  - nao deve ser utilizado em ambientes reais

- `WPA2`
  - representou um grande avanço em relacao ao WEP
  - tornou-se padrao por muitos anos
  - ainda depende de senhas fortes e configuracao adequada

- `WPA3`
  - amplia a protecao contra ataques de adivinhacao offline
  - oferece mecanismos mais modernos de autenticacao
  - e considerado superior ao WPA2 em cenarios atuais

### 5.3. Camadas de seguranca

O projeto conversa com tres camadas principais:

- `camada de enlace`
  - relacionada ao Wi-Fi, WPA2 e WPA3
- `camada de transporte`
  - relacionada a HTTP versus HTTPS e ao uso de TLS
- `camada de aplicacao`
  - relacionada ao login, validacao, autorizacao e confianca nos parametros

### 5.4. Wireshark

O Wireshark e uma ferramenta de captura e analise de pacotes. No projeto, ele e usado para mostrar:

- a existencia do trafego na rede
- a diferenca entre trafego legivel em HTTP
- e a dificuldade de leitura quando o transporte esta protegido por HTTPS

### 5.5. Burp Suite

O Burp Suite e uma ferramenta de interceptacao e manipulacao de requisicoes HTTP e HTTPS. No projeto, ele e usado para mostrar:

- interceptacao de requisicoes antes do envio ao servidor
- adulteracao de parametros
- comparacao entre um backend inseguro e outro protegido

### 5.6. Autenticacao e autorizacao

O projeto tambem ajuda a diferenciar dois conceitos que podem ser explorados no artigo:

- `autenticacao`
  - verificar se o usuario realmente e quem diz ser
- `autorizacao`
  - definir o que o usuario autenticado pode fazer

No fluxo vulneravel, o servidor falha justamente ao confiar na autorizacao enviada pelo cliente.

## 6. Problema demonstrado pelo projeto

O fluxo vulneravel mostra duas falhas centrais:

- os dados trafegam por HTTP, o que facilita a visualizacao do conteudo em ferramentas de captura
- o servidor aceita o parametro `role` enviado pelo cliente, permitindo adulteracao de privilegio

Isso faz com que um usuario comum consiga:

- ter sua senha visivel no trafego capturado
- modificar a requisicao no Burp Suite
- simular uma elevacao para `admin`

Ja o fluxo protegido foi construido para responder a essas fragilidades:

- a senha e verificada no servidor com `scrypt`
- o `role` e imposto pelo backend
- ha bloqueio apos tres falhas
- o transporte pode ser protegido com HTTPS

## 7. Arquitetura da demonstracao

O sistema possui dois componentes principais:

- `backend em Node.js com Express`
- `frontend estatico servido pela aplicacao`

### 7.1. Backend

O servidor principal esta em `server.js`.

Ele implementa:

- servidor HTTP na porta `3000` por padrao
- servidor HTTPS na porta `3443` por padrao, se houver certificado
- rota vulneravel de login
- rota protegida de login
- controle de bloqueio por tentativas
- API de metricas e eventos
- reinicializacao do estado da demo

Pontos importantes do codigo:

- configuracao de portas e certificado em `server.js`
- criacao de hashes com `scrypt` em `server.js`
- metricas e telemetria em `server.js`
- rastreamento de tentativas em `server.js`
- fluxo vulneravel em `server.js`
- fluxo protegido em `server.js`
- inicializacao HTTP e HTTPS em `server.js`

### 7.2. Frontend

O frontend possui tres visoes principais:

- pagina inicial
- formulario vulneravel
- formulario protegido
- painel de evidencias

Arquivos principais:

- home: `public/index.html`
- login vulneravel: `public/login-inseguro.html`
- login protegido: `public/login-seguro.html`
- painel: `public/painel-analise.html`
- cliente do painel: `public/painel.js`

### 7.3. Painel de evidencias

O painel mostra:

- numero de tentativas no fluxo vulneravel
- numero de tentativas no fluxo protegido
- falhas
- bloqueios
- adulteracoes aceitas
- adulteracoes bloqueadas
- eventos com data, hora e detalhes

Isso ajuda muito na escrita do artigo porque transforma a apresentacao pratica em dados observaveis.

## 8. O que a demonstracao mostra na pratica

### 8.1. No fluxo vulneravel

O fluxo vulneravel demonstra:

- envio de credenciais por HTTP
- possibilidade de visualizacao do corpo da requisicao
- confianca indevida em dados enviados pelo cliente
- adulteracao de `role`
- sucesso de elevacao de privilegio

### 8.2. No fluxo protegido

O fluxo protegido demonstra:

- validacao de senha no lado do servidor
- nao confianca no `role` vindo do cliente
- bloqueio temporario por repeticao de erros
- registro de eventos de seguranca
- diferenca entre HTTP e HTTPS no transporte

### 8.3. Na perspectiva do tema

Isso se encaixa no tema "seguranca em redes sem fio" porque mostra que:

- uma rede sem fio insegura ou mal monitorada facilita captura de trafego
- um trafego HTTP exposto aumenta o risco
- uma aplicacao mal implementada potencializa o dano
- uma defesa em camadas reduz a exploracao

## 9. Credenciais da demonstracao

- `aluno / 123456 / user`
- `analista / wifi2026 / analyst`
- `admin / adminwifi / admin`

## 10. Como iniciar o projeto

1. Abra um terminal na raiz do projeto clonado
2. Rode:

```powershell
npm start
```

3. Abra no navegador:

```txt
http://localhost:3000
```

4. O projeto funciona normalmente em HTTP.
5. Para habilitar HTTPS localmente, gere o certificado da demo com:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1
```

6. Depois de gerar o certificado, o servidor HTTPS tambem sobe em:

```txt
https://localhost:3443
```

### 10.1. Observacao sobre o certificado

- o arquivo `demo-cert.pfx` deve ser gerado localmente por cada usuario
- esse arquivo nao deve ser publicado no repositório
- o script `scripts/gerar-certificado-demo.ps1` existe justamente para criar esse certificado de forma local

### 10.2. Se a porta 3000 estiver ocupada

Use portas alternativas:

```powershell
$env:PORT='3100'
$env:HTTPS_PORT='3444'
npm start
```

## 11. Telas que vao ser usadas na apresentacao

- Home:
  - `http://localhost:3000`

- Fluxo vulneravel:
  - `http://localhost:3000/login-inseguro.html`

- Fluxo protegido:
  - `http://localhost:3000/login-seguro.html`

- Painel de evidencias:
  - `http://localhost:3000/painel-analise.html`

## 12. Metodologia experimental

Esta secao pode ser adaptada quase diretamente para o artigo.

### 12.1. Tipo de estudo

Estudo experimental demonstrativo, com comparacao entre dois cenarios de autenticacao em ambiente controlado.

### 12.2. Ambiente de teste

- computador com o servidor da aplicacao
- navegador web
- Burp Suite para interceptacao
- Wireshark para captura
- celular conectado na mesma rede Wi-Fi

### 12.3. Variaveis observadas

- visibilidade do conteudo da requisicao
- possibilidade de adulteracao de parametros
- aceitacao ou bloqueio da adulteracao
- ocorrencia de bloqueio por tentativas
- diferenca de leitura do trafego entre HTTP e HTTPS

### 12.4. Procedimento

1. iniciar o sistema
2. executar o fluxo vulneravel
3. interceptar a requisicao com Burp
4. adulterar o `role`
5. observar o sucesso da exploracao
6. capturar o trafego com Wireshark
7. executar o fluxo protegido
8. repetir a tentativa de adulteracao
9. observar o bloqueio logico no backend
10. repetir a comparacao sob HTTPS

## 13. Ordem recomendada da apresentacao

Sugestao de ordem:

1. Mostrar a pagina inicial e explicar o objetivo
2. Abrir o painel de evidencias em uma aba separada
3. Demonstrar o fluxo vulneravel
4. Demonstrar a adulteracao com Burp Suite
5. Mostrar o evento correspondente no painel
6. Demonstrar o fluxo protegido
7. Mostrar que o Burp intercepta, mas o backend nao aceita a adulteracao
8. Demonstrar o bloqueio por tentativas
9. Mostrar o Wireshark comparando HTTP e HTTPS
10. Fechar explicando seguranca por camadas

## 14. Fluxo completo com Burp Suite

### 14.1. Preparacao

1. Abra o Burp Suite
2. Va em `Proxy > Intercept`
3. Deixe `Intercept is off` para carregar as paginas normalmente
4. Configure o navegador para usar proxy:
   - host: `127.0.0.1`
   - porta: `8080`

Se for usar o navegador do proprio Burp, pode abrir por ele tambem.

### 14.2. Carregar a pagina vulneravel

1. Abra:

```txt
http://127.0.0.1:3000/login-inseguro.html
```

2. Deixe a pagina carregar completamente
3. Volte ao Burp
4. Ligue `Intercept is on`

### 14.3. Interceptar o login vulneravel

1. Volte para o navegador
2. Preencha:
   - `usuario = aluno`
   - `senha = 123456`
   - `role = user`
3. Clique em `Enviar login vulneravel`
4. Volte para o Burp
5. A requisicao que interessa deve ser:

```txt
POST /login-vulneravel
```

6. Na area de requisicao, abra a visualizacao `Raw`
7. Procure o corpo JSON no final da requisicao
8. Troque:

```json
{"usuario":"aluno","senha":"123456","role":"user"}
```

por:

```json
{"usuario":"aluno","senha":"123456","role":"admin"}
```

9. Clique em `Forward`

### 14.4. O que deve acontecer

- o servidor vai aceitar `admin`
- a tela vai mostrar que o privilegio adulterado foi aceito
- no painel, deve aparecer um evento `vulnerable_success`
- no painel, o campo `tamperedRoleAccepted` deve aparecer como verdadeiro

### 14.5. O que interpretar no artigo

Esse resultado indica:

- falha de autorizacao
- excesso de confianca no cliente
- inadequacao do uso de HTTP para trafego sensivel
- aumento da superficie de ataque em ambiente sem fio

### 14.6. O que falar nessa parte

Sugestao de fala:

"Aqui estamos interceptando a requisicao na camada de aplicacao. Mesmo sem conhecer a senha de admin, conseguimos mudar o parametro `role` antes de enviar. O servidor vulneravel confiou no cliente e aceitou a elevacao de privilegio."

## 15. Fluxo completo com Burp no login protegido

### 15.1. Abrir a pagina protegida

1. Deixe `Intercept is off`
2. Abra:

```txt
http://127.0.0.1:3000/login-seguro.html
```

3. Espere a pagina carregar
4. Ligue `Intercept is on`

### 15.2. Interceptar o login protegido

1. No navegador, preencha:
   - `usuario = aluno`
   - `senha = 123456`
   - `role = admin`
2. Clique em `Enviar login protegido`
3. Volte para o Burp
4. A requisicao deve ser:

```txt
POST /login-seguro
```

5. Se quiser, mantenha o corpo como esta ou force novamente:

```json
{"usuario":"aluno","senha":"123456","role":"admin"}
```

6. Clique em `Forward`

### 15.3. O que deve acontecer

- o servidor nao vai conceder admin
- a resposta vai trazer o privilegio real do usuario, normalmente `user`
- no painel, deve aparecer `secure_role_override_blocked`

### 15.4. O que interpretar no artigo

Esse resultado demonstra:

- validacao correta no lado do servidor
- separacao adequada entre autenticacao e autorizacao
- resistencia a manipulacao de parametros
- melhoria de postura de seguranca na camada de aplicacao

### 15.5. O que falar nessa parte

Sugestao de fala:

"Agora a requisicao ainda pode ser interceptada, mas o backend nao confia no cliente. Mesmo alterando o `role`, o servidor aplica o privilegio real do usuario. Isso mostra a diferenca entre apenas interceptar e realmente explorar uma falha."

## 16. Fluxo de bloqueio por tentativas

### 16.1. Como testar

1. Abra o fluxo protegido
2. Use:
   - `usuario = aluno`
   - `senha = errada`
3. Envie a senha errada tres vezes
4. Tente uma quarta vez

### 16.2. Resultado esperado

- o sistema informa bloqueio temporario
- no painel aparecem:
  - `secure_failure`
  - `secure_blocked`

### 16.3. O que interpretar no artigo

Isso demonstra a adocao de um controle compensatorio contra tentativa repetida de autenticacao, reduzindo o risco de forca bruta simples.

### 16.4. O que falar

"Aqui estamos mostrando um controle adicional de defesa. Mesmo que alguem tente varias senhas, o sistema reduz a chance de brute force com bloqueio temporario."

## 17. Fluxo completo com Wireshark

### 17.1. Preparacao

1. Abra o Wireshark
2. Escolha a interface de rede que esta sendo usada
   - geralmente a interface Wi-Fi
3. Comece a captura
4. Use o filtro:

```txt
tcp.port == 3000 or tcp.port == 3443
```

### 17.2. Teste HTTP

1. No navegador ou no celular, abra:

```txt
http://IP_DO_PC:3000/login-inseguro.html
```

2. Faca um login vulneravel com:
   - `usuario = aluno`
   - `senha = 123456`
   - `role = user`

3. No Wireshark:
   - localize os pacotes da porta `3000`
   - clique com o botao direito
   - use `Follow` ou `Seguir`
   - escolha `TCP Stream`

### 17.3. O que deve aparecer

No fluxo HTTP, o conteudo do login pode aparecer legivel, incluindo campos como:

- `usuario`
- `senha`
- `role`

### 17.4. O que interpretar no artigo

Esse resultado mostra que:

- o trafego existe em claro do ponto de vista do transporte
- um observador com acesso ao meio pode analisar o conteudo
- o problema se agrava em redes sem fio abertas, mal configuradas ou monitoradas

### 17.5. O que falar

"No HTTP, o trafego passa sem protecao de transporte. O Wireshark consegue capturar e reconstruir o conteudo da requisicao, o que mostra o risco em redes sem fio sem protecao adequada."

## 18. Comparacao HTTP vs HTTPS no Wireshark

### 18.1. Teste HTTPS

1. Abra no navegador:

```txt
https://IP_DO_PC:3443/login-seguro.html
```

2. Se aparecer aviso do certificado, aceite para fins de demonstracao
3. Faca login com:
   - `usuario = aluno`
   - `senha = 123456`

### 18.2. O que observar

- os pacotes continuam existindo
- o Wireshark ainda mostra que houve comunicacao
- mas o conteudo da senha e do corpo nao aparece em texto claro como no HTTP

### 18.3. O que interpretar no artigo

Esse resultado sustenta a ideia de que:

- a criptografia de transporte nao elimina o trafego
- ela protege o conteudo do trafego
- a defesa no transporte complementa, mas nao substitui, a defesa na aplicacao

### 18.4. O que falar

"Aqui ainda existe trafego na rede, mas o conteudo esta protegido por TLS. Isso mostra a diferenca entre enxergar que houve comunicacao e conseguir ler o conteudo da comunicacao."

## 19. Teste no celular

### 19.1. Preparacao

1. Descubra o IPv4 do computador na pagina inicial
2. Conecte o celular e o computador na mesma rede Wi-Fi
3. No celular, abra:

```txt
http://IP_DO_PC:3000
```

### 19.2. Com Burp no celular

Se quiser interceptar o celular pelo Burp:

1. Nas configuracoes do Wi-Fi do celular, habilite proxy manual
2. Host do proxy:
   - IP do computador
3. Porta:
   - `8080`
4. Abra a pagina no celular
5. Intercepte normalmente no Burp

Observacao:

- para HTTP, isso costuma funcionar direto
- para HTTPS, normalmente precisa instalar o certificado CA do Burp no dispositivo

### 19.3. Valor academico do teste no celular

O uso do celular aproxima a demonstracao de um ambiente real de rede sem fio, tornando o experimento mais convincente para o artigo e para a banca.

## 20. O que mostrar no painel de evidencias

Durante a apresentacao, deixem a pagina do painel aberta:

```txt
http://localhost:3000/painel-analise.html
```

Eventos importantes para mostrar:

- `vulnerable_success`
- `secure_success`
- `secure_role_override_blocked`
- `secure_failure`
- `secure_blocked`

Metricas importantes:

- `tamperAccepted`
- `tamperBlocked`
- `failedAttempts`
- `blockedAttempts`

### 20.1. Como usar o painel no artigo

O painel pode ser citado como fonte de evidencia observacional do experimento, ajudando a documentar:

- quantidade de tentativas
- sucesso ou falha das exploracoes
- ocorrencia de bloqueio
- diferenca entre os dois fluxos

## 21. Resultados esperados

Uma forma objetiva de escrever os resultados no artigo e organizar assim:

- no fluxo vulneravel, a adulteracao do parametro `role` foi aceita pelo servidor
- no fluxo vulneravel, os dados trafegaram em HTTP e puderam ser visualizados com mais facilidade
- no fluxo protegido, a adulteracao do `role` nao foi aceita
- no fluxo protegido, houve bloqueio apos tres tentativas com senha incorreta
- no HTTPS, o conteudo do trafego nao ficou exposto no Wireshark da mesma forma que no HTTP

## 22. Discussao sugerida para o artigo

Vocês podem discutir os resultados sob estes eixos:

### 22.1. Seguranca em camadas

O projeto mostra que a seguranca de redes sem fio nao pode ser reduzida ao protocolo Wi-Fi. Mesmo em um ambiente com protecao no acesso sem fio, uma aplicacao mal implementada pode permitir exploracao.

### 22.2. Limite das ferramentas

Burp Suite e Wireshark nao sao “o problema”; eles sao instrumentos de analise. O problema real esta na implementacao insegura e na falta de boas praticas.

### 22.3. Importancia do backend

Confiar em parametros enviados pelo cliente representa erro conceitual grave. Privilegios devem ser definidos pelo servidor com base na identidade validada.

### 22.4. Importancia do transporte

Mesmo um fluxo de login com validacao correta ainda se beneficia de HTTPS, pois a protecao do transporte reduz a exposicao do conteudo trafegado.

## 23. Limitacoes do projeto

Para o artigo, vale mencionar com honestidade algumas limitacoes:

- trata-se de um ambiente controlado de laboratorio
- o sistema e uma simulacao didatica, nao uma aplicacao corporativa completa
- o certificado HTTPS utilizado na demo e self-signed
- nao foram explorados ataques mais avancados de camada fisica ou de enlace
- o foco foi autenticacao, autorizacao e transporte

Mencionar limitacoes fortalece o texto academico, porque mostra consciencia metodologica.

## 24. Trabalhos futuros

Vocês podem sugerir como extensao:

- incluir demonstracoes relacionadas a WPA2 e WPA3
- simular um captive portal malicioso
- integrar logs persistentes em banco de dados
- adicionar autenticacao multifator
- comparar diferentes algoritmos e politicas de senha
- ampliar o estudo para cenarios com access point falso

## 25. Estrutura sugerida para o artigo

Uma estrutura possivel:

1. Introducao
2. Fundamentacao teorica
3. Metodologia
4. Desenvolvimento do prototipo
5. Experimentos realizados
6. Analise dos resultados
7. Limitacoes e trabalhos futuros
8. Conclusao

## 26. Texto-base para a introducao

Vocês podem adaptar algo como:

"A crescente utilizacao de redes sem fio em ambientes pessoais, academicos e corporativos torna a seguranca dessas infraestruturas um tema de elevada relevancia. Embora protocolos como WPA2 e WPA3 contribuam para a protecao do acesso a rede, a seguranca final percebida pelo usuario depende tambem da forma como as aplicacoes tratam autenticacao, autorizacao e transporte de dados. Nesse contexto, este trabalho apresenta uma demonstracao pratica de seguranca em redes sem fio com foco em um sistema de login web, comparando um fluxo vulneravel e um fluxo protegido. Utilizando as ferramentas Burp Suite e Wireshark, foi possivel observar como credenciais e parametros podem ser interceptados e adulterados em um cenario inseguro, bem como analisar o efeito de mecanismos corretivos como validacao no backend, bloqueio por tentativas e uso de HTTPS."

## 27. Texto-base para a metodologia

Vocês podem adaptar algo como:

"O trabalho foi desenvolvido como um estudo experimental em ambiente controlado. Para isso, foi implementada uma aplicacao web com dois fluxos de autenticacao: um propositalmente vulneravel e outro com controles de seguranca aplicados no servidor. O ambiente de teste foi composto por um computador executando a aplicacao, um navegador web, um dispositivo movel conectado a mesma rede sem fio, a ferramenta Burp Suite para interceptacao e manipulacao de requisicoes e o Wireshark para captura e analise do trafego. Os experimentos envolveram a submissao de credenciais, a modificacao de parametros de autorizacao, a observacao do comportamento do backend e a comparacao entre trafego HTTP e HTTPS."

## 28. Texto-base para a analise dos resultados

Vocês podem adaptar algo como:

"Os resultados mostraram que, no fluxo vulneravel, o servidor aceitou o privilegio adulterado enviado pelo cliente, evidenciando uma falha de autorizacao. Alem disso, a comunicacao realizada por HTTP permitiu maior exposicao do conteudo trafegado na captura de rede. Em contrapartida, no fluxo protegido, a tentativa de modificacao do privilegio nao foi aceita, uma vez que o backend passou a impor o papel real do usuario autenticado. Adicionalmente, o sistema implementou bloqueio temporario apos repetidas falhas de autenticacao, reduzindo a superficie para ataques de tentativa e erro. Na comparacao entre HTTP e HTTPS, observou-se que a protecao do transporte dificultou a leitura do conteudo da comunicacao, reforcando a importancia da seguranca em camadas."

## 29. Texto-base para a conclusao

Vocês podem adaptar algo como:

"Conclui-se que a seguranca em redes sem fio depende da integracao entre mecanismos de protecao na rede, no transporte e na aplicacao. O experimento demonstrou que falhas na implementacao de autenticacao e autorizacao podem comprometer o sistema mesmo quando existem mecanismos de seguranca em outras camadas. Por outro lado, a adocao de validacoes no servidor, bloqueio por tentativas e HTTPS contribui significativamente para reduzir a exploracao. Dessa forma, o trabalho evidencia que a seguranca deve ser tratada de maneira multicamadas, articulando protocolos de rede e boas praticas de desenvolvimento seguro."

## 30. Roteiro curto de fala

Exemplo de roteiro:

1. "Nosso projeto demonstra seguranca em redes sem fio em multiplas camadas."
2. "Primeiro mostramos uma aplicacao vulneravel, onde o cliente consegue alterar a requisicao."
3. "Com o Burp Suite, interceptamos o login e trocamos o `role` para `admin`."
4. "O servidor vulneravel aceita essa alteracao, o que representa uma falha de confianca no lado do cliente."
5. "Depois mostramos a versao protegida, onde o backend valida corretamente e ignora o `role` adulterado."
6. "Tambem mostramos bloqueio por tentativas para reduzir ataques de forca bruta."
7. "No Wireshark, comparamos HTTP e HTTPS para mostrar a diferenca entre trafego legivel e trafego protegido por TLS."
8. "Assim, conectamos seguranca na aplicacao, no transporte e na rede sem fio."

## 31. Problemas comuns e como resolver

### A pagina nao carrega quando o Burp esta ligado

Causa:

- o `Intercept` esta segurando os requests GET da pagina

Solucao:

1. deixe `Intercept is off` para carregar a pagina
2. ligue o `Intercept` so na hora de enviar o formulario

### O Burp nao intercepta nada

Verifique:

- se o navegador esta usando proxy `127.0.0.1:8080`
- se o `Intercept is on` esta ligado

### O HTTPS mostra aviso no navegador

Isso e esperado porque o certificado da demo e self-signed.

### O celular nao acessa o site

Verifique:

- se o celular e o computador estao na mesma rede
- se o IP usado e o IPv4 correto do computador
- se firewall ou antivirus nao estao bloqueando a porta

## 32. Lista de evidencias para capturar e colocar no artigo

Sugestao de prints ou figuras:

1. pagina inicial do projeto
2. tela do fluxo vulneravel
3. Burp interceptando `POST /login-vulneravel`
4. corpo da requisicao antes e depois da mudanca de `role`
5. resposta aceitando `admin`
6. painel registrando `vulnerable_success`
7. tela do fluxo protegido
8. Burp interceptando `POST /login-seguro`
9. resposta protegida com `assignedRole: user`
10. painel registrando `secure_role_override_blocked`
11. painel mostrando `secure_blocked`
12. Wireshark com fluxo HTTP
13. Wireshark com fluxo HTTPS

## 33. Arquivos uteis do projeto

- gerador do certificado: `scripts/gerar-certificado-demo.ps1`
- servidor principal: `server.js`
- painel de evidencias: `public/painel-analise.html`
