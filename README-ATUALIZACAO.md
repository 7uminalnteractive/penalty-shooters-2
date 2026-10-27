# Penalty Shooters — interface e carreira

Extraia este pacote **na raiz do projeto original**, substituindo os arquivos com o mesmo nome. O ZIP contém apenas arquivos novos ou alterados; os arquivos originais de imagens, áudio, Construct e WebAssembly continuam necessários.

Abra `index.html` por um servidor HTTP (o mesmo GitHub Pages ou hospedagem do projeto serve). Abrir por `file://` não funciona, porque o jogo carrega JSON, módulos e WebAssembly. Para desenvolvimento com Node: `npm run dev` e abra a porta 4173.

## Implementado

- Interface em português, com painéis escuros, transparência discreta, menus responsivos e destaque verde.
- Início com campeonato rápido, nova carreira, carregar carreira e carreira ao vivo.
- Campeonato rápido com 32 clubes reais: oito grupos de quatro, dois classificados por grupo e mata-mata até a final.
- Carreira brasileira com os 20 clubes da Série A, calendário de 38 rodadas, 380 partidas, resultados dos outros clubes e classificação.
- Copa do Brasil e competição continental conforme participação encontrada na base; mata-mata em formato adaptado para o jogo, sem reproduzir o regulamento integral da vida real.
- Mercado com compra e venda, orçamento fictício, manutenção de elenco mínimo e notícias geradas pelas decisões.
- Troca direta de clube pelo treinador dentro da temporada. Não há negociação contratual nem propostas automáticas.
- Seleção e ordenação dos batedores, com nomes e números fornecidos pela fonte de elencos.
- Salvamento automático, até seis carreiras, exportação e importação JSON.
- Placar inspirado na referência enviada: nomes em azul, centro e laterais verde-limão, escudos reais e círculos numerados para gols/perdas.
- Menu de pausa, retorno à partida, áudio e saída sem registrar um resultado incompleto.
- Ponte com o motor Construct existente. Conversão explícita entre resultado do jogador/CPU e mandante/visitante.
- Escudos incluídos como arquivos locais. Dados de clubes e elencos consultados na ESPN em 26/10/2026.

## Limitações desta entrega

Esta é uma implementação da interface e da base de carreira, não uma reconstrução integral de um jogo como EA Sports FC.

- O motor, as animações, os jogadores, o campo e as placas publicitárias continuam sendo os do jogo original. A opção visual completa aplica ajustes leves de cor e contraste.
- As cores de uniformes foram remapeadas para os clubes; camisas oficiais de 2026, patrocinadores e estampas precisam de novos assets. Os clubes extras/estrangeiros ainda usam modelos genéricos.
- A carreira ao vivo importa somente o Brasileirão: classificação, resultados, próximos jogos e elencos. Copas e continentais ao vivo não estão integradas.
- A importação ao vivo exige rede e resposta válida da ESPN. Não há chave de API nem servidor externo configurado. Restrições CORS, indisponibilidade ou mudanças no serviço podem impedir a importação; nesse caso o jogo mostra o erro e não fabrica um cenário real.
- Calendários da carreira normal, finanças, valores de jogadores e notícias são simulados. Os valores não são estimativas de mercado da vida real.
- Os elencos reproduzem a resposta da fonte, que pode conter reservas, base e registros ainda não atualizados de transferências. Não se afirma revisão individual de todos os atletas.
- Clubes estrangeiros nas copas têm nome e escudo, mas não elenco completo.
- A escolha dos batedores define os nomes e a sequência; ainda não há atributos individuais que alterem a física das cobranças.
- Não há rebaixamento, promoção entre divisões, contratos, salários, lesões, evolução individual ou salvamento de uma cobrança em andamento.
- Jogos reais adiados sem nova data ficam sinalizados e não são inventados. A temporada ao vivo não pode ser encerrada enquanto houver essas pendências na importação.
- Ao começar a próxima temporada, a liga e a copa nacional são recriadas. A reclassificação continental entre temporadas ainda não está implementada.
- O editor antigo continua disponível, mas edita a base legada; não altera retroativamente os elencos das carreiras já salvas.

## Verificação

Foram executados testes automatizados da lógica do calendário, classificação, compras, orçamento, troca de treinador, importação, temporada completa, campeonato rápido e conservação de resultados históricos. A ponte do Construct foi testada com um runtime simulado, incluindo início, pausa e resultado como mandante/visitante.

**Não houve validação visual nem partida completa no navegador real:** a ferramenta de navegador bloqueou o acesso à prévia. Assim, a integração gráfica e o comportamento em celulares reais ainda precisam de teste. A verificação com runtime simulado não equivale a jogar no motor real.

Para repetir os testes:

```sh
node tests/career-core.test.mjs
node tests/engine-bridge.test.cjs
node tests/live-data.test.mjs
```

## Fontes de dados

- Participantes da Série A: https://www.cbf.com.br/futebol-brasileiro/times/campeonato-brasileiro/serie-a/2026
- Clubes ESPN: https://site.api.espn.com/apis/site/v2/sports/soccer/bra.1/teams?limit=100
- Elencos: `https://site.api.espn.com/apis/site/v2/sports/soccer/bra.1/teams/{id}/roster`
- Escudos: URLs de `a.espncdn.com` retornadas pela fonte.
- Clubes continentais: endpoints `conmebol.libertadores` e `conmebol.sudamericana`.
- A origem dos dados não implica vínculo, patrocínio ou autorização comercial dos clubes.

## Organização

- `index.html`, `interface.css`, `interface.js`: nova interface.
- `game.html`: entrada isolada do jogo original.
- `engine-bridge.js`: comunicação com o Construct.
- `career-core.mjs`: regras e estado da simulação.
- `live-data.mjs`: importação de cenário real.
- `clubs.json`, `competitions.json`: clubes, elencos, cores e participantes.
- `teams_br2.json`: nomes, siglas e cores atualizados da base legada.
- `assets/crests/`: escudos locais.
- `package.json`, `server.cjs`: servidor de desenvolvimento opcional.
- `tests/`: testes executáveis com Node.

Os arquivos `data.json`, `scripts/c3runtime.js`, `scripts/main.js` e `ps2-mod.js` não foram modificados. O ZIP pode ser aplicado sobre a cópia original enviada.
