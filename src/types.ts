// Store Map Layout Types

export interface MapMeta {
  storeId: number;
  name: string;
  created: string;
  imageSize: [number, number];
}

export interface MapDefaults {
  aisleWidth: number;
  bayWidth: number;
  baysPerSide: number;
  facing: string;
  bayOrder: string;
}

export interface LabelPosition {
  x: number;
  y: number;
}

export interface LabelSize {
  width: number;
  height: number;
}

export interface AisleSection {
  bay: string;
  category: string;
  side?: 'L' | 'R';
}

export interface PromoEndInfo {
  code: string;
  label: string;
  name: string;
}

export interface PromoEnds {
  front?: PromoEndInfo;
  frontLeft?: PromoEndInfo;
  frontRight?: PromoEndInfo;
  back?: PromoEndInfo;
  backLeft?: PromoEndInfo;
  backRight?: PromoEndInfo;
}

export interface Aisle {
  id: string;
  label: string;
  aisleNumber?: number;
  type?: string;
  p1: [number, number];
  p2: [number, number];
  aisleWidth: number;
  bayWidth?: number;
  baysPerSide?: number;
  bayOrder?: string;
  facing?: string;
  rotation?: number; // Rotation angle in degrees (0-360)
  locked: boolean;
  labelPosition?: LabelPosition;
  labelSize?: LabelSize;
  sections?: AisleSection[];
  promoEnds?: PromoEnds;
}

export interface EditorSettings {
  gridEnabled: boolean;
  snapEnabled: boolean;
  gridSize: number; // Grid cell size in pixels
}

export interface MapLayout {
  meta: MapMeta;
  defaults: MapDefaults;
  aisles: Aisle[];
  points?: unknown[];
  layout?: {
    W: number;
    H: number;
  };
  __documentation?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface ViewState {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export type Tool = 'select' | 'pan' | 'add';

// Range Activity Types
export interface RangeActivity {
  date: string;           // "Mon 5th Jan"
  category: string;       // "Baby Foods"
  brief?: string;
  capacityHours: number;  // 1.5
  newLines: number;       // 2
  delistLines: number;    // 4
  reason: string;         // "Branded NPD"
  buyer?: string;
  merchandiser?: string;
  supplyChain?: string;
  implementationGuidance?: string;
  kitRequirements?: string;
}
