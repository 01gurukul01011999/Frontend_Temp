import { NextResponse } from 'next/server';
import { Workbook } from 'exceljs';

export const dynamic = "force-static";
export const revalidate = 0;

export async function GET() {
  const workbook = new Workbook();

  // ========== Instructions Sheet ==========
  const instructions = workbook.addWorksheet('Instructions');
  instructions.mergeCells("A1:T1");
  instructions.getCell("A1").value = "Product Upload Template Instructions";
  instructions.getCell("A1").font = { bold: true, size: 12 };
  instructions.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3CD" }, // light yellow
  };
  instructions.getCell("A1").alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  instructions.getRow(1).height = 30;
  instructions.getCell("A1").border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };

  // ===== Row 2 =====
  instructions.mergeCells("A2:T2");
  instructions.getCell("A2").value = "Add data to this Excel sheet for quick uploads";
  instructions.getCell("A2").font = { bold: true, size: 12 };
  instructions.getCell("A2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "B4BAC3" }, // gray-blue
  };
  instructions.getRow(2).height = 24;
  instructions.getCell("A2").alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "left",
  };
  instructions.getCell("A2").border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };

  // ===== Row 3–6 Rich Text =====
  instructions.mergeCells("A3:T6");

  instructions.getCell("A3").value = {
    richText: [
      { text: "2 types of fields in the top row: " },
      { text: "Compulsory Fields", font: { bold: true, color: { argb: "FF0000" } } },
      { text: ", " },
      { text: "Recommended Fields\n", font: { bold: true, color: { argb: "FF007000" } } },
      { text: "Compulsory Fields", font: { bold: true, color: { argb: "FF0000" } } },
      { text: " are values necessary to create your product. Missing (Blank Cells) or incorrect values in a mandatory field will lead to rejection of the listing.\n" },
      { text: "Recommended Fields", font: { bold: true, color: { argb: "FF007000" } } },
      { text: " give customers important information they need to make an informed purchase decision. Missing values (Blank Cells) make it difficult for customers to find your listing." }
    ],
  };
  instructions.getCell("A3").font = { size: 11 };
  instructions.getCell("A3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F2F6FC" }, // light blue
  };
  instructions.getCell("A3").alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  instructions.getRow(3).height = 25;
  instructions.getRow(4).height = 25;
  instructions.getRow(5).height = 25;
  instructions.getRow(6).height = 25;
  instructions.getCell("A3").border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };

// ===== Key Guidelines Section =====
instructions.mergeCells("A7:B10"); // Key Guidelines title
instructions.getCell("A7").value = "Key Guidelines";
instructions.getCell("A7").font = { bold: true, size: 11 };
instructions.getCell("A7").alignment = { vertical: "top", horizontal: "left" };
instructions.getCell("A7").fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "F2F6FC" }, // light blue shade
};
 instructions.getCell("A7").alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
instructions.getCell("A7").border = {
  top: { style: "thin", color: { argb: "000000" } },
  left: { style: "thin", color: { argb: "000000" } },
  bottom: { style: "thin", color: { argb: "000000" } },
  right: { style: "thin", color: { argb: "000000" } },
};

