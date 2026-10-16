# Espetaria Avenida — site com pedido por e-mail (Vercel)

Estrutura: `index.html` (site) e `api/pedido.js` (função que envia o pedido por e-mail). Não precisa de build nem de dependências.

## Configurar o e-mail (Resend)
1. Crie uma conta em resend.com e gere uma chave de API.
2. Para testar, use o remetente de teste do Resend (`onboarding@resend.dev`), que costuma entregar só para o e-mail da sua própria conta. Para a loja receber em outro e-mail, verifique um domínio no Resend e use um remetente desse domínio (confira a documentação atual).

## Publicar na Vercel
1. Envie esta pasta para um repositório do GitHub e importe na Vercel (ou use `vercel` no terminal dentro da pasta).
2. Em Settings > Environment Variables, crie:
   - `RESEND_API_KEY`: a chave do Resend.
   - `EMAIL_TO`: e-mail que recebe os pedidos (pode separar vários por vírgula).
   - `EMAIL_FROM`: remetente, ex.: `Pedidos Espetaria <pedidos@seudominio.com.br>`.
   - `ALLOWED_ORIGIN` (opcional): endereço do site, ex.: `https://seusite.vercel.app`.
3. Faça um novo deploy depois de criar as variáveis.

## Antes de divulgar
- Troque o número de teste de WhatsApp (campo `whatsapp` no início do script do `index.html`).
- Faça um pedido de teste e confira se o e-mail chegou (olhe também o spam).
- Os valores são calculados no navegador do cliente. A equipe deve sempre conferir o pedido antes de confirmar.
