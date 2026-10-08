import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { PRELIMS_SUBJECTS_SEED } from '../src/data/prelims-seed';
import { MAINS_SUBJECTS_SEED } from '../src/data/mains-seed';
import { OPTIONALS_SUBJECTS_SEED } from '../src/data/optionals-seed';
import { ALL_SYLLABUS_SUBJECTS } from '../src/lib/syllabus/seed-loader';
import { filterUserSyllabusSubjects } from '../src/lib/completion';

describe('Task 11: Complete UPSC Syllabus Tree Depth & Breadth', () => {
  test('Prelims includes Science & Technology and Art & Culture', () => {
    const scitech = PRELIMS_SUBJECTS_SEED.find((s) => s.id === 'prelims.gs1.scitech');
    assert.ok(scitech, 'Prelims must include Science & Technology');
    assert.equal(scitech.stage, 'prelims');
    assert.ok(scitech.topics.length >= 2, 'Science & Tech must have at least 2 topics');
    const scitechSubtopics = scitech.topics.flatMap((t) => t.subtopics);
    assert.ok(scitechSubtopics.some((st) => st.title.toLowerCase().includes('space') || st.title.toLowerCase().includes('isro')));
    assert.ok(scitechSubtopics.some((st) => st.title.toLowerCase().includes('biotechnology') || st.title.toLowerCase().includes('crispr')));

    const artCulture = PRELIMS_SUBJECTS_SEED.find((s) => s.id === 'prelims.gs1.art_culture');
    assert.ok(artCulture, 'Prelims must include Indian Art & Culture');
    assert.equal(artCulture.stage, 'prelims');
    const artSubtopics = artCulture.topics.flatMap((t) => t.subtopics);
    assert.ok(artSubtopics.some((st) => st.title.toLowerCase().includes('architecture') || st.title.toLowerCase().includes('temple')));
  });

  test('Mains includes Essay Paper and Qualifying Papers (Indian Language & English)', () => {
    const essay = MAINS_SUBJECTS_SEED.find((s) => s.id === 'mains.essay');
    assert.ok(essay, 'Mains must include Essay Paper (Paper I)');
    assert.equal(essay.stage, 'mains');
    assert.ok(essay.topics.length >= 2, 'Essay must have philosophical and socio-economic sections');

    const qualLanguage = MAINS_SUBJECTS_SEED.find((s) => s.id === 'mains.qualifying.language');
    assert.ok(qualLanguage, 'Mains must include Compulsory Indian Language Qualifying Paper A');
    assert.equal(qualLanguage.stage, 'mains');

    const qualEnglish = MAINS_SUBJECTS_SEED.find((s) => s.id === 'mains.qualifying.english');
    assert.ok(qualEnglish, 'Mains must include English Language Qualifying Paper B');
    assert.equal(qualEnglish.stage, 'mains');
  });

  test('Optionals seed contains all 26 official UPSC optional subjects', () => {
    const expectedOptionalCodes = [
      'AGRICULTURE',
      'ANIMAL_HUSBANDRY',
      'ANTHROPOLOGY',
      'BOTANY',
      'CHEMISTRY',
      'CIVIL_ENGINEERING',
      'COMMERCE',
      'ECONOMICS',
      'ELECTRICAL_ENGINEERING',
      'GEOGRAPHY',
      'GEOLOGY',
      'HISTORY',
      'LAW',
      'MANAGEMENT',
      'MATHEMATICS',
      'MECHANICAL_ENGINEERING',
      'MEDICAL_SCIENCE',
      'PHILOSOPHY',
      'PHYSICS',
      'PSIR',
      'PSYCHOLOGY',
      'PUBLIC_ADMINISTRATION',
      'SOCIOLOGY',
      'STATISTICS',
      'ZOOLOGY',
      'LITERATURE',
    ];

    assert.equal(OPTIONALS_SUBJECTS_SEED.length, 26, 'Must contain all 26 official UPSC optional subjects');

    for (const code of expectedOptionalCodes) {
      const found = OPTIONALS_SUBJECTS_SEED.find(
        (s) => s.optional_code?.toUpperCase() === code || s.id.toUpperCase().includes(code)
      );
      assert.ok(found, `Optional subject ${code} must be present in optionals seed`);
      assert.equal(found.stage, 'optional');
      assert.ok(found.topics.length >= 2, `${code} must have Paper 1 and Paper 2 topics`);
    }
  });

  test('filterUserSyllabusSubjects narrows optionals to the user selected optional', () => {
    const userPSIR = filterUserSyllabusSubjects(ALL_SYLLABUS_SUBJECTS, 'PSIR (Political Science)');
    const optionalSubjectsPSIR = userPSIR.filter((s) => s.stage === 'optional');
    assert.equal(optionalSubjectsPSIR.length, 1, 'Should filter down to only 1 chosen optional');
    assert.equal(optionalSubjectsPSIR[0].optional_code, 'PSIR');

    const userPubAd = filterUserSyllabusSubjects(ALL_SYLLABUS_SUBJECTS, 'Public Administration');
    const optionalSubjectsPubAd = userPubAd.filter((s) => s.stage === 'optional');
    assert.equal(optionalSubjectsPubAd.length, 1);
    assert.equal(optionalSubjectsPubAd[0].optional_code, 'PUBLIC_ADMINISTRATION');
  });
});
