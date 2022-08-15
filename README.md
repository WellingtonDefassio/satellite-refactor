<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# CONTROLLER

## SATELLITE

```bash
### SEND MESSAGES @POST

responsável por receber o body com a finalidade de realizar o post de uma nova mensagem

fluxo:
-> recebe um body onde deve conter um payload: string e um deviceId: string.
-> este é recebido pelo pipe de transformação FetchDevice, caso o device exista é inserido as informações do device dentro do objeto e dado sequencia, caso o device não seja encontrado o serviço lança uma exceção.
-> em seguida o controlador recebe os dados que é validado pelo SendMessageDto, que é feito as verificações necessarias nos tipo de dados.
-> após validado é chamado o createSend Service com as informações do body.

```

```bash
### SEND MESSAGES @GET

responsavel por receber os parametros via query que será chamado no serviço.

fluxo:
-> receber os parametros via query que serão validados / transformador dentro do FindSendMessagesDto.

IMPORTANTE!!!
hoje a logica de:
limit de solicitações / padrão de limit,
maximo de dias anteriores permitidos da solicitação.
está contido dentro desta classe. (criado uma issues para este.)

-> após validado dados pe chamado o service para retorno do parametro.

```

```bash
### EMITTED MESSAGES

responsavel por receber os parametros via query que será chamado no serviço.

fluxo:
-> receber os parametros via query que serão validados / transformador dentro do FindEmittedMessagesDto.

IMPORTANTE!!!
hoje a logica de:
limit de solicitações / padrão de limit,
maximo de dias anteriores permitidos da solicitação.
está contido dentro desta classe. (criado uma issues para este.)

-> após validado dados pe chamado o service para retorno do parametro.

```

# SERVIÇOS

## SATELLITE

```bash

### CREATE-SEND-MESSAGES

serviço responsavel por criar uma mensagem no banco de dados.

fluxo:
-> é recebido via controller um body contendo um deviceId, payload, e um objeto device: que contem id deviceId e status.
-> esta mensagem é persistida no banco e vinculado a um device pré existente na tabela device, IMPORTANTE!! é esperado que a tabela device seja fornecido por outro serviço, no momento foi criado uma tabela para o mesmo.
-> obs: todas as mensagens cadastradas recebem como padrão o status CREATED, para que seja recebida por outros serviços.

```

```bash
### GET-SENDED-MESSAGES

fluxo:
-> é recebido via controller os possiveis parametros (id, status, deviceId, limit, startDate ou ids)
id: busca um id individualmente.
deviceId: busca pelo mensagens de um device especifico.
status: busca pelo status da mensagem
startDate: data inicial da consulta. (data limit de consulta atual é 7 dias, pode ser alterado)
limit: o numero retornado da api, padrão atual 100, max 500 (parametros podem ser alterados)
ids: busca varios ids de uma vez padrão do paremetro 1,2,3,4,5.

-> caso não exista o parametro ids o serviço considerara uma consulta em lote, retornando os dados de acordo com os outros parametros com limite de 500 mensagens e fornecendo o paramentro nextUtc, usado para pegar outro lote dos mesmo paramentros com novas informações.

-> caso seja fornecido o parametro ids será feito uma busca individual para cara um dos ids, sendo retornado apenas uma lista contendo os objetos encontrados.


```

```bash

### GET-EMITTED-MESSAGES

fluxo:
-> é recebido via controller os possiveis parametros (limit, device, startDate, messageSize)

limit: o numero retornado da api, padrão atual 100, max 500 (parametros podem ser alterados)
startDate: data inicial da consulta. (data limit de consulta atual é 7 dias, pode ser alterado)
deviceId: busca pelo mensagens de um device especifico.
messageSize: representa o valor minimo do message size a ser encontrado.

-> caso não seja encontrado uma mensagem com os parametros informador é retornado um array vazio.

-> caso seja encontrado é feito o tratamento das mensagens e retornado via body.

obs: o serviço já implementa a logica de verificar se os ultimos resultado fornecidos possuem a mesma data, assim excluindo esses e devolvendo no proximo lote.

```

## ORBCOMM

