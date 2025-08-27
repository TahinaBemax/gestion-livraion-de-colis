import { BordereauLivraisonEntity } from './bordereau-livraison.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BordereauLivraisonCreateDto } from 'src/common/dto/bordereau-livraison/create-bordereau-livraison-dto';
import { Repository, In, DataSource } from 'typeorm';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { DetailColisEntity } from '../colis/detail-colis.entity';


@Injectable()
export class BordereauLivraisonService {
    constructor(
        @InjectRepository  (BordereauLivraisonEntity)
        private readonly bordereauRep: Repository<BordereauLivraisonEntity>, 
        @InjectRepository  (OrdreLivraisonEntity)
        private readonly ordreRep: Repository<OrdreLivraisonEntity>, 
        private readonly dataSource: DataSource
    ) {}


    async create(data: BordereauLivraisonCreateDto): Promise<BordereauLivraisonEntity[]> {
        const bordereaux: BordereauLivraisonEntity[] = await this.mapToBordereauLivraisonEntity(data);
        const prepared: BordereauLivraisonEntity[] = this.bordereauRep.create(bordereaux);
        return this.bordereauRep.save(prepared);
    }

    async findAll(): Promise<BordereauLivraisonEntity[]> {
        return this.bordereauRep.find({relations: ['ordre_livraison' ,'livreur', 'contenu']});
    }

    async findById(id: string): Promise<BordereauLivraisonEntity> {
        const matched =  await this.bordereauRep.findOne({
            where: { id: id },
            relations: ['ordre_livraison' ,'livreur', 'contenu']
        });

        if(!matched) throw new NotFoundException("Bordereau de livraison inexistant!");

        return matched;
    }

    private async mapToBordereauLivraisonEntity(dto: BordereauLivraisonCreateDto): Promise<BordereauLivraisonEntity[]> {
        if(!dto) throw new Error('Données du bordereau de livraison manquantes');
        const bordereaux = new Array<BordereauLivraisonEntity>();
        const ordres_livraison = await this.ordreRep.findBy({ id: In(dto.id_ordre_livraison) });

        if(ordres_livraison.length === 0 ) throw new Error("Ordres de livraison vide!");

        for (const ordre of ordres_livraison) {
            const sequence = await this.dataSource.query("SELECT nextval('ref_bordereau')");
            const ref = 'BL-' + sequence[0].nextval.toString().padStart(8, '0');
            
            const bordereau = new BordereauLivraisonEntity();
            bordereau.id = ref;
            const produits: DetailColisEntity[] = [];

            bordereau.date_bordereau = dto.date_bordereau ?? new Date().toISOString().split('T')[0];
            bordereau.date_livraison = dto.date_livraison;
            bordereau.ordre_livraison = ordre;

            bordereau.nom_expediteur = "AdriColis";
            bordereau.adresse_expediteur = "Soavimasoandro, Antananarivo, Madagascar";
            bordereau.contact_expediteur = "+261 34 00 000 00";

            bordereau.nom_destinataire = ordre.point_livraison.numero_magasin;
            bordereau.adresse_destinataire =  ordre.point_livraison.numero_rue + ', ' + ordre.point_livraison.nom_rue + ', ' + ordre.point_livraison.ville;  
            bordereau.contact_destinataire = "";

            bordereau.livreur = (await ordre.tournee_livraison).livreur;

            ordre.livraisons.forEach(l => {
                l.colis.forEach(c => {
                    c.details_colis.forEach(produit => produits.push(produit));
                });
            });
            bordereau.contenu = produits;
            bordereaux.push(bordereau);
        }

        return bordereaux;
    }

    // async generateBonLivraison(bl: BordereauLivraisonEntity): Promise<Buffer> {
    //   const fonts = {
    //     Roboto: {
    //       normal: 'node_modules/pdfmake/fonts/Roboto-Regular.ttf',
    //       bold: 'node_modules/pdfmake/fonts/Roboto-Medium.ttf',
    //       italics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf',
    //       bolditalics: 'node_modules/pdfmake/fonts/Roboto-MediumItalic.ttf',
    //     },
    //   };

    //   const title = "BON DE LIVRAISON";
    //   const nomPrenomLivreur = bl.livreur.user.nom + " " + bl.livreur.user.prenom;

    //   // Table for products
    //   const produitsTable = [
    //     [
    //       { text: 'Réf Produit', style: 'tableHeader' },
    //       { text: 'Description', style: 'tableHeader' },
    //       { text: 'Poids (kg)', style: 'tableHeader' },
    //       { text: 'Valeur (€)', style: 'tableHeader' },
    //     ],
    //     ...bl.contenu.map((prod) => [
    //       prod.id,
    //       prod.description_produit,
    //       prod.poids_produit.toString(),
    //       prod.valeur_produit.toString(),
    //     ]),
    //   ];

    //   // PDF definition
    //   const docDefinition: TDocumentDefinitions = {
    //     content: [
    //       { text: title, style: 'header' },
    //       {
    //         columns: [
    //           [
    //             { text: 'EXPÉDITEUR', style: 'subheader' },
    //             { text: bl.nom_expediteur },
    //             { text: bl.adresse_expediteur },
    //             { text: 'Contact: ' + bl.contact_expediteur },
    //           ],
    //           [
    //             { text: 'DESTINATAIRE', style: 'subheader' },
    //             { text: bl.nom_destinataire },
    //             { text: bl.adresse_destinataire },
    //             { text: 'Contact: ' + bl.contact_destinataire },
    //           ],
    //         ],
    //       },
    //       { text: '\n' },
    //       {
    //         columns: [
    //           [
    //             { text: 'Date du Bordereau: ' + bl.date_bordereau },
    //             { text: 'Date de Livraison: ' + bl.date_livraison },
    //           ],
    //           [
    //             { text: 'Livreur: ' + nomPrenomLivreur },
    //             { text: 'Ordre Livraison: ' + (bl.ordre_livraison?.id || '---') },
    //           ],
    //         ],
    //       },
    //       { text: '\n\n' },
    //       { text: 'DÉTAILS DES PRODUITS', style: 'subheader' },
    //       {
    //         table: {
    //           headerRows: 1,
    //           widths: ['auto', '*', 'auto', 'auto'],
    //           body: produitsTable,
    //         },
    //         layout: 'lightHorizontalLines',
    //       },
    //       { text: '\n' },
    //       {
    //         columns: [
    //           { text: 'Signature Livreur: ___________________' },
    //           { text: 'Signature Destinataire: ___________________', alignment: 'right' },
    //         ],
    //       },
    //     ],
    //     styles: {
    //       header: {
    //         fontSize: 18,
    //         bold: true,
    //         alignment: 'center',
    //         margin: [0, 0, 0, 10],
    //       },
    //       subheader: {
    //         fontSize: 12,
    //         bold: true,
    //         margin: [0, 10, 0, 5],
    //       },
    //       tableHeader: {
    //         bold: true,
    //         fontSize: 11,
    //         color: 'black',
    //       },
    //     },
    //   };

    //   return new Promise<Buffer>((resolve, reject) => {
    //     const pdfDocGenerator = (PdfMake as any).createPdf(docDefinition);
    //     pdfDocGenerator.getBuffer((buffer: Buffer) => {
    //       resolve(buffer);
    //     });
    //   });
    // }

}
