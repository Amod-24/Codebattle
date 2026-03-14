/**
 * Unit tests for the Judge engine.
 * Tests query processing, answer validation, attempt tracking, and query limits.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createSession,
  createSessionWithSecret,
  processInput,
  getSessionStatus,
} from '../judge.js';
import { getProblemById } from '../problems.js';

describe('Judge Engine', () => {
  let problem;
  let session;

  beforeEach(() => {
    problem = getProblemById('binary-search-1');
    session = createSessionWithSecret(problem, 42);
  });

  describe('createSession', () => {
    it('should create a session with correct defaults', () => {
      expect(session.problemId).toBe('binary-search-1');
      expect(session.secretNumber).toBe(42);
      expect(session.maxQueries).toBe(7);
      expect(session.maxAttempts).toBe(2);
      expect(session.currentAttempt).toBe(1);
      expect(session.queriesUsed).toBe(0);
      expect(session.isFinished).toBe(false);
      expect(session.won).toBe(false);
    });

    it('should generate a random secret between 1 and 100', () => {
      const randomSession = createSession(problem);
      expect(randomSession.secretNumber).toBeGreaterThanOrEqual(1);
      expect(randomSession.secretNumber).toBeLessThanOrEqual(100);
    });
  });

  describe('processInput - Queries', () => {
    it('should return TOO_LOW when guess is less than secret', () => {
      const result = processInput(session, '? 20');
      expect(result.type).toBe('response');
      expect(result.message).toBe('TOO_LOW');
      expect(session.queriesUsed).toBe(1);
    });

    it('should return TOO_HIGH when guess is greater than secret', () => {
      const result = processInput(session, '? 80');
      expect(result.type).toBe('response');
      expect(result.message).toBe('TOO_HIGH');
    });

    it('should return CORRECT when guess equals secret', () => {
      const result = processInput(session, '? 42');
      expect(result.type).toBe('info');
      expect(result.message).toContain('CORRECT');
    });

    it('should increment query counter on valid query', () => {
      processInput(session, '? 50');
      processInput(session, '? 25');
      expect(session.queriesUsed).toBe(2);
      expect(session.totalQueriesUsed).toBe(2);
    });

    it('should reject query with invalid number', () => {
      const result = processInput(session, '? abc');
      expect(result.type).toBe('error');
      expect(result.message).toContain('Invalid');
      expect(session.queriesUsed).toBe(0);
    });

    it('should reject query with out-of-range number', () => {
      const result = processInput(session, '? 150');
      expect(result.type).toBe('error');
      expect(session.queriesUsed).toBe(0);
    });

    it('should enforce query limit', () => {
      for (let i = 0; i < 7; i++) {
        processInput(session, `? ${i + 1}`);
      }
      const result = processInput(session, '? 50');
      expect(result.type).toBe('error');
      expect(result.message).toContain('Query limit');
    });
  });

  describe('processInput - Answers', () => {
    it('should accept correct answer', () => {
      const result = processInput(session, '! 42');
      expect(result.type).toBe('success');
      expect(session.isFinished).toBe(true);
      expect(session.won).toBe(true);
    });

    it('should reject wrong answer and decrement attempts', () => {
      const result = processInput(session, '! 50');
      expect(result.type).toBe('error');
      expect(session.currentAttempt).toBe(2);
      expect(session.isFinished).toBe(false);
    });

    it('should end game after all attempts exhausted', () => {
      processInput(session, '! 50'); // Wrong, attempt 1 used
      const result = processInput(session, '! 60'); // Wrong, attempt 2 used
      expect(result.type).toBe('error');
      expect(session.isFinished).toBe(true);
      expect(session.won).toBe(false);
    });

    it('should reset queries on wrong attempt', () => {
      processInput(session, '? 50');
      processInput(session, '? 25');
      expect(session.queriesUsed).toBe(2);
      processInput(session, '! 50'); // Wrong answer
      expect(session.queriesUsed).toBe(0); // Reset for new attempt
    });

    it('should reject invalid answer format', () => {
      const result = processInput(session, '! abc');
      expect(result.type).toBe('error');
      expect(result.message).toContain('Invalid');
    });
  });

  describe('processInput - Invalid commands', () => {
    it('should reject unknown commands', () => {
      const result = processInput(session, 'hello world');
      expect(result.type).toBe('error');
      expect(result.message).toContain('Invalid command');
    });

    it('should reject input after game is finished', () => {
      processInput(session, '! 42'); // Win the game
      const result = processInput(session, '? 50');
      expect(result.type).toBe('error');
      expect(result.message).toContain('already over');
    });
  });

  describe('getSessionStatus', () => {
    it('should return correct initial status', () => {
      const status = getSessionStatus(session);
      expect(status.queriesUsed).toBe(0);
      expect(status.queriesRemaining).toBe(7);
      expect(status.currentAttempt).toBe(1);
      expect(status.attemptsRemaining).toBe(2);
      expect(status.isFinished).toBe(false);
      expect(status.won).toBe(false);
    });

    it('should update after queries', () => {
      processInput(session, '? 50');
      processInput(session, '? 25');
      const status = getSessionStatus(session);
      expect(status.queriesUsed).toBe(2);
      expect(status.queriesRemaining).toBe(5);
    });
  });
});