// Merge content cell (right side)
instructions.mergeCells("C7:T10");
instructions.getCell("C7").value = {
  richText: [
    { text: "• Some cells have fixed valid values. You must only select a value from the drop-down menu in such cells\n" },
    { text: "• Check the validation sheet to see what values are valid for each column\n" },
    { text: "• If you wish to create ", },
    { text: "multiple variants", font: { bold: true } },
    { text: " for your products, there would be a new row for each one (Each size, each colour in a separate row)" },
  ]
};
instructions.getCell("C7").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
instructions.getCell("C7").border = {
  top: { style: "thin", color: { argb: "000000" } },
  left: { style: "thin", color: { argb: "000000" } },
  bottom: { style: "thin", color: { argb: "000000" } },
  right: { style: "thin", color: { argb: "000000" } },
};


  // Common styles
  const pinkHeaderFill = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFF3CD" } };
  const headerFont = { bold: true, size: 12, color: { argb: "000000" } };
 const normalFont = { size: 11, color: { argb: "000000" } };
  const borderStyle = {
    top: { style: 'thin' as const, color: { argb: "000000" } },
    left: { style: 'thin' as const, color: { argb: "000000" } },
    bottom: { style: 'thin' as const, color: { argb: "000000" } },
    right: { style: 'thin' as const, color: { argb: "000000" } },
  };

  // ===== 1. Points to check before uploading the sheet =====
  instructions.mergeCells("A12:T12");
  instructions.getCell("A12").value = "Points to check before uploading the sheet";
  instructions.getCell("A12").font = headerFont;
  instructions.getCell("A12").fill = pinkHeaderFill;
  instructions.getCell("A12").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
  instructions.getCell("A12").border = borderStyle;
  instructions.getRow(1).height = 25;

  instructions.mergeCells("A13:T18");
  instructions.getCell("A13").value =
    "• All the mandatory fields should be correctly filled\n" +
    "• Both Meesho Price & Wrong/Defective Returns Price should be less than MRP. Wrong/Defective Returns Price should be lower than Meesho Price.\n" +
    "• Image link should be working and Images should be mapped correctly with products\n" +
    "• Content should not have grammatical errors or spelling mistakes\n" +
    "• Restricted Keywords should not be used (e.g. smoking, other portal names, violent slogans)";
  instructions.getCell("A13").font = normalFont;
  instructions.getCell("A13").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
  instructions.getCell("A13").border = borderStyle;

  // ===== 2. Image criteria =====
  instructions.mergeCells("A19:T19");
  instructions.getCell("A19").value = "Image criteria";
  instructions.getCell("A19").font = headerFont;
  instructions.getCell("A19").fill = pinkHeaderFill;
  instructions.getCell("A19").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
  instructions.getCell("A19").border = borderStyle;
  instructions.getRow(7).height = 25;

  instructions.mergeCells("A20:T20");
  instructions.getCell("A20").value = "You must provide minimum 1 front image for each SKUs";
  instructions.getCell("A20").font = normalFont;
  instructions.getCell("A20").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
  instructions.getCell("A20").border = borderStyle;

  // ===== 3. Image standards =====
  instructions.mergeCells("A21:T21");
  instructions.getCell("A21").value = "Image standards";
  instructions.getCell("A21").font = headerFont;
  instructions.getCell("A21").fill = pinkHeaderFill;
  instructions.getCell("A21").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
  instructions.getCell("A21").border = borderStyle;
  instructions.getRow(9).height = 25;

  instructions.mergeCells("A22:T23");
  instructions.getCell("A22").value =
    "Solo product image without any props.\nProduct image should not have any text";
  instructions.getCell("A22").font = normalFont;
  instructions.getCell("A22").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
  instructions.getCell("A22").border = borderStyle;

  // ===== 4. Following Images will be rejected =====
  instructions.mergeCells("A25:T25");
  instructions.getCell("A25").value = "Following Images will be rejected";
  instructions.getCell("A25").font = headerFont;
  instructions.getCell("A25").fill = pinkHeaderFill;
  instructions.getCell("A25").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
  instructions.getCell("A25").border = borderStyle;

  instructions.mergeCells("A26:T32");
  instructions.getCell("A26").value =
    "Graphic/ Inverted/ Pixelated image are not accepted.\n" +
    "Images with text/Watermark are not acceptable in primary images.\n" +
    "Blur images and clutter images are not accepted.\n" +
    "Images should not contain price/brand logo for the product.\n" +
    "Product images must not be shrunk, elongated or stretched.\n" +
    "Partial product image is not allowed.\n" +
    "Offensive/Objectionable images/products are not acceptable.";
  instructions.getCell("A26").font = normalFont;
  instructions.getCell("A26").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
  instructions.getCell("A26").border = borderStyle;

  // ===== 5. Image format =====
  instructions.mergeCells("A33:T33");
  instructions.getCell("A33").value = "Image format";
  instructions.getCell("A33").font = headerFont;
  instructions.getCell("A33").fill = pinkHeaderFill;
  instructions.getCell("A33").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
  instructions.getCell("A33").border = borderStyle;

  instructions.mergeCells("A34:T36");
  instructions.getCell("A34").value =
    "We only accept .JPEG images. Any other format is not accepted\n" +
    "We accept Images only in RGB color space . We don’t accept images in CMYK or any other color space";
  instructions.getCell("A34").font = normalFont;
  instructions.getCell("A34").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
  instructions.getCell("A34").border = borderStyle;

  // ===== 6. Uploading & providing image =====
  instructions.mergeCells("A38:T38");
  instructions.getCell("A38").value = "Uploading & providing image";
  instructions.getCell("A38").font = headerFont;
  instructions.getCell("A38").fill = pinkHeaderFill;
  instructions.getCell("A38").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
  instructions.getCell("A38").border = borderStyle;

  instructions.mergeCells("A39:T40");
  instructions.getCell("A39").value =
    "Please use the image uploader on the supplier panel to generate image link. We do not support google drive links. Click on below video link to learn more\n" +
    "How to create Image link";
  instructions.getCell("A39").font = normalFont;
  instructions.getCell("A39").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
  instructions.getCell("A39").border = borderStyle;

  // ===== 7. Declaration =====
  instructions.mergeCells("A41:T41");
  instructions.getCell("A41").value = "Declaration";
  instructions.getCell("A41").font = headerFont;
  instructions.getCell("A41").fill = pinkHeaderFill;
  instructions.getCell("A41").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
  instructions.getCell("A41").border = borderStyle;

  instructions.mergeCells("A42:T48");
  instructions.getCell("A42").value =
    "Seller hereby warrants and confirms that: (i) the products listed herein are duly compliant with all applicable laws including but not limited to quality control standards issued from time to time; (ii) it has obtained all necessary registrations and certification of the products listed by it on Meesho, details of which will be shared accurately with Meesho and Seller shall ensure that such licenses/registrations remain valid and subsisting till the time Seller continues to sell on Meesho. In case on any breach or failure by the Sellers to adhere to the above: Seller acknowledges that: (i) Seller shall be solely responsible for any costs and consequences on account of listing and sale of such products and shall fully indemnify Meesho from any claims arising out of such act or omission; and (ii) Meesho may take necessary action against the product or the seller account as available to it under the Supplier Agreement, applicable platform policies, applicable law or in equity.";
  instructions.getCell("A42").font = normalFont;
  instructions.getCell("A42").alignment = { wrapText: true, vertical: "top", horizontal: "left" };
  instructions.getCell("A42").border = borderStyle;



  // ========== Tshirts-Fill this ==========
  const fillSheet = workbook.addWorksheet('Tshirts-Fill this');
  
