// Returns a clarification prompt the agent surfaces to user.
async function askClarification({ question, options = [] }) {
  return {
    type: 'clarification',
    question,
    options,
  };
}

module.exports = { askClarification };
