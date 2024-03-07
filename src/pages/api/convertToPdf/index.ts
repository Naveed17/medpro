import puppeteer from 'puppeteer';
import { Readable } from 'stream';
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const htmlContent = req.body.htmlContent;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    // Generate PDF
    const pdfStream = await page.pdf();

    await browser.close();

    // Return PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
    const pdfBuffer = Buffer.from(pdfStream);
    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);
    stream.pipe(res);
}
