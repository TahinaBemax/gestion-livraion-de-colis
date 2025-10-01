import { ClientCreateDto } from "src/common/dto/client/client-create-dto";

export class ClientDataTest {
    static getClients(): ClientCreateDto[]{
        const client1: ClientCreateDto = new ClientCreateDto();
        client1.nom_client = "Rasoanaivo";
        client1.prenom_client = "Miora";
        client1.civilite = "Mme";
        client1.numero_telephone = "+261 34 12 34 56 78";
        client1.adresse_mail = "miora.rasoanaivo@example.com";

        const client2: ClientCreateDto = new ClientCreateDto();
        client2.nom_client = "Rakoto";
        client2.prenom_client = "Jean";
        client2.numero_telephone = "+261 33 23 45 67 89";
        client2.adresse_mail = "jean.rakoto@example.com";

        const client3: ClientCreateDto = new ClientCreateDto();
        client3.nom_client = "Ramahefa";
        client3.prenom_client = "Tiana";
        client3.civilite = "Mlle";
        client3.numero_telephone = "+261 32 33 44 55 66";
        client3.adresse_mail = "tiana.ramahefa@example.com";


        const client4: ClientCreateDto = new ClientCreateDto();
        client4.nom_client = "Andriamifidy";
        client4.prenom_client = "Olga";
        client4.numero_telephone = "+261 34 11 22 33 44";
        client4.adresse_mail = "olga.andriamifidy@example.com";


        const client5: ClientCreateDto = new ClientCreateDto();
        client5.nom_client = "Ravelojaona";
        client5.prenom_client = "Naina";
        client5.civilite = "M.";
        client5.numero_telephone = "+261 32 01 23 45 67";
        client5.adresse_mail = "naina.ravelojaona@example.com";


        const client6: ClientCreateDto = new ClientCreateDto();
        client6.nom_client = "Rakotomalala";
        client6.prenom_client = "Rija";
        client6.numero_telephone = "+261 33 55 66 77 88";
        client6.adresse_mail = "rija.rakotomalala@example.com";

        return [client1, client2, client3, client4, client5, client6];
    }
}