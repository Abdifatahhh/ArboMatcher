export interface FakeJob {
  id: string;
  title: string;
  region: string;
  job_type: string;
  hours_per_week: number;
  description: string;
  created_at: string;
  expertise: string;
  remote_type: string;
  duration_weeks: number;
  full_description: string;
}

export const fakeJobs: FakeJob[] = [
  {
    id: 'fake-1',
    title: 'Bedrijfsarts voor grote arbodienst regio Amsterdam',
    region: 'Noord-Holland',
    job_type: 'ZZP',
    hours_per_week: 24,
    description: 'Wij zoeken een ervaren bedrijfsarts voor onze vestiging in Amsterdam. U bent verantwoordelijk voor verzuimbegeleiding en preventief medisch onderzoek.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Voor een grote landelijke arbodienst zoeken wij een ervaren bedrijfsarts voor onze vestiging in Amsterdam.

Als bedrijfsarts bent u verantwoordelijk voor:
- Verzuimbegeleiding van medewerkers
- Uitvoeren van preventief medisch onderzoek (PMO)
- Arbeidsomstandighedenspreekuur
- Advisering aan werkgevers over gezondheid en arbeid
- Samenwerking met casemanagers en arbeidsdeskundigen

Wat wij bieden:
- Marktconform uurtarief
- Flexibele werktijden
- Professionele ondersteuning
- Moderne werkplek in Amsterdam
- Langdurige samenwerking mogelijk`
  },
  {
    id: 'fake-2',
    title: 'Verzekeringsarts WIA-beoordelingen',
    region: 'Utrecht',
    job_type: 'ZZP',
    hours_per_week: 32,
    description: 'Voor een landelijke verzekeraar zoeken wij een verzekeringsarts voor het uitvoeren van WIA-beoordelingen en medische adviezen.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'ONSITE',
    duration_weeks: 26,
    full_description: `Een gerenommeerde landelijke verzekeraar is op zoek naar een verzekeringsarts voor het uitvoeren van WIA-beoordelingen.

Uw werkzaamheden:
- Uitvoeren van sociaal-medische beoordelingen
- Opstellen van medische rapportages
- Adviseren over arbeidsongeschiktheid
- Behandelen van bezwaarzaken
- Deelname aan overleg met arbeidsdeskundigen

Wij vragen:
- BIG-registratie als arts
- Ervaring met WIA-beoordelingen is een pré
- Goede communicatieve vaardigheden
- Zelfstandige werkhouding

Wij bieden:
- Uitstekende arbeidsvoorwaarden
- Professionele werkomgeving
- Goede bereikbaarheid met OV`
  },
  {
    id: 'fake-3',
    title: 'Bedrijfsarts verzuimbegeleiding MKB',
    region: 'Zuid-Holland',
    job_type: 'ZZP',
    hours_per_week: 16,
    description: 'Flexibele inzet als bedrijfsarts voor MKB-bedrijven in de regio Rotterdam. Zelfstandige werkwijze met ondersteuning van ervaren casemanagers.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Voor onze MKB-klanten in de regio Rotterdam zoeken wij een flexibele bedrijfsarts.

De opdracht:
- Verzuimbegeleiding voor diverse MKB-bedrijven
- Spreekuren op verschillende locaties
- Telefonische consulten mogelijk
- Samenwerking met ervaren casemanagers

Profiel:
- Geregistreerd bedrijfsarts of arts met arbeid-gezondheid
- Flexibel inzetbaar
- Zelfstandige werkhouding
- Affiniteit met MKB

Arbeidsvoorwaarden:
- Concurrerend uurtarief
- Reiskostenvergoeding
- Flexibele planning
- Ondersteuning door backoffice`
  },
  {
    id: 'fake-4',
    title: 'Medisch adviseur letselschade',
    region: 'Noord-Brabant',
    job_type: 'DETACHERING',
    hours_per_week: 40,
    description: 'Als medisch adviseur beoordeel je letselschadedossiers en geef je advies over de medische aspecten van claims.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Een grote verzekeraar zoekt een medisch adviseur voor de afdeling letselschade.

Functie-inhoud:
- Beoordelen van letselschadedossiers
- Opstellen van medische adviezen
- Contact met behandelend artsen
- Adviseren over causaal verband
- Deelname aan expertmeetings

Functie-eisen:
- Afgeronde opleiding geneeskunde
- Ervaring als medisch adviseur
- Kennis van letselschade
- Analytisch vermogen
- Goede schriftelijke vaardigheden

Arbeidsvoorwaarden:
- Salaris conform CAO
- Pensioenregeling
- 25 vakantiedagen
- Thuiswerkmogelijkheden`
  },
  {
    id: 'fake-5',
    title: 'Bedrijfsarts voor gemeente',
    region: 'Gelderland',
    job_type: 'ZZP',
    hours_per_week: 24,
    description: 'De gemeente Arnhem zoekt een bedrijfsarts voor begeleiding van medewerkers en advisering aan management over gezondheid en arbeid.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'ONSITE',
    duration_weeks: 26,
    full_description: `De gemeente Arnhem is op zoek naar een bedrijfsarts voor een interim opdracht.

Taken:
- Verzuimbegeleiding gemeentemedewerkers
- Preventief medisch onderzoek
- Advisering aan management
- Arbeidsomstandighedenspreekuur
- Deelname aan sociaal medisch team

Gevraagd:
- Registratie als bedrijfsarts
- Ervaring in publieke sector is een pré
- Kennis van overheidsorganisaties
- Teamspeler

Geboden:
- Marktconform tarief
- Werkplek op het gemeentehuis
- Mogelijkheid tot verlenging`
  },
  {
    id: 'fake-6',
    title: 'Casemanager arbeid & gezondheid',
    region: 'Overijssel',
    job_type: 'LOONDIENST',
    hours_per_week: 36,
    description: 'Coördineer re-integratietrajecten en werk samen met bedrijfsartsen voor optimale terugkeer naar werk van zieke medewerkers.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'casemanager-verzuim',
    remote_type: 'HYBRID',
    duration_weeks: 0,
    full_description: `Voor een arbodienst in Overijssel zoeken wij een casemanager arbeid & gezondheid.

Werkzaamheden:
- Coördinatie van re-integratietrajecten
- Contact onderhouden met werkgevers en werknemers
- Samenwerking met bedrijfsartsen
- Bewaken van Wet verbetering poortwachter
- Administratieve afhandeling

Profiel:
- HBO-opleiding in relevante richting
- Ervaring als casemanager
- Kennis van sociale wetgeving
- Communicatief sterk
- Nauwkeurig

Wij bieden:
- Vast dienstverband
- Salaris €3.500 - €4.500
- Goede secundaire voorwaarden
- Opleidingsmogelijkheden`
  },
  {
    id: 'fake-7',
    title: 'Verzekeringsarts Sociaal Medische Zaken',
    region: 'Limburg',
    job_type: 'ZZP',
    hours_per_week: 20,
    description: 'Uitvoeren van sociaal-medische beoordelingen voor de WIA en Ziektewet bij een grote uitvoeringsinstantie.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'ONSITE',
    duration_weeks: 52,
    full_description: `Een grote uitvoeringsorganisatie zoekt verzekeringsartsen voor sociaal-medische beoordelingen.

De functie:
- WIA-beoordelingen
- Ziektewet-beoordelingen
- Opstellen van rapportages
- Overleg met arbeidsdeskundigen
- Bijwonen van hoorzittingen

Vereisten:
- BIG-geregistreerd arts
- Bij voorkeur verzekeringsarts
- Ervaring met SMZ is een pré
- Zelfstandig kunnen werken

Voorwaarden:
- Aantrekkelijk uurtarief
- Flexibele inzet mogelijk
- Werkplek in Maastricht
- Langdurige opdracht`
  },
  {
    id: 'fake-8',
    title: 'Bedrijfsarts preventie en PMO',
    region: 'Noord-Holland',
    job_type: 'ZZP',
    hours_per_week: 8,
    description: 'Focus op preventief medisch onderzoek en gezondheidsbevordering voor bedrijven in de regio Haarlem.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'pob',
    remote_type: 'ONSITE',
    duration_weeks: 52,
    full_description: `Arbodienst zoekt bedrijfsarts met focus op preventie voor de regio Haarlem.

Werkzaamheden:
- Uitvoeren van PMO's
- Gezondheidsvoorlichting
- Werkplekonderzoeken
- Advisering over preventiebeleid
- Leefstijlinterventies

Gezocht:
- Geregistreerd bedrijfsarts
- Affiniteit met preventie
- Enthousiast en proactief
- Goede presentatievaardigheden

Condities:
- 1 dag per week
- Marktconform tarief
- Locatie Haarlem
- Uitbreiding mogelijk`
  },
  {
    id: 'fake-9',
    title: 'Medisch adviseur zorgverzekeraar',
    region: 'Utrecht',
    job_type: 'DETACHERING',
    hours_per_week: 32,
    description: 'Beoordeel machtigingsaanvragen en geef medisch advies over vergoedingen van zorgkosten.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Grote zorgverzekeraar zoekt medisch adviseur voor de afdeling zorginkoop.

Taken:
- Beoordelen van machtigingsaanvragen
- Medische advisering
- Contact met zorgaanbieders
- Bijdragen aan beleidsontwikkeling
- Kwaliteitscontroles

Eisen:
- Afgeronde opleiding geneeskunde
- Kennis van zorgverzekeringen
- Analytisch denkvermogen
- Klantgerichte instelling

Aanbod:
- Detachering voor 1 jaar
- Marktconform salaris
- Hybride werken mogelijk
- Uitstekende bereikbaarheid`
  },
  {
    id: 'fake-10',
    title: 'Bedrijfsarts industrie sector',
    region: 'Zuid-Holland',
    job_type: 'ZZP',
    hours_per_week: 40,
    description: 'Langdurige opdracht bij een groot industrieel bedrijf. Verzuimbegeleiding en arbeidsomstandighedenbeleid.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'ONSITE',
    duration_weeks: 52,
    full_description: `Groot industrieel bedrijf in de Rotterdamse haven zoekt een bedrijfsarts.

De opdracht:
- Verzuimbegeleiding 2000+ medewerkers
- Arbeidsomstandighedenbeleid
- Keuringen
- Preventief medisch onderzoek
- Advisering aan directie

Profiel:
- Geregistreerd bedrijfsarts
- Ervaring in industrie is een pré
- Kennis van gevaarlijke stoffen
- Leiderschapskwaliteiten

Voorwaarden:
- Fulltime opdracht
- Uitstekend tarief
- Eigen kantoor op locatie
- Parkeerplaats beschikbaar`
  },
  {
    id: 'fake-11',
    title: 'Arbeidsdeskundige re-integratie',
    region: 'Groningen',
    job_type: 'ZZP',
    hours_per_week: 24,
    description: 'Begeleiding van complexe re-integratietrajecten in samenwerking met bedrijfsartsen en werkgevers.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'arbo-arts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Arbodienst in Noord-Nederland zoekt een arbeidsdeskundige.

Werkzaamheden:
- Complexe re-integratietrajecten
- Arbeidsdeskundig onderzoek
- Functiemogelijkhedenlijst opstellen
- Overleg met bedrijfsartsen
- Rapportages voor UWV

Vereisten:
- Register Arbeidsdeskundige
- Ervaring met 1e en 2e spoor
- Regio Noord-Nederland
- Eigen vervoer

Arbeidsvoorwaarden:
- Flexibele inzet
- Concurrerend tarief
- Kilometervergoeding
- Thuiswerken deels mogelijk`
  },
  {
    id: 'fake-12',
    title: 'Verzekeringsarts bezwaar en beroep',
    region: 'Noord-Brabant',
    job_type: 'ZZP',
    hours_per_week: 32,
    description: 'Behandel bezwaar- en beroepszaken op het gebied van arbeidsongeschiktheid en sociale verzekeringen.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'ONSITE',
    duration_weeks: 26,
    full_description: `UWV zoekt verzekeringsarts voor bezwaar en beroep in regio Brabant.

Functie:
- Behandelen van bezwaarzaken
- Opstellen van rapportages
- Vertegenwoordiging bij rechtbank
- Herbeoordelingen
- Collegiaal overleg

Eisen:
- Verzekeringsarts
- Ervaring met B&B
- Juridische affiniteit
- Stressbestendig

Aanbod:
- Interim opdracht 6+ maanden
- Uitstekend tarief
- Werkplek in Eindhoven of Tilburg
- Goede begeleiding`
  },
  {
    id: 'fake-13',
    title: 'Bedrijfsarts financiële sector',
    region: 'Noord-Holland',
    job_type: 'ZZP',
    hours_per_week: 16,
    description: 'Verzuimbegeleiding en preventieve zorg voor medewerkers van een grote bank in Amsterdam.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Grote Nederlandse bank zoekt bedrijfsarts voor verzuimbegeleiding.

Taken:
- Verzuimspreekuur
- Preventief medisch onderzoek
- Advisering HR
- Psychische problematiek
- Burn-out preventie

Profiel:
- Geregistreerd bedrijfsarts
- Ervaring met financiële sector
- Kennis van psychische klachten
- Professionele uitstraling

Condities:
- 2 dagen per week
- Marktconform tarief
- Moderne werkplek Amsterdam Zuid
- Thuiswerken mogelijk`
  },
  {
    id: 'fake-14',
    title: 'Medisch adviseur arbeidsongeschiktheid',
    region: 'Gelderland',
    job_type: 'LOONDIENST',
    hours_per_week: 36,
    description: 'Medische beoordeling en advisering voor arbeidsongeschiktheidsverzekeringen bij een grote verzekeraar.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'HYBRID',
    duration_weeks: 0,
    full_description: `Grote verzekeraar in Arnhem zoekt medisch adviseur voor vaste aanstelling.

Werkzaamheden:
- Beoordelen van AO-claims
- Medische rapportages
- Contact met behandelend artsen
- Advisering aan acceptatie
- Beleidsontwikkeling

Eisen:
- Arts met relevante ervaring
- Kennis van verzekeringsgeneeskunde
- Analytisch vermogen
- Teamspeler

Arbeidsvoorwaarden:
- Vast contract
- Salaris €6.000 - €8.000
- Pensioenregeling
- 30 vakantiedagen
- Hybride werken`
  },
  {
    id: 'fake-15',
    title: 'Bedrijfsarts zorg en welzijn',
    region: 'Zuid-Holland',
    job_type: 'ZZP',
    hours_per_week: 24,
    description: 'Inzet bij zorginstellingen voor verzuimbegeleiding van zorgpersoneel en advies over werkbelasting.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'ONSITE',
    duration_weeks: 26,
    full_description: `Zorggroep in Zuid-Holland zoekt bedrijfsarts voor meerdere locaties.

De opdracht:
- Verzuimbegeleiding zorgpersoneel
- Advisering over werkbelasting
- Spreekuren op verschillende locaties
- Samenwerking met HR
- Preventieve interventies

Gezocht:
- Geregistreerd bedrijfsarts
- Ervaring in de zorg
- Affiniteit met fysieke belasting
- Flexibel inzetbaar

Voorwaarden:
- 3 dagen per week
- Marktconform tarief
- Reiskostenvergoeding
- Optie tot verlenging`
  },
  {
    id: 'fake-16',
    title: 'Consultant arbeid en gezondheid',
    region: 'Utrecht',
    job_type: 'ZZP',
    hours_per_week: 20,
    description: 'Advies en implementatie van gezondheidsbeleid bij middelgrote en grote organisaties.',
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'arbo-arts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Adviesbureau zoekt consultant arbeid en gezondheid.

Rol:
- Advies over gezondheidsbeleid
- Implementatie van interventies
- Workshops en trainingen
- Projectmanagement
- Klantrelatiebeheer

Profiel:
- Achtergrond in arbeid en gezondheid
- Advieservaring
- Ondernemend
- Netwerker

Aanbod:
- Flexibele opdrachten
- Aantrekkelijk tarief
- Werken vanuit Utrecht
- Afwisselend werk`
  },
  {
    id: 'fake-17',
    title: 'Verzekeringsarts claimbeoordeling',
    region: 'Overijssel',
    job_type: 'DETACHERING',
    hours_per_week: 40,
    description: 'Beoordeling van verzekeringsclaims en opstellen van medische rapportages voor een grote verzekeraar.',
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'ONSITE',
    duration_weeks: 52,
    full_description: `Verzekeraar in Zwolle zoekt verzekeringsarts voor claimbeoordeling.

Taken:
- Beoordelen van claims
- Medische rapportages
- Advies aan schadebehandelaars
- Dossieranalyse
- Fraudedetectie

Vereisten:
- Arts, bij voorkeur verzekeringsarts
- Ervaring met claimbehandeling
- Oog voor detail
- Integer

Voorwaarden:
- Detachering 1 jaar
- Fulltime
- Goed salaris
- Moderne werkplek Zwolle`
  },
  {
    id: 'fake-18',
    title: 'Bedrijfsarts onderwijssector',
    region: 'Noord-Holland',
    job_type: 'ZZP',
    hours_per_week: 12,
    description: 'Verzuimbegeleiding voor onderwijspersoneel bij diverse scholen in de regio Amsterdam-Noord.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Scholengroep zoekt bedrijfsarts voor regio Amsterdam-Noord.

Werkzaamheden:
- Verzuimbegeleiding docenten
- Spreekuren op scholen
- Advisering aan schooldirecties
- Preventie werkdruk
- Samenwerking met HR

Profiel:
- Geregistreerd bedrijfsarts
- Affiniteit met onderwijs
- Kennis van psychische klachten
- Communicatief sterk

Condities:
- 1,5 dag per week
- Flexibele tijden
- Marktconform tarief
- Langdurige opdracht`
  },
  {
    id: 'fake-19',
    title: 'Medisch adviseur pensioenfonds',
    region: 'Limburg',
    job_type: 'ZZP',
    hours_per_week: 24,
    description: 'Medische advisering bij arbeidsongeschiktheidspensioenen en invaliditeitsbeoordelingen.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'ONSITE',
    duration_weeks: 26,
    full_description: `Pensioenfonds in Maastricht zoekt medisch adviseur.

De functie:
- Beoordeling invaliditeitsaanvragen
- Advies over arbeidsongeschiktheidspensioen
- Contact met keuringsartsen
- Rapportages voor bestuur
- Beleidsadvisering

Eisen:
- Arts met ervaring
- Kennis van pensioenen
- Analytisch vermogen
- Discretie

Aanbod:
- 3 dagen per week
- Goede vergoeding
- Werkplek Maastricht
- Inhoudelijk interessant werk`
  },
  {
    id: 'fake-20',
    title: 'Bedrijfsarts transport en logistiek',
    region: 'Zuid-Holland',
    job_type: 'LOONDIENST',
    hours_per_week: 32,
    description: 'Structurele inzet voor grote logistieke organisatie. Focus op preventie en duurzame inzetbaarheid.',
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'ONSITE',
    duration_weeks: 0,
    full_description: `Groot logistiek bedrijf zoekt bedrijfsarts voor vaste aanstelling.

Rol:
- Verzuimbegeleiding
- Keuringen chauffeurs
- Preventiebeleid
- Duurzame inzetbaarheid
- Advisering directie

Gezocht:
- Geregistreerd bedrijfsarts
- Ervaring met fysiek werk
- Kennis van keuringen
- Hands-on mentaliteit

Arbeidsvoorwaarden:
- Vast contract
- Goed salaris
- Auto van de zaak
- Werkplek Rotterdam`
  },
  {
    id: 'fake-21',
    title: 'Specialist arbeid en psyche',
    region: 'Noord-Brabant',
    job_type: 'ZZP',
    hours_per_week: 16,
    description: 'Begeleiding van medewerkers met psychische klachten en advisering over werkhervatting.',
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'arbo-arts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Arbodienst zoekt specialist arbeid en psyche.

Werkzaamheden:
- Begeleiding bij burn-out
- Advisering werkhervatting
- Psycho-educatie
- Coaching leidinggevenden
- Preventieve interventies

Profiel:
- Achtergrond in A&G psychologie
- Ervaring met werkgerelateerde klachten
- Communicatief sterk
- Zelfstandig

Condities:
- 2 dagen per week
- Aantrekkelijk tarief
- Werkgebied Brabant
- Thuiswerken mogelijk`
  },
  {
    id: 'fake-22',
    title: 'Verzekeringsarts Wajong',
    region: 'Friesland',
    job_type: 'ZZP',
    hours_per_week: 28,
    description: 'Uitvoeren van Wajong-beoordelingen voor jongeren met een arbeidsbeperking.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'ONSITE',
    duration_weeks: 26,
    full_description: `UWV Friesland zoekt verzekeringsarts voor Wajong-beoordelingen.

Taken:
- Wajong-beoordelingen
- Medische rapportages
- Gesprekken met jongeren
- Overleg met arbeidsdeskundigen
- Advisering over participatie

Vereisten:
- Verzekeringsarts
- Affiniteit met jongeren
- Kennis van beperkingen
- Empathisch

Voorwaarden:
- Interim 6 maanden
- Goede vergoeding
- Werkplek Leeuwarden
- Maatschappelijk relevant werk`
  },
  {
    id: 'fake-23',
    title: 'Bedrijfsarts overheid',
    region: 'Utrecht',
    job_type: 'DETACHERING',
    hours_per_week: 36,
    description: 'Langdurige detachering bij een ministerie voor verzuimbegeleiding en arbogerelateerd advies.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Ministerie in Den Haag zoekt bedrijfsarts via detachering.

De opdracht:
- Verzuimbegeleiding ambtenaren
- Arbeidsomstandighedenadvies
- PMO
- Advisering aan directie
- Beleidsontwikkeling

Profiel:
- Geregistreerd bedrijfsarts
- Ervaring bij overheid
- Discretie
- Politieke sensitiviteit

Aanbod:
- Detachering 1 jaar
- Mogelijkheid vast
- Marktconform tarief
- Hybride werken
- Werkplek Den Haag`
  },
  {
    id: 'fake-24',
    title: 'Medisch adviseur rechtsbijstand',
    region: 'Gelderland',
    job_type: 'ZZP',
    hours_per_week: 12,
    description: 'Medische advisering bij juridische geschillen over letselschade en arbeidsongeschiktheid.',
    created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'REMOTE',
    duration_weeks: 52,
    full_description: `Rechtsbijstandverzekeraar zoekt medisch adviseur.

Werkzaamheden:
- Medische dossieranalyse
- Advies aan juristen
- Beoordeling expertises
- Contact met behandelend artsen
- Rapportages

Eisen:
- Arts
- Ervaring als medisch adviseur
- Juridische interesse
- Schriftelijk sterk

Condities:
- Flexibele uren
- Thuiswerken mogelijk
- Goed tarief
- Interessant werk`
  },
  {
    id: 'fake-25',
    title: 'Bedrijfsarts retail sector',
    region: 'Noord-Holland',
    job_type: 'ZZP',
    hours_per_week: 20,
    description: 'Verzuimbegeleiding voor winkelketens met focus op fysieke belasting en werkdruk.',
    created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'HYBRID',
    duration_weeks: 26,
    full_description: `Retailorganisatie zoekt bedrijfsarts voor meerdere filialen.

Taken:
- Verzuimbegeleiding winkelpersoneel
- Spreekuren op hoofdkantoor
- Advisering aan management
- Fysieke belastingsproblematiek
- Werkdrukpreventie

Profiel:
- Geregistreerd bedrijfsarts
- Affiniteit met retail
- Praktisch ingesteld
- Communicatief

Voorwaarden:
- 2,5 dag per week
- Marktconform tarief
- Werkplek Amsterdam
- Mogelijkheid verlenging`
  },
  {
    id: 'fake-26',
    title: 'Adviseur duurzame inzetbaarheid',
    region: 'Zeeland',
    job_type: 'LOONDIENST',
    hours_per_week: 32,
    description: 'Ontwikkelen en implementeren van programmas voor duurzame inzetbaarheid van medewerkers.',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'pob',
    remote_type: 'HYBRID',
    duration_weeks: 0,
    full_description: `Middelgroot bedrijf in Zeeland zoekt adviseur duurzame inzetbaarheid.

Rol:
- Beleidsontwikkeling DI
- Implementatie programmas
- Workshops en trainingen
- Monitoring en evaluatie
- Advisering directie

Gezocht:
- Achtergrond A&G
- Ervaring met DI-projecten
- Projectmanagement
- Enthousiast

Arbeidsvoorwaarden:
- Vast contract
- Salaris €4.000 - €5.000
- Ontwikkelingsmogelijkheden
- Deels thuiswerken`
  },
  {
    id: 'fake-27',
    title: 'Verzekeringsarts herbeoordelingen',
    region: 'Zuid-Holland',
    job_type: 'ZZP',
    hours_per_week: 24,
    description: 'Uitvoeren van herbeoordelingen WIA bij veranderde medische omstandigheden.',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'ONSITE',
    duration_weeks: 52,
    full_description: `UWV Rotterdam zoekt verzekeringsarts voor herbeoordelingen.

Werkzaamheden:
- WIA-herbeoordelingen
- Rapportages
- Gesprekken met cliënten
- Overleg met arbeidsdeskundigen
- Bijwonen hoorzittingen

Vereisten:
- Verzekeringsarts
- Ervaring met herbeoordelingen
- Nauwkeurig
- Communicatief

Voorwaarden:
- 3 dagen per week
- Uitstekend tarief
- Werkplek Rotterdam
- Langdurige opdracht`
  },
  {
    id: 'fake-28',
    title: 'Bedrijfsarts technische sector',
    region: 'Noord-Brabant',
    job_type: 'ZZP',
    hours_per_week: 32,
    description: 'Verzuimbegeleiding en preventie voor technische bedrijven in de regio Eindhoven.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'ONSITE',
    duration_weeks: 26,
    full_description: `Technisch bedrijf in Eindhoven zoekt bedrijfsarts.

De opdracht:
- Verzuimbegeleiding
- Keuringen
- Arbeidsomstandigheden
- PMO
- Advisering

Profiel:
- Geregistreerd bedrijfsarts
- Ervaring in techniek
- Kennis van arbo
- Praktisch

Condities:
- 4 dagen per week
- Goed tarief
- Werkplek Eindhoven
- Interessante omgeving`
  },
  {
    id: 'fake-29',
    title: 'Medisch adviseur verzekeringen',
    region: 'Flevoland',
    job_type: 'DETACHERING',
    hours_per_week: 40,
    description: 'Brede rol als medisch adviseur voor diverse verzekeringsproducten en claimbeoordelingen.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'verzekeringsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Verzekeraar in Almere zoekt medisch adviseur.

Functie:
- Claimbeoordeling diverse producten
- Medische advisering
- Dossieranalyse
- Contact externe partijen
- Kwaliteitsbewaking

Eisen:
- Arts
- Brede ervaring
- Analytisch
- Klantgericht

Aanbod:
- Detachering 1 jaar
- Fulltime
- Goed salaris
- Moderne werkplek Almere
- Hybride werken`
  },
  {
    id: 'fake-30',
    title: 'Bedrijfsarts ICT sector',
    region: 'Utrecht',
    job_type: 'ZZP',
    hours_per_week: 16,
    description: 'Verzuimbegeleiding voor tech-bedrijven met focus op burn-out preventie en werkstress.',
    created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    expertise: 'bedrijfsarts',
    remote_type: 'HYBRID',
    duration_weeks: 52,
    full_description: `Tech-bedrijf in Utrecht zoekt bedrijfsarts.

Werkzaamheden:
- Verzuimbegeleiding IT-professionals
- Burn-out preventie
- Werkstress aanpak
- Spreekuren
- Advisering HR

Profiel:
- Geregistreerd bedrijfsarts
- Affiniteit met ICT
- Kennis van psychische klachten
- Modern en toegankelijk

Condities:
- 2 dagen per week
- Marktconform tarief
- Moderne werkplek Utrecht
- Thuiswerken mogelijk
- Jong en dynamisch team`
  }
];

export const getFakeJobById = (id: string): FakeJob | undefined => {
  return fakeJobs.find(job => job.id === id);
};
