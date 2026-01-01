// Default category mappings bundled into the app
// These are used as the baseline and can be overridden by user's localStorage mappings

export const DEFAULT_CATEGORY_MAPPINGS: Record<string, string> = {
    // Meat & Fish
    "Bacon & Bacon Joints": "bacon|bacon joints",
    "Beef. lamb, sous vide": "beef inc. steak bar",
    "Beef": "beef inc. steak bar",
    "Lamb": "pork & lamb",
    "Pork": "pork & lamb",
    "Sausage": "sausages",
    "Poultry (Breaded)": "breaded poultry",
    "Poultry (Fresh)": "poultry portions & whole birds inc turkey",
    "Turkey": "poultry portions & whole birds inc turkey",
    "Pre Packed Fish": "prep cook fish",
    "Frozen Fish": "processed meat, fish & poultry",
    "Frozen Prep Poultry": "breaded poultry",
    "Frozen Meat, Burgers, Sausage": "processed meat, fish & poultry",
    "Prepacked Cooked Meats & Sandwich Fillings": "cooked meat inc pate|sandwich & meal accomps exc rolls",

    // Bakery & Cakes
    "Bought in Cake": "cake inc. party cakes",
    "Cake Shop": "combined cakeshop",
    "Cake shop": "combined cakeshop",
    "In Store Bakery": "soft rolls & baps|combined cakeshop|bakery 2|danish, fruit & scones|pick n mix",
    "Freshly Baked Pies": "pie shop",
    "Pies & Pastries": "pies",
    "Frozen Pies": "pies",
    "Bought In Bread": "bread rolls|soft rolls & baps",
    "Oven Fresh": "oven fresh counter",

    // Pizza & Ready Meals
    "Freshly Made Pizza (in Store)": "pizza display",
    "FRESHLY MADE PIZZA (Pre Packed)": "pizza display",
    "Frozen Pizza / Snacks": "pizza & party food",
    "Frozen Party Food": "pizza & party food",
    "Ready Meals": "ready meals",
    "Frozen Ready Meals": "ready meals",
    "Convenience Meals": "complete meals|con meals",
    "Prepared Foods - Pasta": "pasta & ambient chilled",

    // Dairy & Chilled
    "Chilled Desserts": "desserts",
    "Dairy Yogurts": "natural, health yogs & func drinks|snacking, indulgent & kids yogs",
    "Deli Counter Inc Express": "express",
    "Salad Bar": "salad bar",
    "Fresh Produce Prep Veg": "bagged salad",
    "Fresh Produce Prep Salad": "bagged salad",
    "Sandwiches": "sandwich & meal accomps exc rolls",
    "Speciality Cheeses": "speciality cheese",
    "Chilled Fruit Juices": "fruit juice",
    "Flavoured Milk and Coffee Drinks": "milk drinks|coffee & protein drinks",

    // Frozen
    "Frozen Ice Cream & Desserts": "ice cream & desserts inc bakery",
    "Frozen Vegetables": "vegetables",
    "Frozen Chips / Potatoes": "chips & potato products",

    // Groceries
    "Sweet & Semi-Sweet Biscuits": "biscuit barrel & treats",
    "Breakfast Cereals": "family & kids cereal|wellbeing cereals|porridge & port, muesli & granola",
    "Canned Vegetables": "canned veg ingredients|canned veg meal accomp",
    "Canned Fruit": "ambient fruit & desserts inc prep & wafers",
    "Soups": "combined soup",
    "Pickles": "pickles",
    "Cooking Oils and Vinegars": "oils inc. vinegar",
    "Cooking Aids (Herbs & Spices)": "salt & herbs",
    "Packet Sauce": "sauce mix",
    "Home Baking": "dried fruit & nuts & flour",
    "Sugar And Sweeteners": "sugar",
    "Coffee & Beverages": "coffee & bevs",

    // Snacks & Confectionery
    "Adult Snacks": "dried fruit & nuts & flour",
    "Nuts & Snacks": "dried fruit & nuts & flour",
    "Crisps & Snacks": "large multi crisps & snacks|small multi crisps & snacks|sharing exc. grocery nuts",
    "Chocolate Confectionery": "boxed & block chocolate|multipack confec|single confec",
    "Everyday Confectionery": "bagged sweets inc. gum & mint|lollies|multipack confec",

    // Free From
    "Free From": "free from|free from combined",
    "Free From Frozen": "free from|free from combined",
    "Fresh Free From": "free from|free from combined",

    // Alcohol - include variations for different naming formats
    "All WINE (Wine 4 Week)": "red wine|white wine|rose wine",
    "All Wine (4 weekly)": "red wine|white wine|rose wine",
    "All Wine": "red wine|white wine|rose wine",
    "Beers": "bitter, ales & craft stout|bottled & canned lager|world lager",
    "Cider": "cider",

    // Jams & Spreads
    "Jam,Marmalades & Sweet Spread": "preserves",
    "Jam, Marmalades & Sweet Spread": "preserves",

    // Household & Cleaning
    "Air Care": "air fresheners",
    "Cleaners": "cleaners",
    "Bleach Disinfecting Toiletcare": "bleach & wc products",
    "Washing Powders & Conditioners": "laundry liquids|laundry powder|fabric conditioners",
    "Washing Up Aids": "washing up liquids",
    "Kitchen Towels": "kitchen towels",
    "Plastics & Foils, Refuse & Vac Bags": "foils, matches & insec",
    "Plastics & Foils": "foils, matches & insec",
    "Disposable Tableware": "disp. t/ware",

    // Health & Beauty
    "Bathroom": "bathroom & room accs",
    "Bathcare": "bath inc sponges & accs",
    "Deodorants": "deod orants",
    "Haircare": "shampoo & conditioners|styling",
    "Skincare Core": "skincare",
    "Mens Toiletries": "mens shave & toiletries",
    "Sanitary Protection": "feminine hygiene",
    "Dental": "dentalcare",

    // Baby
    "Baby Foods": "baby food",
    "Baby Care": "baby milk|baby wipes & c/wool|feed & soothers",

    // Pets
    "Pet Care": "treats & pet food|dry dog food|dry cat food|wet cat food|wet dog small dog",
    "Pet Foods": "treats & pet food|dry dog food|dry cat food|wet cat food|wet dog small dog",

    // International Foods
    "International Foods Indian": "mexican, rice, indian, oriental",
    "International Foods Italian": "mexican, rice, indian, oriental",
    "International Foods Mexican": "mexican, rice, indian, oriental",
    "International Foods Oriental": "mexican, rice, indian, oriental",
    "International Foods Rice": "mexican, rice, indian, oriental",
    "Ambient World Foods": "mexican, rice, indian, oriental",

    // Home & General
    "All Year Toys": "kids toys",
    "Bedding & Decor": "bed linen & home decor|pillows & quilts",
    "Dine": "ceramic/dinnerware/tableware",
    "Glassware": "glassware",
    "Mugs": "ceramic/dinnerware/tableware",

    // Ignored Categories (not on map yet)
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
    "Frozen Applied Nutrition": "IGNORE_ITEM",
    "Frozen Meat Free": "IGNORE_ITEM",
    "Frozen World Foods": "IGNORE_ITEM",
    "Frozen Yorkshire Puddings": "IGNORE_ITEM",
    "World Foods - Ambient": "IGNORE_ITEM",
    "World Foods - Ambient ": "IGNORE_ITEM",
    "World Foods - Fresh": "IGNORE_ITEM",
    "Fresh World Foods": "IGNORE_ITEM",
    "JML": "IGNORE_ITEM",
};
