import type { MapLayout } from '../types';

export const MAP_VIEWBOX_PADDING = 200;

export const DEFAULT_MAP_LAYOUT: MapLayout = {
    "meta": {
        "storeId": 218,
        "name": "Thornton-Cleveleys (seed from sample)",
        "created": "auto",
        "imageSize": [1832, 1092]
    },
    "defaults": {
        "aisleWidth": 40,
        "bayWidth": 20,
        "baysPerSide": 24,
        "facing": "y+",
        "bayOrder": "p1-to-p2"
    },
    "aisles": [
        {
            "id": "70",
            "label": "Seasonal Aisle",
            "p1": [1080, 878.6115417480469],
            "p2": [1080, 585.8852233886719],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1045, "y": 565 },
            "labelSize": { "width": 240, "height": 140 }
        },
        {
            "id": "Table 1",
            "label": "Table 1",
            "p1": [1690, 720],
            "p2": [1690, 640],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1920, "y": 660 },
            "labelSize": { "width": 200, "height": 100 }
        },
        {
            "id": "Table 2",
            "label": "Table 2",
            "p1": [1690, 640],
            "p2": [1690, 560],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1920, "y": 560 },
            "labelSize": { "width": 200, "height": 100 }
        },
        {
            "id": "Table 3",
            "label": "Table 3",
            "p1": [1690, 520],
            "p2": [1690, 440],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1920, "y": 430 },
            "labelSize": { "width": 200, "height": 100 }
        },
        {
            "id": "Table 4",
            "label": "Table 4",
            "p1": [1690, 440],
            "p2": [1690, 360],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1920, "y": 320 },
            "labelSize": { "width": 200, "height": 100 }
        },
        {
            "id": "Table 5",
            "label": "Table 5",
            "p1": [1690, 320],
            "p2": [1690, 260],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1920, "y": 160 },
            "labelSize": { "width": 200, "height": 100 }
        },
        {
            "id": "Eggs",
            "label": "Eggs",
            "p1": [1688.4058837890625, 253.8638153076172],
            "p2": [1688.4058837890625, 193.8638153076172],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1920, "y": 60 },
            "labelSize": { "width": 200, "height": 80 }
        },
        {
            "id": "Table 6",
            "label": "Table 6",
            "p1": [565.687744140625, 214.77166748046875],
            "p2": [565.687744140625, 138.40853881835938],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 660, "y": -40 },
            "labelSize": { "width": 220, "height": 140 }
        },
        {
            "id": "Table 7",
            "label": "Table 7",
            "p1": [390.46209716796875, 208.635498046875],
            "p2": [390.46209716796875, 138.40853881835938],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 430, "y": -40 },
            "labelSize": { "width": 220, "height": 140 }
        },
        {
            "id": "Table 8",
            "label": "Table 8",
            "p1": [174.78256225585938, 206.59010314941406],
            "p2": [174.78256225585938, 138.40853881835938],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 180, "y": -40 },
            "labelSize": { "width": 260, "height": 140 }
        },
        {
            "id": "Rack 1",
            "label": "Rack 1",
            "p1": [1580.548583984375, 882.6134643554688],
            "p2": [1580.548583984375, 822.6134643554688],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1701.7391357421875, "y": 879.8912353515625 },
            "labelSize": { "width": 200, "height": 120 }
        },
        {
            "id": "Rack 2",
            "label": "Rack 2",
            "p1": [1581.1165771484375, 817.95458984375],
            "p2": [1581.1165771484375, 757.95458984375],
            "aisleWidth": 50,
            "locked": false,
            "labelPosition": { "x": 1700, "y": 760 },
            "labelSize": { "width": 200, "height": 120 }
        },
        {
            "id": "Front of store BWS",
            "label": "FOS BWS",
            "p1": [1457.7954711914062, 844.7581176757812],
            "p2": [1457.7954711914062, 644.7581176757812],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1468.1231079101562, "y": 710.7896118164062 },
            "labelSize": { "width": 169.56494140625, "height": 335.321044921875 }
        },
        {
            "id": "Meat sendi 1",
            "label": "Butchery sendi 1",
            "p1": [1459.0758056640625, 978.6110076904297],
            "p2": [1298.16796875, 978.6110076904297],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1160, "y": 1120 },
            "labelSize": { "width": 240, "height": 160 }
        },
        {
            "id": "Fish sendi 1",
            "label": "Fishmonger sendi 1",
            "p1": [1453.86376953125, 178.86245727539062],
            "p2": [1253.86376953125, 178.86245727539062],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1320, "y": -40 },
            "labelSize": { "width": 240, "height": 140 }
        },
        {
            "id": "Deli sendi 1",
            "label": "Deli sendi 1",
            "p1": [1149.7730712890625, 180.90786743164062],
            "p2": [989.7730712890625, 180.90786743164062],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 980, "y": -40 },
            "labelSize": { "width": 240, "height": 140 }
        },
        {
            "id": "Front of store",
            "label": "Front of store 1",
            "p1": [465.4452819824219, 979.5188293457031],
            "p2": [321.5732727050781, 979.5188293457031],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 244.8912353515625, "y": 878.3695678710938 },
            "labelSize": { "width": 200, "height": 160 }
        },
        {
            "id": "new-aisle-1761559782046",
            "label": "Front of store 2",
            "p1": [470.21607208251953, 979.5188293457031],
            "p2": [605.212043762207, 979.5188293457031],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 448.15203857421875, "y": 880 },
            "labelSize": { "width": 200, "height": 160 }
        },
        {
            "id": "new-aisle-1761559826881",
            "label": "Front of store 3",
            "p1": [609.3027801513672, 979.5188293457031],
            "p2": [762.7072296142578, 979.5188293457031],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 650, "y": 880 },
            "labelSize": { "width": 200, "height": 160 }
        },
        {
            "id": "new-aisle-1761559844799",
            "label": "Front of store 4",
            "p1": [766.7979965209961, 979.5188293457031],
            "p2": [905.8847274780273, 979.5188293457031],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 850, "y": 880 },
            "labelSize": { "width": 200, "height": 160 }
        },
        {
            "id": "new-aisle-1761559873863",
            "label": "Front of store 5",
            "p1": [912.0209121704102, 979.5188293457031],
            "p2": [1059.2893447875977, 979.5188293457031],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1050, "y": 880 },
            "labelSize": { "width": 200, "height": 160 }
        },
        {
            "id": "new-aisle-1761559910999",
            "label": "Front of store 6",
            "p1": [1065.4253540039062, 979.5188293457031],
            "p2": [1202.4666137695312, 979.5188293457031],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1250, "y": 880 },
            "labelSize": { "width": 200, "height": 160 }
        },
        {
            "id": "new-aisle-1761560018748",
            "label": "Wine of the week",
            "p1": [1499.0485916137695, 237.04129028320312],
            "p2": [1499.0485916137695, 504.53924560546875],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1360, "y": 400 },
            "labelSize": { "width": 200, "height": 140 }
        },
        {
            "id": "new-aisle-1761560409800",
            "label": "Plant of the week",
            "p1": [1807.9029235839844, 662.4829711914062],
            "p2": [1807.9029235839844, 862.4829711914062],
            "aisleWidth": 40,
            "locked": false,
            "labelPosition": { "x": 1921.63037109375, "y": 840 },
            "labelSize": { "width": 200, "height": 220 }
        }
    ]
};

