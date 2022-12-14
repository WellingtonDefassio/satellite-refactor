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

- Author - [Kamil My??liwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# CONTROLLER

## SATELLITE

```bash
### SEND MESSAGES @POST

respons??vel por receber o body com a finalidade de realizar o post de uma nova mensagem

fluxo:
-> recebe um body onde deve conter um payload: string e um deviceId: string.
-> este ?? recebido pelo pipe de transforma????o FetchDevice, caso o device exista ?? inserido as informa????es do device dentro do objeto e dado sequencia, caso o device n??o seja encontrado o servi??o lan??a uma exce????o.
-> em seguida o controlador recebe os dados que ?? validado pelo SendMessageDto, que ?? feito as verifica????es necessarias nos tipo de dados.
-> ap??s validado ?? chamado o createSend Service com as informa????es do body.

```

```bash
### SEND MESSAGES @GET

responsavel por receber os parametros via query que ser?? chamado no servi??o.

fluxo:
-> receber os parametros via query que ser??o validados / transformador dentro do FindSendMessagesDto.

IMPORTANTE!!!
hoje a logica de:
limit de solicita????es / padr??o de limit,
maximo de dias anteriores permitidos da solicita????o.
est?? contido dentro desta classe. (criado uma issues para este.)

-> ap??s validado dados pe chamado o service para retorno do parametro.

```

```bash
### EMITTED MESSAGES

responsavel por receber os parametros via query que ser?? chamado no servi??o.

fluxo:
-> receber os parametros via query que ser??o validados / transformador dentro do FindEmittedMessagesDto.

IMPORTANTE!!!
hoje a logica de:
limit de solicita????es / padr??o de limit,
maximo de dias anteriores permitidos da solicita????o.
est?? contido dentro desta classe. (criado uma issues para este.)

-> ap??s validado dados pe chamado o service para retorno do parametro.

```

# SERVI??OS

## SATELLITE

```bash

### CREATE-SEND-MESSAGES

servi??o responsavel por criar uma mensagem no banco de dados.

fluxo:
-> ?? recebido via controller um body contendo um deviceId, payload, e um objeto device: que contem id deviceId e status.
-> esta mensagem ?? persistida no banco e vinculado a um device pr?? existente na tabela device, IMPORTANTE!! ?? esperado que a tabela device seja fornecido por outro servi??o, no momento foi criado uma tabela para o mesmo.
-> obs: todas as mensagens cadastradas recebem como padr??o o status CREATED, para que seja recebida por outros servi??os.

```

```bash
### GET-SENDED-MESSAGES

fluxo:
-> ?? recebido via controller os possiveis parametros (id, status, deviceId, limit, startDate ou ids)
id: busca um id individualmente.
deviceId: busca pelo mensagens de um device especifico.
status: busca pelo status da mensagem
startDate: data inicial da consulta. (data limit de consulta atual ?? 7 dias, pode ser alterado)
limit: o numero retornado da api, padr??o atual 100, max 500 (parametros podem ser alterados)
ids: busca varios ids de uma vez padr??o do paremetro 1,2,3,4,5.

-> caso n??o exista o parametro ids o servi??o considerara uma consulta em lote, retornando os dados de acordo com os outros parametros com limite de 500 mensagens e fornecendo o paramentro nextUtc, usado para pegar outro lote dos mesmo paramentros com novas informa????es.

-> caso seja fornecido o parametro ids ser?? feito uma busca individual para cara um dos ids, sendo retornado apenas uma lista contendo os objetos encontrados.


```

```bash

### GET-EMITTED-MESSAGES

fluxo:
-> ?? recebido via controller os possiveis parametros (limit, device, startDate, messageSize)

limit: o numero retornado da api, padr??o atual 100, max 500 (parametros podem ser alterados)
startDate: data inicial da consulta. (data limit de consulta atual ?? 7 dias, pode ser alterado)
deviceId: busca pelo mensagens de um device especifico.
messageSize: representa o valor minimo do message size a ser encontrado.

-> caso n??o seja encontrado uma mensagem com os parametros informador ?? retornado um array vazio.

-> caso seja encontrado ?? feito o tratamento das mensagens e retornado via body.

obs: o servi??o j?? implementa a logica de verificar se os ultimos resultado fornecidos possuem a mesma data, assim excluindo esses e devolvendo no proximo lote.

```

## ORBCOMM

```bash
### EMITTED-MESSAGES

servi??o respons??vel por capturar todas as mensagens emitidas pelos aparelhos que usam o servi??o da orbcomm.

fluxo:
-> ?? obtido o ultimo registro na tabela orbcommDownloadParamControl coluna nextMessage, parametro usado para consulta na api do cliente.

-> ?? realizada uma chamada na api do cliente onde o parametro nextMessage ?? enviado, em resposta ?? espero o retorno das 500 proximas mensagens emitidas e o parametro nextMessage e um parametro ErrorID = 0;

-> ?? validado a resposta da api do cliente e caso seja diferente da esperada ?? lan??ado um Erro.

-> ?? chamado o metodo createManyMessages, este ir?? criar na tabela Satellites um registro para cada mensagem, e 8 registros na tabela especificos j?? que para cada mensagem da orbcomm ?? devolvido 8 valores espeficos do servi??o!

-> dentro do metodo upsertMobileVersion ?? realizado um filtro no retorno da api que mantem apenas as mensagens com o atributo 'Payload', este ?? usado para atualizar as versoes do equipamentos, atualiza valores existentes e cria caso n??o exista, chave unica de referencia 'DeviceID'

-> ap??s ?? chamado o createNextUtcParam que ?? responsavel por persistir a proxima nextMessage que ser?? chamada na proxima execu????o do servi??o.

-> em caso de erros ?? persistido na tabela LogError 'usado apenas para o servi??o da orbcomm' a mensagem do erro, e o servi??o 'EMITTED_MESSAGES'

realizado teste de integra????o.

```

```bash

### SEND-MESSAGES

servi??o responsavel por coletar mensagens destinadas a um device e enviar para a api da orbcomm.

fluxo:
-> ?? coletado no banco de dados todas as mensagens com o status CREATED (indica que a mensagem ainda n??o foi processada) e que o device atrelado a mensagem seja do servi??o ORBCOMM_V2, caso n??o haja mensagem ?? lan??ado um exce????o e o ciclo do servi??o ?? interrompido. obs: no momento o servi??o captura todas as mensagens, porem ?? possivel inserir o parametro take dentro da pesquisa para limitar o numero de mensagens que ser?? enviado para servi??o de satellite. ap??s o termino do servi??o o status das mensagens ser?? alterado e elas n??o ser??o coletadas novamente.

-> ?? chamado o metodo formatMessageToPost este servi??o ?? responsavel por formatar as mensagens retornadas no formato aceito pela api da ORBCOMM, IMPORTANTE!!: hoje as credenciais est??o hardcode dentro do metodo, podem substituida por uma varivael de ambiente .env.

-> ?? chamado o metodo postApiOrbcomm responsavel por realizar o post das mensagens no servi??o orbcomm.

-> o retorno deste post ?? validado pelo metodo validateApiReturn, caso a resposta seja diferente da esperada ?? lan??ada uma exce????o e o ciclo do servi??o ?? interrompido.

-> por fim ?? chamado o updateMessageStatus onde ?? fornecido o array de resposta Submissions da api, este ?? responsavel por atualizar o status da mensagem para SUBMITTED e criar os valores na tabela specificValues os atributos fwrdID e status, que s??o atributos especificos do servi??o.

-> em caso de erros ?? persistido na tabela LogError 'usado apenas para o servi??o da orbcomm' a mensagem do erro, e o servi??o 'SEND_MESSAGES'

```

```bash

### CHECK-MESSAGES

servi??o responsavel por verificar o status da mensagem enviada ao servi??o de satellite orbcomm, at?? a resposta do mesmo.

-> ?? coletado no bando todas as mensagens que possuem o status SUBMITTED e o device atrelado o servi??o ORBCOMM_V2, caso n??o haja mensagens ?? lan??ado um exce????o e o servi??o ?? interrompido.

-> encima das mensagens filtradas ?? realizado uma formata????o onde ?? criado um objeto com os atributos id e fwrdIdValue e retornado.

-> ap??s isso uma nova formata????o ?? realizada esta para atender o solicitado pela api orbcomm, onde ?? enviado o id, senha e as fwids messages que desejamos consultar. IMPORTANTE!!: hoje as credenciais est??o hardcode dentro do metodo, podem substituida por uma varivael de ambiente .env.

-> o valor retornado pela api ?? submetido a ao metodo validateResponse onde caso a mensagem n??o devolva o valor esperado ?? lan??ado uma exce????o e o cliclo ?? interrompido.

-> com o retorno correto da api ?? chamado o metodo addIdInResponse ele ?? responsavel por pegar a lista de objetos retornado pela api identificar qual possui a propriedade ForwardMessageID igual a fwrdIdValue enviada e acrescentar o id(banco de dados) no body.

-> por fim para cada mensagem retornada em que o State (codigo do status) que seja diferente de zero ser?? atualizado no banco com seu novo status, e o valor especifico orbcomm status tamb??m ser?? atualizado.

```
