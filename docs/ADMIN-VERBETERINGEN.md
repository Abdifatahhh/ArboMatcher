# Admin-omgeving – verbeteringen die super handig zijn

Op basis van de huidige admin (Dashboard, Verificaties, Artsen, Gebruikers, Opdrachtgevers, Opdrachten, Reacties, Abonnementen, Instellingen) zijn dit verbeteringen die het beheer een stuk makkelijker maken.

---

## 1. Badges in de sidebar (aanbevolen)

**Nu:** Je ziet pas op het dashboard hoeveel verificaties/reacties wachten.

**Idee:** In de navigatie naast "BIG Verificaties" en "Reacties" een **badge** met het aantal dat aandacht nodig heeft (bijv. PENDING verificaties, PENDING reacties).

- Voordeel: In één oogopslag zie je waar je moet zijn, zonder eerst het dashboard te openen.
- Technisch: Zelfde counts als op het dashboard (bijv. uit AuthContext of een lichtgewicht admin-stats hook) in de sidebar tonen.

---

## 2. Afwijzingsreden zonder `window.prompt`

**Nu:** Bij "Afwijzen" op Verificaties wordt `window.prompt('Reden voor afwijzing (optioneel):')` gebruikt.

**Idee:** Een **modal** of **inline veld** voor de afwijzingsreden:
- Klik op "Afwijzen" → modal opent met tekstveld "Reden (optioneel)" + knop "Afwijzen" / "Annuleren".
- Reden wordt in `verification_reason` opgeslagen en (optioneel) getoond op het arts-profiel.

- Voordeel: Professioneler, werkt beter op mobiel, reden is altijd vastgelegd.
- Plek: `Admin/Verificaties.tsx` + eventueel een kleine `RejectReasonModal` component.

---

## 3. Export naar CSV/Excel

**Nu:** Data alleen in de app bekijken.

**Idee:** Op elke overzichtspagina een knop **"Exporteer CSV"** (of Excel):
- **Verificaties / Artsen:** Naam, e-mail, BIG-nummer, verificatiestatus, datum.
- **Gebruikers:** Naam, e-mail, rol, status, aanmelddatum.
- **Opdrachten:** Titel, opdrachtgever, status, datum, regio.
- **Reacties:** Opdracht, arts, status, datum.

- Voordeel: Rapportage, back-up, analyse in Excel zonder extra tools.
- Technisch: Client-side: huidige gefilterde lijst (of huidige pagina) naar CSV string en download. Optioneel later server-side voor grote exports.

---

## 4. Algemene zoekbalk (admin search)

**Nu:** Per sectie apart zoeken (artsen, gebruikers, opdrachten, etc.).

**Idee:** **Eén zoekbalk** in de admin-header/sidebar:
- Zoekterm → zoekt tegelijk (of in stappen) in gebruikers, artsen (BIG/naam), opdrachten (titel/bedrijf).
- Resultaten: gegroepeerd (bijv. "Gebruikers (2)", "Artsen (1)", "Opdrachten (3)") met links naar de juiste detailpagina.

- Voordeel: Snel iemand of een opdracht vinden zonder te weten in welke sectie die zit.
- Technisch: Zoek-API of meerdere Supabase-queries; resultaten in een dropdown of aparte "Zoekresultaten"-pagina.

---

## 5. Directe links naar eerste "aandacht nodig"

**Nu:** Dashboard toont "X verificaties wachtend" en "Y sollicitaties in behandeling" met links naar de lijstpagina.

**Idee:** Extra knoppen/links:
- **"Ga naar eerste verificatie"** → link naar `/admin/artsen/{id}` van de oudste PENDING arts (of eerste in de lijst).
- **"Ga naar eerste reactie"** → link naar de eerste PENDING sollicitatie (bijv. in een modal of aparte detailpagina).

- Voordeel: Vanuit het dashboard in één klik naar het eerste item dat beoordeeld moet worden.
- Technisch: Bij het ophalen van activity/counts ook het eerste relevante id meenemen en in de link gebruiken.

---

## 6. Filters in de URL (onthouden / deelbaar)

**Nu:** Filters (status, zoekterm, rol, etc.) verdwijnen bij terugnavigeren of verversen.

**Idee:** **Query parameters** gebruiken voor filters:
- Bijv. `/admin/verificaties?status=PENDING&search=jan`
- Bij laden: filters uit URL vullen; bij wijziging filter: URL updaten (history.replaceState of React Router search params).

