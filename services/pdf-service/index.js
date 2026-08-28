import express from 'express';
import libre from 'libreoffice-convert';
import { PDFDocument } from 'pdf-lib';
import { promisify } from 'util';

const PAGE_H = 841.89;

const convertAsync = promisify(libre.convert);
const app = express();
app.use(express.raw({ type: '*/*', limit: '20mb' }));

app.post('/gerar-pdf', async (req, res) => {
    const { docxBase64, fotoUrl, assinaturaUrl } = JSON.parse(req.body.toString());

    // 1. docx -> pdf
    const docxBuf = Buffer.from(docxBase64, 'base64');
    const pdfBuf = await convertAsync(docxBuf, '.pdf', undefined);

    // 2. sobrepor foto e assinatura
    const pdfDoc = await PDFDocument.load(pdfBuf);
    const page = pdfDoc.getPage(0);

    // Foto — página 1 (índice 0)
    if (fotoUrl) {
        const fotoBytes = await fetch(fotoUrl).then((r) => r.arrayBuffer());
        const foto = await pdfDoc.embedJpg(fotoBytes).catch(() => pdfDoc.embedPng(fotoBytes));
        const page0 = pdfDoc.getPage(0);
        page0.drawImage(foto, {
            x: 449.95,
            y: PAGE_H - 93.75 - 102,   // = 646.14
            width: 90.75,
            height: 102,
        });
    }

    // Assinatura — página 2 (índice 1)
    if (assinaturaUrl) {
        const assinBytes = await fetch(assinaturaUrl).then((r) => r.arrayBuffer());
        const assinatura = await pdfDoc.embedPng(assinBytes);
        const page1 = pdfDoc.getPage(1);
        page1.drawImage(assinatura, {
            x: 209.2,
            y: PAGE_H - 261 - 21,     // = 559.89
            width: 210,
            height: 21,
        });
    }

    const finalPdf = await pdfDoc.save();
    res.set('Content-Type', 'application/pdf');
    res.send(Buffer.from(finalPdf));
});

app.listen(process.env.PORT || 3000);