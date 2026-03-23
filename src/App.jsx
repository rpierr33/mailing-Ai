import { useReducer } from 'react';
import { reducer, initialState } from './utils/reducer';
import Layout from './components/Layout';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import Audience from './components/Audience';
import TemplateBuilder from './components/TemplateBuilder';
import Automations from './components/Automations';
import Reports from './components/Reports';
import Settings from './components/Settings';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const views = {
    dashboard: Dashboard,
    campaigns: Campaigns,
    audience: Audience,
    templates: TemplateBuilder,
    automations: Automations,
    reports: Reports,
    settings: Settings,
  };

  const CurrentView = views[state.currentView] || Dashboard;

  return (
    <>
      <Layout state={state} dispatch={dispatch}>
        <CurrentView state={state} dispatch={dispatch} />
      </Layout>
      <Toast notifications={state.notifications} dispatch={dispatch} />
      <ConfirmDialog dialog={state.confirmDialog} dispatch={dispatch} />
    </>
  );
}
