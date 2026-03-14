/**
 * Judge engine for CodeBattle interactive problems.
 * Handles query processing, answer validation, and attempt tracking.
 */

/**
 * Create a new game session for a problem.
 * @param {object} problem - The problem definition
 * @returns {object} A new game session state
 */
export function createSession(problem) {
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  return {
    problemId: problem.id,
    secretNumber,
    maxQueries: problem.maxQueries,
    maxAttempts: problem.maxAttempts,
    currentAttempt: 1,
    queriesUsed: 0,
    totalQueriesUsed: 0,
    isFinished: false,
    won: false,
    history: [],
    lowBound: 1,
    highBound: 100,
  };
}

/**
 * Create a session with a specific secret number (for testing).
 * @param {object} problem
 * @param {number} secretNumber
 * @returns {object}
 */
export function createSessionWithSecret(problem, secretNumber) {
  const session = createSession(problem);
  session.secretNumber = secretNumber;
  return session;
}

/**
 * Process a user input command.
 * Returns { type, message, session } where type is 'response', 'success', 'error', 'info'.
 *
 * @param {object} session - Current game session
 * @param {string} input - User input string
 * @returns {object} Result object
 */
export function processInput(session, input) {
  const trimmed = input.trim();

  if (session.isFinished) {
    return {
      type: 'error',
      message: 'Game is already over. Start a new game to play again.',
      session,
    };
  }

  if (trimmed.startsWith('? ')) {
    return processQuery(session, trimmed);
  } else if (trimmed.startsWith('! ')) {
    return processAnswer(session, trimmed);
  } else {
    return {
      type: 'error',
      message:
        'Invalid command. Use "? N" to query or "! N" to submit your answer.',
      session,
    };
  }
}

/**
 * Process a query command (? N).
 * @param {object} session
 * @param {string} input
 * @returns {object}
 */
function processQuery(session, input) {
  const parts = input.split(' ');
  const num = parseInt(parts[1], 10);

  if (isNaN(num) || num < 1 || num > 100) {
    return {
      type: 'error',
      message: 'Invalid query. N must be a number between 1 and 100.',
      session,
    };
  }

  if (session.queriesUsed >= session.maxQueries) {
    return {
      type: 'error',
      message: `Query limit reached (${session.maxQueries}/${session.maxQueries}). Submit your answer with "! N".`,
      session,
    };
  }

  session.queriesUsed++;
  session.totalQueriesUsed++;

  let response;
  if (num < session.secretNumber) {
    response = 'TOO_LOW';
    session.lowBound = Math.max(session.lowBound, num + 1);
  } else if (num > session.secretNumber) {
    response = 'TOO_HIGH';
    session.highBound = Math.min(session.highBound, num - 1);
  } else {
    response = 'CORRECT';
  }

  session.history.push({ type: 'query', value: num, response });

  if (response === 'CORRECT') {
    return {
      type: 'info',
      message: `${response} — Now submit your answer with "! ${num}"`,
      session,
    };
  }

  return {
    type: 'response',
    message: response,
    session,
    queriesRemaining: session.maxQueries - session.queriesUsed,
  };
}

/**
 * Process an answer submission (! N).
 * @param {object} session
 * @param {string} input
 * @returns {object}
 */
function processAnswer(session, input) {
  const parts = input.split(' ');
  const answer = parseInt(parts[1], 10);

  if (isNaN(answer) || answer < 1 || answer > 100) {
    return {
      type: 'error',
      message: 'Invalid answer. N must be a number between 1 and 100.',
      session,
    };
  }

  if (answer === session.secretNumber) {
    session.isFinished = true;
    session.won = true;
    return {
      type: 'success',
      message: `✓ Correct! The hidden number was ${session.secretNumber}. You found it in ${session.totalQueriesUsed} queries.`,
      session,
    };
  }

  // Wrong answer
  session.currentAttempt++;
  session.history.push({ type: 'answer', value: answer, correct: false });

  if (session.currentAttempt > session.maxAttempts) {
    session.isFinished = true;
    session.won = false;
    return {
      type: 'error',
      message: `✗ Wrong answer! The hidden number was ${session.secretNumber}. No attempts remaining.`,
      session,
    };
  }

  // Reset queries for next attempt
  session.queriesUsed = 0;
  session.lowBound = 1;
  session.highBound = 100;

  return {
    type: 'error',
    message: `✗ Wrong! You have ${session.maxAttempts - session.currentAttempt + 1} attempt(s) remaining. Queries reset to 0/${session.maxQueries}.`,
    session,
    attemptsRemaining: session.maxAttempts - session.currentAttempt + 1,
  };
}

/**
 * Get the current status of a game session.
 * @param {object} session
 * @returns {object}
 */
export function getSessionStatus(session) {
  return {
    queriesUsed: session.queriesUsed,
    queriesRemaining: session.maxQueries - session.queriesUsed,
    currentAttempt: session.currentAttempt,
    attemptsRemaining: session.maxAttempts - session.currentAttempt + 1,
    isFinished: session.isFinished,
    won: session.won,
  };
}