export const REFERENCE_STORE_LAYOUT: MapLayout = {
    "meta": {
        "storeId": 218,
        "name": "Thornton-Cleveleys - Shelving Layout",
        "created": "auto",
        "imageSize": [1832, 1092]
    },
    "defaults": {
        "aisleWidth": 20,
        "bayWidth": 20,
        "baysPerSide": 11,
        "facing": "y+",
        "bayOrder": "p1-to-p2"
    },
    "aisles": [
        // FRONT SECTION GONDOLAS (y=580 to y=880) - Between Middle Promos and Checkouts
        // Gondola 1 (between aisles 1-2)
        { "id": "G1-A", "label": "Water/Pop", "type": "gondola", "p1": [1460, 880], "p2": [1460, 580], "aisleWidth": 20, "locked": false },
        // Gondola 2 (between aisles 2-3)
        { "id": "G2-A", "label": "Pop/Cookshop", "type": "gondola", "p1": [1374, 880], "p2": [1374, 580], "aisleWidth": 20, "locked": false },
        // Gondola 3 (between aisles 3-4)
        { "id": "G3-A", "label": "Cookshop/Home", "type": "gondola", "p1": [1284, 880], "p2": [1284, 580], "aisleWidth": 20, "locked": false },
        // Gondola 4 (between aisles 4-5)
        { "id": "G4-A", "label": "Home/Leisure", "type": "gondola", "p1": [1200, 880], "p2": [1200, 580], "aisleWidth": 20, "locked": false },
        // Gondola 5 (between aisles 5-70)
        { "id": "G5-A", "label": "Leisure/Seasonal", "type": "gondola", "p1": [1120, 880], "p2": [1120, 580], "aisleWidth": 20, "locked": false },
        // Gondola 6 (between aisles 70-7)
        { "id": "G6-A", "label": "Seasonal/Nutmeg", "type": "gondola", "p1": [1030, 880], "p2": [1030, 580], "aisleWidth": 20, "locked": false },
        // Gondola 7 (between aisles 7-8)
        { "id": "G7-A", "label": "Nutmeg", "type": "gondola", "p1": [930, 880], "p2": [930, 580], "aisleWidth": 20, "locked": false },
        // Gondola 8 (between aisles 8-9)
        { "id": "G8-A", "label": "Nutmeg/Baby", "type": "gondola", "p1": [830, 880], "p2": [830, 580], "aisleWidth": 20, "locked": false },
        // Gondola 9 (between aisles 9-10)
        { "id": "G9-A", "label": "Baby/H&B", "type": "gondola", "p1": [746, 880], "p2": [746, 580], "aisleWidth": 20, "locked": false },
        // Gondola 10 (between aisles 10-11)
        { "id": "G10-A", "label": "H&B", "type": "gondola", "p1": [676, 880], "p2": [676, 580], "aisleWidth": 20, "locked": false },
        // Gondola 11 (between aisles 11-12)
        { "id": "G11-A", "label": "H&B/Dog", "type": "gondola", "p1": [590, 880], "p2": [590, 580], "aisleWidth": 20, "locked": false },
        // Gondola 12 (between aisles 12-13)
        { "id": "G12-A", "label": "Dog/Cat", "type": "gondola", "p1": [500, 880], "p2": [500, 580], "aisleWidth": 20, "locked": false },
        // Gondola 13 (between aisles 13-14)
        { "id": "G13-A", "label": "Cat/Cleaning", "type": "gondola", "p1": [422, 880], "p2": [422, 580], "aisleWidth": 20, "locked": false },
        // Gondola 14 (between aisles 14-15)
        { "id": "G14-A", "label": "Cleaning/Paper", "type": "gondola", "p1": [332, 880], "p2": [332, 580], "aisleWidth": 20, "locked": false },
        // Gondola 15 (between aisles 15-16)
        { "id": "G15-A", "label": "Paper/Frozen", "type": "gondola", "p1": [220, 880], "p2": [220, 580], "aisleWidth": 20, "locked": false },

        // BACK SECTION GONDOLAS (y=220 to y=500) - Between Back Promos and Middle Promos
        // Gondola 18 (Wine area)
        { "id": "G18-A", "label": "Wine", "type": "gondola", "p1": [1460, 500], "p2": [1460, 240], "aisleWidth": 20, "locked": false },
        // Gondola 19 (Spirits)
        { "id": "G19-A", "label": "Spirits/Wine", "type": "gondola", "p1": [1374, 500], "p2": [1374, 220], "aisleWidth": 20, "locked": false },
        // Gondola 20 (Beer)
        { "id": "G20-A", "label": "Beer/Spirits", "type": "gondola", "p1": [1284, 500], "p2": [1284, 220], "aisleWidth": 20, "locked": false },
        // Gondola 21 (Crisps)
        { "id": "G21-A", "label": "Crisps/Beer", "type": "gondola", "p1": [1200, 500], "p2": [1200, 220], "aisleWidth": 20, "locked": false },
        // Gondola 22 (Biscuits)
        { "id": "G22-A", "label": "Biscuits/Crisps", "type": "gondola", "p1": [1120, 500], "p2": [1120, 220], "aisleWidth": 20, "locked": false },
        // Gondola 23 (Sweets)
        { "id": "G23-A", "label": "Sweets/Biscuits", "type": "gondola", "p1": [1037, 500], "p2": [1037, 260], "aisleWidth": 20, "locked": false },
        // Gondola 24 (International)
        { "id": "G24-A", "label": "International/Sweets", "type": "gondola", "p1": [955, 500], "p2": [955, 220], "aisleWidth": 20, "locked": false },
        // Gondola 25 (Canned food)
        { "id": "G25-A", "label": "Canned/International", "type": "gondola", "p1": [864, 500], "p2": [864, 220], "aisleWidth": 20, "locked": false },
        // Gondola 26 (Canned food)
        { "id": "G26-A", "label": "Canned", "type": "gondola", "p1": [777, 500], "p2": [777, 220], "aisleWidth": 20, "locked": false },
        // Gondola 27 (Homebake)
        { "id": "G27-A", "label": "Homebake/Canned", "type": "gondola", "p1": [700, 500], "p2": [700, 220], "aisleWidth": 20, "locked": false },
        // Gondola 28 (Desserts/Tea)
        { "id": "G28-A", "label": "Desserts/Homebake", "type": "gondola", "p1": [610, 500], "p2": [610, 220], "aisleWidth": 20, "locked": false },
        // Gondola 29 (Cereal)
        { "id": "G29-A", "label": "Cereal/Desserts", "type": "gondola", "p1": [523, 500], "p2": [523, 220], "aisleWidth": 20, "locked": false },
        // Gondola 30 (Bread)
        { "id": "G30-A", "label": "Bread/Cereal", "type": "gondola", "p1": [435, 500], "p2": [435, 220], "aisleWidth": 20, "locked": false },
        // Gondola 31 (Free from)
        { "id": "G31-A", "label": "Free from/Bread", "type": "gondola", "p1": [332, 500], "p2": [332, 200], "aisleWidth": 20, "locked": false },
        // Gondola 32 (Dairy)
        { "id": "G32-A", "label": "Dairy/Free from", "type": "gondola", "p1": [220, 500], "p2": [220, 200], "aisleWidth": 20, "locked": false },

        // PROMO ENDS - Front Section (Checkout side)
        { "id": "PE-G1-F", "label": "PE 1", "type": "promo", "p1": [1460, 920], "p2": [1460, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G2-F", "label": "PE 2", "type": "promo", "p1": [1374, 920], "p2": [1374, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G3-F", "label": "PE 3", "type": "promo", "p1": [1284, 920], "p2": [1284, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G4-F", "label": "PE 4", "type": "promo", "p1": [1200, 920], "p2": [1200, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G5-F", "label": "PE 5", "type": "promo", "p1": [1120, 920], "p2": [1120, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G6-F", "label": "PE 6", "type": "promo", "p1": [1030, 920], "p2": [1030, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G7-F", "label": "PE 7", "type": "promo", "p1": [930, 920], "p2": [930, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G8-F", "label": "PE 8", "type": "promo", "p1": [830, 920], "p2": [830, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G9-F", "label": "PE 9", "type": "promo", "p1": [746, 920], "p2": [746, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G10-F", "label": "PE 10", "type": "promo", "p1": [676, 920], "p2": [676, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G11-F", "label": "PE 11", "type": "promo", "p1": [590, 920], "p2": [590, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G12-F", "label": "PE 12", "type": "promo", "p1": [500, 920], "p2": [500, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G13-F", "label": "PE 13", "type": "promo", "p1": [422, 920], "p2": [422, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G14-F", "label": "PE 14", "type": "promo", "p1": [332, 920], "p2": [332, 890], "aisleWidth": 25, "locked": false },
        { "id": "PE-G15-F", "label": "PE 15", "type": "promo", "p1": [220, 920], "p2": [220, 890], "aisleWidth": 25, "locked": false },

        // PROMO ENDS - Front Section (Middle promo side)
        { "id": "PE-G1-B", "label": "PE 1 Back", "type": "promo", "p1": [1460, 570], "p2": [1460, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G2-B", "label": "PE 2 Back", "type": "promo", "p1": [1374, 570], "p2": [1374, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G3-B", "label": "PE 3 Back", "type": "promo", "p1": [1284, 570], "p2": [1284, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G4-B", "label": "PE 4 Back", "type": "promo", "p1": [1200, 570], "p2": [1200, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G5-B", "label": "PE 5 Back", "type": "promo", "p1": [1120, 570], "p2": [1120, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G6-B", "label": "PE 6 Back", "type": "promo", "p1": [1030, 570], "p2": [1030, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G7-B", "label": "PE 7 Back", "type": "promo", "p1": [930, 570], "p2": [930, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G8-B", "label": "PE 8 Back", "type": "promo", "p1": [830, 570], "p2": [830, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G9-B", "label": "PE 9 Back", "type": "promo", "p1": [746, 570], "p2": [746, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G10-B", "label": "PE 10 Back", "type": "promo", "p1": [676, 570], "p2": [676, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G11-B", "label": "PE 11 Back", "type": "promo", "p1": [590, 570], "p2": [590, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G12-B", "label": "PE 12 Back", "type": "promo", "p1": [500, 570], "p2": [500, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G13-B", "label": "PE 13 Back", "type": "promo", "p1": [422, 570], "p2": [422, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G14-B", "label": "PE 14 Back", "type": "promo", "p1": [332, 570], "p2": [332, 540], "aisleWidth": 25, "locked": false },
        { "id": "PE-G15-B", "label": "PE 15 Back", "type": "promo", "p1": [220, 570], "p2": [220, 540], "aisleWidth": 25, "locked": false },

        // PROMO ENDS - Back Section (Middle promo side)
        { "id": "PE-G18-F", "label": "PE Wine F", "type": "promo", "p1": [1460, 540], "p2": [1460, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G19-F", "label": "PE Spirits F", "type": "promo", "p1": [1374, 540], "p2": [1374, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G20-F", "label": "PE Beer F", "type": "promo", "p1": [1284, 540], "p2": [1284, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G21-F", "label": "PE Crisps F", "type": "promo", "p1": [1200, 540], "p2": [1200, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G22-F", "label": "PE Biscuits F", "type": "promo", "p1": [1120, 540], "p2": [1120, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G23-F", "label": "PE Sweets F", "type": "promo", "p1": [1037, 540], "p2": [1037, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G24-F", "label": "PE Intl F", "type": "promo", "p1": [955, 540], "p2": [955, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G25-F", "label": "PE Canned F", "type": "promo", "p1": [864, 540], "p2": [864, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G26-F", "label": "PE Canned2 F", "type": "promo", "p1": [777, 540], "p2": [777, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G27-F", "label": "PE Homebake F", "type": "promo", "p1": [700, 540], "p2": [700, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G28-F", "label": "PE Desserts F", "type": "promo", "p1": [610, 540], "p2": [610, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G29-F", "label": "PE Cereal F", "type": "promo", "p1": [523, 540], "p2": [523, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G30-F", "label": "PE Bread F", "type": "promo", "p1": [435, 540], "p2": [435, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G31-F", "label": "PE FreeFrom F", "type": "promo", "p1": [332, 540], "p2": [332, 510], "aisleWidth": 25, "locked": false },
        { "id": "PE-G32-F", "label": "PE Dairy F", "type": "promo", "p1": [220, 540], "p2": [220, 510], "aisleWidth": 25, "locked": false },

        // PROMO ENDS - Back Section (Back promo side)
        { "id": "PE-G18-B", "label": "PE Wine B", "type": "promo", "p1": [1460, 230], "p2": [1460, 200], "aisleWidth": 25, "locked": false },
        { "id": "PE-G19-B", "label": "PE Spirits B", "type": "promo", "p1": [1374, 210], "p2": [1374, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G20-B", "label": "PE Beer B", "type": "promo", "p1": [1284, 210], "p2": [1284, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G21-B", "label": "PE Crisps B", "type": "promo", "p1": [1200, 210], "p2": [1200, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G22-B", "label": "PE Biscuits B", "type": "promo", "p1": [1120, 210], "p2": [1120, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G23-B", "label": "PE Sweets B", "type": "promo", "p1": [1037, 250], "p2": [1037, 220], "aisleWidth": 25, "locked": false },
        { "id": "PE-G24-B", "label": "PE Intl B", "type": "promo", "p1": [955, 210], "p2": [955, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G25-B", "label": "PE Canned B", "type": "promo", "p1": [864, 210], "p2": [864, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G26-B", "label": "PE Canned2 B", "type": "promo", "p1": [777, 210], "p2": [777, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G27-B", "label": "PE Homebake B", "type": "promo", "p1": [700, 210], "p2": [700, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G28-B", "label": "PE Desserts B", "type": "promo", "p1": [610, 210], "p2": [610, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G29-B", "label": "PE Cereal B", "type": "promo", "p1": [523, 210], "p2": [523, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G30-B", "label": "PE Bread B", "type": "promo", "p1": [435, 210], "p2": [435, 180], "aisleWidth": 25, "locked": false },
        { "id": "PE-G31-B", "label": "PE FreeFrom B", "type": "promo", "p1": [332, 190], "p2": [332, 160], "aisleWidth": 25, "locked": false },
        { "id": "PE-G32-B", "label": "PE Dairy B", "type": "promo", "p1": [220, 190], "p2": [220, 160], "aisleWidth": 25, "locked": false },

        // FIXTURE AREAS
        { "id": "Checkouts", "label": "Checkouts", "type": "fixture", "p1": [1540, 960], "p2": [100, 960], "aisleWidth": 40, "locked": false },
        { "id": "Middle-Promos", "label": "Middle Promos", "type": "fixture", "p1": [1560, 540], "p2": [60, 540], "aisleWidth": 30, "locked": false },
        { "id": "Back-Promos", "label": "Back Promos", "type": "fixture", "p1": [1580, 180], "p2": [60, 180], "aisleWidth": 30, "locked": false },
        { "id": "Market-Street", "label": "Market Street", "type": "fixture", "p1": [1560, 120], "p2": [160, 120], "aisleWidth": 25, "locked": false },
        { "id": "Produce", "label": "Produce", "type": "fixture", "p1": [1700, 940], "p2": [1700, 260], "aisleWidth": 150, "locked": false },
        { "id": "Back-Wall", "label": "Back Wall", "type": "chilled", "p1": [1660, 60], "p2": [40, 60], "aisleWidth": 40, "locked": false },
        { "id": "Frozen-Wall", "label": "Frozen Wall", "type": "chilled", "p1": [60, 920], "p2": [60, 200], "aisleWidth": 40, "locked": false }
    ],
    "points": [],
    "layout": {
        "W": 1832,
        "H": 1092
    }
};

// Accurate layout extracted from store PDF - selling space only
// Gondolas = shelving units (by category), Aisles = walking voids (numbered)
export const PDF_ACCURATE_LAYOUT: MapLayout = {
    "meta": {
        "storeId": 218,
        "name": "218 Thornton Cleveleys - PDF Accurate",
        "created": "2024-12-28",
        "imageSize": [
            1832,
            1092
        ]
    },
    "defaults": {
        "aisleWidth": 18,
        "bayWidth": 20,
        "baysPerSide": 11,
        "facing": "y+",
        "bayOrder": "p1-to-p2"
    },
    "aisles": [
        {
            "id": "Frozen-Wall-Front",
            "label": "Remote Freezer",
            "type": "chilled",
            "p1": [
                60,
                880
            ],
            "p2": [
                60,
                580
            ],
            "aisleWidth": 40,
            "locked": false,
            "sections": [
                {
                    "bay": "638",
                    "category": "pies",
                    "side": "R"
                },
                {
                    "bay": "3664",
                    "category": "pizza & party food",
                    "side": "R"
                },
                {
                    "bay": "4230",
                    "category": "processed meat, fish & poultry",
                    "side": "R"
                },
                {
                    "bay": "4233",
                    "category": "restaurant",
                    "side": "R"
                },
                {
                    "bay": "4235",
                    "category": "take away",
                    "side": "R"
                },
                {
                    "bay": "3942",
                    "category": "frozen in aisle promo",
                    "side": "R"
                }
            ]
        },
        {
            "id": "G-17-16",
            "label": "17|16",
            "type": "gondola",
            "p1": [
                160,
                880
            ],
            "p2": [
                160,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "4229",
                    "category": "natural meat, fish & poultry",
                    "side": "L"
                },
                {
                    "bay": "631",
                    "category": "meat free",
                    "side": "L"
                },
                {
                    "bay": "647",
                    "category": "ready meals",
                    "side": "L"
                },
                {
                    "bay": "624",
                    "category": "chips & potato products",
                    "side": "R"
                },
                {
                    "bay": "655",
                    "category": "vegetables",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "1186",
                    "label": "frozen promo 2",
                    "name": "Frozen Promo 2"
                },
                "frontLeft": {
                    "code": "2343",
                    "label": "ice lollies",
                    "name": "Ice Lollies"
                },
                "frontRight": {
                    "code": "2343",
                    "label": "ice lollies",
                    "name": "Ice Lollies"
                },
                "back": {
                    "code": "1157",
                    "label": "frozen promo 1",
                    "name": "Frozen Promo 1"
                },
                "backLeft": {
                    "code": "3687",
                    "label": "fro 1",
                    "name": "Fro 1"
                },
                "backRight": {
                    "code": "3688",
                    "label": "fro 2",
                    "name": "Fro 2"
                }
            }
        },
        {
            "id": "G-16-15",
            "label": "16|15",
            "type": "gondola",
            "p1": [
                255,
                880
            ],
            "p2": [
                255,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "2164",
                    "category": "ice cream & desserts inc bakery",
                    "side": "L"
                },
                {
                    "bay": "660",
                    "category": "york. pudd",
                    "side": "L"
                },
                {
                    "bay": "4500",
                    "category": "clearance stock",
                    "side": "R"
                },
                {
                    "bay": "1079",
                    "category": "toilet rolls",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "1169",
                    "label": "frozen promo 3",
                    "name": "Frozen Promo 3"
                },
                "frontLeft": {
                    "code": "4631",
                    "label": "I.A paper promo",
                    "name": "IA Paper Promo"
                },
                "frontRight": {
                    "code": "767",
                    "label": "mat stand",
                    "name": "Mat Stand"
                },
                "back": {
                    "code": "938",
                    "label": "fresh promo end 2",
                    "name": "Fresh Promo 2"
                },
                "backLeft": {
                    "code": "4141",
                    "label": "coke stand",
                    "name": "Coke Stand"
                },
                "backRight": {
                    "code": "3713",
                    "label": "ship 21",
                    "name": "Ship 21"
                }
            }
        },
        {
            "id": "G-15-14",
            "label": "15|14",
            "type": "gondola",
            "p1": [
                340,
                880
            ],
            "p2": [
                340,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "555",
                    "category": "tissues",
                    "side": "L"
                },
                {
                    "bay": "738",
                    "category": "kitchen towels",
                    "side": "L"
                },
                {
                    "bay": "4209",
                    "category": "foils, bin liners matches & insec",
                    "side": "L"
                },
                {
                    "bay": "534",
                    "category": "DIY & motor",
                    "side": "L"
                },
                {
                    "bay": "4329",
                    "category": "all laundry",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2864",
                    "label": "household 3 promo",
                    "name": "Household 3 Promo"
                },
                "frontLeft": {
                    "code": "3729",
                    "label": "ship 27",
                    "name": "Ship 27"
                },
                "frontRight": {
                    "code": "3720",
                    "label": "ship 26",
                    "name": "Ship 26"
                },
                "back": {
                    "code": "4240",
                    "label": "branded promo",
                    "name": "Branded Promo"
                },
                "backLeft": {
                    "code": "2961",
                    "label": "hh 2r",
                    "name": "HH 2R"
                },
                "backRight": {
                    "code": "2918",
                    "label": "hh 2l",
                    "name": "HH 2L"
                }
            }
        },
        {
            "id": "G-14-13",
            "label": "14|13",
            "type": "gondola",
            "p1": [
                418.0003282402959,
                882.6662290129389
            ],
            "p2": [
                418.0003282402959,
                582.6662290129389
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "4329",
                    "category": "all laundry",
                    "side": "L"
                },
                {
                    "bay": "1100",
                    "category": "washing up liquids",
                    "side": "L"
                },
                {
                    "bay": "113",
                    "category": "air fresheners",
                    "side": "L"
                },
                {
                    "bay": "4563",
                    "category": "JML",
                    "side": "L"
                },
                {
                    "bay": "4182",
                    "category": "bleach & wc products",
                    "side": "R"
                },
                {
                    "bay": "4208",
                    "category": "cleaners, disinfectant & polish",
                    "side": "R"
                },
                {
                    "bay": "4207",
                    "category": "cleaning cloths & shoecare",
                    "side": "R"
                },
                {
                    "bay": "758",
                    "category": "lightbulbs",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "4648",
                    "label": "gum end",
                    "name": "Gum End"
                },
                "frontRight": {
                    "code": "22",
                    "label": "ship",
                    "name": "Ship"
                },
                "back": {
                    "code": "2862",
                    "label": "household 1 promo",
                    "name": "Household 1 Promo"
                },
                "backLeft": {
                    "code": "2960",
                    "label": "hh 1r",
                    "name": "HH 1R"
                },
                "backRight": {
                    "code": "2917",
                    "label": "hh 1l",
                    "name": "HH 1L"
                }
            }
        },
        {
            "id": "G-13-12",
            "label": "13|12",
            "type": "gondola",
            "p1": [
                500,
                880
            ],
            "p2": [
                500,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "365",
                    "category": "cat treats",
                    "side": "L"
                },
                {
                    "bay": "677",
                    "category": "gourmet",
                    "side": "L"
                },
                {
                    "bay": "104",
                    "category": "wet cat food",
                    "side": "L"
                },
                {
                    "bay": "1010",
                    "category": "small animal",
                    "side": "L"
                },
                {
                    "bay": "3263",
                    "category": "fresh & frozen pet food",
                    "side": "R"
                },
                {
                    "bay": "3276",
                    "category": "dog treats inc accs & toys",
                    "side": "R"
                },
                {
                    "bay": "2185",
                    "category": "dry dog food",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "235",
                    "label": "batteries",
                    "name": "Batteries"
                },
                "frontLeft": {
                    "code": "235",
                    "label": "battery stand",
                    "name": "Battery Stand"
                },
                "back": {
                    "code": "2867",
                    "label": "petfood 2 promo",
                    "name": "Petfood 2 Promo"
                },
                "backLeft": {
                    "code": "4345",
                    "label": "house hold ship",
                    "name": "Household Ship"
                },
                "backRight": {
                    "code": "2922",
                    "label": "pet 2l",
                    "name": "Pet 2L"
                }
            }
        },
        {
            "id": "G-12-11",
            "label": "12|11",
            "type": "gondola",
            "p1": [
                580,
                880
            ],
            "p2": [
                580,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "2056",
                    "category": "wet dog small dog",
                    "side": "L"
                },
                {
                    "bay": "364",
                    "category": "cat litter",
                    "side": "L"
                },
                {
                    "bay": "538",
                    "category": "dry cat food",
                    "side": "L"
                },
                {
                    "bay": "565",
                    "category": "feminine hygiene",
                    "side": "R"
                },
                {
                    "bay": "1006",
                    "category": "skincare",
                    "side": "R"
                },
                {
                    "bay": "3828",
                    "category": "Combined cosmetics",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "4940",
                    "label": "bws 7 promo",
                    "name": "BWS 7 Promo"
                },
                "frontLeft": {
                    "code": "3921",
                    "label": "3921",
                    "name": "3921"
                },
                "frontRight": {
                    "code": "3921",
                    "label": "3921",
                    "name": "3921"
                },
                "back": {
                    "code": "2866",
                    "label": "petfood 1 promo",
                    "name": "Petfood 1 Promo"
                },
                "backLeft": {
                    "code": "2964",
                    "label": "pf 1r",
                    "name": "PF 1R"
                },
                "backRight": {
                    "code": "687",
                    "label": "hair accs",
                    "name": "Hair Accs"
                }
            }
        },
        {
            "id": "G-11-10",
            "label": "11|10",
            "type": "gondola",
            "p1": [
                660,
                880
            ],
            "p2": [
                660,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "995",
                    "category": "shampoo & conditioners",
                    "side": "L"
                },
                {
                    "bay": "403",
                    "category": "colorants",
                    "side": "L"
                },
                {
                    "bay": "1043",
                    "category": "styling",
                    "side": "L"
                },
                {
                    "bay": "562",
                    "category": "hair rem",
                    "side": "L"
                },
                {
                    "bay": "764",
                    "category": "suncare",
                    "side": "L"
                },
                {
                    "bay": "1017",
                    "category": "soap",
                    "side": "R"
                },
                {
                    "bay": "525",
                    "category": "deod orants",
                    "side": "R"
                },
                {
                    "bay": "1175",
                    "category": "medicines ex slimming",
                    "side": "R"
                },
                {
                    "bay": "577",
                    "category": "fine frag",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "3371",
                    "label": "suncare",
                    "name": "Suncare"
                },
                "frontLeft": {
                    "code": "4337",
                    "label": "pm ship 3",
                    "name": "PM Ship 3"
                },
                "frontRight": {
                    "code": "22",
                    "label": "ship",
                    "name": "Ship"
                },
                "back": {
                    "code": "2860",
                    "label": "health & beauty 2 promo",
                    "name": "H&B 2 Promo"
                },
                "backLeft": {
                    "code": "2958",
                    "label": "h/2r",
                    "name": "H/2R"
                },
                "backRight": {
                    "code": "2915",
                    "label": "hb 21",
                    "name": "HB 21"
                }
            }
        },
        {
            "id": "G-10-9",
            "label": "10|9",
            "type": "gondola",
            "p1": [
                740,
                880
            ],
            "p2": [
                740,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "1019",
                    "category": "bath inc sponges & accs",
                    "side": "L"
                },
                {
                    "bay": "524",
                    "category": "dentalcare",
                    "side": "L"
                },
                {
                    "bay": "786",
                    "category": "mens shave & toiletries",
                    "side": "L"
                },
                {
                    "bay": "2242",
                    "category": "weaning & bath accs",
                    "side": "R"
                },
                {
                    "bay": "149",
                    "category": "feed & soothers",
                    "side": "R"
                },
                {
                    "bay": "151",
                    "category": "baby food",
                    "side": "R"
                },
                {
                    "bay": "154",
                    "category": "baby milk",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "786",
                    "label": "mens shave & toiletries",
                    "name": "Mens Shave"
                },
                "frontLeft": {
                    "code": "22",
                    "label": "ship",
                    "name": "Ship"
                },
                "back": {
                    "code": "2859",
                    "label": "health & beauty 1 promo",
                    "name": "H&B 1 Promo"
                },
                "backLeft": {
                    "code": "2957",
                    "label": "hb 1r",
                    "name": "HB 1R"
                },
                "backRight": {
                    "code": "2914",
                    "label": "hb 11",
                    "name": "HB 11"
                }
            }
        },
        {
            "id": "G-9-8",
            "label": "9|8",
            "type": "gondola",
            "p1": [
                820,
                880
            ],
            "p2": [
                820,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "813",
                    "category": "nappies",
                    "side": "L"
                },
                {
                    "bay": "164",
                    "category": "baby wipes & c/wool",
                    "side": "L"
                },
                {
                    "bay": "157",
                    "category": "baby toiletries",
                    "side": "L"
                },
                {
                    "bay": "1184",
                    "category": "nutmeg",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2240",
                    "label": "bags for life",
                    "name": "Bags For Life"
                },
                "frontLeft": {
                    "code": "3945",
                    "label": "meds promo",
                    "name": "Meds Promo"
                },
                "frontRight": {
                    "code": "1088",
                    "label": "lunch",
                    "name": "Lunch"
                },
                "back": {
                    "code": "3024",
                    "label": "baby 1 promo",
                    "name": "Baby 1 Promo"
                },
                "backLeft": {
                    "code": "3026",
                    "label": "bob 1r",
                    "name": "Bob 1R"
                },
                "backRight": {
                    "code": "3025",
                    "label": "bob 11",
                    "name": "Bob 11"
                }
            }
        },
        {
            "id": "G-8-7",
            "label": "8|7",
            "type": "gondola",
            "p1": [
                900,
                880
            ],
            "p2": [
                900,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "1184",
                    "category": "nutmeg",
                    "side": "L"
                },
                {
                    "bay": "1184",
                    "category": "nutmeg",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "AE1",
                    "label": "AE1",
                    "name": "Nutmeg End 1"
                },
                "frontRight": {
                    "code": "AE2",
                    "label": "AE2",
                    "name": "Nutmeg End 2"
                },
                "back": {
                    "code": "AE3",
                    "label": "AE3",
                    "name": "Nutmeg End 3"
                },
                "backRight": {
                    "code": "AE4",
                    "label": "AE4",
                    "name": "Nutmeg End 4"
                }
            }
        },
        {
            "id": "G-7-6",
            "label": "7|6",
            "type": "gondola",
            "p1": [
                980,
                880
            ],
            "p2": [
                980,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "2377",
                    "category": "womenswear",
                    "side": "L"
                },
                {
                    "bay": "988",
                    "category": "seasonal",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "673",
                    "label": "gift card unit",
                    "name": "Gift Card Unit"
                },
                "frontRight": {
                    "code": "3719",
                    "label": "ship 25",
                    "name": "Ship 25"
                },
                "back": {
                    "code": "3666",
                    "label": "events 2 promo",
                    "name": "Events 2 Promo"
                },
                "backLeft": {
                    "code": "3931",
                    "label": "editing",
                    "name": "Editing"
                },
                "backRight": {
                    "code": "2916",
                    "label": "hb 31",
                    "name": "HB 31"
                }
            }
        },
        {
            "id": "G-6-5",
            "label": "6|5",
            "type": "gondola",
            "p1": [
                1060,
                880
            ],
            "p2": [
                1060,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "988",
                    "category": "seasonal",
                    "side": "L"
                },
                {
                    "bay": "118",
                    "category": "kids toys",
                    "side": "R"
                },
                {
                    "bay": "529",
                    "category": "disp. t/ware",
                    "side": "R"
                },
                {
                    "bay": "2209",
                    "category": "party essentials",
                    "side": "R"
                },
                {
                    "bay": "2102",
                    "category": "single confec",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "845",
                    "label": "chart books",
                    "name": "Chart Books"
                },
                "frontLeft": {
                    "code": "22",
                    "label": "ship",
                    "name": "Ship"
                },
                "frontRight": {
                    "code": "3139",
                    "label": "h/l 7",
                    "name": "H&L 7"
                },
                "back": {
                    "code": "2982",
                    "label": "events 1 promo",
                    "name": "Events 1 Promo"
                },
                "backLeft": {
                    "code": "3138",
                    "label": "h/l 6",
                    "name": "H&L 6"
                },
                "backRight": {
                    "code": "3137",
                    "label": "h/l 5",
                    "name": "H&L 5"
                }
            }
        },
        {
            "id": "G-5-4",
            "label": "5|4",
            "type": "gondola",
            "p1": [
                1140,
                880
            ],
            "p2": [
                1140,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "3052",
                    "category": "kids zone books",
                    "side": "L"
                },
                {
                    "bay": "2368",
                    "category": "kids zone mugs",
                    "side": "L"
                },
                {
                    "bay": "820",
                    "category": "magazines",
                    "side": "L"
                },
                {
                    "bay": "1090",
                    "category": "utility storage",
                    "side": "L"
                },
                {
                    "bay": "745",
                    "category": "laundry accs",
                    "side": "L"
                },
                {
                    "bay": "389",
                    "category": "cleaning",
                    "side": "L"
                },
                {
                    "bay": "333",
                    "category": "candles",
                    "side": "R"
                },
                {
                    "bay": "231",
                    "category": "bathroom & room accs",
                    "side": "R"
                },
                {
                    "bay": "912",
                    "category": "pillows & quilts",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2793",
                    "label": "science museum toys",
                    "name": "Science Museum Toys"
                },
                "frontLeft": {
                    "code": "h/l 7",
                    "label": "h/l 7",
                    "name": "H&L 7"
                },
                "back": {
                    "code": "2659",
                    "label": "home & leisure 3 promo",
                    "name": "H&L 3 Promo"
                },
                "backLeft": {
                    "code": "2737",
                    "label": "new release",
                    "name": "New Release"
                },
                "backRight": {
                    "code": "2664",
                    "label": "h/l 4",
                    "name": "H&L 4"
                }
            }
        },
        {
            "id": "G-4-3",
            "label": "4|3",
            "type": "gondola",
            "p1": [
                1220,
                880
            ],
            "p2": [
                1220,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "2540",
                    "category": "bed linen & home decor",
                    "side": "L"
                },
                {
                    "bay": "370",
                    "category": "ceramic/dinnerware/tableware",
                    "side": "L"
                },
                {
                    "bay": "2553",
                    "category": "bakeware",
                    "side": "R"
                },
                {
                    "bay": "2556",
                    "category": "ovenware",
                    "side": "R"
                },
                {
                    "bay": "2577",
                    "category": "SDA food prep",
                    "side": "R"
                },
                {
                    "bay": "2578",
                    "category": "SDA kettles & toasters",
                    "side": "R"
                },
                {
                    "bay": "735",
                    "category": "kitchen plastics & bins",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "806",
                    "label": "mugs",
                    "name": "Mugs"
                },
                "frontLeft": {
                    "code": "3141",
                    "label": "h/l 9",
                    "name": "H&L 9"
                },
                "frontRight": {
                    "code": "3140",
                    "label": "h/l 8",
                    "name": "H&L 8"
                },
                "back": {
                    "code": "2658",
                    "label": "home & leisure 2 promo",
                    "name": "H&L 2 Promo"
                },
                "backLeft": {
                    "code": "2663",
                    "label": "h/l 3",
                    "name": "H&L 3"
                },
                "backRight": {
                    "code": "2662",
                    "label": "h/l 2",
                    "name": "H&L 2"
                }
            }
        },
        {
            "id": "G-3-2",
            "label": "3|2",
            "type": "gondola",
            "p1": [
                1300,
                880
            ],
            "p2": [
                1300,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "737",
                    "category": "kitchen tools",
                    "side": "L"
                },
                {
                    "bay": "843",
                    "category": "panware",
                    "side": "L"
                },
                {
                    "bay": "590",
                    "category": "food storage",
                    "side": "L"
                },
                {
                    "bay": "675",
                    "category": "glassware",
                    "side": "L"
                },
                {
                    "bay": "4273",
                    "category": "bulk buy",
                    "side": "R"
                },
                {
                    "bay": "4396",
                    "category": "carbonates exc bulk",
                    "side": "R"
                },
                {
                    "bay": "763",
                    "category": "lunchbox",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "3152",
                    "label": "SDA floorcare",
                    "name": "SDA Floorcare"
                },
                "frontLeft": {
                    "code": "22",
                    "label": "ship",
                    "name": "Ship"
                },
                "back": {
                    "code": "2657",
                    "label": "home & leisure 1 promo",
                    "name": "H&L 1 Promo"
                },
                "backLeft": {
                    "code": "2661",
                    "label": "h/l",
                    "name": "H&L"
                },
                "backRight": {
                    "code": "3142",
                    "label": "10",
                    "name": "Promo 10"
                }
            }
        },
        {
            "id": "G-2-1",
            "label": "2|1",
            "type": "gondola",
            "p1": [
                1380,
                880
            ],
            "p2": [
                1380,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "4502",
                    "category": "cola exc bulk",
                    "side": "L"
                },
                {
                    "bay": "4384",
                    "category": "soft drinks branded",
                    "side": "L"
                },
                {
                    "bay": "1029",
                    "category": "squash",
                    "side": "L"
                },
                {
                    "bay": "801",
                    "category": "mixers",
                    "side": "R"
                },
                {
                    "bay": "664",
                    "category": "fruit juice",
                    "side": "R"
                },
                {
                    "bay": "2782",
                    "category": "sports drinks inc nutrition",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "3823",
                    "label": "seasonal drinks",
                    "name": "Seasonal Drinks"
                },
                "frontLeft": {
                    "code": "3718",
                    "label": "ship 24",
                    "name": "Ship 24"
                },
                "frontRight": {
                    "code": "23",
                    "label": "ship 23",
                    "name": "Ship 23"
                },
                "back": {
                    "code": "2851",
                    "label": "grocery & impulse 1a",
                    "name": "G&I 1A"
                },
                "backLeft": {
                    "code": "2906",
                    "label": "g&i 1a left",
                    "name": "G&I 1A Left"
                },
                "backRight": {
                    "code": "2949",
                    "label": "g&i 1a right",
                    "name": "G&I 1A Right"
                }
            }
        },
        {
            "id": "G-1-0",
            "label": "1|0",
            "type": "gondola",
            "p1": [
                1460,
                880
            ],
            "p2": [
                1460,
                580
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "582",
                    "category": "flav water inc func",
                    "side": "L"
                },
                {
                    "bay": "3795",
                    "category": "sparkling & plain water",
                    "side": "L"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "3715",
                    "label": "ship 22",
                    "name": "Ship 22"
                }
            }
        },
        {
            "id": "Wall-1-Bottom",
            "label": "Wall 1 - Deli/Meat",
            "type": "chilled",
            "p1": [
                55.21646973012118,
                498.75676467906624
            ],
            "p2": [
                55.21646973012118,
                85.02873931101968
            ],
            "aisleWidth": 40,
            "locked": false,
            "sections": [
                {
                    "bay": "916",
                    "category": "pork"
                },
                {
                    "bay": "3885",
                    "category": "slow cooked"
                },
                {
                    "bay": "989",
                    "category": "seasonal"
                },
                {
                    "bay": "506",
                    "category": "breaded poultry"
                },
                {
                    "bay": "3274",
                    "category": "poultry portions & whole birds inc turkey"
                },
                {
                    "bay": "169",
                    "category": "bacon, gammon & sausages"
                }
            ]
        },
        {
            "id": "Wall-2",
            "label": "Wall 2 - Meat",
            "type": "chilled",
            "p1": [
                87.10349930991313,
                46.12434846393676
            ],
            "p2": [
                287.1034993099131,
                46.12434846393676
            ],
            "aisleWidth": 25,
            "locked": false,
            "sections": [
                {
                    "bay": "797",
                    "category": "mince"
                },
                {
                    "bay": "4975",
                    "category": "beef inc lamb"
                },
                {
                    "bay": "4899",
                    "category": "meat & fish foil trays"
                },
                {
                    "bay": "4897",
                    "category": "isp primal meats"
                }
            ]
        },
        {
            "id": "Wall-3",
            "label": "Wall 3 - Butchery",
            "type": "counter",
            "p1": [
                293.3896726006604,
                44.18506016662945
            ],
            "p2": [
                379.7886540421799,
                44.18506016662945
            ],
            "aisleWidth": 27.5,
            "locked": false,
            "sections": [
                {
                    "bay": "1531",
                    "category": "butchery counter"
                },
                {
                    "bay": "1531",
                    "category": "butchery counter"
                }
            ]
        },
        {
            "id": "Wall-4",
            "label": "Wall 4 - Bakery",
            "type": "bakery",
            "p1": [
                450,
                45
            ],
            "p2": [
                700,
                45
            ],
            "aisleWidth": 25,
            "locked": false,
            "sections": [
                {
                    "bay": "195",
                    "category": "soft rolls & baps"
                },
                {
                    "bay": "257",
                    "category": "combined cakeshop"
                },
                {
                    "bay": "3659",
                    "category": "bakery 2"
                },
                {
                    "bay": "192",
                    "category": "danish, fruit & scones"
                },
                {
                    "bay": "1572",
                    "category": "pick n mix"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "4007",
                    "label": "bread & cakes promo 1",
                    "name": "Bread & Cakes Promo 1"
                }
            }
        },
        {
            "id": "Wall-5",
            "label": "Cake Shop Island",
            "type": "chilled",
            "p1": [
                550,
                120
            ],
            "p2": [
                700,
                120
            ],
            "aisleWidth": 20,
            "locked": false,
            "sections": [
                {
                    "bay": "257",
                    "category": "combined cakeshop"
                },
                {
                    "bay": "3519",
                    "category": "mini"
                },
                {
                    "bay": "2382",
                    "category": "cokes sendil"
                },
                {
                    "bay": "3660",
                    "category": "french style"
                }
            ]
        },
        {
            "id": "Wall-6",
            "label": "Deli",
            "type": "chilled",
            "p1": [
                770.5528483450972,
                49.987983837337275
            ],
            "p2": [
                875.2812213272654,
                49.987983837337275
            ],
            "aisleWidth": 26.290969144629244,
            "locked": false,
            "sections": []
        },
        {
            "id": "Wall-7",
            "label": "Pie Shop",
            "type": "counter",
            "p1": [
                901.9805636934833,
                50
            ],
            "p2": [
                1023.0868023696155,
                50
            ],
            "aisleWidth": 25,
            "locked": false,
            "sections": [
                {
                    "bay": "906",
                    "category": "pie shop"
                }
            ]
        },
        {
            "id": "Wall-8",
            "label": "oven fresh counter",
            "type": "counter",
            "p1": [
                1050.0609605470916,
                49.939039452908496
            ],
            "p2": [
                1166.9468035489806,
                49.939039452908496
            ],
            "aisleWidth": 25.12192109418301,
            "locked": false,
            "sections": [
                {
                    "bay": "830",
                    "category": "oven fresh counter"
                }
            ]
        },
        {
            "id": "Wall-9",
            "label": "Wall 9 - Hot Food",
            "type": "counter",
            "p1": [
                977.9118628017893,
                130.55672792831533
            ],
            "p2": [
                1075.2341781686598,
                130.55672792831533
            ],
            "aisleWidth": 24.024780275949524,
            "locked": false,
            "sections": [
                {
                    "bay": "VAT",
                    "category": "vat free chickens"
                },
                {
                    "bay": "2869",
                    "category": "express"
                },
                {
                    "bay": "2701",
                    "category": "express meat, pork & chix"
                }
            ]
        },
        {
            "id": "Wall-10",
            "label": "Wall 10 - Fish",
            "type": "counter",
            "p1": [
                1326.5459391387499,
                50.31270346055027
            ],
            "p2": [
                1637.949185521318,
                50.31270346055027
            ],
            "aisleWidth": 25.625406921100534,
            "locked": false,
            "sections": [
                {
                    "bay": "458",
                    "category": "cooked meat inc pate"
                },
                {
                    "bay": "1776",
                    "category": "prep cook fish"
                },
                {
                    "bay": "1532",
                    "category": "fish counter"
                }
            ]
        },
        {
            "id": "Wall-12",
            "label": "Wall 12 - Addition Pallets",
            "type": "promo",
            "p1": [
                1684.0216488304711,
                194.33398867741187
            ],
            "p2": [
                1684.0216488304711,
                150.8529754115639
            ],
            "aisleWidth": 140.18434509563713,
            "locked": false,
            "sections": [
                {
                    "bay": "3166",
                    "category": "BWS Pallet"
                },
                {
                    "bay": "3165",
                    "category": "FOS white pallet 1"
                },
                {
                    "bay": "3167",
                    "category": "FOS white pallet 2"
                }
            ],
            "rotation": 359.9410879230263
        },
        {
            "id": "Wall-13",
            "label": "salad bar",
            "type": "counter",
            "p1": [
                1735.6627645351473,
                89.2637894323895
            ],
            "p2": [
                1829.4636929729957,
                89.2637894323895
            ],
            "aisleWidth": 25.505372757859135,
            "locked": false,
            "sections": [
                {
                    "bay": "1529",
                    "category": "salad bar"
                }
            ],
            "rotation": 45
        },
        {
            "id": "Wall-15",
            "label": "Wall 15 - Produce Right",
            "type": "chilled",
            "p1": [
                1928.1320244467447,
                272.2809063866908
            ],
            "p2": [
                1928.1320244467447,
                471.2161073859432
            ],
            "aisleWidth": 23.21501148609309,
            "locked": false,
            "sections": [
                {
                    "bay": "925",
                    "category": "pizza"
                },
                {
                    "bay": "570",
                    "category": "pasta & garlic bread"
                },
                {
                    "bay": "910",
                    "category": "pies"
                }
            ]
        },
        {
            "id": "Wall-17",
            "label": "Wall 17 - Salad & Mushrooms",
            "type": "chilled",
            "p1": [
                1500,
                580
            ],
            "p2": [
                1500,
                868.5996065918209
            ],
            "aisleWidth": 25,
            "locked": false,
            "sections": [
                {
                    "bay": "1153",
                    "category": "mushrooms"
                },
                {
                    "bay": "1134",
                    "category": "misc salad inc avocados"
                },
                {
                    "bay": "1138",
                    "category": "lettuce"
                },
                {
                    "bay": "171",
                    "category": "bagged salad"
                }
            ]
        },
        {
            "id": "G-34-33",
            "label": "34|33",
            "type": "chilled",
            "p1": [
                165,
                500
            ],
            "p2": [
                165,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "553",
                    "category": "juice",
                    "side": "L"
                },
                {
                    "bay": "1162",
                    "category": "quick sale",
                    "side": "L"
                },
                {
                    "bay": "283",
                    "category": "butters & fats",
                    "side": "L"
                },
                {
                    "bay": "4961",
                    "category": "ready meals & soup excludes meat free",
                    "side": "R"
                },
                {
                    "bay": "3887",
                    "category": "meat free alternatives",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "1149",
                    "label": "fresh promo end 4",
                    "name": "Fresh Promo End 4"
                },
                "frontLeft": {
                    "code": "970",
                    "label": "salami stand",
                    "name": "Salami Stand"
                },
                "frontRight": {
                    "code": "3677",
                    "label": "hp chill 4",
                    "name": "HP Chill 4"
                },
                "back": {
                    "code": "100",
                    "label": "for £10",
                    "name": "For £10"
                },
                "backLeft": {
                    "code": "3015",
                    "label": "fresh integral 1",
                    "name": "Fresh Integral 1"
                },
                "backRight": {
                    "code": "979",
                    "label": "schwartz",
                    "name": "Schwartz"
                }
            }
        },
        {
            "id": "G-33-32",
            "label": "33|32",
            "type": "chilled",
            "p1": [
                260,
                500
            ],
            "p2": [
                260,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "4902",
                    "category": "egg ship",
                    "side": "L"
                },
                {
                    "bay": "605",
                    "category": "desserts",
                    "side": "L"
                },
                {
                    "bay": "4961",
                    "category": "ready meals & soup excludes meat free",
                    "side": "L"
                },
                {
                    "bay": "4950",
                    "category": "licensed meal deals",
                    "side": "L"
                },
                {
                    "bay": "791",
                    "category": "milk",
                    "side": "R"
                },
                {
                    "bay": "601",
                    "category": "cream",
                    "side": "R"
                },
                {
                    "bay": "1635",
                    "category": "combined yoghurts",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "16",
                    "label": "fresh promo end",
                    "name": "Fresh Promo End"
                },
                "back": {
                    "code": "1129",
                    "label": "fresh promo end 3",
                    "name": "Fresh Promo End 3"
                },
                "backLeft": {
                    "code": "3679",
                    "label": "hp chill 3",
                    "name": "HP Chill 3"
                }
            }
        },
        {
            "id": "G-32-31",
            "label": "32|31",
            "type": "chilled",
            "p1": [
                350,
                500
            ],
            "p2": [
                350,
                205
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "792",
                    "category": "milk drinks",
                    "side": "L"
                },
                {
                    "bay": "4965",
                    "category": "coffee drinks",
                    "side": "L"
                },
                {
                    "bay": "1635",
                    "category": "combined yoghurts",
                    "side": "L"
                },
                {
                    "bay": "3467",
                    "category": "free from combined",
                    "side": "R"
                },
                {
                    "bay": "2474",
                    "category": "free from",
                    "side": "R"
                },
                {
                    "bay": "598",
                    "category": "free from",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2854",
                    "label": "grocery & impulse 5b promo",
                    "name": "G&I 5B Promo"
                },
                "frontRight": {
                    "code": "2796",
                    "label": "ba",
                    "name": "BA"
                },
                "back": {
                    "code": "4392",
                    "label": "branded promo 2",
                    "name": "Branded Promo 2"
                },
                "backLeft": {
                    "code": "3709",
                    "label": "ship",
                    "name": "Ship"
                },
                "backRight": {
                    "code": "3721",
                    "label": "ship 28",
                    "name": "Ship 28"
                }
            }
        },
        {
            "id": "G-31-30",
            "label": "31|30",
            "type": "gondola",
            "p1": [
                440,
                500
            ],
            "p2": [
                440,
                190
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "368",
                    "category": "party cakes",
                    "side": "L"
                },
                {
                    "bay": "917",
                    "category": "cakes",
                    "side": "L"
                },
                {
                    "bay": "581",
                    "category": "LL milk",
                    "side": "L"
                },
                {
                    "bay": "2373",
                    "category": "free",
                    "side": "L"
                },
                {
                    "bay": "3267",
                    "category": "salad & meal accomps",
                    "side": "R"
                },
                {
                    "bay": "3268",
                    "category": "morning goods",
                    "side": "R"
                },
                {
                    "bay": "929",
                    "category": "preserves",
                    "side": "R"
                },
                {
                    "bay": "4006",
                    "category": "promo",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2863",
                    "label": "household 2 promo",
                    "name": "Household 2 Promo"
                },
                "frontLeft": {
                    "code": "3736",
                    "label": "sm",
                    "name": "SM"
                },
                "frontRight": {
                    "code": "9488",
                    "label": "g&i right",
                    "name": "G&I Right"
                },
                "back": {
                    "code": "4007",
                    "label": "bread & cakes promo 1",
                    "name": "Bread & Cakes Promo 1"
                },
                "backLeft": {
                    "code": "1161",
                    "label": "clear",
                    "name": "Clear"
                },
                "backRight": {
                    "code": "3722",
                    "label": "ship 29",
                    "name": "Ship 29"
                }
            }
        },
        {
            "id": "G-30-29",
            "label": "30|29",
            "type": "gondola",
            "p1": [
                515.4868239561207,
                485
            ],
            "p2": [
                515.4868239561207,
                202.25658802193965
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "3267",
                    "category": "sandwich & meal accomps",
                    "side": "L"
                },
                {
                    "bay": "2160",
                    "category": "400g loaves",
                    "side": "L"
                },
                {
                    "bay": "2162",
                    "category": "800g white loaves",
                    "side": "L"
                },
                {
                    "bay": "2161",
                    "category": "wholemeal, seeded & best of both loaves",
                    "side": "L"
                },
                {
                    "bay": "3362",
                    "category": "family & kids cereal",
                    "side": "R"
                },
                {
                    "bay": "3348",
                    "category": "wellbeing cereals",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2983",
                    "label": "paper 1 promo",
                    "name": "Paper 1 Promo"
                },
                "back": {
                    "code": "257",
                    "label": "combined cakeshop",
                    "name": "Combined Cakeshop"
                },
                "backLeft": {
                    "code": "3708",
                    "label": "ship",
                    "name": "Ship"
                },
                "backRight": {
                    "code": "3707",
                    "label": "ship 15",
                    "name": "Ship 15"
                }
            }
        },
        {
            "id": "G-29-28",
            "label": "29|28",
            "type": "gondola",
            "p1": [
                600,
                500
            ],
            "p2": [
                600,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "1044",
                    "category": "sugar",
                    "side": "L"
                },
                {
                    "bay": "4131",
                    "category": "cereal bars",
                    "side": "L"
                },
                {
                    "bay": "3349",
                    "category": "porridge & port, muesli & granola",
                    "side": "L"
                },
                {
                    "bay": "3348",
                    "category": "wellbeing cereals",
                    "side": "L"
                },
                {
                    "bay": "395",
                    "category": "coffee & bevs",
                    "side": "R"
                },
                {
                    "bay": "1065",
                    "category": "tea",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "4189",
                    "label": "drinks promo 3",
                    "name": "Drinks Promo 3"
                },
                "frontLeft": {
                    "code": "4338",
                    "label": "cereal ship",
                    "name": "Cereal Ship"
                },
                "back": {
                    "code": "4015",
                    "label": "MS end 3",
                    "name": "MS End 3"
                },
                "backLeft": {
                    "code": "3706",
                    "label": "ship 14",
                    "name": "Ship 14"
                },
                "backRight": {
                    "code": "3705",
                    "label": "ship 13",
                    "name": "Ship 13"
                }
            }
        },
        {
            "id": "G-28-27",
            "label": "28|27",
            "type": "gondola",
            "p1": [
                690,
                500
            ],
            "p2": [
                690,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "395",
                    "category": "coffee & bevs",
                    "side": "L"
                },
                {
                    "bay": "3970",
                    "category": "ambient fruit & desserts inc prep & wafers",
                    "side": "L"
                },
                {
                    "bay": "545",
                    "category": "eggs",
                    "side": "R"
                },
                {
                    "bay": "288",
                    "category": "cupcakes, mix & decs.",
                    "side": "R"
                },
                {
                    "bay": "3814",
                    "category": "dried fruit & nuts & flour",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "4188",
                    "label": "drinks promo 2",
                    "name": "Drinks Promo 2"
                },
                "frontLeft": {
                    "code": "3733",
                    "label": "sm",
                    "name": "SM"
                },
                "frontRight": {
                    "code": "2796",
                    "label": "ba",
                    "name": "BA"
                },
                "back": {
                    "code": "2838",
                    "label": "grocery & impulse 3b promo",
                    "name": "G&I 3B Promo"
                },
                "backLeft": {
                    "code": "3704",
                    "label": "ship 19",
                    "name": "Ship 19"
                },
                "backRight": {
                    "code": "3699",
                    "label": "ship 7",
                    "name": "Ship 7"
                }
            }
        },
        {
            "id": "G-27-26",
            "label": "27|26",
            "type": "gondola",
            "p1": [
                765,
                500
            ],
            "p2": [
                765,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "2119",
                    "category": "ethnic combined",
                    "side": "L"
                },
                {
                    "bay": "492",
                    "category": "oils inc. vinegar",
                    "side": "L"
                },
                {
                    "bay": "681",
                    "category": "gravy, stuffing meat free & whole foods",
                    "side": "L"
                },
                {
                    "bay": "1161",
                    "category": "groc clear",
                    "side": "L"
                },
                {
                    "bay": "827",
                    "category": "pickles",
                    "side": "R"
                },
                {
                    "bay": "2379",
                    "category": "sauces, salads & cond ex vin",
                    "side": "R"
                },
                {
                    "bay": "693",
                    "category": "salt & herbs",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2840",
                    "label": "grocery & impulse 4b promo",
                    "name": "G&I 4B Promo"
                },
                "frontLeft": {
                    "code": "2895",
                    "label": "g&i4b left",
                    "name": "G&I 4B Left"
                },
                "frontRight": {
                    "code": "2896",
                    "label": "g&i4b right",
                    "name": "G&I 4B Right"
                },
                "back": {
                    "code": "4013",
                    "label": "MS end 1",
                    "name": "MS End 1"
                },
                "backLeft": {
                    "code": "3703",
                    "label": "ship 11",
                    "name": "Ship 11"
                },
                "backRight": {
                    "code": "4336",
                    "label": "fam pack 2",
                    "name": "Fam Pack 2"
                }
            }
        },
        {
            "id": "G-26-25",
            "label": "26|25",
            "type": "gondola",
            "p1": [
                835,
                500
            ],
            "p2": [
                835,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "181",
                    "category": "beans & pasta",
                    "side": "L"
                },
                {
                    "bay": "342",
                    "category": "canned veg & spreads",
                    "side": "L"
                },
                {
                    "bay": "331",
                    "category": "canned fish",
                    "side": "L"
                },
                {
                    "bay": "4682",
                    "category": "con meals inc. ambient meals",
                    "side": "R"
                },
                {
                    "bay": "349",
                    "category": "combined soup",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "SH2605",
                    "label": "V events Bay promo",
                    "name": "V Events Bay Promo"
                },
                "frontLeft": {
                    "code": "3731",
                    "label": "sm",
                    "name": "SM"
                },
                "frontRight": {
                    "code": "3710",
                    "label": "ship 18",
                    "name": "Ship 18"
                },
                "back": {
                    "code": "4838",
                    "label": "the best end",
                    "name": "The Best End"
                },
                "backLeft": {
                    "code": "3702",
                    "label": "ship 19",
                    "name": "Ship 19"
                },
                "backRight": {
                    "code": "3724",
                    "label": "ship 5",
                    "name": "Ship 5"
                }
            }
        },
        {
            "id": "G-25-24",
            "label": "25|24",
            "type": "gondola",
            "p1": [
                910,
                500
            ],
            "p2": [
                910,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "710",
                    "category": "indian",
                    "side": "L"
                },
                {
                    "bay": "3186",
                    "category": "dried pasta inc pasta sauce & trad sauce",
                    "side": "L"
                },
                {
                    "bay": "972",
                    "category": "sauce mix",
                    "side": "L"
                },
                {
                    "bay": "958",
                    "category": "rice",
                    "side": "R"
                },
                {
                    "bay": "789",
                    "category": "mexican",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "3073",
                    "label": "grocery & impulse 9b promo",
                    "name": "G&I 9B Promo"
                },
                "frontLeft": {
                    "code": "3687",
                    "label": "eye 2",
                    "name": "Eye 2"
                },
                "frontRight": {
                    "code": "3008",
                    "label": "2r",
                    "name": "2R"
                },
                "back": {
                    "code": "2858",
                    "label": "grocery & impulse 8b promo",
                    "name": "G&I 8B Promo"
                },
                "backLeft": {
                    "code": "3701",
                    "label": "ship 9",
                    "name": "Ship 9"
                },
                "backRight": {
                    "code": "3721",
                    "label": "ship 30",
                    "name": "Ship 30"
                }
            }
        },
        {
            "id": "G-24-23",
            "label": "24|23",
            "type": "gondola",
            "p1": [
                980,
                485
            ],
            "p2": [
                980,
                223.47757593255014
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "285",
                    "category": "canned veg combined",
                    "side": "L"
                },
                {
                    "bay": "828",
                    "category": "oriental",
                    "side": "L"
                },
                {
                    "bay": "810",
                    "category": "multipack confec",
                    "side": "R"
                },
                {
                    "bay": "3621",
                    "category": "bagged choc",
                    "side": "R"
                },
                {
                    "bay": "2547",
                    "category": "boxed & block chocolate",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "SVB",
                    "label": "SHELVED VOLUME BAY impulse 1b promo",
                    "name": "SVB Impulse 1B"
                },
                "frontLeft": {
                    "code": "3675",
                    "label": "sm 4",
                    "name": "SM 4"
                },
                "frontRight": {
                    "code": "3712",
                    "label": "ship 20",
                    "name": "Ship 20"
                },
                "back": {
                    "code": "2987",
                    "label": "POS printer",
                    "name": "POS Printer"
                },
                "backRight": {
                    "code": "2796",
                    "label": "ba",
                    "name": "BA"
                }
            }
        },
        {
            "id": "G-23-22",
            "label": "23|22",
            "type": "gondola",
            "p1": [
                1060.375592487056,
                485
            ],
            "p2": [
                1060.375592487056,
                225
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "89",
                    "category": "pick n mix",
                    "side": "L"
                },
                {
                    "bay": "3802",
                    "category": "bagged sweets inc. gum & mint",
                    "side": "L"
                },
                {
                    "bay": "3803",
                    "category": "low sugar",
                    "side": "L"
                },
                {
                    "bay": "3624",
                    "category": "kids & party confec",
                    "side": "L"
                },
                {
                    "bay": "4061",
                    "category": "in aisle promo 5",
                    "side": "L"
                },
                {
                    "bay": "248",
                    "category": "biscuit barrel & treats",
                    "side": "R"
                },
                {
                    "bay": "2121",
                    "category": "usd",
                    "side": "R"
                },
                {
                    "bay": "3935",
                    "category": "in aisle promo 4",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "SVB",
                    "label": "SHELVED VOLUME BAY promo 1",
                    "name": "SVB Promo 1"
                },
                "frontLeft": {
                    "code": "3674",
                    "label": "sm 3",
                    "name": "SM 3"
                },
                "frontRight": {
                    "code": "4181",
                    "label": "drinks 1",
                    "name": "Drinks 1"
                },
                "back": {
                    "code": "2841",
                    "label": "grocery & impulse 6B promo",
                    "name": "G&I 6B Promo"
                },
                "backLeft": {
                    "code": "3698",
                    "label": "ship 6",
                    "name": "Ship 6"
                },
                "backRight": {
                    "code": "3697",
                    "label": "ship 5",
                    "name": "Ship 5"
                }
            }
        },
        {
            "id": "G-22-21",
            "label": "22|21",
            "type": "gondola",
            "p1": [
                1138.2956944618384,
                499.5353885374916
            ],
            "p2": [
                1138.2956944618384,
                200.88870984732003
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "829",
                    "category": "out of home",
                    "side": "L"
                },
                {
                    "bay": "1281",
                    "category": "healthy & snack bars",
                    "side": "L"
                },
                {
                    "bay": "2276",
                    "category": "crackers",
                    "side": "L"
                },
                {
                    "bay": "4069",
                    "category": "sharing exc. grocery nuts",
                    "side": "R"
                },
                {
                    "bay": "4359",
                    "category": "combined crisps & snacks",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2836",
                    "label": "grocery & impulse 2b promo",
                    "name": "G&I 2B Promo"
                },
                "frontLeft": {
                    "code": "2891",
                    "label": "g&i2b left",
                    "name": "G&I 2B Left"
                },
                "frontRight": {
                    "code": "2839",
                    "label": "g&i2b right",
                    "name": "G&I 2B Right"
                },
                "back": {
                    "code": "4068",
                    "label": "nuts",
                    "name": "Nuts"
                },
                "backLeft": {
                    "code": "3696",
                    "label": "ship 4",
                    "name": "Ship 4"
                },
                "backRight": {
                    "code": "3694",
                    "label": "ship 3",
                    "name": "Ship 3"
                }
            }
        },
        {
            "id": "G-21-20",
            "label": "21|20",
            "type": "gondola",
            "p1": [
                1221.4372486118048,
                500
            ],
            "p2": [
                1221.4372486118048,
                200
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "4359",
                    "category": "combined crisps & snacks",
                    "side": "L"
                },
                {
                    "bay": "4359",
                    "category": "combined crisps & snacks",
                    "side": "L"
                },
                {
                    "bay": "4119",
                    "category": "new & innovative",
                    "side": "R"
                },
                {
                    "bay": "2047",
                    "category": "world lager",
                    "side": "R"
                },
                {
                    "bay": "4220",
                    "category": "bottled & canned lager",
                    "side": "R"
                },
                {
                    "bay": "3826",
                    "category": "Beer Promo",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "SH2835B",
                    "label": "double bay impulse 2a promo",
                    "name": "Double Bay Impulse 2A Promo"
                },
                "frontLeft": {
                    "code": "2890",
                    "label": "g&i2a",
                    "name": "G&I 2A"
                },
                "frontRight": {
                    "code": "625",
                    "label": "bar accs",
                    "name": "Bar Accs"
                },
                "back": {
                    "code": "2855",
                    "label": "grocery & impulse 7B promo",
                    "name": "G&I 7B Promo"
                },
                "backLeft": {
                    "code": "22",
                    "label": "ship",
                    "name": "Ship"
                },
                "backRight": {
                    "code": "3694",
                    "label": "ship 2",
                    "name": "Ship 2"
                }
            }
        },
        {
            "id": "G-20-19",
            "label": "20|19",
            "type": "gondola",
            "p1": [
                1301.4372486118048,
                499.5353885374916
            ],
            "p2": [
                1301.4372486118048,
                199.5353885374916
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "2046",
                    "category": "bitter, ales & craft stout",
                    "side": "L"
                },
                {
                    "bay": "384",
                    "category": "cider",
                    "side": "L"
                },
                {
                    "bay": "1024",
                    "category": "spirits",
                    "side": "R"
                },
                {
                    "bay": "3755",
                    "category": "gifting & party drinks",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2640",
                    "label": "BWS pallet promo 2",
                    "name": "BWS Pallet Promo 2"
                },
                "frontLeft": {
                    "code": "2509",
                    "label": "bws",
                    "name": "BWS"
                },
                "frontRight": {
                    "code": "2503",
                    "label": "bws",
                    "name": "BWS"
                },
                "back": {
                    "code": "2517",
                    "label": "bws 1 promo",
                    "name": "BWS 1 Promo"
                },
                "backLeft": {
                    "code": "2798",
                    "label": "local spirits",
                    "name": "Local Spirits"
                },
                "backRight": {
                    "code": "2634",
                    "label": "bws 2",
                    "name": "BWS 2"
                }
            }
        },
        {
            "id": "G-19-18",
            "label": "19|18",
            "type": "gondola",
            "p1": [
                1381.4372486118048,
                500
            ],
            "p2": [
                1381.4372486118048,
                215
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "3337",
                    "category": "low alc & stubbs",
                    "side": "L"
                },
                {
                    "bay": "2572",
                    "category": "sparkling & perry",
                    "side": "L"
                },
                {
                    "bay": "3040",
                    "category": "boxed wines & minis",
                    "side": "L"
                },
                {
                    "bay": "592",
                    "category": "fortified",
                    "side": "L"
                },
                {
                    "bay": "1906",
                    "category": "white wine",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2639",
                    "label": "BWS pallet promo 1",
                    "name": "BWS Pallet Promo 1"
                },
                "frontRight": {
                    "code": "2633",
                    "label": "bws",
                    "name": "BWS"
                },
                "backLeft": {
                    "code": "3166",
                    "label": "addition BWS pallet 2",
                    "name": "Addition BWS Pallet 2"
                },
                "backRight": {
                    "code": "3165",
                    "label": "addition BWS pallet 1",
                    "name": "Addition BWS Pallet 1"
                }
            },
            "labelPosition": {
                "x": 7738.4372486118045,
                "y": 350
            }
        },
        {
            "id": "G-18-0",
            "label": "18|0",
            "type": "gondola",
            "p1": [
                1459.156461767112,
                503.52612433222555
            ],
            "p2": [
                1459.156461767112,
                206.3360400974069
            ],
            "aisleWidth": 23.874549053746932,
            "locked": false,
            "sections": [
                {
                    "bay": "1188",
                    "category": "wine promo",
                    "side": "L"
                },
                {
                    "bay": "959",
                    "category": "red wine",
                    "side": "L"
                },
                {
                    "bay": "1905",
                    "category": "red wine",
                    "side": "L"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2518",
                    "label": "bws 2 promo",
                    "name": "BWS 2 Promo"
                },
                "frontLeft": {
                    "code": "2633",
                    "label": "bws",
                    "name": "BWS"
                },
                "back": {
                    "code": "3167",
                    "label": "addition BWS pallet",
                    "name": "Addition BWS"
                },
                "backLeft": {
                    "code": "L",
                    "label": "",
                    "name": "Promo Left"
                }
            }
        },
        {
            "id": "Aisle-16",
            "label": "Aisle 16",
            "type": "aisle",
            "p1": [
                180,
                880
            ],
            "p2": [
                180,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-15",
            "label": "Aisle 15",
            "type": "aisle",
            "p1": [
                240,
                880
            ],
            "p2": [
                240,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-14",
            "label": "Aisle 14",
            "type": "aisle",
            "p1": [
                298.01017544917335,
                880.6665572532347
            ],
            "p2": [
                298.01017544917335,
                580.6665572532347
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-13",
            "label": "Aisle 13",
            "type": "aisle",
            "p1": [
                376.0072212865101,
                880
            ],
            "p2": [
                376.0072212865101,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-12",
            "label": "Aisle 12",
            "type": "aisle",
            "p1": [
                460.6747632606326,
                880
            ],
            "p2": [
                460.6747632606326,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-11",
            "label": "Aisle 11",
            "type": "aisle",
            "p1": [
                538.0052518447346,
                880
            ],
            "p2": [
                538.0052518447346,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-10",
            "label": "Aisle 10",
            "type": "aisle",
            "p1": [
                620.8096005792303,
                880
            ],
            "p2": [
                620.8096005792303,
                580
            ],
            "aisleWidth": 50,
            "locked": false
        },
        {
            "id": "Aisle-9",
            "label": "Aisle 9",
            "type": "aisle",
            "p1": [
                699.205400325817,
                880.5996999818991
            ],
            "p2": [
                699.205400325817,
                580.5996999818991
            ],
            "aisleWidth": 50,
            "locked": false
        },
        {
            "id": "Aisle-8",
            "label": "Aisle 8",
            "type": "aisle",
            "p1": [
                780,
                880
            ],
            "p2": [
                780,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-7",
            "label": "Aisle 7",
            "type": "aisle",
            "p1": [
                845,
                880
            ],
            "p2": [
                845,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-6",
            "label": "Aisle 6",
            "type": "aisle",
            "p1": [
                920,
                880
            ],
            "p2": [
                920,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-70",
            "label": "Aisle 70",
            "type": "aisle",
            "p1": [
                1005,
                880
            ],
            "p2": [
                1005,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-5",
            "label": "Aisle 5",
            "type": "aisle",
            "p1": [
                1095,
                880
            ],
            "p2": [
                1095,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-4",
            "label": "Aisle 4",
            "type": "aisle",
            "p1": [
                1180,
                880
            ],
            "p2": [
                1180,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-3",
            "label": "Aisle 3",
            "type": "aisle",
            "p1": [
                1262,
                880
            ],
            "p2": [
                1262,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-2",
            "label": "Aisle 2",
            "type": "aisle",
            "p1": [
                1350,
                880
            ],
            "p2": [
                1350,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-1",
            "label": "Aisle 1",
            "type": "aisle",
            "p1": [
                1440,
                880
            ],
            "p2": [
                1440,
                580
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-34",
            "label": "Aisle 34",
            "type": "aisle",
            "p1": [
                180,
                500
            ],
            "p2": [
                180,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-33",
            "label": "Aisle 33",
            "type": "aisle",
            "p1": [
                260,
                500
            ],
            "p2": [
                260,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-32",
            "label": "Aisle 32",
            "type": "aisle",
            "p1": [
                340,
                500
            ],
            "p2": [
                340,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-31",
            "label": "Aisle 31",
            "type": "aisle",
            "p1": [
                420,
                500
            ],
            "p2": [
                420,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-30",
            "label": "Aisle 30",
            "type": "aisle",
            "p1": [
                500,
                500
            ],
            "p2": [
                500,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-29",
            "label": "Aisle 29",
            "type": "aisle",
            "p1": [
                580,
                500
            ],
            "p2": [
                580,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-28",
            "label": "Aisle 28",
            "type": "aisle",
            "p1": [
                660,
                500
            ],
            "p2": [
                660,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-27",
            "label": "Aisle 27",
            "type": "aisle",
            "p1": [
                740,
                500
            ],
            "p2": [
                740,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-26",
            "label": "Aisle 26",
            "type": "aisle",
            "p1": [
                820,
                500
            ],
            "p2": [
                820,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-25",
            "label": "Aisle 25",
            "type": "aisle",
            "p1": [
                900,
                500
            ],
            "p2": [
                900,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-24",
            "label": "Aisle 24",
            "type": "aisle",
            "p1": [
                980,
                500
            ],
            "p2": [
                980,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-23",
            "label": "Aisle 23",
            "type": "aisle",
            "p1": [
                1060,
                500
            ],
            "p2": [
                1060,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-22",
            "label": "Aisle 22",
            "type": "aisle",
            "p1": [
                1140,
                500
            ],
            "p2": [
                1140,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-21",
            "label": "Aisle 21",
            "type": "aisle",
            "p1": [
                1220,
                500
            ],
            "p2": [
                1220,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-20",
            "label": "Aisle 20",
            "type": "aisle",
            "p1": [
                1300,
                500
            ],
            "p2": [
                1300,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-19",
            "label": "Aisle 19",
            "type": "aisle",
            "p1": [
                1380,
                500
            ],
            "p2": [
                1380,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Aisle-18",
            "label": "Aisle 18",
            "type": "aisle",
            "p1": [
                1460,
                500
            ],
            "p2": [
                1460,
                200
            ],
            "aisleWidth": 50,
            "locked": true
        },
        {
            "id": "Wall-13-copy-1767099497297",
            "label": "pizza counter",
            "type": "counter",
            "p1": [
                1826.0588322738108,
                178.8687523045727
            ],
            "p2": [
                1919.3155649393084,
                178.8687523045727
            ],
            "aisleWidth": 26.049568530209655,
            "locked": false,
            "sections": [
                {
                    "bay": "1280",
                    "category": "pizza display"
                }
            ],
            "rotation": 45
        },
        {
            "id": "Herbs-Table",
            "label": "Herbs Table",
            "type": "fixture",
            "p1": [
                1659.8914285898811,
                465.7966362745393
            ],
            "p2": [
                1659.8914285898811,
                418.6510381483282
            ],
            "aisleWidth": 37.8544018737889,
            "locked": false,
            "sections": [
                {
                    "bay": "1131",
                    "category": "herbs & ingredients",
                    "side": "L"
                }
            ]
        },
        {
            "id": "Pr1",
            "label": "Produce 1",
            "p1": [
                1820,
                442
            ],
            "p2": [
                1680,
                442
            ],
            "aisleWidth": 43,
            "locked": false,
            "sections": [
                {
                    "bay": "2413",
                    "category": "RTC",
                    "side": "L"
                },
                {
                    "bay": "1151",
                    "category": "onions",
                    "side": "L"
                },
                {
                    "bay": "1326",
                    "category": "potatoes",
                    "side": "R"
                }
            ]
        },
        {
            "id": "Nuts-Stand",
            "label": "Nuts Stand",
            "type": "fixture",
            "p1": [
                1841.62453855985,
                464.1587883017251
            ],
            "p2": [
                1841.62453855985,
                419.1587883017251
            ],
            "aisleWidth": 40,
            "locked": false,
            "sections": [
                {
                    "bay": "933",
                    "category": "produce nuts"
                }
            ]
        },
        {
            "id": "Pr2",
            "label": "Produce 2 (D)",
            "p1": [
                1820,
                545
            ],
            "p2": [
                1657,
                545
            ],
            "aisleWidth": 43,
            "locked": false,
            "sections": [
                {
                    "bay": "1139",
                    "category": "tomatoes",
                    "side": "L"
                },
                {
                    "bay": "1137",
                    "category": "peppers",
                    "side": "R"
                },
                {
                    "bay": "1139",
                    "category": "tomatoes",
                    "side": "R"
                }
            ]
        },
        {
            "id": "Pr3",
            "label": "Produce 3 (C)",
            "p1": [
                1820,
                650
            ],
            "p2": [
                1657,
                650
            ],
            "aisleWidth": 43,
            "locked": false,
            "sections": [
                {
                    "bay": "3338",
                    "category": "tropical fruit",
                    "side": "L"
                },
                {
                    "bay": "1324",
                    "category": "loose & pre-pack bananas",
                    "side": "R"
                }
            ]
        },
        {
            "id": "Pr4",
            "label": "Produce 4 (B)",
            "p1": [
                1820,
                750
            ],
            "p2": [
                1657,
                750
            ],
            "aisleWidth": 43,
            "locked": false,
            "sections": [
                {
                    "bay": "1140",
                    "category": "loose & pre-pack citrus",
                    "side": "L"
                },
                {
                    "bay": "1140",
                    "category": "loose & pre-pack citrus",
                    "side": "R"
                },
                {
                    "bay": "1824",
                    "category": "combined apples & pears",
                    "side": "R"
                }
            ]
        },
        {
            "id": "Produce-Bin-1",
            "label": "Produce Bin 1",
            "type": "fixture",
            "p1": [
                1675.6228622947979,
                880.4573155761174
            ],
            "p2": [
                1642.1559497456653,
                880.4573155761174
            ],
            "aisleWidth": 38.362725961001615,
            "locked": false,
            "sections": [
                {
                    "bay": "3618",
                    "category": "produce bin 1"
                }
            ]
        },
        {
            "id": "Pr5",
            "label": "combined apples & pears",
            "p1": [
                1828.364018115346,
                848.3640181153459
            ],
            "p2": [
                1645.988534402703,
                848.3640181153459
            ],
            "aisleWidth": 23.271963769308286,
            "locked": false,
            "sections": [
                {
                    "bay": "1826",
                    "category": "combined apples & pears",
                    "side": "L"
                }
            ]
        },
        {
            "id": "Produce-Bin-2",
            "label": "Produce Bin 2",
            "type": "fixture",
            "p1": [
                1827.4880642589744,
                880
            ],
            "p2": [
                1789.2094863904767,
                880
            ],
            "aisleWidth": 40,
            "locked": false,
            "sections": [
                {
                    "bay": "3620",
                    "category": "produce bin 2"
                }
            ]
        },
        {
            "id": "Pr5-copy-1767355006304",
            "label": "Produce 5 (A) (copy)",
            "p1": [
                1787.2026797978897,
                872.7973202021103
            ],
            "p2": [
                1678.3599718363012,
                872.7973202021103
            ],
            "aisleWidth": 25.594640404220627,
            "locked": false,
            "sections": [
                {
                    "bay": "2665",
                    "category": "produce FOS 1",
                    "side": "L"
                },
                {
                    "bay": "2666",
                    "category": "produce FOS 2",
                    "side": "L"
                },
                {
                    "bay": "2667",
                    "category": "produce FOS 3",
                    "side": "L"
                }
            ]
        },
        {
            "id": "Wall-16",
            "label": "Wall 16",
            "type": "chilled",
            "p1": [
                1927.3697650948957,
                498.04316573853987
            ],
            "p2": [
                1927.3697650948957,
                867.6302349051043
            ],
            "aisleWidth": 24.739530189791367,
            "locked": false,
            "sections": [
                {
                    "bay": "1145",
                    "category": "green veg"
                },
                {
                    "bay": "924",
                    "category": "prep veg"
                },
                {
                    "bay": "1152",
                    "category": "exotic veg"
                },
                {
                    "bay": "923",
                    "category": "prep fruit & melon"
                },
                {
                    "bay": "3353",
                    "category": "soft fruit exc tropical"
                }
            ]
        },
        {
            "id": "MVG",
            "label": "MVG",
            "type": "gondola",
            "p1": [
                1203.996186347423,
                1213.3079040201842
            ],
            "p2": [
                1203.996186347423,
                757.4215531732992
            ],
            "aisleWidth": 20,
            "locked": false,
            "sections": [
                {
                    "bay": "1534",
                    "category": "cards"
                },
                {
                    "bay": "845",
                    "category": "chart books"
                },
                {
                    "bay": "2372",
                    "category": "combined mvg"
                },
                {
                    "bay": "1536",
                    "category": "stationery"
                }
            ],
            "promoEnds": {},
            "rotation": 90
        },
        {
            "id": "FTG",
            "label": "FTG",
            "type": "chilled",
            "p1": [
                1325.48888868251,
                1112.6933722734934
            ],
            "p2": [
                1325.48888868251,
                901.2187587901658
            ],
            "aisleWidth": 20,
            "locked": false,
            "sections": [
                {
                    "bay": "3",
                    "category": "Hot food to go"
                },
                {
                    "bay": "",
                    "category": "FTG Sandwiches"
                },
                {
                    "bay": "",
                    "category": "FTG Drinks"
                }
            ],
            "promoEnds": {},
            "rotation": 90
        },
        {
            "id": "self scan",
            "label": "self scan checkouts",
            "type": "gondola",
            "p1": [
                736.0440610894532,
                1174.3137495700619
            ],
            "p2": [
                736.0440610894532,
                797.4673906922644
            ],
            "aisleWidth": 20,
            "locked": false,
            "sections": [
                {
                    "bay": "",
                    "category": "Checkouts - Confec"
                },
                {
                    "bay": "2",
                    "category": "Checkouts - Crisps"
                },
                {
                    "bay": "3",
                    "category": "Checkouts - H&B"
                },
                {
                    "bay": "4",
                    "category": "Checkouts - H&L"
                },
                {
                    "bay": "5",
                    "category": "Checkouts - Household"
                },
                {
                    "bay": "6",
                    "category": "Checkouts - Nutmeg"
                },
                {
                    "bay": "7",
                    "category": "Checkouts - Pet"
                },
                {
                    "bay": "8",
                    "category": "CategoryCheckouts - Reusable Bags"
                },
                {
                    "bay": "9",
                    "category": "Checkouts - Seasonal Confec"
                },
                {
                    "bay": "10",
                    "category": "Checkouts - Soft Drinks"
                }
            ],
            "promoEnds": {},
            "rotation": 90
        },
        {
            "id": "checkouts",
            "label": "checkouts",
            "type": "gondola",
            "p1": [
                338.33865502179464,
                1151.674240068571
            ],
            "p2": [
                338.33865502179464,
                831.5528370833991
            ],
            "aisleWidth": 30,
            "locked": false,
            "sections": [
                {
                    "bay": "",
                    "category": "checkouts"
                }
            ],
            "promoEnds": {},
            "rotation": 90
        },
        {
            "id": "Kiosk",
            "label": "Kiosk",
            "type": "gondola",
            "p1": [
                1083.378072231806,
                1096.4046126159747
            ],
            "p2": [
                1083.378072231806,
                918.8539895583224
            ],
            "aisleWidth": 20,
            "locked": false,
            "sections": [
                {
                    "bay": "10",
                    "category": "Checkouts - Kiosk"
                },
                {
                    "bay": "2",
                    "category": "Checkouts - Vape"
                },
                {
                    "bay": "4",
                    "category": "Checkouts - Crisps"
                }
            ],
            "promoEnds": {},
            "rotation": 90
        },
        {
            "id": "G-18-0-copy-1767369433467",
            "label": "18|0 (copy)",
            "type": "gondola",
            "p1": [
                1496.2200548625278,
                504.39647510165656
            ],
            "p2": [
                1496.2200548625278,
                204.39647510165656
            ],
            "aisleWidth": 20,
            "locked": false,
            "sections": [
                {
                    "bay": "4976",
                    "category": "chilled bws meals",
                    "side": "R"
                },
                {
                    "bay": "526",
                    "category": "dips",
                    "side": "R"
                },
                {
                    "bay": "2424",
                    "category": "speciality cheese",
                    "side": "R"
                },
                {
                    "bay": "2425",
                    "category": "grated, sliced & block cheese",
                    "side": "R"
                },
                {
                    "bay": "1638",
                    "category": "snacking cheese",
                    "side": "R"
                }
            ],
            "promoEnds": {
                "front": {
                    "code": "2518",
                    "label": "bws 2 promo",
                    "name": "BWS 2 Promo"
                },
                "back": {
                    "code": "3167",
                    "label": "addition BWS pallet",
                    "name": "Addition BWS"
                },
                "frontRight": {
                    "code": "R",
                    "label": "",
                    "name": "Promo Right"
                }
            }
        },
        {
            "id": "Flowers-BG",
            "label": "Flowers BG",
            "type": "gondola",
            "p1": [
                1793.4357623450132,
                1033.7387408639865
            ],
            "p2": [
                1713.4357623450132,
                1033.7387408639865
            ],
            "aisleWidth": 40,
            "locked": false,
            "sections": [
                {
                    "bay": "1478",
                    "category": "flowers"
                },
                {
                    "bay": "1478",
                    "category": "flowers"
                },
                {
                    "bay": "1478",
                    "category": "flowers"
                },
                {
                    "bay": "1478",
                    "category": "flowers"
                }
            ]
        },
        {
            "id": "Plants-BF",
            "label": "Plants BF",
            "type": "fixture",
            "p1": [
                1831.9654937374967,
                1129.0434353574285
            ],
            "p2": [
                1695.9790079191612,
                1129.0434353574285
            ],
            "aisleWidth": 23.0500409865067,
            "locked": false,
            "sections": [
                {
                    "bay": "913",
                    "category": "plants"
                }
            ]
        },
        {
            "id": "Plants-BE",
            "label": "Plants BE",
            "type": "fixture",
            "p1": [
                1849.9901502791095,
                1094.9610298933933
            ],
            "p2": [
                1947.2190192583967,
                1094.9610298933933
            ],
            "aisleWidth": 17.27641377627606,
            "locked": false,
            "sections": [
                {
                    "bay": "913",
                    "category": "plants"
                }
            ],
            "rotation": 328.0290944394575
        },
        {
            "id": "Mobile-Bread-Unit",
            "label": "Mobile Bread",
            "type": "fixture",
            "p1": [
                1625.887554151554,
                879.7019192501091
            ],
            "p2": [
                1640.5610090011448,
                879.7019192501091
            ],
            "aisleWidth": 34.131731932743605,
            "locked": false,
            "sections": [
                {
                    "bay": "3443",
                    "category": "mobile bread unit"
                }
            ]
        },
        {
            "id": "WIGIG",
            "label": "wigig pallets",
            "type": "front",
            "p1": [
                1738.2324970294085,
                350.9694127469185
            ],
            "p2": [
                1738.2324970294085,
                287.2960183312708
            ],
            "aisleWidth": 176.3264259016587,
            "locked": false,
            "sections": [
                {
                    "bay": "1",
                    "category": "Wigig 1",
                    "side": "R"
                },
                {
                    "bay": "2",
                    "category": "Wigig 2",
                    "side": "R"
                },
                {
                    "bay": "3",
                    "category": "Wigig 3",
                    "side": "R"
                },
                {
                    "bay": "4",
                    "category": "Wigig 4",
                    "side": "L"
                },
                {
                    "bay": "5",
                    "category": "Wigig 5",
                    "side": "L"
                },
                {
                    "bay": "6",
                    "category": "Wigig 6",
                    "side": "L"
                }
            ],
            "rotation": 0,
            "promoEnds": {}
        }
    ],
    "points": [],
    "layout": {
        "W": 1832,
        "H": 1092
    }
};