// Column widths (adjust as per your screenshot)
fillSheet.columns = [
  { width: 8 }, // A
  { width: 20 }, // B
  { width: 30 }, // C
  { width: 25 }, // D
  { width: 25 }, // E
  { width: 25 }, // F
  { width: 30 }, // G
  { width: 25 }, // H
  { width: 25 }, // I
  { width: 25 }, // J
  { width: 25 }, // K
  { width: 25 }, // L
  { width: 30 }, // M
  { width: 25 }, // N
  { width: 25 }, // O
  { width: 25 }, // P
  { width: 25 }, // Q
  { width: 25 }, // R
  { width: 25 }, // S
];

// Example header row
fillSheet.getRow(1).height = 50;

// Merge cells for big headers
fillSheet.mergeCells("A1:D1");
fillSheet.mergeCells("E1:AR1");

fillSheet.getCell("A1").value = {
  richText: [
    { text: "Tshirts Template ", font: { bold: true, size: 18, color: { argb: "000000" } } },
    { text: "(Men Fashion/Mens Clothing/Men Top Wear/Tshirts)", font: { bold: false, size: 9, color: { argb: "555555" } } }
  ]
};
fillSheet.getCell("E1").value = {
  richText: [
    { text: "Tshirts Template ", font: { bold: true, size: 18, color: { argb: "000000" } } },
    { text: "(Men Fashion/Mens Clothing/Men Top Wear/Tshirts)", font: { bold: false, size: 9, color: { argb: "555555" } } }
  ]
};


