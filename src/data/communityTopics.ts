export interface CommunityTopic {
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  content: string;
}

const IMG = {
  doctor: '/images/community/doctor.jpg',
  office: '/images/community/office.jpg',
  shield: '/images/community/shield.jpg',
  briefcase: '/images/community/briefcase.jpg',
  profile: '/images/community/profile.jpg',
  users: '/images/community/users.jpg',
  calendar: '/images/community/calendar.jpg',
};

export const COMMUNITY_TOPICS: CommunityTopic[] = [
  {
    slug: 'starten-als-arts',
    title: 'Starten als professional op ArboMatcher',
    category: 'Voor professionals',
    description: 'Registreer met je BIG-nummer, maak je profiel compleet en ontvang opdrachten die bij je passen.',
    imageUrl: IMG.doctor,
    content: `Als bedrijfsarts of arbo-arts kun je via ArboMatcher opdrachten vinden die bij je passen. In dit overzicht lees je stap voor stap hoe je van registratie naar je eerste opdracht gaat.

## Registreren en profiel

Maak een account aan met je e-mailadres. Kies de rol "Professional" en vul je basisgegevens in: naam, telefoon en je BIG-nummer. Zonder BIG-nummer kun je niet verifiëren en dus niet reageren op opdrachten. Zorg dat je het nummer zonder spaties of punten invult (11 cijfers).

- Account aanmaken via "Gratis registreren"
- Rol "Professional" selecteren
- BIG-nummer en contactgegevens invullen

## BIG-verificatie

Na het invullen van je BIG-nummer controleren we dit tegen het landelijke BIG-register. Meestal is je account binnen één werkdag geverifieerd. Pas daarna kun je solliciteren op opdrachten. Zonder verificatie blijven je mogelijkheden beperkt tot het bekijken van het platform.

- Controle tegen het officiële register
- Meestal binnen één werkdag actief
- Bij vragen of vertraging: neem contact met ons op

## Specialismen en regio's

Vul in je profiel in welke specialismen en regio's bij je passen. Organisaties zoeken op deze filters; hoe completer je profiel, hoe groter de kans dat je relevante opdrachten ziet. Je kunt meerdere regio's en specialismen selecteren.

- Specialismen: verzuim, PMO, re-integratie, etc.
- Regio's: waar wil je werken of op afstand ondersteunen?
- Beschikbaarheid: uren per week, startdatum

## Je eerste opdracht

Blader door de open opdrachten, filter op regio of type, en reageer met een korte motivatie. Organisaties ontvangen je reactie en kunnen je uitnodigen voor een gesprek of direct een opdracht toewijzen. Reageer tijdig en helder om je kansen te vergroten.

- Opdrachten bekijken en filteren
- Sollicitatie met motivatie indienen
- Communicatie via het platform of zoals afgesproken`,
  },
  {
    slug: 'big-verificatie-kwaliteit',
    title: 'BIG-verificatie en kwaliteit',
    category: 'Voor professionals',
    description: 'Alle professionals op het platform zijn BIG-geregistreerd. Zo garanderen we betrouwbare matching.',
    imageUrl: IMG.shield,
    content: `Op ArboMatcher werken alleen professionals met een geverifieerd BIG-nummer. Dat zorgt voor kwaliteit en vertrouwen voor organisaties en voor jou.

## Wat is BIG-verificatie?

Het BIG-register (Beroepen in de Individuele Gezondheidszorg) bevat alle bevoegde zorgverleners in Nederland. Wij controleren je ingevulde nummer tegen dit register. Klopt het nummer en is je registratie actueel, dan wordt je account als geverifieerd gemarkeerd.

- Landelijk register voor bevoegde zorgverleners
- Controle op nummer en status
- Zichtbaar voor organisaties dat je geverifieerd bent

## Verificatie aanvragen

Verificatie vraag je niet apart aan: zodra je je BIG-nummer in je profiel invult, start de controle automatisch. Meestal is het binnen één werkdag rond. Heb je net je BIG ontvangen? Soms duurt het even voordat het register is bijgewerkt; bij problemen helpen we je graag.

- BIG-nummer invullen in profiel (11 cijfers)
- Geen aparte aanvraag nodig
- Bij twijfel: contact opnemen

## Status controleren

In je profiel zie je of je status "Geverifieerd" is. Zonder deze status kun je niet reageren op opdrachten. Zorg dat je registratie in het BIG-register actueel blijft; wijzigingen in het register kunnen invloed hebben op je verificatiestatus. Bij vragen over je status kun je ons altijd benaderen.`,
  },
  {
    slug: 'solliciteren-opdrachten',
    title: 'Solliciteren op opdrachten',
    category: 'Voor professionals',
    description: 'Reageer op opdrachten, blijf op de hoogte van nieuwe vacatures en communiceer direct met organisaties.',
    imageUrl: IMG.briefcase,
    content: `Solliciteren op ArboMatcher is eenvoudig: je bekijkt open opdrachten, filtert op wat bij je past en stuurt een reactie met een korte motivatie. Hier lees je hoe je dat effectief doet.

## Opdrachten bekijken

Op de Community- en opdrachtenpagina's zie je welke vacatures openstaan. Filter op regio, type (verzuim, PMO, re-integratie) en contractvorm (ZZP, detachering, loondienst). Lees de opdrachtbeschrijving goed door zodat je reactie aansluit op wat de organisatie zoekt.

- Filter op regio en type opdracht
- Let op eisen (BIG, ervaring, locatie)
- Houd je beschikbaarheid in de gaten

## Sollicitatie indienen

Klik op "Reageren" of "Solliciteren" en schrijf een korte, duidelijke motivatie. Noem waarom je past bij deze opdracht en wat je meebrengt (ervaring, specialisme, beschikbaarheid). Voeg geen grote bijlagen toe tenzij gevraagd; houd het overzichtelijk.

- Korte motivatie die aansluit op de opdracht
- Vermeld je beschikbaarheid en eventuele randvoorwaarden
- Controleer je gegevens voordat je verstuurt

## Shortlist en selectie

De organisatie beoordeelt de reacties en kan kandidaten op de shortlist zetten of uitnodigen voor een gesprek. Je ontvangt bericht over de status van je sollicitatie. Reageer tijdig op uitnodigingen en wees duidelijk over je beschikbaarheid om de kans op een match te vergroten.`,
  },
  {
    slug: 'tarieven-administratie',
    title: 'Tarieven en administratie',
    category: 'Voor professionals',
    description: 'Stel je uurtarief in, beheer je beschikbaarheid en houd je declaraties overzichtelijk.',
    imageUrl: IMG.briefcase,
    content: `Een helder uurtarief en overzichtelijke administratie helpen je om professioneel te werken en organisaties gerust te stellen. Hier een overzicht van wat er op het platform en in je eigen organisatie belangrijk is.

## Uurtarief bepalen

Bepaal je tarief op basis van de markt, je ervaring en je kosten. Een richtlijn voor ervaren bedrijfsartsen ligt vaak tussen € 120 en € 180 per uur; de bandbreedte hangt af van regio en type opdracht. Op ArboMatcher kun je een indicatie of bandbreedte in je profiel zetten zodat organisaties weten wat ze kunnen verwachten.

- Markt en ervaring meewegen
- Kosten (verzekering, pensioen, vakantie) meerekenen
- Transparantie in je profiel

## Beschikbaarheid

Geef in je profiel aan hoeveel uur per week je beschikbaar bent en vanaf wanneer. Organisaties filteren hierop; een actuele beschikbaarheid vergroot je kansen. Werk je beschikbaarheid bij zodra er iets verandert.

- Uren per week en startdatum
- Regio of type opdracht (op locatie / op afstand)
- Profiel up-to-date houden

## Declareren en factureren

De afspraken over declaratie en facturatie maak je met de organisatie. Het platform ondersteunt de match; de contractuele en administratieve afhandeling doe je onderling. Houd je administratie overzichtelijk (uren, facturen, overeenkomsten) voor je eigen administratie en eventuele controle.`,
  },
  {
    slug: 'tips-voor-artsen',
    title: 'Tips voor professionals',
    category: 'Voor professionals',
    description: 'Hoe profileer je je goed? Hoe vergroot je je kansen op een match?',
    imageUrl: IMG.profile,
    content: `Met een sterk profiel en duidelijke communicatie vergroot je je kansen op passende opdrachten. Hier praktische tips voor professionals op ArboMatcher.

## Profiel optimaliseren

Zorg dat je profiel volledig is: BIG geverifieerd, specialismen en regio's ingevuld, een korte bio en een indicatie van je tarief en beschikbaarheid. Organisaties scannen profielen snel; hoe completer en duidelijker, hoe groter de kans dat je wordt uitgenodigd.

- Alle velden invullen en actueel houden
- Bio: wie ben je, wat doe je, wat is je toegevoegde waarde?
- Tarief en beschikbaarheid vermelden

## Netwerken op het platform

Reageer tijdig op opdrachten en op berichten van organisaties. Een professionele, duidelijke communicatie bouwt vertrouwen op. Als je eenmaal een opdracht hebt gedaan, kan een tevreden organisatie je opnieuw benaderen of je profiel doorverwijzen.

- Snel en helder reageren
- Afspraken nakomen en communiceren bij wijzigingen
- Profiel en ervaring up-to-date houden

## Veelgestelde vragen

**Kan ik meerdere opdrachten tegelijk hebben?** Ja, zolang je beschikbaarheid het toelaat en je met organisaties afspreekt hoe je uren verdeelt.

**Moet ik via ArboMatcher factureren?** Nee; facturatie en betaling regel je met de organisatie. Het platform brengt jullie bij elkaar.

**Hoe word ik zichtbaarder?** Een compleet profiel, duidelijke specialismen en tijdig reageren helpen. Je kunt ook in je bio aangeven dat je openstaat voor nieuwe opdrachten.`,
  },
  {
    slug: 'opdrachten-plaatsen',
    title: 'Opdrachten plaatsen',
    category: 'Voor organisaties',
    description: 'Plaats een opdracht, ontvang reacties van gekwalificeerde professionals en kies de juiste kandidaat.',
    imageUrl: IMG.office,
    content: `Via ArboMatcher plaats je een opdracht en ontvang je reacties van BIG-geregistreerde professionals. Hier lees je hoe je dat van begin tot eind aanpakt.

## Opdracht aanmaken

Log in als organisatie en kies "Opdracht plaatsen". Geef een duidelijke titel (bijv. "Bedrijfsarts verzuimbegeleiding") en beschrijf de context: wat doet je organisatie, wat is het doel, hoeveel uur of dagen per week, voor welke periode? Hoe concreter, hoe beter de reacties.

- Duidelijke titel en beschrijving
- Context, omvang en contractvorm (ZZP, detachering, loondienst)
- Eisen (BIG, ervaring, locatie) vermelden

## Profiel beschrijven

Beschrijf het gewenste profiel: welke BIG-registratie is nodig, welke ervaring of specialismen zijn gewenst, en of de professional op locatie of op afstand moet kunnen werken? Dit helpt professionals om in te schatten of ze passen en filtert onnodige reacties.

- Vereiste BIG-registratie
- Ervaring en specialismen
- Locatie of afstand

## Reacties beoordelen

Je ontvangt reacties van professionals met een motivatie en een link naar hun profiel. Bekijk de profielen op BIG-verificatie, ervaring en beschikbaarheid. Stel kandidaten op de shortlist en nodig ze eventueel uit voor een gesprek. Geef alle kandidaten binnen een paar werkdagen een eerste reactie.

- Reacties bekijken en vergelijken
- Shortlist maken en kandidaten uitnodigen
- Tijdig reageren

## Kandidaat selecteren

Kies de kandidaat die het beste past en maak afspraken over startdatum, uren, tarief en contractvorm. De verdere afhandeling (contract, facturatie) doe je onderling. Via het platform kun je de match afronden en eventueel later opnieuw een opdracht plaatsen.`,
  },
  {
    slug: 'artsen-vinden-matchen',
    title: 'Professionals vinden en matchen',
    category: 'Voor organisaties',
    description: 'Zoek op specialisme, regio en beschikbaarheid. Direct contact zonder tussenpartij.',
    imageUrl: IMG.users,
    content: `Op ArboMatcher vind je professionals op basis van specialisme, regio en beschikbaarheid. Je werkt direct met de professional, zonder tussenpartij. Hier hoe je zoekt en matcht.

## Zoeken en filteren

Gebruik de filters om opdrachten of profielen te doorzoeken op regio, type (verzuim, PMO, etc.) en beschikbaarheid. Als organisatie zie je wie er gereageerd heeft op je opdracht; je kunt ook zoeken in het aanbod van professionals als je eerst wilt oriënteren.

- Filter op regio en type opdracht
- Bekijk reacties op je geplaatste opdrachten
- Vergelijk profielen op ervaring en beschikbaarheid

## Profielen bekijken

Open het profiel van een professional om meer te zien: BIG-verificatie, specialismen, regio, bio en tarief/beschikbaarheid. Zo beoordeel je of iemand past bij je vraag. Alle getoonde professionals zijn BIG-geregistreerd; wij controleren dat voor je.

- BIG-status en specialismen
- Bio en ervaring
- Tarief en beschikbaarheid

## Contact opnemen

Na het selecteren van een kandidaat neem je contact op via het platform of zoals afgesproken. Maak duidelijke afspraken over start, uren, tarief en contract. Door tijdig en helder te communiceren verloopt de match soepel.`,
  },
  {
    slug: 'verificatie-kwaliteitsborging',
    title: 'Verificatie en kwaliteitsborging',
    category: 'Voor organisaties',
    description: 'Al onze professionals zijn BIG-geregistreerd. Wij controleren dit voor je.',
    imageUrl: IMG.shield,
    content: `Op ArboMatcher werken alleen professionals met een geverifieerd BIG-nummer. Dat vermindert uw zoekwerk en verhoogt de betrouwbaarheid van de matching.

## BIG-register

Het BIG-register is het landelijke register van bevoegde zorgverleners in Nederland. Wij controleren het BIG-nummer van elke professional die zich aanmeldt. Alleen bij een geldige, actuele registratie krijgt de professional de status "Geverifieerd" en kan hij of zij reageren op opdrachten.

- Controle tegen het officiële register
- Alleen geverifieerde professionals kunnen solliciteren
- Geen tussenpartij; direct contact met de professional

## Kwaliteitsgarantie

Door deze verificatie weet u dat u alleen met BIG-geregistreerde professionals in contact komt. Wij garanderen geen inhoudelijke kwaliteit van het werk – die bepaalt u samen met de professional – maar wel dat de basiskwalificatie (BIG-registratie) is gecontroleerd.

- Basis: BIG-registratie gecontroleerd
- Verdere kwaliteit: ervaring, referenties en afspraken onderling

## Klachten en geschillen

Bij problemen of geschillen rond een opdracht raden we aan eerst onderling tot een oplossing te komen. Komt u er niet uit, dan kunt u contact met ons opnemen. Wij kunnen bemiddelen of u doorverwijzen. Voor juridische geschillen blijft een jurist of geschilleninstantie de aangewezen route.`,
  },
  {
    slug: 'inzet-contractvormen',
    title: 'Inzet en contractvormen',
    category: 'Voor organisaties',
    description: 'ZZP, detachering of loondienst – kies de vorm die bij je organisatie past.',
    imageUrl: IMG.calendar,
    content: `De inzet van een professional kan in verschillende contractvormen: ZZP, detachering of loondienst. Op ArboMatcher vindt u de professional; de precieze afspraken spreekt u onderling af. Hier een overzicht.

## Contractvormen

**ZZP:** De professional werkt als zzp'er voor u, vaak per opdracht of voor een bepaalde periode. U maakt afspraken over uren, tarief en reikwijdte.

**Detachering:** De professional wordt via een detacheringsbureau of eigen onderneming bij u ingezet. Afspraken over verantwoordelijkheid en facturatie met de betreffende partij.

**Loondienst:** Vaste inzet in dienstverband bij uw organisatie of arbodienst, bijvoorbeeld een vaste dag per week of fulltime.

- Keuze afhankelijk van uw behoefte en beleid
- Afspraken helder vastleggen

## Afspraken vastleggen

Leg afspraken over uren, tarief, duur, verantwoordelijkheden en eventuele bijzonderheden schriftelijk vast. Dat voorkomt misverstanden en biedt duidelijkheid voor beide partijen. Gebruik waar nodig een modelovereenkomst of advies van een jurist.

- uren, tarief, duur
- verantwoordelijkheden en reikwijdte
- opzegging en evaluatie

## Evaluatie en verlenging

Evalueer periodiek of de inzet voldoet en of u wilt verlengen of beëindigen. Door tijdig te communiceren over verlenging of afronding verloopt de samenwerking soepel. Bij een nieuwe periode kunt u bestaande afspraken verlengen of bijstellen.`,
  },
];

export function getTopicBySlug(slug: string): CommunityTopic | undefined {
  return COMMUNITY_TOPICS.find((t) => t.slug === slug);
}
