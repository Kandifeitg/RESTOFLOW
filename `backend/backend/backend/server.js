```js
customer
});
res.json(data);
} catch(e){ res.status(500).json({ error: e.message }); }
});
});


// --- CALLBACK (webhook) CINETPAY → marquer payé et générer reçu ---
app.post('/api/payments/confirm', (req, res) => {
const { order_id, provider, method, amount, tx_ref, tx_id } = req.body;
const paid_at = new Date().toISOString();
db.run(`INSERT INTO payments(order_id, provider, method, amount, status, tx_ref, tx_id, paid_at)
VALUES(?,?,?,?,?,?,?,?)`,
[order_id, provider||'cinetpay', method||'mobile_money', amount, 'paid', tx_ref||null, tx_id||null, paid_at], function(err){
if (err) return res.status(400).json({ error: err.message });


// Générer PDF
const receiptsDir = path.join(__dirname, 'receipts');
if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir);
const pdfPath = path.join(receiptsDir, `receipt_${order_id}.pdf`);
const doc = new PDFDocument({ size: 'A4', margin: 40 });
const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);


// En-tête
doc.fontSize(20).fillColor('#27AE60').text('RestoFlow – Reçu de paiement', { align: 'center' });
doc.moveDown();


db.get(`SELECT * FROM orders WHERE id = ?`, [order_id], (e, order) => {
if (!order) { doc.text('Commande introuvable').end(); return; }
doc.fillColor('#000').fontSize(12);
doc.text(`Commande #${order.id}`);
doc.text(`Date : ${new Date(order.created_at).toLocaleString()}`);
doc.text(`Table/Livraison : ${order.table_no || '—'}`);
doc.text(`Total : ${order.total} XOF`);
doc.moveDown();
doc.text('Détails :');
db.all(`SELECT * FROM order_items WHERE order_id = ?`, [order_id], (e2, items) => {
items.forEach(it => doc.text(`- ${it.item_title} x${it.qty} = ${it.line_total} XOF`));
doc.moveDown();
doc.fillColor('#FF2E6D').text(`Paiement: ${amount} XOF via ${method || 'N/A'}`);
doc.fillColor('#000').text(`Transaction: ${tx_id || 'N/A'}`);
doc.end();
});
});


stream.on('finish', () => res.json({ receipt_url: `/receipts/${path.basename(pdfPath)}` }));
});
});


// --- ABONNEMENTS ---
app.post('/api/subscriptions', (req, res) => {
const { owner_id, plan, start_at, end_at, status } = req.body;
db.run(`INSERT INTO subscriptions(owner_id, plan, start_at, end_at, status) VALUES(?,?,?,?,?)`,
[owner_id, plan, start_at, end_at, status], function(err){
if (err) return res.status(400).json({ error: err.message });
res.json({ id: this.lastID });
});
});


app.listen(PORT, () => console.log(`RestoFlow – API locale & UI: http://localhost:${PORT}`));
```
