/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scene } from './components/Scene';
import { HtmlOverlay } from './components/HtmlOverlay';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <main className="relative w-full min-h-screen bg-space-900 text-starlight selection:bg-neon-blue/30 selection:text-white">
      <div className="film-grain"></div>
      <Navbar />
      <Scene />
      <HtmlOverlay />
    </main>
  );
}
