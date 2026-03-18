/**
 * Integration tests for CodeBattle.
 * Tests the interaction between judge engine and problem definitions.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getProblemById, getAllProblems, validateProblem } from '../../src/engine/problems.js';
import {
  createSessionWithSecret,
  processInput,
  getSessionStatus,
} from '../../src/engine/judge.js';

describe('Integration: Judge + Problems', () => {
  describe('Full game flow - Binary Search', () => {
    let problem;
    let session;

    beforeEach(() => {
      problem = getProblemById('binary-search-1');
      session = createSessionWithSecret(problem, 73);
    });

    it('should complete a successful binary search game', () => {
      // Simulate binary search: secret is 73
      let result = processInput(session, '? 50');
      expect(result.message).toBe('TOO_LOW');

      result = processInput(session, '? 75');
      expect(result.message).toBe('TOO_HIGH');

      result = processInput(session, '? 63');
      expect(result.message).toBe('TOO_LOW');

      result = processInput(session, '? 69');
      expect(result.message).toBe('TOO_LOW');

      result = processInput(session, '? 72');
      expect(result.message).toBe('TOO_LOW');

      result = processInput(session, '? 73');
      expect(result.message).toContain('CORRECT');

      // Submit answer
      result = processInput(session, '! 73');
      expect(result.type).toBe('success');
      expect(session.won).toBe(true);
      expect(session.isFinished).toBe(true);
    });

    it('should handle failed first attempt and successful second attempt', () => {
      // First attempt: wrong answer
      processInput(session, '? 50');
      const wrongResult = processInput(session, '! 50');
      expect(wrongResult.type).toBe('error');
      expect(session.currentAttempt).toBe(2);
      expect(session.queriesUsed).toBe(0); // Reset for new attempt

      // Second attempt: correct answer
      processInput(session, '? 73');
      const correctResult = processInput(session, '! 73');
      expect(correctResult.type).toBe('success');
      expect(session.won).toBe(true);
    });

    it('should handle complete failure scenario', () => {
      // Both attempts wrong
      processInput(session, '! 10'); // Wrong attempt 1
      const result = processInput(session, '! 20'); // Wrong attempt 2
      expect(result.type).toBe('error');
      expect(session.isFinished).toBe(true);
      expect(session.won).toBe(false);
    });
  });

  describe('Session status tracking', () => {
    it('should accurately track queries across interactions', () => {
      const problem = getProblemById('binary-search-1');
      const session = createSessionWithSecret(problem, 50);

      let status = getSessionStatus(session);
      expect(status.queriesUsed).toBe(0);
      expect(status.queriesRemaining).toBe(7);

      processInput(session, '? 25');
      processInput(session, '? 75');
      processInput(session, '? 50');

      status = getSessionStatus(session);
      expect(status.queriesUsed).toBe(3);
      expect(status.queriesRemaining).toBe(4);
    });
  });

  describe('All problems are valid', () => {
    it('should validate all problem definitions', () => {
      const allProblems = getAllProblems();
      allProblems.forEach((problem) => {
        expect(validateProblem(problem)).toBe(true);
      });
    });

    it('should create valid sessions for all problems', () => {
      const allProblems = getAllProblems();
      allProblems.forEach((problem) => {
        const session = createSessionWithSecret(problem, 50);
        expect(session.problemId).toBe(problem.id);
        expect(session.maxQueries).toBe(problem.maxQueries);
        expect(session.maxAttempts).toBe(problem.maxAttempts);
      });
    });
  });
});