// Style for all header cells
for (const cell of ["A1", "E1"]) {
  fillSheet.getCell(cell).alignment = {
    vertical: "middle",
    horizontal: "left",
    wrapText: true,
  };
  fillSheet.getCell(cell).font = { bold: true, size: 18 };
  fillSheet.getCell(cell).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "d6d6d4" }, // Light gray
  };
  fillSheet.getCell(cell).border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };
}


// Example columns
const headers = [
  { title: "Field Names", color: "", textColor: "000000" },
  { title: "Do not fill these 2 columns. To be filled by Meesho only.", color: "FFFFCCCC", textColor: "FF660000" },
  { title: "Do not fill these 2 columns. To be filled by Meesho only.", color: "FFFFCCCC", textColor: "FF660000" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "* Compulsory Field", color: "FFCCE5FF", textColor: "FF003366" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" },
  { title: "Optional Field", color: "FFD9EAD3", textColor: "FF004400" }
];


const descriptions = [
  { "title": "Fields +   Description:" },
  { "title": "ERROR STATUS", "description": "For system use, don't modify" },
  { "title": "ERROR MESSAGE", "description": "For system use, don't modify" },
  { "title": "Product Name", "description": "Provide the name of your product which will be visible on the Meesho app." },
  { "title": "Variation", "description": "Select variation (sizes) from the list" },
  { "title": "Meesho Price", "description": "This is the normal/regular price at which you sell on Meesho. This price shall be lower than the Maximum Retail Price (MRP) of the Product. Customers buying at this price will be able to return products for all reasons." },
  { "title": "Wrong/Defective Returns Price", "description": "Enter the price at which you want to sell this product on Meesho app. Customers buying at this price can only return wrong/defective delivered items. Recommend entering Rs.22 lower than Meesho Price." },
  { "title": "MRP", "description": "Maximum Retail Price (inclusive of all taxes) shall be the maximum price of the product as per the applicable laws and as mentioned on the package of the product." },
  { "title": "GST %", "description": "Product GST %" },
  { "title": "HSN ID", "description": "Select the HSN ID from the dropdown." },
  { "title": "Net Weight (gms)", "description": "Weight of the product pack in grams" },
  { "title": "Inventory", "description": "Number of items you have in stock." },
  { "title": "Country of Origin", "description": "Please provide the manufacturing country for this product" },
  { "title": "Manufacturer Details", "description": "Name and address of the manufacturer" },
  { "title": "Packer Details", "description": "Name and address of the packer" },
  { "title": "Color", "description": "Select \"Color\" from the list" },
  { "title": "Fabric", "description": "Select \"Fabric\" from the list" },
  { "title": "Fit/Shape", "description": "Select \"Fit/Shape\" from the list" },
  { "title": "Neck", "description": "Select \"Neck\" from the list" },
  { "title": "Net Quantity (N)", "description": "Select \"Net Quantity (N)\" from the list" },
  { "title": "Occasion", "description": "Select \"Occasion\" from the list" },
  { "title": "Pattern", "description": "Select \"Pattern\" from the list" },
  { "title": "Print Or Pattern Type", "description": "Select \"Print Or Pattern Type\" from the list" },
  { "title": "Sleeve Length", "description": "Select \"Sleeve Length\" from the list" },
  { "title": "Chest Size", "description": "Select \"Chest Size\" from the list (Inch)" },
  { "title": "Length Size", "description": "Select \"Length Size\" from the list (Inch)" },
  { "title": "Shoulder Size", "description": "Select \"Shoulder Size\" from the list (Inch)" },
  { "title": "Image 1 (Front)", "description": "Click on Images Bulk Upload on the supplier panel to create the image links. Do not use Google Drive links." },
  { "title": "Image 2", "description": "Click on 'Image link Generator' on the supplier panel to create the image links. Google Drive links not accepted." },
  { "title": "Image 3", "description": "Click on 'Image link Generator' on the supplier panel to create the image links. Google Drive links not accepted." },
  { "title": "Image 4", "description": "Click on 'Image link Generator' on the supplier panel to create the image links. Google Drive links not accepted." },
  { "title": "Product ID / Style ID", "description": "Style Code is an alphanumeric code given to a product and can be found on the tag or packaging. Remains same for all Size variants but changes for Color variants." },
  { "title": "SKU ID", "description": "Seller SKU ID is a unique ID for each product variation, created by the seller to identify products on Meesho." },
  { "title": "Brand Name", "description": "Enter the Brand name" },
  { "title": "Group ID", "description": "Enter same group ID for products to be grouped in a single catalog on Meesho app." },
  { "title": "Product Description", "description": "Please write few lines describing your product" },
  { "title": "Importer Details", "description": "Name and address of the importer if product is manufactured outside India" },
  { "title": "EAN/UPC", "description": "EAN is a 13 digit bar code required by brands. Prefix UPC with 0 to make 13 digits. Leave blank if not applicable." },
  { "title": "Brand", "description": "Select \"Brand\" from the list" },
  { "title": "Character", "description": "Select \"Character\" from the list" },
  { "title": "Hemline", "description": "Select \"Hemline\" from the list" },
  { "title": "Length", "description": "Select \"Length\" from the list" },
  { "title": "Number of Pockets", "description": "Select \"Number of Pockets\" from the list" },
  { "title": "Sleeve Styling", "description": "Select \"Sleeve Styling\" from the list" }
]

const tutorial = [
  { title: "Tutorial Link" },
  { title: "" },
  { title: "" },
  { title:  ""},
  { title:  ""},
  { title: "" },
  { title: "Watch Explainer Video", link: "https://www.youtube.com/watch?v=pIfqMxFVMKQ&ab_channel=NetflixIndia" },
  { title: "" },
  { title: "" },
  { title: "" },
  { title: "" },
  { title: ""},
  { title: ""},
  { title: ""},
  { title: ""},
  { title: "" },
  { title: "" },
  { title: "" },
  { title: ""},
  { title: "" },
  { title: ""},
  { title: "" },
  { title: "" },
  { title: "" },
  { title:  ""},
  { title:  ""},
  { title:  ""},
  { title: "Watch Explainer Video" , link: "https://www.youtube.com/watch?v=pIfqMxFVMKQ&ab_channel=NetflixIndia"},
  { title: ""},
  { title: ""},
  { title: "" },
  { title: ""},
  { title:  "Watch Explainer Video" , link: "https://www.youtube.com/watch?v=pIfqMxFVMKQ&ab_channel=NetflixIndia"},
  { title: "" },
  { title: ""},
  { title: "" },
  { title:"" },
  { title: "" },
  { title:"" },
  { title: ""},
  { title: "" },
  { title: "" },
  { title: ""},
  { title: ""}
];


// Set widths
let colIdx = 1;
for (const _ of headers) {
  fillSheet.getColumn(colIdx++).width = 30;
}

// Row 1 – Headers
const headerRow = fillSheet.getRow(2);
colIdx = 1;
for (const h of headers) {
  const cell = headerRow.getCell(colIdx++);
  cell.value = h.title;
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: h.color }
  };
  cell.border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };
  cell.font = { bold: false, size: 9, color: { argb: h.textColor} };
  cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
}
headerRow.height = 30;

