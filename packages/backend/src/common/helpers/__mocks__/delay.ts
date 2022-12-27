// DO NOT IMPORT!
// This is a mock function for tests.
// No delay needed for tests.
function delayMock(ms: number): Promise<void> {
  return Promise.resolve();
}

module.exports = {
  delay: delayMock,
};
