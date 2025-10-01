import { Utils } from 'src/common/utils/utils';
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { BordereauLivraisonEntity } from 'src/modules/bordereau-livraison/bordereau-livraison.entity';
import { BarcodeService } from '../code_barre/code_barre.service';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { DetailColisEntity } from 'src/modules/colis/detail-colis.entity';

@Injectable()
export class PdfService {

    async generatePDF(): Promise<Buffer> {
        const pdfBuffer: Buffer = await new Promise(resolve => {
            const doc = new PDFDocument({
                size: 'LETTER',
                bufferPages: true,
            });

            doc.text('Hello World', 100, 50);
            doc.end();

            const buffer = [];
            doc.on('data', buffer.push.bind(buffer))
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            })
        });

        return pdfBuffer;
    }

    async generateBonLivraison(bl: BordereauLivraisonEntity): Promise<Buffer> {
        const font = "Times-Roman";
        const fontBold = "Times-Bold";
        const fontParagraphSize = 20;
        const fontColorParagraphSize = '#333333';

        const pdfBuffer: Buffer = await new Promise(resolve => {
            const doc = new PDFDocument({ margin: 50 });

            // Title
            doc.font(font)
            .fontSize(fontParagraphSize)
            .fillColor(fontColorParagraphSize)
            .text("BORDEREAU DE LIVRAISON", 50, 50);

            // Logo
            const filePath = 'uploads/images/logo.png';
            this.setLogoToRight(doc, filePath);

            this.horizontalLine(doc);

            // Company + Destinataire
            this.companyInformation(bl, doc, fontBold, font);
            this.destinataireInformation(bl, doc, fontBold, font);

            // Table (auto-break)
            this.tableauProduit(bl, doc);

            // Signature
            this.signature(bl, doc, fontBold, font, doc.y + 30);

            // 👉 Barcode at the end of the LAST page
            this.barCode(doc, bl);

            // Finalize
            doc.end();

            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            });
        });

        return pdfBuffer;
    }


    private setLogoToRight(doc: PDFKit.PDFDocument, filePath: string){
        // - margin is 50, 
        const pageWidth = doc.page.width; //- doc.page.width gives the page width
        const logoWidth = 30; //logo width is 100
        const logoX = pageWidth - doc.page.margins.right - logoWidth; // right-aligned
        const logoY = 50;
        // - First argument: path to the image file
        // - Second and third: x and y coordinates
        // - Options: width (height adjusts automatically to maintain aspect ratio)
        doc.image(filePath, logoX, logoY, { width: logoWidth });
    }

    private companyInformation(
        bl:BordereauLivraisonEntity,
        doc: PDFKit.PDFDocument, 
        fontBold: string, 
        fontNormal: string
    ){
        const fontSize = 12;
        const titlefontSize = 14;
        doc
            .font(fontBold)
            .fontSize(titlefontSize)
            .text(bl.nom_expediteur, 50, 120)

        doc.font(fontNormal)
            .fontSize(fontSize)
            .text(bl.adresse_expediteur)
            .text("Numero de telephone: " + bl.contact_expediteur)
    }

    private destinataireInformation(
        bl:BordereauLivraisonEntity,
        doc: PDFKit.PDFDocument, 
        fontBold: string, 
        fontNormal: string
    ){
        const fontSize = 12;
        const titlefontSize = 14;
        doc
            .font(fontNormal)
            .fontSize(fontSize)
            .text('Bordereau de livraison N°: ' + bl.id, 50, 180,)
            .text('Date: ' + bl.date_bordereau)
            .text('Date livraison: ' + bl.date_livraison)
            .text('Livreur: ');

        doc.font(fontBold)
            .fontSize(fontSize)
            .text('DESTINTAIRE', 50, 180,{align: "right"});

        doc
            .font(fontBold)
            .fontSize(fontSize)
            .text(bl.nom_destinataire, {align: "right"})
            .font(fontNormal)
            .text(bl.adresse_destinataire, {align: "right"})
        
        if(bl.contact_destinataire && bl.contact_destinataire !== ''){
            doc.text("Numero de telephone: " + (bl.contact_destinataire?? '---'), {align: "right"})
        }
    }

    private signature(
        bl:BordereauLivraisonEntity,
        doc: PDFKit.PDFDocument, 
        fontBold: string, 
        fontNormal: string,
        startY: number
    ){
        const fontSize = 12;
        const docWith = doc.page.width;

        doc
            .font(fontBold)
            .fontSize(fontSize)
            .text('Client:', 50, startY)
            .font(fontNormal)
            .text('Reçu le: ', 50, startY + 20)
            .text('Signature: ', 50 ,startY + 40);

        doc
            .font(fontBold)
            .fontSize(fontSize)
            .text('Expediteur:', docWith - 200, startY)
            .font(fontNormal)
            .text('Livré le: ', docWith - 200, startY + 20);
    }

    private async barCode(doc: PDFKit.PDFDocument, bl: BordereauLivraisonEntity) {
        const buffer = BarcodeService.generateBarcodeImage(bl.ordre_livraison.id.toString());

        const unlinkAsync = util.promisify(fs.unlink);
        // 1. Define where to store the barcode image
        const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'images');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const barcodeFilePath = path.join(uploadsDir, `barcode-${bl.id}.png`);
        fs.writeFileSync(barcodeFilePath, buffer);

        // 2. Generate barcode and save as PNG file
        BarcodeService.generateBarcodeImage(bl.id.toString(), barcodeFilePath);

        // 3. Insert the PNG into the PDF
        const pageHeight = doc.page.height;
        const barcodeWidth = 100; // adjust size
        const barcodeHeight = 100; // adjust size
        const barcodeX = doc.page.width - doc.page.margins.right - barcodeWidth;
        const barcodeY = pageHeight - doc.page.margins.bottom - barcodeHeight;

        doc.image(barcodeFilePath, barcodeX, barcodeY, {width: barcodeWidth, height: barcodeHeight});

        // 4. Delete the file after insertion
        await unlinkAsync(barcodeFilePath);
    }

    private tableauProduit(bl: BordereauLivraisonEntity, doc: PDFKit.PDFDocument) {
        const startX = 50;
        let startY = doc.y + 40; // start below previous content
        const rowHeight = 20;
        const colWidths = [100, 250, 60, 100];
        const headers = ['Ref.Produit', 'Description', 'Poids', 'Valeur'];

        // Table title
        doc.font('Times-Bold').text('Contenu:', startX, startY - 20);

        // Header row
        doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), rowHeight)
        .fill('#eeeeee');
        let x = startX;
        headers.forEach((header, i) => {
            doc.fillColor('#000000')
            .font('Helvetica-Bold')
            .fontSize(12)
            .text(header, x + 5, startY + 5, { width: colWidths[i] - 10, align: i >= 2 ? 'right' : 'left' });
            x += colWidths[i];
        });

        startY += rowHeight;

        // Rows
        this.getProduits(bl).forEach((product, rowIndex) => {
                // ✅ Check page space
                if (startY + rowHeight > doc.page.height - doc.page.margins.bottom - 100) {
                    doc.addPage();
                    startY = doc.y;
                }
    
                // Alternating background
                if (rowIndex % 2 === 0) {
                    doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), rowHeight)
                    .fill('#f9f9f9');
                }
    
                // Row cells
                x = startX;
                const row = [
                    product.id,
                    product.description_produit,
                    product.poids_produit + 'kg',
                    Utils.currencyFormat(product.valeur_produit)
                ];
    
                row.forEach((cell, i) => {
                    doc.fillColor('#000000')
                    .font('Helvetica')
                    .fontSize(12)
                    .text(cell.toString(), x + 5, startY + 5, { width: colWidths[i] - 10, align: i >= 2 ? 'right' : 'left' });
                    x += colWidths[i];
                });
    
                startY += rowHeight;
            });

        return startY;
    }


    private horizontalLine(doc: PDFKit.PDFDocument){
        // 6️⃣ Add a horizontal line below header
        doc
        .moveTo(50, 100)             // Starting point of line (x=50, y=100)
        .lineTo(550, 100)            // Ending point of line (x=550, y=100)
        .stroke();                   // Draw the line
    }

    private getProduits(bl: BordereauLivraisonEntity){
        const produits: DetailColisEntity[] = [];

        bl.ordre_livraison.livraison.colis.forEach(colis => {
            colis.details_colis.forEach(produit => {
                produits.push(produit);
            });
        });

        return produits;
    }
}
