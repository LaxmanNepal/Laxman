# Laxman Ultimate AI Edge Gallery Skill

An all-in-one Agent Skill for Google's AI Edge Gallery. It is intentionally packaged as **one skill** with a JavaScript runtime instead of requiring dozens of separate skills.

## Included capabilities

- Web search (DuckDuckGo Instant Answer)
- News search (Google News RSS)
- Weather + 3-day forecast (Open-Meteo)
- Wikipedia summaries
- Public web-page text extraction with CORS fallback
- Calculator
- Currency conversion (Frankfurter)
- Unit conversion: length, mass, volume, area, speed, temperature
- Time-zone lookup
- QR-code URL generation
- SHA-1 / SHA-256 / SHA-384 / SHA-512 hashing
- Base64 encode/decode
- JSON formatter
- Regex tester
- Hex color conversion
- Secure random password generation
- Cryptographic random number
- Public IP information
- URL and Google Maps links
- Local notes via localStorage
- Pomodoro/countdown helpers
- Tip calculator
- BMI calculator
- Percentage calculator
- Date difference
- Text statistics / word count
- URI encode/decode
- UUID generation

Most utility functions are local and require **no API key**. Network features use public endpoints and can fail when the device/network blocks them.

## AI Edge Gallery installation

Google's Agent Skills documentation says JS skills use `scripts/index.html` and expose `window['ai_edge_gallery_get_result']`; it also recommends true web hosting such as GitHub Pages for JS assets and a `.nojekyll` file for raw `SKILL.md` access.

After GitHub Pages is enabled for this repository, load this skill using the repository Pages URL, for example:

`https://laxmannepal.github.io/Laxman/`

The URL entered into AI Edge Gallery should point to the **skill folder itself**. Because this repository's root is the skill folder, the Pages root is the install URL.

## Local import

You can also download the repository and import the folder containing `SKILL.md` into AI Edge Gallery's local skill importer.

## Notes

- This skill does not silently send SMS/email/WhatsApp messages. It returns safe links where appropriate.
- It does not claim to provide unrestricted internet browsing. Search and page retrieval depend on public endpoints and CORS/network availability.
- It does not execute arbitrary Python. AI Edge Gallery's official documentation recommends JavaScript for on-device custom logic.
