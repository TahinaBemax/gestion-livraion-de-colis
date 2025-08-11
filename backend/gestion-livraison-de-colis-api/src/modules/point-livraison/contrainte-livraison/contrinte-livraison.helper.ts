// import { Injectable, NotFoundException } from "@nestjs/common";
// import { ContrainteJourLivraisonService } from "../contrainte-jour-livraison/contrainte-jour-livraison.service";
// import { PointLivraison } from "../point-livraison.entity";
// import { PointLivraisonService } from "../point-livraison.service";
// import { ContrainteJourLivraison } from "../contrainte-jour-livraison/contrainte-jour-livraison.entity";

// @Injectable()
// export class ContrainteLivraisonHelper {
//     constructor(
//         private readonly pointLivraisonService: PointLivraisonService,
//         private readonly contrainteJourService: ContrainteJourLivraisonService
//     ){}    


//     async getPointLivraison(id: number): Promise<PointLivraison> {
//         const pl = await this.pointLivraisonService.findById(id);
//         if(!pl) throw new NotFoundException(`Point de Livraison avec id: ${id} introuvable!`);
//         return pl;
//     }

//     async getContraintesJoursLivraisons(ids?: number[]): Promise<ContrainteJourLivraison[]|undefined> {
//         if(!ids) return ids;

//         return Promise.all(ids.map(id => {
//             return this.contrainteJourService.findById(id)
//         }));        
//     }
// }