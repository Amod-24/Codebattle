/**
 * Problem definitions for CodeBattle.
 * Each problem is an interactive challenge where users query the system.
 */

export const problems = [
  {
    id: 'binary-search-1',
    title: 'Find the Hidden Number',
    difficulty: 'easy',
    tags: ['binary-search', 'interactive'],
    maxQueries: 7,
    maxAttempts: 2,
    statement: {
      description: `You are playing a guessing game with the system. The system has chosen a secret number <code>X</code> hidden in the range <code>[1, 100]</code>. Your goal is to find <code>X</code> by asking queries.`,
      interaction: [
        'You can ask a query by typing: <code>? N</code> where N is a number between 1 and 100.',
        'The system will respond with one of:',
        '<code>TOO_LOW</code> — if N is less than X',
        '<code>TOO_HIGH</code> — if N is greater than X',
        '<code>CORRECT</code> — if N equals X',
      ],
      rules: [
        'You have at most <strong>7 queries</strong> per attempt.',
        'You have <strong>2 attempts</strong> to find the correct answer.',
        'To submit your final answer, type: <code>! N</code> where N is your guess.',
        'If your answer is wrong, you lose one attempt.',
      ],
      hint: 'Think about how binary search narrows down the range by half with each query. With 7 queries, you can search a range of up to 128 numbers!',
    },
    example: [
      { type: 'query', text: '? 50' },
      { type: 'response', text: 'TOO_HIGH' },
      { type: 'query', text: '? 25' },
      { type: 'response', text: 'TOO_LOW' },
      { type: 'query', text: '? 37' },
      { type: 'response', text: 'TOO_LOW' },
      { type: 'query', text: '? 43' },
      { type: 'response', text: 'CORRECT' },
      { type: 'answer', text: '! 43' },
      { type: 'success', text: '✓ Accepted! The hidden number was 43.' },
    ],
  },
];

/**
 * Get a problem by its ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getProblemById(id) {
  return problems.find((p) => p.id === id);
}

/**
 * Get all problems.
 * @returns {Array}
 */
export function getAllProblems() {
  return problems;
}

/**
 * Validate problem data integrity.
 * @param {object} problem
 * @returns {boolean}
 */
export function validateProblem(problem) {
  if (!problem) return false;
  const requiredFields = [
    'id',
    'title',
    'difficulty',
    'tags',
    'maxQueries',
    'maxAttempts',
    'statement',
    'example',
  ];
  return requiredFields.every((field) => problem[field] !== undefined);
}
