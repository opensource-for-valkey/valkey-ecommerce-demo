import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { openAgentAssistant } from '../utils/openAgentAssistant';

/** Legacy /ai-search URL — opens the floating assistant and redirects home. */
const AgentSearchRedirect = () => {
  useEffect(() => {
    openAgentAssistant();
  }, []);

  return <Navigate to='/' replace />;
};

export default AgentSearchRedirect;
