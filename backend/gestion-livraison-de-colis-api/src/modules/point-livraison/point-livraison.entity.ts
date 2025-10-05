import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Prestataire } from "../prestataire/prestataire.entity";
import { ContrainteLivraisonEntity } from "../contrainte-livraison/contrainte-livraison.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";
import { EvenementLocalEntity } from "../evenement-local/evenement-local.entity";
import { ClientEntity } from "../client/client.entity";
import { parse } from "date-fns";
import { CreneauLivraisonEntity } from "../creneau-livraison/creneau-livraison.entity";

@Entity("points_livraison")
@Unique(["numero_magasin"])
export class PointLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_point_livraison"})
    id: number;

    @Column({name: "nom_point_livraison"})
    numero_magasin: string;

    @Column()
    nom_rue: string;

    @Column()
    numero_rue: string;

    @Column()
    departement?: string;

    @Column()
    ville: string;

    @Column({nullable : true})
    pays?: string;

    @Column({nullable : true})
    latitude?: number;

    @Column({nullable : true})
    longitude?: number;

    @Column()
    code_postal: string;

    @Column({nullable : true})
    complement_adresse?: string;

    @ManyToOne(() => Prestataire, {nullable: true})
    @JoinColumn({name: "id_prestataire", referencedColumnName: "id_prestataire"})
    prestataire?: Prestataire;

    @OneToMany(() => ContrainteLivraisonEntity, (c) => c.point_livraison, {
        eager: true, 
        cascade: ["insert"], 
        onUpdate: "CASCADE",
        nullable: true
    })
    contraintes_livraison?: ContrainteLivraisonEntity[];

    @ManyToMany(() => EvenementLocalEntity, (event) => event.points_livraison, {
        eager: true, 
        cascade: ["insert", "update"], 
        nullable: true
    })
    @JoinTable({
        name: "contraintes_evenement",
        inverseJoinColumn: { name: "id_point_livraison", referencedColumnName: "id"},
        joinColumn: {name: "id_evenement", referencedColumnName: "id"}
    })
    evenements?: EvenementLocalEntity[];

    @OneToMany(() => ClientEntity, (p) => p.point_livraison, {
        nullable: true,
        lazy: true
    })
    clients: Promise<ClientEntity[]>|ClientEntity[];

    @OneToMany(() => OrdreLivraisonEntity, (ordre) => ordre.point_livraison)
    ordres_livraison: OrdreLivraisonEntity[];

    @OneToMany(() => CreneauLivraisonEntity, (creneau) => creneau.point_livraison, {
        eager: true
    })
    creneaux_livraison: CreneauLivraisonEntity[];

    getCreneauxLivraison(dateLivraison: Date){
        const contraintes = this.contraintes_livraison;
        const local: string = 'fr-FR';
        const jourSemaine = dateLivraison.toLocaleDateString(local, {weekday: 'long'});

        if(contraintes){
            contraintes.forEach(c => {
                const dateDebut = parse(c.date_contrainte, "dd/MM/yyyy", new Date());
                if(dateDebut == dateLivraison ){
                    return {
                         heure_debut: c.heure_debut_livrable, 
                         heure_fin: c.heure_fin_livrable
                    };
                }
            });
        } 

        this.creneaux_livraison.forEach(c => {
            if(c.jour_semaine.toLowerCase() === jourSemaine.toLowerCase()){
                return {
                    heure_debut: c.heure_debut, 
                    heure_fin: c.heure_fin
                };
            }
        });

        return null;
        
    }
}