// Row 2 – Field descriptions
const descRow = fillSheet.getRow(3);
colIdx = 1;
for (const desc of descriptions) {
  const cell = descRow.getCell(colIdx++);
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "d6d6d4" } // light gray
  };
  cell.border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };
  cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
  cell.value = {
    richText: [
      { text: desc.title + "\n\n", font: { bold: true, size: 12, color: { argb: "FF000000" } } },
      { text: desc.description || '', font: { size: 10, color: { argb: "FF555555" } } }
    ]
  };
}
descRow.height = 140;



// Row 3 – Tutorial Links
const tutorialRow = fillSheet.getRow(4);
colIdx = 1;
for (const text of tutorial) {
  const cell = tutorialRow.getCell(colIdx++);
  // Background
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "d6d6d4" }
  };
  // Border
  cell.border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };
  // Alignment
  cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
  // ✅ Hyperlink value (make sure link is valid)
  if (text.link) {
    cell.value = { text: text.title, hyperlink: text.link };
    cell.font = { bold: true, size: 12, color: { argb: "FF0000FF" }, underline: true }; // Blue + underline
  } else {
    cell.value = text.title;
    cell.font = { bold: false, size: 12, color: { argb: "FF000000" } };
  }
}
tutorialRow.height = 40;







  // ========== Example Sheet ==========
  const example = workbook.addWorksheet('Example Sheet');
  example.addRow([
    'Category Name',
    'Product Name',
    'Description',
    'MRP',
    'Price',
    'GSTIN',
  ]);
  example.addRow([
    'Sarees',
    'Silk Saree',
    'Traditional wear with border',
    1299,
    999,
    '27ABCDE1234F1Z5',
  ]);

  // ========== Validation Sheet ==========
  const validation = workbook.addWorksheet('Validation Sheet');
