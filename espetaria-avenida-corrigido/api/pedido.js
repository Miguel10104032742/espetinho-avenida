// Função serverless da Vercel: recebe o pedido do site e envia por e-mail (Resend).
const clean = (s, n) => String(s || "").replace(/[\r\n]+/g, " ").trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  const { RESEND_API_KEY, EMAIL_TO, EMAIL_FROM, ALLOWED_ORIGIN } = process.env;
  if (!RESEND_API_KEY || !EMAIL_TO || !EMAIL_FROM) return res.status(500).json({ ok: false, erro: "configuracao" });
  if (ALLOWED_ORIGIN && req.headers.origin && req.headers.origin !== ALLOWED_ORIGIN) return res.status(403).json({ ok: false });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = null; } }
  if (!b || typeof b !== "object") return res.status(400).json({ ok: false });
  if (b.site) return res.status(200).json({ ok: true }); // campo-armadilha contra robôs

  const texto = String(b.texto || "");
  const cliente = clean(b.cliente, 60), telefone = clean(b.telefone, 30), modalidade = clean(b.modalidade, 20);
  if (texto.length < 30 || texto.length > 6000 || !cliente || telefone.replace(/\D/g, "").length < 10)
    return res.status(400).json({ ok: false });

  let r;
  try {
  r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: EMAIL_TO.split(",").map((s) => s.trim()),
      subject: `Novo pedido (${modalidade || "-"}) - ${cliente}`,
      text: `${texto}\n\n---\nPedido recebido pelo site. Confirme valores, taxa de entrega e prazo com o cliente: ${telefone}`,
    }),
  });
  } catch (e) { console.error("Resend rede", e); return res.status(502).json({ ok: false }); }
  if (!r.ok) { console.error("Resend", r.status, await r.text()); return res.status(502).json({ ok: false }); }
  return res.status(200).json({ ok: true });
};
