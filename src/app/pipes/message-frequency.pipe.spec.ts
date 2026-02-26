import { MessageFrequencyPipe } from './message-frequency.pipe';
import { describe, expect, it } from 'vitest';

describe('MassageFrequencyPipe', () => {
  it('create an instance', () => {
    const pipe = new MessageFrequencyPipe();
    expect(pipe).toBeTruthy();
  });
});
