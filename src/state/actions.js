export const CHANGE_SECTION = 'CHANGE_SECTION';

export function changeSection(newSection) {
  return {
    type: CHANGE_SECTION,
    section: newSection
  };
}
