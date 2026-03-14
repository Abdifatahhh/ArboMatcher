export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Privacyverklaring & Cookies</h1>
          <p className="text-slate-300 text-lg">
            Hoe ArboMatcher B.V. omgaat met uw persoonsgegevens en cookies
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-12 pb-6 border-b border-slate-200">
          <p className="text-sm font-medium text-[#0F172A]/70 mb-2">Inhoudsopgave</p>
          <ol className="list-decimal list-inside space-y-1 text-[#0F172A]">
            <li><a href="#section_verantwoordelijke" className="text-[#0F172A] hover:underline">Verantwoordelijke</a></li>
            <li><a href="#section_gegevens" className="text-[#0F172A] hover:underline">Welke gegevens wij verwerken</a></li>
            <li><a href="#section_doelen" className="text-[#0F172A] hover:underline">Doelen en rechtsgronden</a></li>
            <li><a href="#section_bewaartermijnen" className="text-[#0F172A] hover:underline">Bewaartermijnen</a></li>
            <li><a href="#section_derden" className="text-[#0F172A] hover:underline">Delen met derden en verwerkers</a></li>
            <li><a href="#section_beveiliging" className="text-[#0F172A] hover:underline">Beveiliging</a></li>
            <li><a href="#section_rechten" className="text-[#0F172A] hover:underline">Uw rechten</a></li>
            <li><a href="#section_cookies" className="text-[#0F172A] hover:underline">Cookies</a></li>
            <li><a href="#section_wijzigingen" className="text-[#0F172A] hover:underline">Wijzigingen en contact</a></li>
          </ol>
        </nav>

        <div className="prose prose-lg max-w-none text-slate-700">
          <p className="mb-8">
            ArboMatcher B.V. respecteert uw privacy en gaat zorgvuldig om met uw persoonsgegevens. In deze privacyverklaring leggen wij uit welke gegevens wij verzamelen, voor welke doelen, op welke rechtsgrond, hoe lang wij ze bewaren en welke rechten u heeft. Dit document voldoet aan de Algemene Verordening Gegevensbescherming (AVG).
          </p>

          <h2 id="section_verantwoordelijke" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">1. Verantwoordelijke</h2>
          <p className="mb-4">
            De verantwoordelijke voor de verwerking van persoonsgegevens in het kader van het platform ArboMatcher is:
          </p>
          <p className="mb-4 font-medium text-[#0F172A]">
            ArboMatcher B.V.<br />
            E-mail: info@arbomatcher.nl
          </p>
          <p className="mb-4">
            Voor vragen over privacy of het uitoefenen van uw rechten kunt u contact opnemen via het bovenstaande e-mailadres of via het contactformulier op de website.
          </p>

          <h2 id="section_gegevens" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">2. Welke gegevens wij verwerken</h2>
          <p className="mb-3">Wij verwerken in ieder geval de volgende categorieën persoonsgegevens:</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong>Account- en registratiegegevens:</strong> e-mailadres, wachtwoord (gehashed), naam, telefoonnummer, rol (professional, organisatie).</li>
            <li><strong>Profielgegevens:</strong> door u ingevulde gegevens op uw profielpagina, zoals specialismen, regio, beschikbaarheid, korte omschrijving, en – voor professionals – BIG-nummer, RCM-nummer, beroepstype en eventueel geüpload cv.</li>
            <li><strong>Gegevens in het kader van opdrachten en reacties:</strong> door u geplaatste opdrachten, reacties op opdrachten, uitnodigingen en berichten die u via het platform verstuurt of ontvangt.</li>
            <li><strong>Technische en gebruikersgegevens:</strong> IP-adres, type browser, apparaat, loggegevens en – indien u daarvoor toestemming geeft – gegevens over het gebruik van de website (analytics).</li>
            <li><strong>Betalingsgegevens:</strong> voor zover u een betaald abonnement afneemt: factuurgegevens (naam, adres, e-mail) en betalingsstatus. Betalingsgegevens zoals creditcard- of bankgegevens worden indien van toepassing door onze betalingsverwerker verwerkt; wij ontvangen geen volledige kaartnummers.</li>
          </ul>
          <p className="mb-4">
            Voor de verificatie van BIG-registraties kunnen wij (of een door ons ingeschakelde partij) uw BIG-nummer controleren bij het BIG-register. Wij verwerken het resultaat van die controle (geverifieerd/niet geverifieerd) en de datum van verificatie.
          </p>

          <h2 id="section_doelen" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">3. Doelen en rechtsgronden</h2>
          <p className="mb-3">Wij verwerken uw gegevens voor de volgende doelen, op de aangegeven rechtsgrond (AVG):</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong>Uitvoering van de overeenkomst (art. 6 lid 1 onder b AVG):</strong> het aanmaken en beheren van uw account, het tonen en plaatsen van opdrachten en reacties, het verzenden van berichten, het beheren van abonnementen en facturatie, en de BIG-verificatie waar dat onderdeel is van onze dienstverlening.</li>
            <li><strong>Gerechtvaardigd belang (art. 6 lid 1 onder f AVG):</strong> het verbeteren en beveiligen van het platform, het afhandelen van klachten en geschillen, en het voldoen aan wettelijke verplichtingen (zoals bewaarplichten voor de administratie).</li>
            <li><strong>Toestemming (art. 6 lid 1 onder a AVG):</strong> het plaatsen van niet-noodzakelijke cookies (zoals analytische cookies) en – indien van toepassing – nieuwsbrieven of marketingcommunicatie. U kunt uw toestemming te allen tijde intrekken.</li>
          </ul>
          <p className="mb-4">
            Wij verwerken geen persoonsgegevens voor andere doelen dan hierboven beschreven, tenzij wij daar uitdrukkelijk toestemming voor vragen of de wet dit verplicht.
          </p>

          <h2 id="section_bewaartermijnen" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">4. Bewaartermijnen</h2>
          <p className="mb-4">
            Wij bewaren uw gegevens niet langer dan noodzakelijk. Concreet: account- en profielgegevens bewaren wij zolang uw account actief is en daarna nog een redelijke termijn voor het afhandelen van eventuele geschillen of klachten (doorgaans maximaal twee jaar na beëindiging, tenzij de wet een langere bewaarplicht oplegt). Gegevens in het kader van opdrachten en berichten bewaren wij eveneens zolang dat voor de dienstverlening en de administratie nodig is. Factuur- en betalingsgegevens bewaren wij in ieder geval conform de fiscale bewaarplicht (zeven jaar). Loggegevens en technische gegevens bewaren wij in de regel niet langer dan twaalf maanden, tenzij voor beveiliging of opsporing van misbruik een langere termijn gerechtvaardigd is.
          </p>
          <p className="mb-4">
            Na afloop van de bewaartermijn worden uw gegevens verwijderd of geanonimiseerd.
          </p>

          <h2 id="section_derden" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">5. Delen met derden en verwerkers</h2>
          <p className="mb-4">
            Wij verkopen uw persoonsgegevens niet aan derden. Wij kunnen uw gegevens wel laten verwerken door zorgvuldig geselecteerde verwerkers die ons ondersteunen bij hosting, database, e-mailverzending, betalingsafhandeling en (indien van toepassing) analyse. Met deze verwerkers sluiten wij verwerkersovereenkomsten af die voldoen aan de AVG. Uw gegevens kunnen daardoor worden opgeslagen of verwerkt binnen de Europese Economische Ruimte (EER) of in landen waarvoor de Europese Commissie een passendheidsbesluit heeft genomen, of met passende waarborgen (zoals standaardcontractbepalingen).
          </p>
          <p className="mb-4">
            Binnen het platform kunnen andere gebruikers (bijvoorbeeld organisaties of professionals) die met u in contact treden via opdrachten of berichten, de gegevens zien die u in dat kader deelt (zoals profielgegevens, reacties en berichten). Dat hoort bij de werking van het platform.
          </p>
          <p className="mb-4">
            Wij verstrekken gegevens aan autoriteiten alleen indien de wet ons daartoe verplicht of wij daartoe gerechtigd zijn.
          </p>

          <h2 id="section_beveiliging" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">6. Beveiliging</h2>
          <p className="mb-4">
            Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, onrechtmatige toegang, wijziging of openbaarmaking. Daarbij horen onder meer versleuteling (SSL/TLS) bij gegevensoverdracht, beveiligde toegang tot het beheergedeelte, regelmatige evaluatie van onze beveiliging en het afsluiten van verwerkersovereenkomsten met partijen die voor ons gegevens verwerken.
          </p>
          <p className="mb-4">
            Ondanks onze inspanningen kan geen enkele overdracht via internet of opslag volledig veilig worden gegarandeerd. Bij een datalek dat een risico voor uw rechten en vrijheden oplevert, melden wij dit aan de Autoriteit Persoonsgegevens en informeren wij betrokkenen waar de wet dat vereist.
          </p>

          <h2 id="section_rechten" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">7. Uw rechten</h2>
          <p className="mb-3">Op grond van de AVG heeft u in ieder geval de volgende rechten:</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong>Recht op inzage (art. 15 AVG):</strong> u kunt opvragen welke persoonsgegevens wij van u verwerken.</li>
            <li><strong>Recht op rectificatie (art. 16 AVG):</strong> u kunt onjuiste of onvolledige gegevens laten corrigeren of aanvullen.</li>
            <li><strong>Recht op wissing (art. 17 AVG):</strong> u kunt vragen uw gegevens te verwijderen, tenzij wij ze nog moeten bewaren op grond van de wet of een gerechtvaardigd belang.</li>
            <li><strong>Recht op beperking van verwerking (art. 18 AVG):</strong> in bepaalde gevallen kunt u vragen de verwerking te beperken (bijvoorbeeld tot opslag).</li>
            <li><strong>Recht op overdraagbaarheid (art. 20 AVG):</strong> voor gegevens die wij op basis van toestemming of overeenkomst geautomatiseerd verwerken, kunt u vragen die gegevens in een gangbaar formaat te ontvangen.</li>
            <li><strong>Recht van bezwaar (art. 21 AVG):</strong> tegen verwerking op grond van gerechtvaardigd belang kunt u bezwaar maken; wij wegen dan uw belangen af tegen die van ons.</li>
            <li><strong>Intrekken van toestemming:</strong> waar wij op basis van toestemming verwerken, kunt u die toestemming te allen tijde intrekken, zonder dat dit de rechtmatigheid van eerdere verwerking aantast.</li>
          </ul>
          <p className="mb-4">
            U kunt uw verzoek sturen naar info@arbomatcher.nl. Wij reageren binnen een maand. U heeft ook het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).
          </p>

          <h2 id="section_cookies" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">8. Cookies</h2>
          <p className="mb-4">
            Deze website maakt gebruik van cookies. Een cookie is een klein bestand dat met pagina’s van deze website wordt meegestuurd en door uw browser op uw apparaat wordt opgeslagen. Cookies worden onder meer gebruikt om de website te laten functioneren, uw voorkeuren te onthouden en – met uw toestemming – het gebruik van de website te analyseren.
          </p>

          <h3 className="text-xl font-semibold text-[#0F172A] mt-6 mb-3">8.1 Soorten cookies die wij gebruiken</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong>Noodzakelijke cookies:</strong> deze zijn strikt noodzakelijk voor het functioneren van de website, zoals inloggen, sessiebeheer en het onthouden van uw cookievoorkeuren. Zonder deze cookies kan de website niet correct werken. Voor deze cookies is geen toestemming vereist; wij baseren ons op ons gerechtvaardigd belang (een werkende website).</li>
            <li><strong>Functionele / voorkeurscookies:</strong> deze onthouden uw keuzes (zoals taal of regio) om uw ervaring te verbeteren. Zij worden geplaatst nadat u daarvoor toestemming heeft gegeven of na het accepteren van “alle cookies” in de cookiebanner.</li>
            <li><strong>Analytische cookies:</strong> deze helpen ons te begrijpen hoe bezoekers de website gebruiken (bijvoorbeeld aantal bezoekers, populaire pagina’s). De gegevens worden in regel geaggregeerd en niet gebruikt om u persoonlijk te identificeren. Wij plaatsen deze cookies alleen nadat u daarvoor toestemming heeft gegeven (bijvoorbeeld via “Alles accepteren” in de cookiebanner).</li>
          </ul>
          <p className="mb-4">
            Wij gebruiken geen cookies van derden voor advertentiedoeleinden (retargeting of tracking voor advertenties) tenzij wij dat uitdrukkelijk op de website vermelden en u daarvoor toestemming geeft.
          </p>

          <h3 className="text-xl font-semibold text-[#0F172A] mt-6 mb-3">8.2 Beheer van cookies</h3>
          <p className="mb-4">
            Bij uw eerste bezoek aan de website kunt u via de cookiebanner kiezen voor “Alleen noodzakelijk” of “Alles accepteren”. U kunt ook op “Voorkeuren” klikken om per categorie aan te geven wat u accepteert. Uw keuze wordt in een cookie opgeslagen zodat wij deze bij een volgend bezoek kunnen respecteren. U kunt uw browser zo instellen dat u geen cookies ontvangt of dat cookies worden gewist; daardoor kunnen sommige onderdelen van de website niet meer goed werken.
          </p>
          <p className="mb-4">
            Meer informatie over het uitschakelen of verwijderen van cookies vindt u in de helpfunctie van uw browser of op websites zoals allaboutcookies.org.
          </p>

          <h2 id="section_wijzigingen" className="text-2xl font-bold text-[#0F172A] mt-10 mb-4 scroll-mt-24">9. Wijzigingen en contact</h2>
          <p className="mb-4">
            Wij kunnen deze privacyverklaring van tijd tot tijd wijzigen, bijvoorbeeld bij wijziging van onze diensten of van de wetgeving. De actuele versie staat altijd op deze pagina; de datum van de laatste update vindt u onderaan. Wij raden u aan deze pagina af en toe te bekijken. Bij ingrijpende wijzigingen kunnen wij u waar mogelijk via e-mail of een melding op de website informeren.
          </p>
          <p className="mb-4">
            Voor vragen over deze privacyverklaring, over het uitoefenen van uw rechten of over cookies kunt u contact opnemen met:
          </p>
          <p className="mb-4 font-medium text-[#0F172A]">
            ArboMatcher B.V.<br />
            E-mail: info@arbomatcher.nl
          </p>

          <p className="mt-12 text-sm text-slate-600">
            Laatste update: 6 maart 2026
          </p>
        </div>
      </div>
    </div>
  );
}
