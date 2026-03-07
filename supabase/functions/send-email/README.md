# Edge Function: send-email

Verstuurt e-mails via de Resend API. De API-key staat alleen op de server (Supabase), niet in de frontend.

## Secrets instellen

In Supabase Dashboard → Project → Edge Functions → Secrets, of via CLI:

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
```

Optioneel:

- `RESEND_FROM` – afzender, bijv. `ArboMatcher <noreply@arbomatcher.nl>`. Zonder eigen domein tijdelijk: `ArboMatcher <onboarding@resend.dev>`.
- `PUBLIC_APP_URL` – basis-URL voor links in mails, bijv. `https://arbomatcher.nl`.

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

| template           | data (optioneel)                          |
|--------------------|-------------------------------------------|
| `welcome`         | `name` of `recipientName`                 |
| `new_application` | `jobTitle`, `applicantName`               |
| `new_invite`      | `jobTitle`, `inviterName`                 |

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
