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

    // Foto — página única (índice 0)
    if (fotoUrl) {
        const fotoBytes = await fetch(fotoUrl).then((r) => r.arrayBuffer());
        const foto = await pdfDoc.embedJpg(fotoBytes).catch(() => pdfDoc.embedPng(fotoBytes));
        const page0 = pdfDoc.getPage(0);
        page0.drawImage(foto, {
            x: 396.70,
            y: PAGE_H - 45.40 - 102,   // = 694.49
            width: 90.75,
            height: 102,
        });
    }

    // Assinatura — mesma página (índice 0)
    if (assinaturaUrl) {
        const assinBytes = await fetch(assinaturaUrl).then((r) => r.arrayBuffer());
        const assinatura = await pdfDoc.embedPng(assinBytes);
        const page0b = pdfDoc.getPage(0);
        page0b.drawImage(assinatura, {
            x: 210,
            y: PAGE_H - 731 - 10,     // = 100.89
            width: 235,
            height: 10,
        });
    }

    const finalPdf = await pdfDoc.save();
    res.set('Content-Type', 'application/pdf');
    res.send(Buffer.from(finalPdf));
});

app.listen(process.env.PORT || 3000);