```bash
### EMITTED-MESSAGES

serviço responsável por capturar todas as mensagens emitidas pelos aparelhos que usam o serviço da orbcomm.

fluxo:
-> é obtido o ultimo registro na tabela orbcommDownloadParamControl coluna nextMessage, parametro usado para consulta na api do cliente.

-> é realizada uma chamada na api do cliente onde o parametro nextMessage é enviado, em resposta é espero o retorno das 500 proximas mensagens emitidas e o parametro nextMessage e um parametro ErrorID = 0;

-> é validado a resposta da api do cliente e caso seja diferente da esperada é lançado um Erro.

-> é chamado o metodo createManyMessages, este irá criar na tabela Satellites um registro para cada mensagem, e 8 registros na tabela especificos já que para cada mensagem da orbcomm é devolvido 8 valores espeficos do serviço!

-> dentro do metodo upsertMobileVersion é realizado um filtro no retorno da api que mantem apenas as mensagens com o atributo 'Payload', este é usado para atualizar as versoes do equipamentos, atualiza valores existentes e cria caso não exista, chave unica de referencia 'DeviceID'

-> após é chamado o createNextUtcParam que é responsavel por persistir a proxima nextMessage que será chamada na proxima execução do serviço.

-> em caso de erros é persistido na tabela LogError 'usado apenas para o serviço da orbcomm' a mensagem do erro, e o serviço 'EMITTED_MESSAGES'

realizado teste de integração.

```

```bash

### SEND-MESSAGES

serviço responsavel por coletar mensagens destinadas a um device e enviar para a api da orbcomm.

fluxo:
-> é coletado no banco de dados todas as mensagens com o status CREATED (indica que a mensagem ainda não foi processada) e que o device atrelado a mensagem seja do serviço ORBCOMM_V2, caso não haja mensagem é lançado um exceção e o ciclo do serviço é interrompido. obs: no momento o serviço captura todas as mensagens, porem é possivel inserir o parametro take dentro da pesquisa para limitar o numero de mensagens que será enviado para serviço de satellite. após o termino do serviço o status das mensagens será alterado e elas não serão coletadas novamente.

-> é chamado o metodo formatMessageToPost este serviço é responsavel por formatar as mensagens retornadas no formato aceito pela api da ORBCOMM, IMPORTANTE!!: hoje as credenciais estão hardcode dentro do metodo, podem substituida por uma varivael de ambiente .env.

-> é chamado o metodo postApiOrbcomm responsavel por realizar o post das mensagens no serviço orbcomm.

-> o retorno deste post é validado pelo metodo validateApiReturn, caso a resposta seja diferente da esperada é lançada uma exceção e o ciclo do serviço é interrompido.

-> por fim é chamado o updateMessageStatus onde é fornecido o array de resposta Submissions da api, este é responsavel por atualizar o status da mensagem para SUBMITTED e criar os valores na tabela specificValues os atributos fwrdID e status, que são atributos especificos do serviço.

-> em caso de erros é persistido na tabela LogError 'usado apenas para o serviço da orbcomm' a mensagem do erro, e o serviço 'SEND_MESSAGES'

```

```bash

### CHECK-MESSAGES

serviço responsavel por verificar o status da mensagem enviada ao serviço de satellite orbcomm, até a resposta do mesmo.

-> é coletado no bando todas as mensagens que possuem o status SUBMITTED e o device atrelado o serviço ORBCOMM_V2, caso não haja mensagens é lançado um exceção e o serviço é interrompido.

-> encima das mensagens filtradas é realizado uma formatação onde é criado um objeto com os atributos id e fwrdIdValue e retornado.

-> após isso uma nova formatação é realizada esta para atender o solicitado pela api orbcomm, onde é enviado o id, senha e as fwids messages que desejamos consultar. IMPORTANTE!!: hoje as credenciais estão hardcode dentro do metodo, podem substituida por uma varivael de ambiente .env.

-> o valor retornado pela api é submetido a ao metodo validateResponse onde caso a mensagem não devolva o valor esperado é lançado uma exceção e o cliclo é interrompido.

-> com o retorno correto da api é chamado o metodo addIdInResponse ele é responsavel por pegar a lista de objetos retornado pela api identificar qual possui a propriedade ForwardMessageID igual a fwrdIdValue enviada e acrescentar o id(banco de dados) no body.

-> por fim para cada mensagem retornada em que o State (codigo do status) que seja diferente de zero será atualizado no banco com seu novo status, e o valor especifico orbcomm status também será atualizado.

```
