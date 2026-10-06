import { PRELIMS_SUBJECTS_SEED } from '@/data/prelims-seed';
import { MAINS_SUBJECTS_SEED } from '@/data/mains-seed';
import { OPTIONALS_SUBJECTS_SEED } from '@/data/optionals-seed';
import type { SubjectNode } from '@/types/syllabus';

export * from './rollup-engine';

export const ALL_SYLLABUS_SUBJECTS: SubjectNode[] = [
  ...PRELIMS_SUBJECTS_SEED,
  ...MAINS_SUBJECTS_SEED,
  ...OPTIONALS_SUBJECTS_SEED,
];
