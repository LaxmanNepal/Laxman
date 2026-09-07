---
name: laxman-ultimate-assistant
description: An all-in-one AI Edge Gallery utility skill for search, news, weather, Wikipedia, web pages, calculations, conversions, developer tools, generators, productivity, maps, and communication links. Uses local logic first and public APIs where needed.
metadata:
  homepage: https://github.com/LaxmanNepal/Laxman
---

# Laxman Ultimate AI Assistant

Use this single skill as a general-purpose toolbox. Prefer local/offline operations whenever possible. For network operations, use public endpoints and clearly report when a service is unavailable.

## Execution

Call the `run_js` tool with the default script `index.html`.
Pass `data` as a JSON string with this schema:

- `action`: required string. One of: `search`, `news`, `weather`, `wikipedia`, `fetch_page`, `summarize_text`, `calculator`, `currency`, `unit_convert`, `timezone`, `qr`, `hash`, `base64`, `json_format`, `regex`, `color`, `password`, `random`, `ip`, `url`, `maps`, `notes`, `pomodoro`, `countdown`, `tip`, `bmi`, `percentage`, `date_diff`, `text_stats`, `encode_uri`, `decode_uri`, `uuid`, `word_count`.
- `query`: optional string for search/news/Wikipedia/page/url.
- `text`: optional string for text operations.
- `city`: optional string for weather.
- `lat`, `lon`: optional numbers for weather.
- `amount`, `from`, `to`: optional currency fields.
- `value`, `from_unit`, `to_unit`, `category`: optional unit conversion fields.
- `expression`: optional calculator expression.
- `algorithm`: optional hash algorithm such as SHA-256, SHA-1, SHA-384, SHA-512.
- `pattern`, `flags`: optional regex fields.
- `color`: optional CSS color.
- `length`: optional number for password/random/word operations.
- `min`, `max`: optional numbers for random.
- `data`: optional JSON-compatible value for formatting.
- `key`, `value`: optional notes fields.
- `minutes`, `seconds`: optional timer fields.
- `principal`, `rate`, `tip_percent`, `people`: optional finance fields.
- `height_cm`, `weight_kg`: optional BMI fields.
- `start`, `end`: optional ISO dates for date difference.

Return the tool result directly to the user. Do not expose implementation details unless asked.

## Routing guidance

- Current weather or forecast -> `weather`.
- Web lookup -> `search`.
- Recent headlines -> `news`.
- Encyclopedia facts -> `wikipedia`.
- Read a public URL -> `fetch_page`.
- Summarize supplied text -> `summarize_text` (local preprocessing only; the model performs the actual summary).
- Math -> `calculator`.
- Exchange rates -> `currency`.
- Measurements -> `unit_convert`.
- Time zones -> `timezone`.
- QR code -> `qr`.
- Hashing -> `hash`.
- JSON cleanup -> `json_format`.
- Base64 -> `base64`.
- Regex testing -> `regex`.
- Color conversion -> `color`.
- Password generation -> `password`.
- Random values -> `random`.
- Public IP -> `ip`.
- Open/share a URL -> `url`.
- Map location -> `maps`.
- Persistent lightweight notes -> `notes`.
- Timers -> `pomodoro` or `countdown`.
- Tip splitting -> `tip`.
- BMI -> `bmi`.
- Percent calculations -> `percentage`.
- Date intervals -> `date_diff`.
- Text statistics -> `text_stats`.
- URL encoding -> `encode_uri` / `decode_uri`.
- UUID -> `uuid`.

## Safety and accuracy

Never invent live data. Network results must be labeled as fetched data and may be unavailable. Do not treat search snippets as authoritative for high-stakes decisions. For financial, medical, legal, or safety-critical questions, use the fetched data only as supporting information and advise verification from an authoritative source.

For communication actions, this skill generates safe deep links such as `mailto:`, `tel:`, and WhatsApp links; it does not silently send messages.
