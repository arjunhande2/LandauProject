# Part Number Scanner

A mobile-friendly GitHub Pages app that:

- opens the phone's rear camera or photo library;
- runs OCR entirely in the browser with Tesseract.js;
- detects labels such as `Part No.`, `Part Number`, `Part #`, and `P/N`;
- extracts the following alphanumeric part number;
- lets the user correct OCR mistakes;
- appends every successful scan from separate photos to one active master list;
- saves that master list in browser storage across page reloads;
- exports every saved row into one Excel worksheet or one CSV file.

## Files

- `index.html` — the complete app. No build step or backend is required.

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. Open the GitHub Pages URL on the phone.

GitHub Pages may take a short time to publish after the first deployment.

## Phone use

1. Tap **Take Photo**.
2. Allow camera access if the browser asks.
3. Keep the label flat and fill most of the image with the text.
4. Tap **Process Selected Images**. The processed photo leaves the queue, but its detected part number remains in the active sheet.
5. Take another photo and scan again. Its result is appended to the same sheet.
6. Correct any detected values if necessary.
7. Tap **Download Excel Workbook**. The downloaded workbook contains every saved scan in one worksheet named **Part Numbers**.

On some phones, downloaded files appear in the browser's Downloads section or the Files app.

## Important implementation notes

- The app is static and does not send images to a custom server.
- The active sheet is stored locally in that browser on that phone. It remains available after refreshes until **Clear Sheet** is used or browser data is erased.
- A browser cannot silently edit an already-downloaded Excel file. Each download creates a fresh `active-part-number-sheet.xlsx` containing the entire current master list, not only the newest photo.
- Tesseract.js and SheetJS are loaded from public CDNs, so an internet connection is needed when the browser has not already cached them.
- OCR quality depends heavily on focus, lighting, glare, text size, and label damage.
- Part numbers must contain at least one digit. Letters, numbers, dots, underscores, slashes, and hyphens are accepted.
- The app intentionally asks the user to review detected values before exporting because OCR cannot guarantee perfect accuracy.

## Quick extraction tests

Open the browser console and run:

```js
PartScannerDebug.extractPartNumbers('Description\nPart No. AB-12345\nQty 2')
```

Expected value:

```js
['AB-12345']
```

The returned object includes `values`, `labelFound`, and `normalizedText`.
