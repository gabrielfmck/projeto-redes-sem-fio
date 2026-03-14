# Projeto Final - Segurança em Redes Sem Fio

Este projeto demonstra segurança em redes sem fio por camadas, comparando um fluxo vulnerável com um fluxo protegido.

O sistema foi construído para permitir testes com:

- navegador;
- celular na mesma rede Wi-Fi;
- Burp Suite;
- Wireshark.

## 1. O que o projeto faz

O projeto possui três partes principais:

- `Fluxo vulnerável`
  - usa HTTP;
  - permite adulteração do parâmetro `role`;
  - aceita privilégio enviado pelo cliente.

- `Fluxo protegido`
  - valida a senha no servidor;
  - ignora o `role` enviado pelo cliente;
  - bloqueia tentativas repetidas;
  - pode rodar com HTTPS para comparação de tráfego.

- `Painel de evidências`
  - mostra tentativas, falhas, bloqueios e adulterações.

## 2. Credenciais de demonstração

- `aluno / 123456 / user`;
- `analista / wifi2026 / analyst`;
- `admin / adminwifi / admin`.

Essas credenciais são apenas para testes locais do projeto.

## 3. Requisitos

- `Node.js` instalado;
- `npm` instalado;
- `PowerShell` para gerar o certificado local, se quiser usar HTTPS;
- opcionalmente:
  - `Burp Suite`;
  - `Wireshark`.

## 4. Como instalar e iniciar

1. Abra um terminal na raiz do projeto clonado.
2. Instale as dependências:

```powershell
npm install
```

3. Inicie o servidor:

```powershell
npm start
```

4. Abra no navegador:

```txt
http://localhost:3000
```

## 5. Como habilitar HTTPS

O projeto funciona normalmente em HTTP. O HTTPS é opcional e serve principalmente para comparar o tráfego no Wireshark.

### 5.1. Gerar o certificado local

Execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1
```

Depois disso, o arquivo `demo-cert.pfx` será criado localmente.

### 5.2. Iniciar com HTTPS

Depois de gerar o certificado, rode:

```powershell
npm start
```

Se tudo estiver correto, o projeto ficará disponível em:

```txt
https://localhost:3443
```

### 5.3. Observação importante

- o arquivo `demo-cert.pfx` deve ser gerado localmente por cada usuário;
- esse arquivo não deve ser publicado no repositório;
- o script `scripts/gerar-certificado-demo.ps1` existe justamente para criar esse certificado localmente.

## 6. Se o HTTPS não iniciar

Se aparecer algo como:

```txt
HTTPS nao foi iniciado. Verifique o arquivo demo-cert.pfx e a senha configurada.
mac verify failure
```

isso significa que o servidor não conseguiu abrir o arquivo `demo-cert.pfx` com a senha esperada.

### 6.1. Como resolver

1. Apague o arquivo `demo-cert.pfx`.
2. Gere novamente o certificado:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1
```

3. Inicie o servidor informando a senha correta:

```powershell
$env:DEMO_CERT_PASSWORD='projeto-redes-demo'
npm start
```

### 6.2. Importante

- se isso acontecer, o fluxo em `HTTP` ainda pode funcionar normalmente;
- o erro afeta apenas a inicialização do `HTTPS`;
- se aparecer `Servidor HTTP rodando em http://localhost:3000`, o projeto já pode ser testado em HTTP.

## 7. Se a porta 3000 estiver ocupada

Se aparecer erro de porta em uso, execute com portas alternativas:

```powershell
$env:PORT='3100'
$env:HTTPS_PORT='3444'
npm start
```

## 8. Telas disponíveis

- Home:
  - `http://localhost:3000`

- Fluxo vulnerável:
  - `http://localhost:3000/login-inseguro.html`

- Fluxo protegido:
  - `http://localhost:3000/login-seguro.html`

- Painel de evidências:
  - `http://localhost:3000/painel-analise.html`

## 9. Como testar no navegador

### 9.1. Fluxo vulnerável

1. Abra:

```txt
http://localhost:3000/login-inseguro.html
```

2. Use:
   - `usuario = aluno`;
   - `senha = 123456`;
   - `role = user`.
3. Envie o formulário.
4. Veja a resposta do servidor.

Você também pode testar adulterando diretamente o campo `role` para `admin`.

### 9.2. Fluxo protegido

1. Abra:

```txt
http://localhost:3000/login-seguro.html
```

2. Use:
   - `usuario = aluno`;
   - `senha = 123456`;
   - `role = admin`.
3. Envie o formulário.
4. Veja que o servidor retorna o privilégio real do usuário.

### 9.3. Bloqueio por tentativas

1. No fluxo protegido, digite senha incorreta.
2. Repita três vezes.
3. Tente novamente.
4. O sistema deve informar bloqueio temporário.

## 10. Como testar com Burp Suite

### 10.1. Preparação

1. Abra o Burp Suite.
2. Vá em `Proxy > Intercept`.
3. Deixe `Intercept is off` para carregar as páginas normalmente.
4. Configure o navegador para usar proxy:
   - host: `127.0.0.1`;
   - porta: `8080`.

### 10.2. Testar o fluxo vulnerável

1. Abra:

