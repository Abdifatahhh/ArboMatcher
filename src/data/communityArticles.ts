export interface CommunityArticle {
  slug: string;
  title: string;
  date: string;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  content?: string;
}

const IMG = {
  doctor: '/images/community/doctor.jpg',
  office: '/images/community/office.jpg',
  finance: '/images/community/finance.jpg',
  legal: '/images/community/legal.jpg',
  profile: '/images/community/profile.jpg',
};

export const COMMUNITY_ARTICLES: CommunityArticle[] = [
  {
    slug: 'big-verificatie-belangrijk',
    title: 'Wat is BIG-verificatie en waarom is het belangrijk?',
    date: '12 feb 2026',
    category: 'Voor professionals',
    imageUrl: IMG.doctor,
    imageAlt: 'Professional met documenten',
    content: `Het BIG-register (Beroepen in de Individuele Gezondheidszorg) is het landelijke register waarin alle bevoegde zorgverleners in Nederland staan. Als bedrijfsarts of arbo-arts moet je BIG-geregistreerd zijn om wettelijk je beroep te mogen uitoefenen. Op ArboMatcher verifiëren we je BIG-nummer voordat je volledig toegang krijgt tot het platform.

## Waarom verifiëren we je BIG-nummer?

Opdrachtgevers – arbodiensten en werkgevers – willen zeker weten dat ze met gekwalificeerde professionals werken. Door je BIG-nummer te controleren tegen het officiële register geven we hen die zekerheid. Daarnaast voldoen we daarmee aan de eisen die horen bij verantwoord matching in de zorg.

- Opdrachtgevers zien direct dat je geregistreerd en bevoegd bent
- Er is geen twijfel over je kwalificatie bij het reageren op opdrachten
- Het platform blijft betrouwbaar voor alle partijen

## Hoe werkt de verificatie op ArboMatcher?

Je vult je 11-cijferige BIG-nummer in bij je profiel (zonder spaties of punten). Wij controleren dit nummer tegen het BIG-register. In de meeste gevallen is je account binnen één werkdag geverifieerd en kun je reageren op opdrachten.

- Vul alleen je eigen, actuele BIG-nummer in
- Controleer of je registratie nog geldig is in het register
- Heb je net je BIG ontvangen? Het register wordt periodiek bijgewerkt; bij vertraging neem contact met ons op

## Geen BIG-registratie: wat dan?

Zonder geldige BIG-registratie kun je op ArboMatcher geen opdrachten accepteren. Dat is een bewuste keuze: we richten ons op professionals die wettelijk bevoegd zijn. Ben je nog in opleiding of wacht je op je registratie? Maak dan alvast een profiel aan en vul je BIG in zodra je het ontvangt; je kunt daarna direct verifiëren.

## Veelgestelde vragen

**Mijn BIG-nummer wordt niet geaccepteerd.** Controleer of je 11 cijfers hebt ingevuld en of er geen spaties of andere tekens in staan. Staat je registratie nog actief in het BIG-register? Bij aanhoudende problemen neem contact met ons op.

**Hoe lang duurt de verificatie?** Meestal binnen één werkdag. Bij drukte of technische controles kan het iets langer duren.

**Kan ik ook zonder BIG op het platform?** Je kunt je aanmelden en je profiel bekijken, maar om te solliciteren op opdrachten is een geverifieerd BIG-nummer vereist.`,
  },
  {
    slug: 'effectieve-opdracht-plaatsen',
    title: 'Zo plaats je een effectieve opdracht als organisatie',
    date: '8 feb 2026',
    category: 'Voor organisaties',
    imageUrl: IMG.office,
    imageAlt: 'Samenwerking in kantoor',
    content: `Een duidelijke opdrachtbeschrijving trekt sneller de juiste professionals aan en bespaart je tijd bij het selecteren van kandidaten. In dit artikel lees je concrete tips om je opdracht effectief te maken, van titel tot nazorg.

## Geef een duidelijke titel

Gebruik een korte, herkenbare titel die het type inzet weergeeft. Voorbeelden: "Bedrijfsarts verzuimbegeleiding", "Arbo-arts preventief medisch onderzoek" of "Verzuimspecialist 6 maanden". Zo vinden professionals die bij je vraag passen je opdracht snel in hun zoekresultaten.

- Vermijd vage omschrijvingen zoals "Professional gezocht"
- Noem het specialisme of de taak in de titel
- Houd de titel zoekmachinevriendelijk (maximaal circa 60 tekens)

## Beschrijf de context en het doel

Wat doet je organisatie? Waarom zoek je deze inzet? Hoeveel uur of dagen per week gaat het om, en voor welke periode? Noem ook of het om ZZP, detachering of loondienst gaat. Hoe concreter je bent, hoe beter de match en hoe gerichter de reacties.

- Omvang: uren per week, duur, startdatum
- Contractvorm: ZZP, detachering, loondienst
- Doel: verzuimbegeleiding, PMO, advies, re-integratie

## Noem duidelijke eisen

Welke BIG-registratie is vereist? Zijn er specifieke ervaringen of specialismen gewenst? Moet de arts op locatie kunnen werken of is (deels) op afstand mogelijk? Dit filtert onnodige reacties en trekt de juiste kandidaten aan.

- BIG-registratie (bedrijfsarts, arbo-arts, etc.)
- Ervaring (bijv. aantal jaren, type organisatie)
- Locatie: op locatie, hybride of volledig op afstand
- Taal of andere randvoorwaarden

## Reageer tijdig op sollicitaties

Professionals investeren tijd in een reactie. Stel ze op de hoogte van de status – ontvangen, in behandeling, shortlist – en geef binnen een paar werkdagen een eerste reactie. Zo blijft het platform aantrekkelijk voor goede kandidaten en bouw je een goede reputatie op als organisatie.

- Plan een moment om reacties te beoordelen (bijv. na sluitingsdatum)
- Laat afgewezen kandidaten kort weten dat je verder gaat met anderen
- Houd kandidaten op de shortlist op de hoogte van vervolgstappen`,
  },
  {
    slug: 'uurtarief-bedrijfsarts',
    title: 'Uurtarief bepalen als bedrijfsarts: tips en richtlijnen',
    date: '5 feb 2026',
    category: 'Voor professionals',
    imageUrl: IMG.finance,
    imageAlt: 'Bepalen van tarieven',
    content: `Een passend uurtarief is belangrijk voor je inkomsten én voor je positie op de markt. Te laag trekt misschien opdrachten aan maar doet geen recht aan je expertise; te hoog kan organisaties afschrikken. In dit artikel vind je handvatten om je tarief te bepalen en transparant te communiceren.

## Kijk naar de markt

Wat vragen vergelijkbare bedrijfsartsen in jouw regio en met jouw ervaring? Wat bieden opdrachten op ArboMatcher en andere platforms? Gebruik dat als referentie, niet als vaste norm: jouw specialismen en beschikbaarheid bepalen mee.

- Vergelijk met peers (zelfde regio, ervaring, type opdracht)
- Houd rekening met vraag en aanbod in jouw vakgebied
- Tarieven kunnen per sector (arbodienst, overheid, bedrijfsleven) verschillen

## Weeg je ervaring en toegevoegde waarde

Net afgestudeerd of jarenlange ervaring met verzuim of PMO? Specifieke kennis – bijvoorbeeld mentaal verzuim, re-integratie of een bepaalde sector – kan een hoger tarief rechtvaardigen. Leg in je profiel en bij sollicitaties kort uit wat je extra biedt.

- Starters kunnen iets onder het marktgemiddelde zitten om ervaring op te doen
- Ervaren professionals of specialismen rechtvaardigen vaak een hoger tarief
- Extra certificeringen of opleidingen kunnen meewegen

## Reken je kosten mee

Denk aan verzekeringen, bijscholing, administratie, pensioen en vakantie. Veel zzp'ers rekenen 40–60% boven hun "netto" tarief om alle kosten en vrije dagen te dekken. Een richtlijn voor ervaren bedrijfsartsen ligt vaak tussen € 120 en € 180 per uur; de bandbreedte hangt af van regio, type opdracht en urgentie.

- Verzekeringen (beroepsaansprakelijkheid, etc.)
- Pensioen en vakantiedagen
- Administratie, bijscholing en acquisitie
- Reservering voor slechte periodes

## Minimumtarief en wetgeving

Er wordt gesproken over een minimum uurtarief voor zzp'ers (bijv. rond € 36) in het kader van schijnzelfstandigheid. Voor bedrijfsartsen liggen de gangbare tarieven doorgaans ruim boven zo'n ondergrens. Blijf op de hoogte van wet- en regelgeving (o.a. Wet DBA, VBAR) zodat je tarief én je samenwerking juridisch helder zijn.

## Wees transparant op het platform

Op ArboMatcher kun je je tarief of een bandbreedte in je profiel vermelden. Dat schept helderheid voor organisaties en voorkomt onnodige gesprekken over budget. Je kunt altijd per opdracht afwijken als de omstandigheden dat rechtvaardigen.`,
  },
  {
    slug: 'arbomatcher-wet-vbar',
    title: 'ArboMatcher en de Wet VBAR: wat betekent dit voor jou?',
    date: '1 feb 2026',
    category: 'Algemeen',
    imageUrl: IMG.legal,
    imageAlt: 'Wetgeving en documenten',
    content: `De Wet verbetering poortwachter en het debat over de Wet VBAR (Verduidelijking Beoordeling Arbeidsrelaties) hebben gevolgen voor verzuim, re-integratie en de inzet van zzp'ers in Nederland. Op ArboMatcher werken organisaties en professionals die met deze thema's te maken hebben. Hier een overzicht wat de ontwikkelingen inhouden en wat het platform voor jou kan betekenen.

## Wat is de Wet VBAR?

Het wetsvoorstel VBAR richt zich op verduidelijking van arbeidsrelaties en het tegengaan van schijnzelfstandigheid. Daarnaast blijft de bestaande wetgeving rond verzuim en poortwachter van kracht: werkgevers moeten binnen bepaalde termijnen een bedrijfsarts inschakelen; de arts beoordeelt en begeleidt het verzuim en de re-integratie. Goede samenwerking tussen werkgever, arts en eventueel andere partijen is cruciaal.

- Verzuim: verplichte inzet bedrijfsarts, termijnen
- Re-integratie: verantwoordelijkheden werkgever en arts
- Schijnzelfstandigheid: wanneer wordt een zzp'er als werknemer gezien?

## Voor organisaties

Heeft je organisatie behoefte aan een bedrijfsarts of arbo-arts (in loondienst, als ZZP of via detachering)? Via ArboMatcher vind je BIG-geregistreerde professionals voor verzuimbegeleiding, preventief medisch onderzoek of advies. Je plaatst een opdracht, ontvangt reacties van gekwalificeerde professionals en kiest op basis van profiel en beschikbaarheid. Zo voldoe je aan de eisen voor verzuimbegeleiding en werk je met betrouwbare partners.

- Alle professionals op het platform zijn BIG-geregistreerd
- Duidelijke afspraken over inzet en contractvorm
- Geen verborgen kosten; direct contact met de professional

## Voor professionals

De vraag naar bedrijfsartsen en arbo-professionals blijft groot. Op het platform zie je opdrachten van arbodiensten en werkgevers. Door je profiel compleet te houden en je BIG-verificatie up-to-date te houden, maak je kans op opdrachten die bij je expertise en beschikbaarheid passen. Houd daarnaast de ontwikkelingen rond minimumtarief en VBAR in de gaten; voor bedrijfsartsen liggen gangbare tarieven doorgaans boven de voorgestelde ondergrens.

## Blijf op de hoogte

Wet- en regelgeving kan wijzigen. We houden onze community en artikelen bij met algemene uitleg; voor juridisch of fiscaal advies raadpleeg altijd een deskundige. Heb je vragen over hoe ArboMatcher aansluit op verzuimwetgeving of inzet van professionals in jouw situatie? Neem contact met ons op.`,
  },
  {
    slug: 'profiel-optimaliseren',
    title: 'Je profiel optimaliseren: zo val je op bij organisaties',
    date: '28 jan 2026',
    category: 'Voor professionals',
    imageUrl: IMG.profile,
    imageAlt: 'Profiel en cv',
    content: `Een sterk profiel op ArboMatcher vergroot de kans dat organisaties je uitnodigen of dat je reacties snel worden opgepakt. In dit artikel lees je wat organisaties het meest belangrijk vinden en hoe jij je profiel daarmee scherper maakt.

## Volledig en actueel profiel

Zorg dat alle velden ingevuld zijn: BIG-nummer (geverifieerd), specialismen, regio('s), beschikbaarheid en een korte bio. Een onvolledig profiel oogt onprofessioneel en organisaties filteren vaak op "compleet profiel". Werk je gegevens bij zodra iets verandert – bijvoorbeeld een nieuwe specialisatie of andere beschikbaarheid.

- BIG verifieerd en zichtbaar
- Specialismen en regio's ingevuld
- Beschikbaarheid (uren/week, startdatum) up-to-date

## Een duidelijke bio

Schrijf in een paar zinnen wie je bent, wat je doet en wat je toegevoegde waarde is. Bijvoorbeeld: ervaring met langdurig verzuim, focus op mentale belasting, of juist breed inzetbaar voor PMO en verzuim. Geen lange verhalen; wel concreet en relevant voor organisaties die snel moeten scannen.

- Wie ben je en wat is je achtergrond?
- Waar ben je goed in of waar wil je je op richten?
- Wat maakt jouw inzet waardevol voor een organisatie?

## Specialismen en regio

Wees eerlijk en specifiek. "Bedrijfsarts" is goed; "verzuimbegeleiding en re-integratie" of "preventief medisch onderzoek" maakt het nog duidelijker. Kies de regio's waar je daadwerkelijk wilt werken; organisaties zoeken vaak op regio en willen weten of je ter plaatse of op afstand beschikbaar bent.

- Noem concrete specialismen of type opdrachten
- Geef aan of je op locatie, hybride of op afstand werkt
- Werkgebied: welke regio's of afstand ben je bereid te reizen?

## Uurtarief en beschikbaarheid

Als je een indicatie van je tarief en je beschikbaarheid (uren per week, startdatum) vermeldt, weten organisaties sneller of je past. Je hoeft niet tot op de euro precies te zijn; een bandbreedte of "in overleg" kan ook. Reageer daarnaast tijdig op opdrachten en op berichten; dat verhoogt je zichtbaarheid en betrouwbaarheid op het platform.

- Tarief of bandbreedte vermelden vergroot de kans op serieuze matches
- Duidelijke beschikbaarheid voorkomt misverstanden
- Snel reageren wordt door organisaties gewaardeerd`,
  },
];

export function getArticleBySlug(slug: string): CommunityArticle | undefined {
  return COMMUNITY_ARTICLES.find((a) => a.slug === slug);
}
