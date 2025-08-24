
const formsJson = {
  "form_101": {
       "AddProductDetails": {
      "copyInputDetailsToAllProducts": true,
      "ProductSizeInventory": [
        { "label": "GST %", "type": "dropdown", "options": ["0", "5", "12", "18", "28"] },
        { "label": "HSN Code", "type": "text", "placeholder": "Enter Product HSN Code" },
        { "label": "Net Weight (gm)", "type": "text", "placeholder": "Enter Net Weight (gm)" },
        { "label": "Style Code / Product ID (optional)", "type": "text", "placeholder": "Enter Style Code / Product ID (optional)" },
        { "label": "Product Name", "type": "text", "placeholder": "Enter Product Name" },
        { "label": "Size", "type": "dropdown", "options": ['Free Size',"S" ,"M"] }
      ]
    },
    "ProductDetails": [
      { "label": "Case/Bezel Material", "type": "dropdown", "options": [
        "Acrylic", "Alloy",  "Polyurethane",  "Stainless Steel", "Tritan",
      ] },
      { "label": "Color", "type": "dropdown", "options": [
        "Beige","Black","Blue","Brown","Camouflage","Coral","Cream"," Gold","Green","Grey","Grey Melange","Khaki","Lavendar","Maroon","Metallic","Multicolor","Mustard","Navy Blue","Nude","Olive","Orange","Peach","Pink","Purple","Red","Rust","Silver","Teal","White","Yellow",
      ] },
      { "label": "Dial Color", "type": "dropdown", "options": [
         "Beige","Black","Blue","Brown","Camouflage","Coral","Cream"," Gold","Green","Grey","Grey Melange","Khaki","Lavendar","Maroon","Metallic","Multicolor","Mustard","Navy Blue","Nude","Olive","Orange","Peach","Pink","Purple","Red","Rust","Silver","Teal","White","Yellow",
      ] },
      { "label": "Dial Design", "type": "dropdown", "options": [
        "Avenger", "Ben 10", "Cartoon Charater", "Diamond",  "Paidu",  "Solid",  "Transparent", "Turntable",      
      ] },
      { "label": "Dial Diameter (cm)", "type": "text", "placeholder": "Enter Dial Diameter (cm)" },
      { "label": "Dial Shape", "type": "dropdown", "options": [
        "Asymetrical",  "Diamond","Oval", "Rectangle/ Tonneau", "Round",  "Square", "Triangle", 
      ] },
      { "label": "Display Type", "type": "dropdown", "options": [
        "Analog", "Digital", "Analog & Digital",
      ] },
      { "label": "Dial Time", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Generic Name", "type": "dropdown", "options": [
        "Sports Watch"
      ] },
      { "label": "Ideal For", "type": "dropdown", "options": [
        "Kids-Boys", "Kids-Girls", "Unisex",
      ] },
      { "label": "Light", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Net Quantity (N)", "type": "dropdown", "options": [
        "1","10", "2", "3", "4", "5", "6", "7", "8", "9", 
      ]},
      { "label": "Occasion", "type": "dropdown", "options": [
        "Casual", "Formal", "Sports", "Partywear",
      ] },
      { "label": "Product Length (cm)", "type": "text", "placeholder": "Enter Product Length (cm)" },
      { "label": "Product Width (cm)", "type": "text", "placeholder": "Enter Product Width (cm)" },
      { "label": "Strap Color", "type": "dropdown", "options": [
         "Beige","Black","Blue","Brown","Camouflage","Coral","Cream"," Gold","Green","Grey","Grey Melange","Khaki","Lavendar","Maroon","Metallic","Multicolor","Mustard","Navy Blue","Nude","Olive","Orange","Peach","Pink","Purple","Red","Rust","Silver","Teal","White","Yellow",
      ] },
      { "label": "Strap Material", "type": "dropdown", "options": [
        "Alloy", "Beads",  "Brass", "Canvas", "Denim","Faux Leather/Leatherette", "Kundan", "Leather", "Metal","Pearl","Plastic","Pu", "Resin",  "Rubber",  "Silicon", "Stainless Steel", "Synthetic",  
      ] },
      { "label": "Strap Type", "type": "dropdown", "options": [
        "Belt", "Bracelet", "Chain", "Magnetic", "Scrunchie", 
      ] },
      { "label": "Trend", "type": "dropdown", "options": [
         "Avengers",     "Barbie",     "Ben 10",     "Butterfly",     "Camouflage",     "Cartoon",     "Chain",     "Chain Linked",     "Chronograph",     "Disney Character",     "Doraemon",     "Floral",     "Golden",     "Graphic Printed",     "Heart",     "Hello Kity",     "King",     "Kings &amp; Queens",     "Korean",     "LED",     "LED Light",     "Leather Strap",     "Little Pony",     "Magnet Strap",     "Queen",     "Religious",     "Rose Gold",     "Silver",     "Spiderman",     "Steel Strap",     "Unisex",     "Vintage",     "Waterproof",     "Wheel",
      ] },
      { "label": "Warranty", "type": "dropdown", "options": [
        "1 Months", "10 Months", "11 Months", "12 Months", "13 Months", "14 Months", "15 Months", "16 Months", "17 Months", "18 Months", "19 Months", "2 Months", "20 Months", "21 Months", "22 Months", "23 Months", "24 Months", "3 Months", "4 Months", "5 Months", "6 Months", "7", "7 Months", "8 Months", "9 Months", "Above 2 Years", "Months", 
      ] },
      { "label": "Water Resistance", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Country of Origin", "type": "dropdown", "options": [
        "India", "China", "USA", "Germany", "Japan", "Italy", "France", "UK", "Canada", "Australia", "South Korea", "Brazil", "Russia", "Spain", "Netherlands", "Switzerland", "Sweden", "Belgium", "Poland", "Turkey", "Mexico", "Norway", "Denmark", "Finland", "Austria", "Ireland", "Portugal", "Czech Republic", "Hungary", "Greece", "Roman", "Slovakia", "Bulgaria", "Croatia", "Lithuania", "Latvia", "Estonia", "Slovenia", "Cyprus", "Malta", "Luxembourg", "Iceland", "Liechtenstein", "Monaco", "Andorra", "San Marino", "Vatican City", "Albania", "Bosnia and Herzegovina", "North Macedonia", "Serbia", "Montenegro", "Kosovo", "Moldova", "Ukraine", "Belarus", "Armenia", "Azerbaijan", "Georgia", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Afghanistan", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan", "Maldives", "Iran", "Iraq", "Syria", "Lebanon", "Jordan",  
      ] },
      { "label": "Manufacturer Details", "type": "text", "placeholder": "Enter Manufacturer Details" },
      { "label": "Packer Details", "type": "text", "placeholder": "Enter Packer Details" }
    ],
     "OtherAttributes": [
      { "label": "Add On", "type": "dropdown", "options": [
        "Bracelet", "No", "No Add on", 
      ] },
      { "label": "Brand", "type": "dropdown", "options": [
         "99SHOPPERS ENTERPRISE",   "A B UNIQUE",   "ADK",   "ALKHWATCHES",   "AMIGOS",   "AMINO",   "ANALOGUE",   "ARMADO",   "ASHISH TRADERS",   "AV Times",   "AWEX",   "AZZUFRE",   "Abrexo",   "Alcove",   "Altedo",   "Axton",   "BENYAR",   "BEPKASU",   "BRAND",   "BRICKHEAD",   "BROSTIN",   "BUMTUM",   "Bella Moda",   "Benling",   "Blue Pearl",   "Bolun",   "Brezilo",   "Buyab Factory",   "CARNAER",   "CHIEFMOUNT",   "CRAB",   "CRAFTING WONDER",   "Carson",   "Cavior",   "DAINTY",   "DECLASSE",   "DHADAK COLLECTION",   "DHANVI ENTERPRISE",   "DIGITRACK",   "DKERAOD",   "DMASH",   "DWARKESH WATCH",   "Daksy",   "Daniel Jubile",   "Daniel Radcliffe",   "Deccan",   "EBR",   "EDENSCOPE",   "ELIOS",   "EMBLICA",   "ENLARGE",   "Eagle fly",   "Endeavour",   "Espoir",   "FEMEO",   "FOXTER",   "FRNDZMART",   "FYLAINCE",   "Fadiso Fashion",   "Feron",   "FixBit",   "Flozio",   "Foreigner",   "GARIHC ENTERPRISE",   "GIFFEMANS",   "GISTARIX",   "GLENVIT-X",   "GPTRADE",   "GRANTOX",   "Galaxy Hub",   "Goldenize fashion",   "Good Friend",   "Groan",   "HALA",   "HATin",   "HC HARMI CRETIVE",   "HEMRAJ CRAFTS",   "HERBITAL",   "HEZOC",   "HK Gauri Singari",   "HMT FASHION",   "HMTr",   "HOGWADS ENTERPRISE",   "Happy Khajana",   "Highend",   "Homeshopeez",   "IFW",   "IMSZZ",   "IRADDQUARTZ",   "Infaneo",   "J.Dial",   "Jagron",   "Jainx",   "Joyres",   "KACEN ENTERPRISE",   "KAJARU",   "KAKU FANCY",   "KE GALLERY",   "KELTICX",   "KIDDILY",   "KIROH",   "KIROH STYLE",   "KLOOCKSATTA",   "KNACK",   "KSTBJN",   "KU",   "Kiarvi Gallery",   "LAVAREDO",   "LAVISHABLE",   "LAXMO",   "LIK",   "LIMESTONE",   "LIRFO",   "LOIS CARON",   "LOKMART",   "LONGBO",   "LORENZ",   "LORETTA",   "LUMIFIE",   "Little Olive",   "Lucifer",   "Lugano",   "MAAN INTERNATIONAL",   "MAHHYAN",   "MAMATHINK",   "MIMID",   "MIVAAN",   "MOOVER",   "MR.MANDAVIYA",   "MVS",   "Maitra",   "Manibam Impex",   "Miarcus",   "Mikado",   "Miss Perfect",   "Mumurs",   "NAX",   "NIBOSI",   "NK Seller",   "NNC",   "NXZ",   "NammaBaby",   "Neutron",   "Ngiva",   "Nikola",   "Nirmuk",   "Nixea",   "Niyati Nx",   "OBLETTER",   "OMIOR",   "ONIR",   "Osmi Toys",   "Oxwor",   "Ozawi",   "PANARS",   "PELITOX",   "PERKONS",   "PIRASO",   "PRASH ENTERPRISE",   "PYTHON",   "Piaoma",   "Praizy Times",   "Prozo",   "QUANTICO",   "REDUX",   "REKHOLA",   "Rage Enterprise",   "Reborn",   "Recaro",   "Rizzly",   "SDK",   "SEDU",   "SHAJARA",   "SHMOFY LUXRY",   "SMILEBABY",   "SPINOZA",   "STIZONA",   "SWADESI STUFF",   "Septem",   "Shaping Fabric",   "Shilu",   "Shivark",   "Shivilex",   "Shocknshop",   "Siraya",   "Sky Magic",   "Skylark",   "Styleflix",   "Stysol",   "Swisstone watch",   "Swisstyle",   "Sylvi",   "TANOT",   "TAPOM",   "TAVIN ENTPERISE",   "TEMEX",   "TEXTURE",   "THE SHOPOHOLIC",   "TIMEWEAR",   "TRANDLOOK",   "TRK HUB",   "TRK IMPEX",   "TRUE COLORS",   "TU4 Enterprise",   "TURK",   "TWIT",   "TYMU",   "Taostry",   "Tesla",   "Time Nter",   "Times",   "Timor",   "TooHype",   "Trex",   "Twin Brothers",   "UNILORD",   "URBAN RETRO",   "Untumble",   "V&amp;Y",   "VARBARRY",   "VEKARIYA",   "VIKINGS",   "VINOUTEE",   "VOLGA",   "VORGETA",   "Varni Retail",   "Versatile",   "Viser",   "Vtrack",   "WATCHVERSE",   "Walrus",   "Wanton",   "Webby",   "Woozie",   "Word of Watch",   "Wristy",   "ZUPERIA",   "Zabby Allen",   "Zanques",
      ] },
      { "label": "Case", "type": "dropdown", "options": [
        "Asymmetrical" , "Oval", "Rectangle", "Square",
      ] },
      { "label": "Clasp Type", "type": "dropdown", "options": [
        "Bracelet", "Buckle", "Stainless Steel Buckle", "Triple Fold Clasp",
      ] },
      { "label": "Date Display", "type": "dropdown", "options": [
          "Yes", "No",
      ] },
      { "label": "GPS", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Mechanism", "type": "dropdown", "options": [
        "Mechanical Automatic" , "Quartz",
      ] },
      { "label": "Power Source", "type": "dropdown", "options": [
        "Battery Powered", "Original Battery", "Solar",
      ] },
      { "label": "Scratch Resistant", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Watch Movement", "type": "dropdown", "options": [
        "sl Movement", "xl Movement",
      ] },
      { "label": "Description", "type": "textarea", "maxlength": 1400 },
      { "label": "Importer Details", "type": "text" }
    ],
 
  },


  "form_102": {
    "AddProductDetails": {
      "copyInputDetailsToAllProducts": true,
      "ProductSizeInventory": [
        { "label": "GST %", "type": "dropdown", "options": ["0", "5", "12", "18", "28"] },
        { "label": "HSN Code", "type": "text", "placeholder": "Enter Product HSN Code" },
        { "label": "Net Weight (gm)", "type": "text", "placeholder": "Enter Net Weight (gm)" },
        { "label": "Style Code / Product ID (optional)", "type": "text", "placeholder": "Enter Style Code / Product ID (optional)" },
        { "label": "Product Name", "type": "text", "placeholder": "Enter Product Name" },
        { "label": "Size", "type": "dropdown", "options": ['Free Size',"l"] }
      ]
    },
    "ProductDetails": [
      { "label": "Case/Bezel Material", "type": "dropdown", "options": [
        "Acrylic", "Alloy",  "Polyurethane",  "Stainless Steel", "Tritan",
      ] },
      { "label": "Color", "type": "dropdown", "options": [
        "Beige","Black","Blue","Brown","Camouflage","Coral","Cream"," Gold","Green","Grey","Grey Melange","Khaki","Lavendar","Maroon","Metallic","Multicolor","Mustard","Navy Blue","Nude","Olive","Orange","Peach","Pink","Purple","Red","Rust","Silver","Teal","White","Yellow",
      ] },
      { "label": "Dial Color", "type": "dropdown", "options": [
         "Beige","Black","Blue","Brown","Camouflage","Coral","Cream"," Gold","Green","Grey","Grey Melange","Khaki","Lavendar","Maroon","Metallic","Multicolor","Mustard","Navy Blue","Nude","Olive","Orange","Peach","Pink","Purple","Red","Rust","Silver","Teal","White","Yellow",
      ] },
      { "label": "Dial Design", "type": "dropdown", "options": [
        "Avenger", "Ben 10", "Cartoon Charater", "Diamond",  "Paidu",  "Solid",  "Transparent", "Turntable",      
      ] },
      { "label": "Dial Diameter (cm)", "type": "text", "placeholder": "Enter Dial Diameter (cm)" },
      { "label": "Dial Shape", "type": "dropdown", "options": [
        "Asymetrical",  "Diamond","Oval", "Rectangle/ Tonneau", "Round",  "Square", "Triangle", 
      ] },
      { "label": "Display Type", "type": "dropdown", "options": [
        "Analog", "Digital", "Analog & Digital",
      ] },
      { "label": "Dial Time", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Generic Name", "type": "dropdown", "options": [
        "Sports Watch"
      ] },
      { "label": "Ideal For", "type": "dropdown", "options": [
        "Kids-Boys", "Kids-Girls", "Unisex",
      ] },
      { "label": "Light", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Net Quantity (N)", "type": "dropdown", "options": [
        "1","10", "2", "3", "4", "5", "6", "7", "8", "9", 
      ]},
      { "label": "Occasion", "type": "dropdown", "options": [
        "Casual", "Formal", "Sports", "Partywear",
      ] },
      { "label": "Product Length (cm)", "type": "text", "placeholder": "Enter Product Length (cm)" },
      { "label": "Product Width (cm)", "type": "text", "placeholder": "Enter Product Width (cm)" },
      { "label": "Strap Color", "type": "dropdown", "options": [
         "Beige","Black","Blue","Brown","Camouflage","Coral","Cream"," Gold","Green","Grey","Grey Melange","Khaki","Lavendar","Maroon","Metallic","Multicolor","Mustard","Navy Blue","Nude","Olive","Orange","Peach","Pink","Purple","Red","Rust","Silver","Teal","White","Yellow",
      ] },
      { "label": "Strap Material", "type": "dropdown", "options": [
        "Alloy", "Beads",  "Brass", "Canvas", "Denim","Faux Leather/Leatherette", "Kundan", "Leather", "Metal","Pearl","Plastic","Pu", "Resin",  "Rubber",  "Silicon", "Stainless Steel", "Synthetic",  
      ] },
      { "label": "Strap Type", "type": "dropdown", "options": [
        "Belt", "Bracelet", "Chain", "Magnetic", "Scrunchie", 
      ] },
      { "label": "Trend", "type": "dropdown", "options": [
         "Avengers",     "Barbie",     "Ben 10",     "Butterfly",     "Camouflage",     "Cartoon",     "Chain",     "Chain Linked",     "Chronograph",     "Disney Character",     "Doraemon",     "Floral",     "Golden",     "Graphic Printed",     "Heart",     "Hello Kity",     "King",     "Kings &amp; Queens",     "Korean",     "LED",     "LED Light",     "Leather Strap",     "Little Pony",     "Magnet Strap",     "Queen",     "Religious",     "Rose Gold",     "Silver",     "Spiderman",     "Steel Strap",     "Unisex",     "Vintage",     "Waterproof",     "Wheel",
      ] },
      { "label": "Warranty", "type": "dropdown", "options": [
        "1 Months", "10 Months", "11 Months", "12 Months", "13 Months", "14 Months", "15 Months", "16 Months", "17 Months", "18 Months", "19 Months", "2 Months", "20 Months", "21 Months", "22 Months", "23 Months", "24 Months", "3 Months", "4 Months", "5 Months", "6 Months", "7", "7 Months", "8 Months", "9 Months", "Above 2 Years", "Months", 
      ] },
      { "label": "Water Resistance", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Country of Origin", "type": "dropdown", "options": [
        "India", "China", "USA", "Germany", "Japan", "Italy", "France", "UK", "Canada", "Australia", "South Korea", "Brazil", "Russia", "Spain", "Netherlands", "Switzerland", "Sweden", "Belgium", "Poland", "Turkey", "Mexico", "Norway", "Denmark", "Finland", "Austria", "Ireland", "Portugal", "Czech Republic", "Hungary", "Greece", "Roman", "Slovakia", "Bulgaria", "Croatia", "Lithuania", "Latvia", "Estonia", "Slovenia", "Cyprus", "Malta", "Luxembourg", "Iceland", "Liechtenstein", "Monaco", "Andorra", "San Marino", "Vatican City", "Albania", "Bosnia and Herzegovina", "North Macedonia", "Serbia", "Montenegro", "Kosovo", "Moldova", "Ukraine", "Belarus", "Armenia", "Azerbaijan", "Georgia", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Afghanistan", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan", "Maldives", "Iran", "Iraq", "Syria", "Lebanon", "Jordan",  
      ] },
      { "label": "Manufacturer Details", "type": "text", "placeholder": "Enter Manufacturer Details" },
      { "label": "Packer Details", "type": "text", "placeholder": "Enter Packer Details" }
    ],
     "OtherAttributes": [
      { "label": "Add On", "type": "dropdown", "options": [
        "Bracelet", "No", "No Add on", 
      ] },
      { "label": "Brand", "type": "dropdown", "options": [
         "99SHOPPERS ENTERPRISE",   "A B UNIQUE",   "ADK",   "ALKHWATCHES",   "AMIGOS",   "AMINO",   "ANALOGUE",   "ARMADO",   "ASHISH TRADERS",   "AV Times",   "AWEX",   "AZZUFRE",   "Abrexo",   "Alcove",   "Altedo",   "Axton",   "BENYAR",   "BEPKASU",   "BRAND",   "BRICKHEAD",   "BROSTIN",   "BUMTUM",   "Bella Moda",   "Benling",   "Blue Pearl",   "Bolun",   "Brezilo",   "Buyab Factory",   "CARNAER",   "CHIEFMOUNT",   "CRAB",   "CRAFTING WONDER",   "Carson",   "Cavior",   "DAINTY",   "DECLASSE",   "DHADAK COLLECTION",   "DHANVI ENTERPRISE",   "DIGITRACK",   "DKERAOD",   "DMASH",   "DWARKESH WATCH",   "Daksy",   "Daniel Jubile",   "Daniel Radcliffe",   "Deccan",   "EBR",   "EDENSCOPE",   "ELIOS",   "EMBLICA",   "ENLARGE",   "Eagle fly",   "Endeavour",   "Espoir",   "FEMEO",   "FOXTER",   "FRNDZMART",   "FYLAINCE",   "Fadiso Fashion",   "Feron",   "FixBit",   "Flozio",   "Foreigner",   "GARIHC ENTERPRISE",   "GIFFEMANS",   "GISTARIX",   "GLENVIT-X",   "GPTRADE",   "GRANTOX",   "Galaxy Hub",   "Goldenize fashion",   "Good Friend",   "Groan",   "HALA",   "HATin",   "HC HARMI CRETIVE",   "HEMRAJ CRAFTS",   "HERBITAL",   "HEZOC",   "HK Gauri Singari",   "HMT FASHION",   "HMTr",   "HOGWADS ENTERPRISE",   "Happy Khajana",   "Highend",   "Homeshopeez",   "IFW",   "IMSZZ",   "IRADDQUARTZ",   "Infaneo",   "J.Dial",   "Jagron",   "Jainx",   "Joyres",   "KACEN ENTERPRISE",   "KAJARU",   "KAKU FANCY",   "KE GALLERY",   "KELTICX",   "KIDDILY",   "KIROH",   "KIROH STYLE",   "KLOOCKSATTA",   "KNACK",   "KSTBJN",   "KU",   "Kiarvi Gallery",   "LAVAREDO",   "LAVISHABLE",   "LAXMO",   "LIK",   "LIMESTONE",   "LIRFO",   "LOIS CARON",   "LOKMART",   "LONGBO",   "LORENZ",   "LORETTA",   "LUMIFIE",   "Little Olive",   "Lucifer",   "Lugano",   "MAAN INTERNATIONAL",   "MAHHYAN",   "MAMATHINK",   "MIMID",   "MIVAAN",   "MOOVER",   "MR.MANDAVIYA",   "MVS",   "Maitra",   "Manibam Impex",   "Miarcus",   "Mikado",   "Miss Perfect",   "Mumurs",   "NAX",   "NIBOSI",   "NK Seller",   "NNC",   "NXZ",   "NammaBaby",   "Neutron",   "Ngiva",   "Nikola",   "Nirmuk",   "Nixea",   "Niyati Nx",   "OBLETTER",   "OMIOR",   "ONIR",   "Osmi Toys",   "Oxwor",   "Ozawi",   "PANARS",   "PELITOX",   "PERKONS",   "PIRASO",   "PRASH ENTERPRISE",   "PYTHON",   "Piaoma",   "Praizy Times",   "Prozo",   "QUANTICO",   "REDUX",   "REKHOLA",   "Rage Enterprise",   "Reborn",   "Recaro",   "Rizzly",   "SDK",   "SEDU",   "SHAJARA",   "SHMOFY LUXRY",   "SMILEBABY",   "SPINOZA",   "STIZONA",   "SWADESI STUFF",   "Septem",   "Shaping Fabric",   "Shilu",   "Shivark",   "Shivilex",   "Shocknshop",   "Siraya",   "Sky Magic",   "Skylark",   "Styleflix",   "Stysol",   "Swisstone watch",   "Swisstyle",   "Sylvi",   "TANOT",   "TAPOM",   "TAVIN ENTPERISE",   "TEMEX",   "TEXTURE",   "THE SHOPOHOLIC",   "TIMEWEAR",   "TRANDLOOK",   "TRK HUB",   "TRK IMPEX",   "TRUE COLORS",   "TU4 Enterprise",   "TURK",   "TWIT",   "TYMU",   "Taostry",   "Tesla",   "Time Nter",   "Times",   "Timor",   "TooHype",   "Trex",   "Twin Brothers",   "UNILORD",   "URBAN RETRO",   "Untumble",   "V&amp;Y",   "VARBARRY",   "VEKARIYA",   "VIKINGS",   "VINOUTEE",   "VOLGA",   "VORGETA",   "Varni Retail",   "Versatile",   "Viser",   "Vtrack",   "WATCHVERSE",   "Walrus",   "Wanton",   "Webby",   "Woozie",   "Word of Watch",   "Wristy",   "ZUPERIA",   "Zabby Allen",   "Zanques",
      ] },
      { "label": "Case", "type": "dropdown", "options": [
        "Asymmetrical" , "Oval", "Rectangle", "Square",
      ] },
      { "label": "Clasp Type", "type": "dropdown", "options": [
        "Bracelet", "Buckle", "Stainless Steel Buckle", "Triple Fold Clasp",
      ] },
      { "label": "Date Display", "type": "dropdown", "options": [
          "Yes", "No",
      ] },
      { "label": "GPS", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Mechanism", "type": "dropdown", "options": [
        "Mechanical Automatic" , "Quartz",
      ] },
      { "label": "Power Source", "type": "dropdown", "options": [
        "Battery Powered", "Original Battery", "Solar",
      ] },
      { "label": "Scratch Resistant", "type": "dropdown", "options": [
        "Yes", "No",
      ] },
      { "label": "Watch Movement", "type": "dropdown", "options": [
        "sl Movement", "xl Movement",
      ] },
      { "label": "Description", "type": "textarea", "maxlength": 1400 },
      { "label": "Importer Details", "type": "text" }
    ],
  },

  "form_701": {
     "AddProductDetails": {
      "copyInputDetailsToAllProducts": true,
      "ProductSizeInventory": [
        { "label": "GST %", "type": "dropdown", "options": ["0", "5", "12", "18", "28"], "info": "Product GST %" },
        { "label": "HSN Code", "type": "text", "placeholder": "Enter Product HSN Code" , "info":"Product hsn code"},
        { "label": "Net Weight (gm)", "type": "text", "placeholder": "Enter Net Weight (gm)", "info":"Means the total weight of the product excluding the packaging weight. Acceptable unit is gram (g) This information is available on the packaging label for pre-packed products. If you are not listing a pre-packed product, please check the weight of the product excluding any external packing and provide such information in SI Unit - grams."},
        { "label": "Style Code / Product ID (optional)", "type": "text", "placeholder": "Enter Style Code / Product ID (optional)", "info":"Product ID is an alphanumeric code which is given to a product and can be found on the tag or packaging. It remains the same for all Size variants and changes for all Color variants. For example, a red colored product that comes in three different sizes will have the same Product ID." },
        { "label": "Product Name", "type": "text", "placeholder": "Enter Product Name", "info": "Please enter the product name. Note: Please avoid adding product features such as weight. dimension, price description here." },
        { "label": "Size", "type": "dropdown", "options": ['Free Size'] }
      ]
    },
    "ProductDetails": [
    { "label": "Generic Name", "type": "dropdown", "options": [
       "Computer Keyboard", "Keyboard", "PC Keyboard", "Wired Keyboard", "Wireless Keyboard",
  
    ] , "info": "Generic Name means the commonly used name through which a product is generally called/known. Generic name DOES NOT MEAN the name of the brand or manufacturer of the product or its use." },
    { "label": "Included Components", "type": "text", "placeholder": "Enter Included Components" , "info":"If the product comes with related parts or accessories, please specify each part or accessory along with the number of units." },
    { "label": "Net Quantity (N)", "type": "dropdown", "options": [
       "1","10", "2", "3", "4", "5", "6", "7", "8", "9",
    ] },
    { "label": "Power Source", "type": "dropdown", "options": [
      "Battery", "Dual Power", "Electricity"
    ],"info":"Power Source is the means by which an electrical appliance receives the necessary electrical energy to function. This can be through batteries or through electricity." },
    { "label": "Warranty Period", "type": "dropdown", "options": [
      "1 Month", "1 Month Brand Warranty", "1 Month Seller Warranty", "1 Year", "1 Year Brand Warranty", "1 Year Seller Warranty", "12 Months", "2 Months", "2 Months Brand Warranty", "2 Months Seller Warranty", "2 Years", "2 Years Brand Warranty", "2 Years Seller Warranty", "3 Months", "3 Months Brand Warranty", "3 Months Seller Warranty", "3 Years", "3 Years Brand Warranty", "3 Years Seller Warranty", "4 Years", "4 Years Brand Warranty", "4 Years Manufacturer Warranty", "4 Years Seller Warranty", "5 Years", "5 Years Brand Warranty", "5 Years Manufacturer Warranty", "5 Years Seller Warranty", "6 Months", "6 Months Brand Warranty", "6 Months Seller Warranty", "9 Months", "9 Months Brand Warranty", "9 Months Seller Warranty", "9 Months Seller Warranty1 Month", "No Warranty"
    ] },
    { "label": "Warranty Type", "type": "dropdown", "options": [
      "Carry In",  "Not Applicable",  "On Site",  "Pick Up",  "Repair",  "Repair or Replacement",  "Replacement"
    ] },
    { "label": "Country of Origin", "type": "dropdown", "options": [
      "India",  "Afghanistan",  "Albania",  "Algeria",  "Andorra",  "Angola",  "Antigua and Barbuda",  "Argentina",  "Armenia",  "Australia",  "Austria",  "Azerbaijan",  "Bahamas",  "Bahrain",  "Bangladesh",  "Barbados",  "Belarus",  "Belgium",  "Belize",  "Benin",  "Bhutan",  "Bolivia",  "Bosnia-Herzegovina",  "Botswana",  "Brazil",  "Brunei",  "Bulgaria",  "Burkina Faso",  "Burundi",  "Cabo Verde",  "Cambodia",  "Cameroon",  "Canada",  "Central African Rep",  "Chad",  "Chile",  "China",  "Colombia",  "Comoros",  "Congo",  "Costa Rica",  "Croatia",  "Cuba",  "Cyprus",  "Czechia",  "DRC Congo",  "Denmark",  "Djibouti",  "Dominica",  "Dominican Republic",  "Ecuador",  "Egypt",  "El Salvador",  "Equatorial Guinea",  "Eritrea",  "Estonia",  "Eswatini",  "Ethiopia",  "Fiji",  "Finland",  "France",  "Gabon",  "Gambia",  "Georgia",  "Germany",  "Ghana",  "Greece",  "Grenada",  "Guatemala",  "Guinea",  "Guinea Bissau",  "Guyana",  "Haiti",  "Holy See",  "Honduras",  "Hungary",  "Iceland",  "Indonesia",  "Iran",  "Iraq",  "Ireland",  "Israel",  "Italy",  "Jamaica",  "Japan",  "Jordan",  "Kazakhstan",  "Kenya",  "Kiribati",  "Kuwait",  "Kyrgyzstan",  "Laos",  "Latvia",  "Lebanon",  "Lesotho",  "Liberia",  "Libya",  "Liechtenstein",  "Lithuania",  "Luxembourg",  "Madagascar",  "Malawi",  "Malaysia",  "Maldives",  "Mali",  "Malta",  "Marshall Islands",  "Mauritania",  "Mauritius",  "Mexico",  "Micronesia",  "Moldova",  "Monaco",  "Mongolia",  "Montenegro",  "Morocco",  "Mozambique",  "Myanmar",  "Namibia",  "Nauru",  "Nepal",  "Netherlands",  "New Zealand",  "Nicaragua",  "Niger",  "Nigeria",  "North Korea",  "North Macedonia",  "Norway",  "Oman",  "Pakistan",  "Palau",  "Palestine State",  "Panama",  "Papua New Guinea",  "Paraguay",  "Peru",  "Philippines",  "Poland",  "Portugal",  "Qatar",  "Romania",  "Russia",  "Rwanda",  "Saint Kitts &amp; Nevis",  "Saint Lucia",  "St Vincent",  "Samoa",  "San Marino",  "Sao Tome",  "Saudi Arabia",  "Senegal",  "Serbia",  "Seychelles",  "Sierra Leone",  "Singapore",  "Slovakia",  "Slovenia",  "Solomon Islands",  "Somalia",  "South Africa",  "South Korea",  "South Sudan",  "Spain",  "Sri Lanka",  "Sudan",  "Suriname",  "Sweden",  "Switzerland",  "Syria",  "Tajikistan",  "Tanzania",  "Thailand",  "Timor Leste",  "Togo",  "Tonga",  "Trinidad and Tobago",  "Tunisia",  "Turkey",  "Turkmenistan",  "Tuvalu",  "Uganda",  "Ukraine",  "UAE",  "United Kingdom",  "USA",  "Uruguay",  "Uzbekistan",  "Vanuatu",  "Venezuela",  "Vietnam",  "Yemen",  "Zambia",  "Zimbabwe"
    ], "info":"Country of Origin means the country in which the product has been produced or assembled in. This information is available on the packaging label for pre- packed products. If you are not listing a pre-packed product, please provide the country in which the product is manufactured." },
    { "label": "Manufacturer Name", "type": "text", "placeholder": "Enter Manufacturer Name", "info": "Enter the name of the Manufacturer which means the entity which has produced the product and this information is generally available on the packaging label of the product. Find “manufactured by” on the label. If this information is not available on the label of your product or your product does not have a label, in such case you will have to provide us with details of the entity/person who is responsible for producing your product." },
    { "label": "Manufacturer Address", "type": "text", "placeholder": "Enter Manufacturer Address", "info": "Enter the address of the Manufacturer which means the entity which has produced the product and this information is generally available on the packaging label of the product. Find “manufactured by” on the label. If this information is not available on the label of your product or your product does not have a label, in such case you will have to provide us with details of the entity/person who is responsible for producing your product." },
    { "label": "Manufacturer Pincode", "type": "text", "placeholder": "Enter Manufacturer Pincode" , "info": "Enter the pincode mentioned in the manufacturers address." },
    { "label": "Packer Name", "type": "text", "placeholder": "Enter Packer Name", "info": "Enter the name of the Packer which generally means the entity which has packed the product. Packer details can generally be found on the label of the product. Find “Pkd” on the label. In case where your product does not have a label where this information is available, you will have to separately check who the packer of your product is. In a lot of the cases, the entity that has packed the product may be the same entity that has manufactured the product as well." },
    { "label": "Packer Address", "type": "text", "placeholder": "Enter Packer Address", "info":"Enter the address of the Packer which generally means the entity which has packed the product. Packer details can generally be found on the label of the product. Find “Pkd” on the label. In case where your product does not have a label where this information is available, you will have to separately check who the packer of your product is. In a lot of the cases, the entity that has packed the product may be the same entity that has manufactured the product as well." },
    { "label": "Packer Pincode", "type": "text", "placeholder": "Enter Packer Pincode", "info":"Enter the pincode mentioned in the packers address." },
    { "label": "Importer Name", "type": "text", "placeholder": "Enter Importer Name", "info": "Enter the name of the Importer which means the entity which has imported the product from any other country into India for sale in India. This information is generally available on the packaging label of the product. Find “imported by” on the label.If this information is not available on the label of your product or your product does not have a label, in such case you will have to provide us with details of the entity/person who is responsible for importing your product." },
    { "label": "Importer Address", "type": "text", "placeholder": "Enter Importer Address", "info": "Enter the address of the Importer which means the entity which has imported the product from any other country into India for sale in India. This information is generally available on the packaging label of the product. Find “imported by” on the label. If this information is not available on the label of your product or your product does not have a label, in such case you will have to provide us with details of the entity/person who is responsible for importing your product."},
    { "label": "Importer Pincode", "type": "text", "placeholder": "Enter Importer Pincode",  "info": "Pincode of the importer if your product is manufactured outside India."}
  ],
   "OtherAttributes": [
     { "label": "TRUE", "type": "text", "placeholder": "Enter TRUE" },
    { "label": "Brand", "type": "dropdown", "options": [
      "A+ Products", "ABTUNA", "ADZOY", "Aroma", "Atarc", "BINNA", "Blitzbot", "Blue Feather", "BoAt", "D25", "DELL", "DHANVI ENTERPRISE", "DIGITAL PLUS", "Dezful", "Di Product", "Dubstep", "Dudao", "E True", "EBUZZ", "Editrix", "Enter", "Etake", "Felsone", "Fire-Boltt", "Foxin", "GARIHC ENTERPRISE", "HEMRAJ CRAFTS", "HIBA", "HexaGear", "Hoppup", "Interceptor", "KINGFASTER", "LYNE", "MESHIV", "MOREX", "MTOOL", "MYZK", "MagJet", "Manibam Impex", "Matlek", "Mivi", "Mophonics", "Msunjay", "Nu Republic", "Omniversal", "Ovking", "PORTRONICS", "Pebble", "Pochanki", "ProDot", "Ptron", "Quantum computing", "RSG", "Redmi", "SEDU", "SPYRONIX", "STmax", "SUBTON BASICS", "SeeCot", "Shaping Fabric", "Sharp Beak", "Skullcandy", "Skycell", "Stela", "TECHEASY ENTERPRISES", "TRK HUB", "TRK IMPEX", "TU4 Enterprise", "TX-FLO", "Tosofy", "Twin Brothers", "U&amp;I", "UBON", "UNITIX", "Vanfly", "Verilux", "WASD", "ZEBRONICS", "ZENIFY", "ZORBES", "Zoook", "physicswallah", "pw", "tvAt", "zebion"
    ] },
    { "label": "Color", "type": "dropdown", "options": [
      "Beige", "Black", "Blue", "Brown", "Coral", "Cream", "Gold", "Green", "Grey", "Grey Melange", "Khaki", "Lavendar", "Maroon", "Metallic", "Multicolor", "Mustard", "Navy Blue", "Nude", "Olive", "Orange", "Peach", "Pink", "Purple", "Red", "Rust", "Silver", "Teal", "White", "Yellow"
    ] },
    { "label": "IS Number", "type": "text", "placeholder": "Enter IS Number", "info":"It is a number given by the Bureau of Indian Standards (BIS) to products that meet certain safety and quality standards. Please add the numeric value next to IS on the product or on the product packaging. This information will be available on the product/packaging label for pre-packed products. Please enter the same value as in the product/ packaging. You can identify this on the product/ packaging in the following format above the certified mark" },
    { "label": "Length", "type": "dropdown", "options": [
      "15 cm", "16 cm", "17 cm", "18 cm", "19 cm", "20 cm", "21 cm", "22 cm", "23 cm", "24 cm", "25 cm", "26 cm", "27 cm", "28 cm", "29 cm", "30 cm", "31 cm", "32 cm", "33 cm", "34 cm", "35 cm", "36 cm", "37 cm", "38 cm", "39 cm", "40 cm", "41 cm", "42 cm", "43 cm", "44 cm", "45 cm", "46 cm", "47 cm", "48 cm", "49 cm", "50 cm"
    ] },
    { "label": "Material", "type": "dropdown", "options": [
      "Metal", "Plastic", "Rubber", 
     ] },
    { "label": "Product Type", "type": "dropdown", "options": [
      "Wired Keyboard", "Wireless Keyboard",
    ] },
    { "label": "R Number", "type": "text", "placeholder": "Enter R Number" , "info":"This is a unique number given to a specific manufacturing unit or factory by the Bureau of Indian Standards (BIS). Please add the 7-10 digit registration number next to CM/L or R on the product or on the product packaging. This information will be available on the product/packaging label for pre-packed products. Please enter the same value as in the product/ packaging. You can identify this on the product/ packaging in the following format below the certified mark." },
    { "label": "USB", "type": "dropdown", "options": [
      "Yes", "No",
    ] },
    { "label": "Width", "type": "dropdown", "options": [
       "15 cm", "16 cm", "17 cm", "18 cm", "19 cm", "20 cm", "21 cm", "22 cm", "23 cm", "24 cm", "25 cm", "26 cm", "27 cm", "28 cm", "29 cm", "30 cm", "31 cm", "32 cm", "33 cm", "34 cm", "35 cm", "36 cm", "37 cm", "38 cm", "39 cm", "40 cm", "41 cm", "42 cm", "43 cm", "44 cm", "45 cm", "46 cm", "47 cm", "48 cm", "49 cm", "50 cm"
    ] },
    { "label": "Description", "type": "textarea", "placeholder": "Enter Description (max 1400 characters)", "info":"Provide the description of the product which will be visible on the app" }
    ],
  },


