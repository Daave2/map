// Default category mappings bundled into the app
// These are used as the baseline and can be overridden by user's localStorage mappings

export const DEFAULT_CATEGORY_MAPPINGS: Record<string, string> = {
    // Meat & Fish
    "Bacon & Bacon Joints": "bacon, gammon & sausages",
    "Beef. lamb, sous vide": "natural meat, fish & poultry",
    "Beef": "natural meat, fish & poultry",
    "Lamb": "natural meat, fish & poultry",
    "Pork": "express meat, pork & chix",
    "Sausage": "bacon, gammon & sausages",
    "Poultry (Breaded)": "breaded poultry",
    "Poultry (Fresh)": "poultry portions & whole birds inc turkey",
    "Turkey": "poultry portions & whole birds inc turkey",
    "Pre Packed Fish": "prep cook fish",
    "Frozen Fish": "processed meat, fish & poultry",
    "Frozen Prep Poultry": "breaded poultry",
    "Frozen Meat, Burgers, Sausage": "processed meat, fish & poultry",
    "Prepacked Cooked Meats & Sandwich Fillings": "cooked meat inc pate",
    "Prepacked Cooked Meats": "cooked meat inc pate",
    "Canned Meat": "canned veg meal accomp", // Best approximation / co-located
    "Canned Meats & Spreads": "canned veg meal accomp",

    // Bakery & Cakes
    "Bought in Cake": "combined cakeshop|cakes|party cakes|cupcakes, mix & decs.",
    "Cake Shop": "combined cakeshop",
    "Cake shop": "combined cakeshop",
    "In Store Bakery": "soft rolls & baps|combined cakeshop|bakery 2|danish, fruit & scones|pick n mix",
    "Freshly Baked Pies": "pie shop",
    "Pies & Pastries": "pies",
    "Frozen Pies": "pies",
    "Bought In Bread": "bread rolls|soft rolls & baps|morning goods", // morning goods not explicit section but maybe mapped
    "Bought in Morning Goods": "combined cakeshop|bread rolls", // Fallback
    "Oven Fresh": "oven fresh counter",
    "Bakery World Foods": "speciality bread",

    // Pizza & Ready Meals
    "Freshly Made Pizza (in Store)": "pizza display",
    "FRESHLY MADE PIZZA (Pre Packed)": "pizza display",
    "Frozen Pizza / Snacks": "pizza & party food",
    "Frozen Party Food": "pizza & party food",
    "Ready Meals": "ready meals|ready meals & soup excludes meat free",
    "Frozen Ready Meals": "ready meals",
    "Convenience Meals": "complete meals|con meals", // If 'complete meals' exists? Audit said no. Map to ready meals?
    "Prepared Foods - Pasta": "pasta & garlic bread", // "pasta & garlic bread" exists (Line 2101)
    "Prepared Foods - Garlic Bread": "pasta & garlic bread",
    "Prepared Foods - Soup": "ready meals & soup excludes meat free",
    "Prep Food & Pasta": "pasta & garlic bread",
    "Ready to Cook (Sous Vide)": "slow cooked", // "slow cooked" (Line 1757)
    "Ready To Cook (Sous Vide)": "slow cooked",

    // Dairy & Chilled
    "Chilled Desserts": "desserts",
    "Dairy Yogurts": "natural, health yogs & func drinks|snacking, indulgent & kids yogs",
    "Deli Counter Inc Express": "express",
    "Salad Bar": "salad bar",
    "Salad bar": "salad bar",
    "Fresh Produce Prep Veg": "bagged salad", // Removed duplicate key, kept this one
    "Fresh Produce Prep Salad": "bagged salad",
    "Sandwiches": "sandwich & meal accomps|morning goods",
    "Sandwiches - Drinks": "food to go",
    "Speciality Cheeses": "speciality cheese",
    "Chilled Fruit Juices": "fruit juice",
    "Flavoured Milk and Coffee Drinks": "milk drinks",
    "Fresh Milk, Daily Dairy & Cream": "milk",
    "Milk Daily Dairy & Cream": "milk",
    "Longlife Milks": "LL milk",
    "Butter,Margarine & Fats": "fats",
    "Grated & Sliced Cheese": "cheese",
    "Pre-Packed Cheese": "cheese",
    "Processed & Soft Cheese": "cheese",
    "Eggs": "eggs",

    // Frozen
    "Frozen Ice Cream & Desserts": "ice cream & desserts inc bakery",
    "Desserts, Puddings, Canned Milk, Ice Cream Accs": "ice cream & desserts inc bakery",
    "Frozen Vegetables": "vegetables",
    "Frozen Chips / Potatoes": "chips & potato products",
    "Frozen Yorkshire Puddings": "york. pudd", // Found "york. pudd" (Line 589)

    // Groceries
    "Sweet & Semi-Sweet Biscuits": "biscuit barrel & treats",
    "Breakfast Cereals": "family & kids cereal|wellbeing cereals|porridge & port, muesli & granola",
    "Canned Vegetables": "canned veg ingredients|canned veg meal accomp",
    "Canned Fruit": "ambient fruit & desserts inc prep & wafers",
    "Soups": "combined soup|ready meals & soup excludes meat free",
    "Pickles": "pickles",
    "Cooking Oils and Vinegars": "oils inc. vinegar",
    "Cooking Oils & Vinegars": "oils inc. vinegar",
    "Cooking Aids (Herbs & Spices)": "salt & herbs",
    "Packet Sauce": "sauce mix",
    "Sauces, Mustards & Dressings": "sauces, salads & cond ex vin",
    "Home Baking": "dried fruit & nuts & flour",
    "Sugar And Sweeteners": "sugar",
    "Coffee & Beverages": "coffee & bevs",
    "Tea": "tea",
    "Hot Beverages (Hot Chocolate)": "coffee & bevs",
    "Napolina Bay": "pasta",
    "Whole Foods/Gravy/Stuffing": "gravy, stuffing meat free & whole foods",
    "Beans And Pasta": "canned veg ingredients|pasta",
    "Canned Fish": "canned fish",

    // Snacks & Confectionery
    "Adult Snacks": "nuts",
    "Nuts & Snacks": "dried fruit & nuts & flour|produce nuts|snacks",
    "Crisps & Snacks": "combined crisps & snacks",
    "Crisps In Baskets (Food To Go)": "food to go",
    "Crispbreads / Crackers": "crackers|crispbread",
    "Chocolate Confectionery": "boxed & block chocolate|multipack confec|single confec",
    "Everyday Confectionery": "bagged sweets inc. gum & mint|lollies|multipack confec",
    "Seasonal Confectionary": "seasonal",

    // Free From
    "Free From": "free from|free from combined",
    "Free From Frozen": "free from|free from combined",
    "Fresh Free From": "free from|free from combined",
    "Free From Chilled": "free from",
    "Dairy Free From": "free from",

    // Alcohol
    "All WINE (Wine 4 Week)": "red wine|white wine|rose wine|boxed wines & minis|wine promo",
    "All Wine (4 weekly)": "red wine|white wine|rose wine|boxed wines & minis|wine promo",
    "All Wine": "red wine|white wine|rose wine|boxed wines & minis|wine promo",
    "Beers": "bitter, ales & craft stout|bottled & canned lager|world lager|Beer Promo",
    "Lager": "bottled & canned lager|world lager",
    "Cider": "cider",
    "No & Low Alcohol": "low alc & stubb|low alc|no alcohol|non alcoholic",
    "Carbonates & Mixers": "carbonates|mixers|mixer|carbonates exc bulk",
    "Spirits/Liqueurs/Cocktails": "spirits|liqueurs|cocktails|gin|vodka|whisky|rum|Beer/Spirits",
    "Party Drinks & Perry": "party drinks|perry",
    "Fruit Juice & Drinks": "fruit juice|juice",
    "Squash & Other Soft Drinks": "squash|cordial",
    "Fortified Wines/Miscellaneous": "fortified wine",

    // Jams & Spreads
    "Jam,Marmalades & Sweet Spread": "preserves",
    "Jam, Marmalades & Sweet Spread": "preserves",

    // Household & Cleaning
    "Air Care": "air fresheners",
    "Cleaners": "cleaners, disinfectant & polish", // Corrected
    "Cleaning": "cleaners, disinfectant & polish",
    "Bleach Disinfecting Toiletcare": "bleach & wc products",
    "Washing Powders & Conditioners": "all laundry|laundry accs",
    "Laundry": "all laundry|laundry accs",
    "Washing Up Aids": "washing up liquids",
    "Kitchen Towels": "kitchen towels",
    "Plastics & Foils, Refuse & Vac Bags": "foils, bin liners matches & insec",
    "Plastics & Foils": "foils, bin liners matches & insec",
    "Refuse & Vac Bags": "foils, bin liners matches & insec", // Audit fail. Maybe "foils, bin liners..."? Or "bin bags" exists?
    "Disposable Tableware": "disp. t/ware",
    "Kitchen Plastics": "kitchen plastics & bins", // Corrected
    "Food Storage": "kitchen plastics & bins",
    "Toilet Tissues": "toilet rolls",

    // Health & Beauty
    "Bathroom": "bathroom & room accs",
    "Bathroom Accessories": "bathroom & room accs",
    "Bathcare": "bath inc sponges & accs",
    "Deodorants": "deod orants",
    "Haircare": "shampoo & conditioners|styling|colorants|hair rem",
    "Skincare Core": "skincare",
    "Suncare": "suncare",
    "Mens Toiletries": "mens shave & toiletries",
    "Sanitary Protection": "feminine hygiene",
    "Dental": "dentalcare",
    "Medicinal": "medicines ex slimming", // Corrected
    "Health & Wellbeing": "medicines ex slimming",

    // Baby
    "Baby Foods": "baby food",
    "Baby Care": "baby milk|baby wipes & c/wool|feed & soothers",
    "BabyCare": "baby milk|baby wipes & c/wool|feed & soothers",

    // Pets
    "Pet Care": "cat treats|wet cat food|fresh & frozen pet food|dog treats inc accs & toys|dry dog food|wet dog small dog|cat litter|dry cat food|Petfood 1 Promo|Petfood 2 Promo",
    "Pet Foods": "cat treats|wet cat food|fresh & frozen pet food|dog treats inc accs & toys|dry dog food|wet dog small dog|cat litter|dry cat food",

    // International Foods
    "International Foods Indian": "mexican, rice, indian, oriental",
    "International Foods Italian": "mexican, rice, indian, oriental",
    "International Foods Mexican": "mexican, rice, indian, oriental",
    "International Foods Oriental": "mexican, rice, indian, oriental",
    "International Foods Rice": "mexican, rice, indian, oriental",
    "Ambient World Foods": "mexican, rice, indian, oriental",
    "World Foods - Ambient": "mexican, rice, indian, oriental",
    "World Foods - Ambient ": "mexican, rice, indian, oriental",

    // Home & General
    "All Year Toys": "kids toys",
    "Bedding & Decor": "bed linen & home decor|pillows & quilts",
    "Filled Bedding": "pillows & quilts",
    "Dine": "ceramic/dinnerware/tableware",
    "Glassware": "glassware",
    "Mugs": "ceramic/dinnerware/tableware",
    "Bakeware": "kitchen tools|cookshop",
    "Ovenware": "kitchen tools|cookshop",
    "Panware": "kitchen tools|cookshop",
    "Kitchen Tools": "kitchen tools",
    "Bulbs & Electrical Accessories": "lightbulbs",
    "Small Domestic Appliances": "lightbulbs|sda",
    "Candles": "candles",
    "Stationery": "stationery",
    "Motoring": "diy & motor",
    "Party Zone": "party",
    "Reusable Bags": "carrier bags",
    "Storage": "kitchen plastics & bins",

    // Fresh Produce
    "Fresh Produce Fruit": "fruit",
    "Fresh Produce Prep Fruit": "fruit",
    // Duplicates removed (Prep Salad/Veg matched in lines 58-59)
    "Fresh Produce Total Veg": "vegetables",
    "Salads & Sundry Fresh Foods": "salad",

    // Tobacco / Kiosk
    "Tobacco Products (Splits)": "kiosk",

    // Ignored Categories / Checkouts
    "3 for £10": "IGNORE_ITEM",
    "Checkouts - Confec": "IGNORE_ITEM",
    "Checkouts - Crisps": "IGNORE_ITEM",
    "Checkouts - H&B": "IGNORE_ITEM",
    "Checkouts - H&L": "IGNORE_ITEM",
    "Checkouts - Household": "IGNORE_ITEM",
    "Checkouts - Kiosk": "IGNORE_ITEM",
    "Checkouts - Nutmeg": "IGNORE_ITEM",
    "Checkouts - Pet": "IGNORE_ITEM",
    "Checkouts - Reusable Bags": "IGNORE_ITEM",
    "Checkouts - Seasonal Confec": "IGNORE_ITEM",
    "Checkouts - Soft Drinks": "IGNORE_ITEM",
    "Checkouts - Vape": "IGNORE_ITEM",
    "Clipstrips": "IGNORE_ITEM",
    "Frozen Applied Nutrition": "IGNORE_ITEM",
    "Frozen Meat Free": "IGNORE_ITEM",
    "Frozen World Foods": "IGNORE_ITEM",
    "World Foods - Fresh": "IGNORE_ITEM",
    "Fresh World Foods": "IGNORE_ITEM",
    "JML": "IGNORE_ITEM",
    "Branded Bay": "IGNORE_ITEM",
    "Branded Bay - Meal Sols": "IGNORE_ITEM",
    "Speciality / PBA": "IGNORE_ITEM", // Or map to speciality?
    "Foil Trays Meat & Fish": "IGNORE_ITEM"
};