validation.columns = [
  { width: 48 }, // A
  { width: 20 }, // B
  { width: 30 }, // C
  { width: 25 }, // D
  { width: 25 }, // E
  { width: 25 }, // F
  { width: 30 }, // G
  { width: 25 }, // H
  { width: 25 }, // I
  { width: 25 }, // J
  { width: 25 }, // K
  { width: 25 }, // L
  { width: 30 }, // M
  { width: 25 }, // N
  { width: 25 }, // O
  { width: 25 }, // P
  { width: 25 }, // Q
  { width: 25 }, // R
  { width: 25 }, // S
   { width: 25 }, // N
  { width: 25 }, // O
  { width: 25 }, // P
  { width: 25 }, // Q
  { width: 25 }, // R
  { width: 25 }, // S
   { width: 25 }, // N
  { width: 25 }, // O
  { width: 25 }, // P
  { width: 25 }, // Q
  { width: 25 }, // R
  { width: 25 }, // S
   { width: 25 }, // N
  { width: 25 }, // O
  { width: 25 }, // P
  { width: 25 }, // Q
  { width: 25 }, // R
  { width: 25 }, // S
   { width: 25 }, // N
  { width: 25 }, // O
  { width: 25 }, // P
  { width: 25 }, // Q
  { width: 25 }, // R
  { width: 25 }, // S
   { width: 25 }, // R
  { width: 25 }, // S
];

