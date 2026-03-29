## Gemini Creative: WordPress Upload + Live Email Booking

This repo includes two WordPress-ready pieces:

1. `wordpress-magic-audit.xml` → imports the **Magic Audit** page UI.
2. `wordpress-plugin/gemini-magic-audit-mailer/gemini-magic-audit-mailer.php` → WordPress plugin entry file (uploadable plugin folder) that receives bookings and emails:
   - `geminicreativeNF@gmail.com`
   - the lead email entered in the form.

## How to put it up (production steps)

### 1) Upload and activate the mailer plugin
1. In WordPress Admin, go to **Plugins → Add New → Upload Plugin**.
2. From this repo root, build the ZIP (binary artifacts are intentionally not stored in git):
   ```bash
   cd wordpress-plugin
   zip -r gemini-magic-audit-mailer.zip gemini-magic-audit-mailer
   ```
3. Upload the generated `wordpress-plugin/gemini-magic-audit-mailer.zip` file and activate **Gemini Magic Audit Mailer**.
4. (SFTP alternative) upload the `wordpress-plugin/gemini-magic-audit-mailer/` folder to `wp-content/plugins/`.

### 2) Import the Magic Audit page from XML
1. Go to **Tools → Import**.
2. Install/run the **WordPress** importer.
3. Upload `wordpress-magic-audit.xml`.
4. Open the new **Magic Audit** page and publish/update if prompted.
5. Add it to your nav under **Appearance → Menus**.

### 3) Make sure WordPress can send email
For reliable delivery, install SMTP (example: WP Mail SMTP) and connect your mail provider.

### 4) Test end-to-end
1. Open `/magic-audit/`.
2. Complete a booking flow.
3. Confirm you receive one email at `geminicreativeNF@gmail.com` and one confirmation at the user email.

## API details (already wired in page script)
The page posts bookings to:

- `POST /wp-json/gc-audit/v1/book`

Payload fields:
- `siteUrl`
- `competitorUrl`
- `leadEmail`
- `selectedDate`
- `selectedTime`

If plugin or SMTP is misconfigured, the page now shows an inline error message instead of a false “email sent” success statement.
