# Part & Serial Number Scanner

A mobile-first GitHub Pages application that reads industrial labels, groups matching parts, tracks serial-number subgroups, exports Excel/CSV files, and can synchronize the active sheet with a public Firebase Firestore inventory.

## Main scanner features

- Opens the phone's rear camera or photo library.
- Runs OCR locally in the browser with Tesseract.js.
- Uses multiple OCR passes in automatic mode:
  - contrast-enhanced and sharpened image
  - high-contrast monochrome image
  - original image as a fallback
- Chooses the strongest OCR result separately for the part and serial fields.
- Detects common part labels, including:
  - `Part No.`
  - `Part Number`
  - `Part #`
  - `P/N` and `PN`
  - `Item No.`
  - `Catalog No.`
  - `PRT No.`
- Detects common serial labels, including:
  - `Serial No.`
  - `Serial Number`
  - `Serial #`
  - `Serial ID`
  - `S/N`, `SN`, and `SER No.`
- Tolerates label OCR mistakes such as `P4RT`, `N0`, `NQ`, and `SER1AL`.
- Preserves complete serial values rather than only the final group or final four digits.
- Supports continuous, grouped, and hexadecimal formats such as:
  - `0x12AB34CD56EF`
  - `12AB 34CD 56EF 7890`
  - `DE AD BE EF 01 23 45 67`
  - `AA:BB:CC:DD:EE:FF`
  - `A1-B2-C3-D4`
- Searches every supported label occurrence on a line instead of stopping after the first.
- When several parts appear in one photo, serials are associated with the nearest part label.
- Groups duplicate part numbers and increases their quantity.
- Stores serial numbers as subgroups beneath the related part.
- Ignores spaces and standard separators when comparing equivalent part or serial identifiers.
- Saves the active sheet in browser storage across page reloads.
- Exports the complete inventory into one Excel worksheet or CSV file.

## Public database features

`database.html` opens in a separate tab and does not request an email address or password.

- Anyone with the deployed website link can view the Firestore inventory.
- Anyone with the link can upload the active sheet saved in their browser.
- **Upload active sheet** writes or updates matching part records.
- **Replace database** clears the shared collection and replaces it with the current browser's complete active sheet.
- Firestore changes appear automatically while the page is open.
- Search works with either formatted or unformatted part and serial values.
- The public database can be downloaded as one Excel worksheet.

> **Important:** This version intentionally provides public read and write access to the `inventory` collection. Do not store private, confidential, or safety-critical information in it.

## Project files

- `index.html` — scanner, OCR, grouped local inventory, editing, and local exports.
- `database.html` — public Firestore database portal.
- `firebase-config.js` — Firebase web-project configuration placeholders.
- `firestore.rules` — public rules for only the `inventory` collection.
- `.nojekyll` — keeps GitHub Pages deployment simple.

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload all project files to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder.
6. Open the generated GitHub Pages address on a phone or computer.

The scanner, local inventory, and Excel/CSV exports work before Firebase is configured. The public database page shows a setup notice until Firebase is connected.

## Configure the public Firebase database

### 1. Create and register a Firebase web app

1. Create a project in Firebase Console.
2. Register a Web app in that project.
3. Copy the generated Firebase configuration object.
4. Replace every `REPLACE_WITH_...` value in `firebase-config.js`.

Email/Password Authentication does **not** need to be enabled for this version.

### 2. Create Firestore

1. Open **Firestore Database** in Firebase Console.
2. Create a database.
3. Select a suitable region.
4. Open the **Rules** tab.

### 3. Publish the included public rules

Copy `firestore.rules` into the Firebase Rules editor and publish it.

The included rules:

- allow anyone to read and write documents under `inventory`
- deny access to every other collection path

The public database will not work if the previous authenticated rule (`request.auth != null`) is still published.

## Scanner workflow

1. Tap **Take Photo** or **Select Images**.
2. Frame the entire label, including both the field name and complete value.
3. Leave **Automatic contrast** selected for multi-pass detection.
4. Tap **Process selected images**.
5. Review and correct the extracted part and serial values.
6. Continue taking different pictures; all successful scans remain in the same active sheet.
7. Download Excel/CSV locally or open **Inventory Database** in a new tab.

## Database workflow

1. Open **Inventory Database** from the scanner.
2. The shared records load automatically without login.
3. Select **Upload active sheet** to add or update this device's local records.
4. Use **Replace database** only when this local sheet should become the entire public database.
5. Open the same `database.html` page on another device to see the shared records.

Because both pages use the same GitHub Pages origin, `database.html` can read the scanner's locally saved active sheet on the same device. Photos are never uploaded; only the inventory record data is sent to Firestore.

## Grouping example

Three scans:

```text
Part No. AB-100
Serial No. 12AB 34CD 56EF 7890
```

```text
Part No. AB-100
Serial No. 0xAABBCCDDEEFF
```

```text
Part No. AB 100
Serial No. 12AB-34CD-56EF-7890
```

Result:

```text
AB-100 — Quantity 3
  12AB 34CD 56EF 7890 — 2 scans
  0XAABBCCDDEEFF — 1 scan
```

Part and serial duplicate comparison ignores standard formatting characters.

## Excel export

The scanner downloads `active-part-serial-inventory.xlsx`. The database portal downloads `shared-part-serial-inventory.xlsx`.

Both workbooks contain one worksheet named **Inventory**:

- Parent rows contain the part number and quantity.
- Serial rows appear beneath their related part.
- Scan date, source, OCR pass, and OCR confidence are included when available.

A browser cannot silently update a workbook that was already downloaded. Each download creates a new workbook from the current local or cloud inventory.

## OCR guidance

- Keep the camera parallel to the label.
- Include the complete `Part No.` and `Serial No.` labels in the photo.
- Avoid glare passing through engraved characters.
- Move closer until the characters occupy a meaningful portion of the image.
- Automatic mode can take longer because it compares multiple image treatments.
- Manual editing remains available because OCR cannot guarantee perfect results on damaged, reflective, curved, or extremely small labels.

## Browser-console parser tests

```js
PartScannerDebug.extractIdentifiers(`
Part No. AB-100
Serial No. DE AD BE EF 01 23 45 67
`)
```

Expected fields include:

```js
{
  partNumbers: ['AB-100'],
  serialNumbers: ['DE AD BE EF 01 23 45 67']
}
```

Other examples:

```js
PartScannerDebug.extractSerialNumbers('Serial No. 0x12AB34CD56EF')
PartScannerDebug.extractSerialNumbers('S/N AA:BB:CC:DD:EE:FF')
PartScannerDebug.extractPartNumbers('Catalog No. 123.456')
PartScannerDebug.serialCanonicalKey('12AB-34CD-56EF')
```
