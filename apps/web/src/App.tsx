import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CoverPage } from './presentation/pages/CoverPage';
import { EnergyAudit } from './presentation/pages/IndividualTool/EnergyAudit';
import { EnergyDrains } from './presentation/pages/IndividualTool/EnergyDrains';
import { ProtocolDesign } from './presentation/pages/IndividualTool/ProtocolDesign';
import { FirstWin } from './presentation/pages/IndividualTool/FirstWin';
import { ProtocolStrengthAnalyzer } from './presentation/pages/IndividualTool/ProtocolStrengthAnalyzer';
import { Canvas } from './presentation/pages/IndividualTool/Canvas';
import { GuruDashboard } from './presentation/pages/GuruDashboard';
import { TeamMeetingTool } from './presentation/pages/TeamMeetingTool';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/audit" element={<EnergyAudit />} />
          <Route path="/drains" element={<EnergyDrains />} />
          <Route path="/protocol" element={<ProtocolDesign />} />
          <Route path="/first-win" element={<FirstWin />} />
          <Route path="/strength-analyzer" element={<ProtocolStrengthAnalyzer />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/guru" element={<GuruDashboard />} />
          <Route path="/team" element={<TeamMeetingTool />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