const row1 = [
  { "title": "Field Type (Compulsory, Recommended, System_Use) ->", "color": "#d6d6d4" },
  { "title": "ERROR STATUS", "color": "#d6d6d4" },
  { "title": "ERROR MESSAGE", "color": "#d6d6d4" },
  { "title": "Product Name", "color": "#d6d6d4" },
  { "title": "Variation", "color": "#d6d6d4" },
  { "title": "Meesho Price", "color": "#d6d6d4" },
  { "title": "Wrong/Defective Returns Price", "color": "#d6d6d4" },
  { "title": "MRP", "color": "#d6d6d4" },
  { "title": "GST %", "color": "#d6d6d4" },
  { "title": "HSN ID", "color": "#d6d6d4" },
  { "title": "Net Weight (gms)", "color": "#d6d6d4" },
  { "title": "Inventory", "color": "#d6d6d4" },
  { "title": "Country of Origin", "color": "#d6d6d4" },
  { "title": "Manufacturer Details", "color": "#d6d6d4" },
  { "title": "Packer Details", "color": "#d6d6d4" },
  { "title": "Color", "color": "#d6d6d4" },
  { "title": "Fabric", "color": "#d6d6d4" },
  { "title": "Fit/Shape", "color": "#d6d6d4" },
  { "title": "Neck", "color": "#d6d6d4" },
  { "title": "Net Quantity (N)", "color": "#d6d6d4" },
  { "title": "Occasion", "color": "#d6d6d4" },
  { "title": "Pattern", "color": "#d6d6d4" },
  { "title": "Print Or Pattern Type", "color": "#d6d6d4" },
  { "title": "Sleeve Length", "color": "#d6d6d4" },
  { "title": "Chest Size", "color": "#d6d6d4" },
  { "title": "Length Size", "color": "#d6d6d4" },
  { "title": "Shoulder Size", "color": "#d6d6d4" },
  { "title": "Image 1 (Front)", "color": "#d6d6d4" },
  { "title": "Image 2", "color": "#d6d6d4" },
  { "title": "Image 3", "color": "#d6d6d4" },
  { "title": "Image 4", "color": "#d6d6d4" },
  { "title": "Product ID / Style ID", "color": "#d6d6d4" },
  { "title": "SKU ID", "color": "#d6d6d4" },
  { "title": "Brand Name", "color": "#d6d6d4" },
  { "title": "Group ID", "color": "#d6d6d4" },
  { "title": "Product Description", "color": "#d6d6d4" },
  { "title": "Importer Details", "color": "#d6d6d4" },
  { "title": "EAN/UPC", "color": "#d6d6d4" },
  { "title": "Brand", "color": "#d6d6d4" },
  { "title": "Character", "color": "#d6d6d4" },
  { "title": "Hemline", "color": "#d6d6d4" },
  { "title": "Length", "color": "#d6d6d4" },
  { "title": "Number of Pockets", "color": "#d6d6d4" },
  { "title": "Sleeve Styling", "color": "#d6d6d4" },
  { "title": "v2", "color": "#d6d6d4" }
]


