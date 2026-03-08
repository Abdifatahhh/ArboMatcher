# Edge Function: send-email

Verstuurt **platform-/business-e-mails** via de Resend API (auth-e-mails gaan via Send Email Hook → `send-auth-email`). API-key alleen server-side.

## Secrets

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
```

Optioneel: `RESEND_FROM` (default `ArboMatcher <noreply@arbomatcher.nl>`), `RESEND_REPLY_TO` (default `support@arbomatcher.nl`), `PUBLIC_APP_URL`.

## Aanroep

**POST** naar de function URL (bijv. `https://<project>.supabase.co/functions/v1/send-email`) met header `Authorization: Bearer <anon_key>` of `Bearer <user_jwt>`.

### Met template

```json
{
  "to": "gebruiker@voorbeeld.nl",
  "template": "welcome",
  "data": { "name": "Jan" }
}
```

Beschikbare templates:

| template              | data (optioneel)                |
|-----------------------|----------------------------------|
| `welcome`             | `name`, `recipientName`         |
| `new_application`     | `jobTitle`, `applicantName`     |
| `new_invite`          | `jobTitle`, `inviterName`       |
| `opdracht_geplaatst`  | `jobTitle`                      |
| `profiel_goedgekeurd` | `name`, `recipientName`          |
| `factuur`             | `factuurNr`, `invoiceNumber`    |

### Vrije mail (subject + html)

```json
{
  "to": "gebruiker@voorbeeld.nl",
  "subject": "Onderwerp",
  "html": "<p>HTML-body</p>"
}
```

## Vanuit de app aanroepen

Na het aanmaken van een reactie (application) of uitnodiging kun je de function aanroepen:

```ts
const { data, error } = await supabase.functions.invoke('send-email', {
  body: {
    to: opdrachtgeverEmail,
    template: 'new_application',
    data: { jobTitle: job.title, applicantName: profile.full_name ?? 'Een professional' },
  },
});
```

Gebruik een service role of een JWT van de ingelogde gebruiker; de function zelf valideert geen rechten (alleen aanroeper met geldige Supabase key kan de function bereiken).