```txt
http://127.0.0.1:3000/login-inseguro.html
```

2. Deixe a página carregar.
3. Ligue `Intercept is on`.
4. Envie o formulário com:
   - `usuario = aluno`;
   - `senha = 123456`;
   - `role = user`.
5. Quando o Burp interceptar `POST /login-vulneravel`, edite o corpo:

```json
{"usuario":"aluno","senha":"123456","role":"admin"}
```

6. Clique em `Forward`.

Resultado esperado:

- o servidor aceita o privilégio adulterado.

### 10.3. Testar o fluxo protegido

1. Abra:

```txt
http://127.0.0.1:3000/login-seguro.html
```

2. Ligue `Intercept is on`.
3. Envie o formulário com:
   - `usuario = aluno`;
   - `senha = 123456`;
   - `role = admin`.
4. Quando o Burp interceptar `POST /login-seguro`, encaminhe a requisição.

Resultado esperado:

- o backend não concede `admin`;
- o servidor impõe o privilégio real do usuário.

## 11. Como testar com Wireshark

### 11.1. Preparação

1. Abra o Wireshark.
2. Escolha a interface de rede usada no teste.
3. Inicie a captura.
4. Use o filtro:

```txt
tcp.port == 3000 or tcp.port == 3443
```

### 11.2. Teste HTTP

1. Abra:

```txt
http://IP_DO_PC:3000/login-inseguro.html
```

2. Envie um login no fluxo vulnerável.
3. No Wireshark, siga o fluxo TCP (`TCP Stream`).

Resultado esperado:

- o conteúdo da requisição pode aparecer legível;
- campos como `usuario`, `senha` e `role` podem ser visualizados.

### 11.3. Teste HTTPS

1. Abra:

```txt
https://IP_DO_PC:3443/login-seguro.html
```

2. Aceite o aviso do certificado, se aparecer.
3. Faça o login.

Resultado esperado:

- os pacotes continuam existindo;
- o conteúdo não aparece em texto claro como no HTTP.

Observações importantes:

- a porta `3443` atende `HTTPS`, não `HTTP`;
- portanto, `http://IP_DO_PC:3443/...` não deve funcionar corretamente;
- use sempre `https://IP_DO_PC:3443/...`.

Se o acesso por IP não funcionar no navegador, o motivo mais comum é o certificado ter sido gerado apenas para `localhost` e `127.0.0.1`.

Nesse caso, gere novamente o certificado incluindo também o IPv4 do computador:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1 -IpAddresses @("127.0.0.1","SEU_IPv4")
```

Exemplo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1 -IpAddresses @("127.0.0.1","192.168.1.10")
```

Depois disso:

1. apague o `demo-cert.pfx` antigo, se necessário;
2. gere o novo certificado com o IP correto;
3. reinicie o servidor;
4. abra novamente:

```txt
https://IP_DO_PC:3443/login-seguro.html
```

## 12. Como testar no celular

1. Descubra o IPv4 do computador na página inicial.
2. Conecte o celular e o computador na mesma rede Wi-Fi.
3. No celular, abra:

```txt
http://IP_DO_PC:3000
```

Se quiser interceptar pelo Burp:

1. Nas configurações do Wi-Fi do celular, habilite proxy manual.
2. Use:
   - host: IP do computador;
   - porta: `8080`.
3. Abra a aplicação no celular.

Observação:

- para HTTP, isso costuma funcionar diretamente;
- para HTTPS, normalmente é necessário instalar o certificado CA do Burp no dispositivo.

## 13. Painel de evidências

Abra:

```txt
http://localhost:3000/painel-analise.html
```

O painel exibe:

- tentativas do fluxo vulnerável;
- tentativas do fluxo protegido;
- falhas;
- bloqueios;
- adulterações aceitas;
- adulterações bloqueadas;
- eventos recentes com detalhes.

## 14. Estrutura do projeto

- `server.js`
  - servidor principal da aplicação;

- `public/`
  - páginas e scripts do frontend;

- `scripts/gerar-certificado-demo.ps1`
  - script para gerar o certificado local da demo;

- `.gitignore`
  - arquivos e pastas que não devem ser enviados ao repositório.

## 15. Problemas comuns

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

### O navegador mostra “Não seguro” em `https://localhost:3443`

Isso acontece porque o certificado usado no projeto é `self-signed`.

Ou seja:

- a conexão está criptografada;
- mas o navegador não confia automaticamente no certificado, porque ele foi gerado localmente e não foi emitido por uma autoridade certificadora pública.

Para testes locais, isso é esperado.

### `https://IP_DO_PC:3443` não abre, mas `https://localhost:3443` abre

Isso normalmente acontece porque o certificado foi gerado sem incluir o IPv4 do computador.

Para corrigir:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-certificado-demo.ps1 -IpAddresses @("127.0.0.1","SEU_IPv4")
```

Depois, reinicie o servidor e teste novamente com:

```txt
https://IP_DO_PC:3443/login-seguro.html
```

### O celular não acessa o site

Verifique:

- se o celular e o computador estão na mesma rede;
- se o IP usado é o IPv4 correto do computador;
- se firewall ou antivírus não estão bloqueando a porta.