const row2 = [
  {
    "title": "Field Names"
  },
  {
    "title": "For system use, don't modify"
  },
  {
    "title": "For system use, don't modify"
  },
  {
    "title": "Provide the name of your product which will be visible on the Meesho app."
  },
  {
    "title": "Select variation (sizes) from the list"
  },
  {
    "title": "This is the normal/regular price at which you sell on Meesho. This price shall be lower than the Maximum Retail Price (MRP) of the Product. Customers buying at this price will be able to return products for all reasons."
  },
  {
    "title": "Enter the price at which you want to sell this product on Meesho app. Customers buying at this price can only return wrong/defective delivered items. Check all applicable return reasons in 'Return Reasons' sheet. Recommend entering Rs.22 lower than Meesho Price, based on reverse shipping & handling cost savings"
  },
  {
    "title": "Maximum Retail Price (inclusive of all taxes) shall be the maximum price of the product as per the applicable laws and as mentioned on the package of the product."
  },
  {
    "title": "Product GST %"
  },
  {
    "title": "Select the HSN ID from the dropdown."
  },
  {
    "title": "Weight of the product pack in grams"
  },
  {
    "title": "Number of items you have in stock."
  },
  {
    "title": "Please provide the manufacturing country for this product"
  },
  {
    "title": "Name and address of the manufacturer"
  },
  {
    "title": "Name and address of the packer"
  },
  {
    "title": "Select 'Color' from the list"
  },
  {
    "title": "Select 'Fabric' from the list"
  },
  {
    "title": "Select 'Fit/Shape' from the list"
  },
  {
    "title": "Select 'Neck' from the list"
  },
  {
    "title": "Select 'Net Quantity (N)' from the list"
  },
  {
    "title": "Select 'Occasion' from the list"
  },
  {
    "title": "Select 'Pattern' from the list"
  },
  {
    "title": "Select 'Print Or Pattern Type' from the list"
  },
  {
    "title": "Select 'Sleeve Length' from the list"
  },
  {
    "title": "Select 'Chest Size' from the list (Inch)"
  },
  {
    "title": "Select 'Length Size' from the list (Inch)"
  },
  {
    "title": "Select 'Shoulder Size' from the list (Inch)"
  },
  {
    "title": "Click on Images Bulk Upload on the supplier panel to create the image links. Please don't add GOOGLE DRIVE links to avoid QC error"
  },
  {
    "title": "Click on 'Image link Generator' on the supplier panel to create the image links. Please note that google drive links will not be accepted"
  },
  {
    "title": "Click on 'Image link Generator' on the supplier panel to create the image links. Please note that google drive links will not be accepted"
  },
  {
    "title": "Click on 'Image link Generator' on the supplier panel to create the image links. Please note that google drive links will not be accepted"
  },
  {
    "title": "Style Code is an alphanumeric code which is given to a product and can be found on the tag or packaging. Style Code remains the same for all Size variants and changes for all Color variants. For example, a red colored product that comes in three different sizes will have the same Style Code."
  },
  {
    "title": "Seller SKU ID is a unique ID for each product variation. This ID is created by seller which helps them to identify their products on Meesho. This ID will be shown in the inventory tab, orders tab, order label and invoices."
  },
  {
    "title": "Enter the Brand name"
  },
  {
    "title": "Enter same group ID for the products which should be grouped in a single catalog on Meesho app."
  },
  {
    "title": "Please write few lines describing your product"
  },
  {
    "title": "Name and address of the importer if this product is manufactured outside India"
  },
  {
    "title": "EAN is a 13 digit bar code required by brands. In case you have UPC, prefix 0 to make it 13 digits. EAN/UPC is limited to 13 characters (including spaces). If not applicable, Please leave it blank."
  },
  {
    "title": "Select 'Brand' from the list"
  },
  {
    "title": "Select 'Character' from the list"
  },
  {
    "title": "Select 'Hemline' from the list"
  },
  {
    "title": "Select 'Length' from the list"
  },
  {
    "title": "Select 'Number of Pockets' from the list"
  },
  {
    "title": "Select 'Sleeve Styling' from the list"
  }
]

const field1 = validation.getRow(1);
colIdx = 1;
for (const text of row1) {
  const cell = field1.getCell(colIdx++);
  // Background
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "d6d6d4" }
  };
  // Border
  cell.border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };
  // Alignment
  cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
  cell.value = text.title;
  cell.font = { bold: false, size: 11, color: { argb: "FF000000" } };
}

field1.height = 40;

const field2 = validation.getRow(2);
colIdx = 1;
for (const text of row2) {
  const cell = field2.getCell(colIdx++);
  // Background
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "d6d6d4" }
  };
  // Border
  cell.border = {
    top: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };
  // Alignment
  cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
  cell.value = text.title;
  cell.font = { bold: false, size: 11, color: { argb: "FF000000" } };
}

field1.height = 40;





  //validation.addRow(['Categories']);
  //validation.addRows([['Tshirts'], ['Sarees'], ['Kurtis'], ['Shirts']]);

  // ========== Return Reasons ==========
  const returnSheet = workbook.addWorksheet('Return Reasons');
  returnSheet.addRow(['Reason']);
  returnSheet.addRows([
    ['Wrong item received'],
    ['Size issue'],
    ['Damaged product'],
  ]);

  // ========== Send as XLSX File ==========
  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=Techpotli-template.xlsx',
    },
  });
}