"form_702": {
     "AddProductDetails": {
      "copyInputDetailsToAllProducts": true,
      "ProductSizeInventory": [
        { "label": "GST %", "type": "dropdown", "options": ["0", "5", "12", "18", "28"] },
        { "label": "HSN Code", "type": "text", "placeholder": "Enter Product HSN Code" },
        { "label": "Net Weight (gm)", "type": "text", "placeholder": "Enter Net Weight (gm)" },
        { "label": "Style Code / Product ID (optional)", "type": "text", "placeholder": "Enter Style Code / Product ID (optional)" },
        { "label": "Product Name", "type": "text", "placeholder": "Enter Product Name" },
        { "label": "Size", "type": "dropdown", "options": ['Free Size'] }
      ]
    },
    "ProductDetails": [
    { "label": "Generic Name", "type": "dropdown", "options": [
       ] },
    { "label": "Included Components", "type": "text", "placeholder": "Enter Included Components" },
    { "label": "Net Quantity (N)", "type": "dropdown", "options": [] },
    { "label": "Power Source", "type": "dropdown", "options": [] },
    { "label": "Warranty Period", "type": "dropdown", "options": [] },
    { "label": "Warranty Type", "type": "dropdown", "options": [] },
    { "label": "Country of Origin", "type": "dropdown", "options": [] },
    { "label": "Manufacturer Name", "type": "text", "placeholder": "Enter Manufacturer Name" },
    { "label": "Manufacturer Address", "type": "text", "placeholder": "Enter Manufacturer Address" },
    { "label": "Manufacturer Pincode", "type": "text", "placeholder": "Enter Manufacturer Pincode" },
    { "label": "Packer Name", "type": "text", "placeholder": "Enter Packer Name" },
    { "label": "Packer Address", "type": "text", "placeholder": "Enter Packer Address" },
    { "label": "Packer Pincode", "type": "text", "placeholder": "Enter Packer Pincode" },
    { "label": "Importer Name", "type": "text", "placeholder": "Enter Importer Name" },
    { "label": "Importer Address", "type": "text", "placeholder": "Enter Importer Address" },
    { "label": "Importer Pincode", "type": "text", "placeholder": "Enter Importer Pincode" }
  ],
  "OtherAttributes": [
     { "label": "TRUE", "type": "text", "placeholder": "Enter TRUE" },
    { "label": "Brand", "type": "dropdown", "options": [] },
    { "label": "Color", "type": "dropdown", "options": [] },
    { "label": "IS Number", "type": "text", "placeholder": "Enter IS Number" },
    { "label": "Length", "type": "dropdown", "options": [] },
    { "label": "Material", "type": "dropdown", "options": [] },
    { "label": "Product Type", "type": "dropdown", "options": [] },
    { "label": "R Number", "type": "text", "placeholder": "Enter R Number" },
    { "label": "USB", "type": "dropdown", "options": [] },
    { "label": "Width", "type": "dropdown", "options": [] },
    { "label": "Description", "type": "textarea", "placeholder": "Enter Description (max 1400 characters)" }
    ],
 
  },
    "form_703": {
       "AddProductDetails": {
      "copyInputDetailsToAllProducts": true,
      "ProductSizeInventory": [
        { "label": "GST %", "type": "dropdown", "options": ["0", "5", "12", "18", "28"] },
        { "label": "HSN Code", "type": "text", "placeholder": "Enter Product HSN Code" },
        { "label": "Net Weight (gm)", "type": "text", "placeholder": "Enter Net Weight (gm)" },
        { "label": "Style Code / Product ID (optional)", "type": "text", "placeholder": "Enter Style Code / Product ID (optional)" },
        { "label": "Product Name", "type": "text", "placeholder": "Enter Product Name" },
        { "label": "Size", "type": "dropdown", "options": ['Free Size'] }
      ]
    },
    "ProductDetails": [
    { "label": "Generic Name", "type": "dropdown", "options": [] },
    { "label": "Included Components", "type": "text", "placeholder": "Enter Included Components" },
    { "label": "Net Quantity (N)", "type": "dropdown", "options": [] },
    { "label": "Power Source", "type": "dropdown", "options": [] },
    { "label": "Warranty Period", "type": "dropdown", "options": [] },
    { "label": "Warranty Type", "type": "dropdown", "options": [] },
    { "label": "Country of Origin", "type": "dropdown", "options": [] },
    { "label": "Manufacturer Name", "type": "text", "placeholder": "Enter Manufacturer Name" },
    { "label": "Manufacturer Address", "type": "text", "placeholder": "Enter Manufacturer Address" },
    { "label": "Manufacturer Pincode", "type": "text", "placeholder": "Enter Manufacturer Pincode" },
    { "label": "Packer Name", "type": "text", "placeholder": "Enter Packer Name" },
    { "label": "Packer Address", "type": "text", "placeholder": "Enter Packer Address" },
    { "label": "Packer Pincode", "type": "text", "placeholder": "Enter Packer Pincode" },
    { "label": "Importer Name", "type": "text", "placeholder": "Enter Importer Name" },
    { "label": "Importer Address", "type": "text", "placeholder": "Enter Importer Address" },
    { "label": "Importer Pincode", "type": "text", "placeholder": "Enter Importer Pincode" }
  ],
   "OtherAttributes": [
     { "label": "TRUE", "type": "text", "placeholder": "Enter TRUE" },
    { "label": "Brand", "type": "dropdown", "options": [] },
    { "label": "Color", "type": "dropdown", "options": [] },
    { "label": "IS Number", "type": "text", "placeholder": "Enter IS Number" },
    { "label": "Length", "type": "dropdown", "options": [] },
    { "label": "Material", "type": "dropdown", "options": [] },
    { "label": "Product Type", "type": "dropdown", "options": [] },
    { "label": "R Number", "type": "text", "placeholder": "Enter R Number" },
    { "label": "USB", "type": "dropdown", "options": [] },
    { "label": "Width", "type": "dropdown", "options": [] },
    { "label": "Description", "type": "textarea", "placeholder": "Enter Description (max 1400 characters)" }
    ],
  }
};

export default formsJson;