- Voordeel: Filters blijven behouden bij terug/verversen; je kunt een link naar een gefilterde lijst delen of bookmarken.
- Plek: Alle admin-lijstpagina’s (Verificaties, Artsen, Gebruikers, Opdrachten, Reacties, Abonnementen).

---

## 7. Bulkacties op Verificaties en Reacties

**Nu:** Alles per regel: één arts goedkeuren/afwijzen, één reactie status wijzigen.

**Idee:**
- **Verificaties:** Checkbox per rij + "Selecteer alle op deze pagina" + knoppen "Geselecteerde goedkeuren" / "Geselecteerde afwijzen" (bij afwijzen: één reden voor alle, of modal per eerste).
- **Reacties:** Zelfde idee: meerdere selecteren → "Markeer als shortlist" / "Afwijzen" / "Accepteren".

- Voordeel: Bij veel PENDING items scheelt dit veel klikken.
- Let op: Duidelijke feedback ("5 artsen goedgekeurd") en evt. bevestiging voor destructieve acties.

---

## 8. Admin-detailpagina voor een opdracht

**Nu:** Admin ziet opdrachten in een tabel en kan status wijzigen; geen eigen detailpagina.

**Idee:** **Admin-opdrachtdetail** (bijv. `/admin/opdrachten/:id`):
- Alle velden van de opdracht (titel, beschrijving, opdrachtgever, regio, type, status, datums).
- Lijst van **alle sollicitaties** op deze opdracht (arts, status, datum, bericht).
- Status opdracht wijzigen (DRAFT/PUBLISHED/CLOSED).
- Link naar opdrachtgever en naar (publieke) opdrachtpagina.

- Voordeel: Alles rond één opdracht op één plek; handig bij klantvragen of controles.
- Technisch: Nieuwe pagina + service-functie om opdracht + opdrachtgever + applications op te halen.

---

## 9. Korte audit / laatst gewijzigd

**Nu:** Geen zicht op wie wat wanneer heeft gewijzigd.

**Idee:** Eenvoudige vorm van "laatst gewijzigd":
- In **ArtsDetail**: "Laatst gewijzigd: {updated_at}" (evt. "door ..." als je later een `updated_by` toevoegt).
- In **Opdrachten/Reacties**: Kolom "Laatst gewijzigd" (updated_at) in de tabel.

Uitbreiding (later): echte **auditlog** (wie heeft welke arts goedgekeurd/afgewezen, welke opdracht status gewijzigd). Dat vraagt om een aparte tabel en triggers of app-logica.

- Voordeel: Basis voor verantwoording en "wie heeft dit gedaan".

---

## 10. Snelle statistieken op het dashboard

**Nu:** Al veel cijfers (verificaties, gebruikers, opdrachten, reacties, abonnementen, nieuw vandaag/deze week).

**Idee (optioneel):**
- **Simpele vergelijking:** "Deze week +X gebruikers t.o.v. vorige week" (als je vorige-week data ophaalt).
- **Grafiek:** Eenvoudige bar- of lijngrafiek "Registraties / opdrachten / sollicitaties per week (laatste 8 weken)" voor snel inzicht in trends.

- Voordeel: Beter gevoel voor groei en drukte zonder externe rapportage.

---

## Prioriteiten (kort)

| Prioriteit | Verbetering | Waarom |
|-----------|-------------|--------|
| **Hoog** | Badges in sidebar (PENDING-counts) | Direct zicht op wat aandacht nodig heeft. |
| **Hoog** | Afwijzingsreden via modal i.p.v. prompt | Betere UX en vastlegging reden. |
| **Hoog** | Export CSV op lijstpagina’s | Rapportage en back-up zonder extra systemen. |
| **Medium** | Filters in URL | Filters blijven behouden; deelbare links. |
| **Medium** | "Ga naar eerste verificatie/reactie" op dashboard | Sneller naar het eerste actie-item. |
| **Medium** | Admin opdracht-detailpagina | Alles van één opdracht + sollicitaties op één plek. |
| **Medium** | Algemene admin-zoekbalk | Snel zoeken over alle secties heen. |
| **Lager** | Bulkacties (verificaties/reacties) | Tijdsbesparing bij veel items. |
| **Lager** | Laatst gewijzigd / eenvoudige audit | Basis voor verantwoording. |
| **Lager** | Trendcijfers / mini-grafiek op dashboard | Inzicht in verloop. |

Als je wilt, kunnen we één of meer van deze punten (bijv. badges in sidebar, reject-modal, of CSV-export) concreet uitwerken in code.
