export type ClassKey = 'glioma' | 'meningioma' | 'pituitary' | 'notumor';

export interface ClassInfo {
  key: ClassKey;
  label: string;
  isTumor: boolean;
  /** CSS custom property holding the class color (HSL triplet) */
  colorVar: string;
  description: string;
}

export const CLASS_INFO: Record<ClassKey, ClassInfo> = {
  glioma: {
    key: 'glioma',
    label: 'Glioma',
    isTumor: true,
    colorVar: '--class-glioma',
    description:
      'Gliomas arise from glial cells, the supporting cells of the brain and spinal cord. They vary widely in grade and behaviour, so specialist assessment is essential.',
  },
  meningioma: {
    key: 'meningioma',
    label: 'Meningioma',
    isTumor: true,
    colorVar: '--class-meningioma',
    description:
      'Meningiomas grow from the meninges, the membranes surrounding the brain. They are often slow-growing and frequently benign, but still need clinical follow-up.',
  },
  pituitary: {
    key: 'pituitary',
    label: 'Pituitary tumor',
    isTumor: true,
    colorVar: '--class-pituitary',
    description:
      'Pituitary tumors develop in the pituitary gland at the base of the brain and can affect hormone levels and, when large, vision.',
  },
  notumor: {
    key: 'notumor',
    label: 'No tumor detected',
    isTumor: false,
    colorVar: '--class-notumor',
    description:
      'The model did not find patterns it associates with the three tumor types. This does not rule out other conditions, or a tumor the model was not trained to recognise.',
  },
};

/** Display order for charts */
export const CLASS_ORDER: ClassKey[] = ['glioma', 'meningioma', 'pituitary', 'notumor'];

/** Below this confidence the result is flagged as uncertain */
export const LOW_CONFIDENCE = 0.8;

export const getClassInfo = (key: string): ClassInfo =>
  CLASS_INFO[key as ClassKey] ?? {
    key: key as ClassKey,
    label: key,
    isTumor: false,
    colorVar: '--primary',
    description: '',
  };
