export function itWasLastAttempt(step) {
    return step.retries === step.maxAttempts;
}
