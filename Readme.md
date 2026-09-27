File tree (new/changed files)
text
frontend/src/
├── App.tsx                          ← rewritten (thin shell)
├── App.css                          ← rewritten (shell bg + main grid)
├── index.css                        ← rewritten (theme vars, reset, shared)
├── hooks/
│   ├── useGameState.ts              ← updated (moves counter)
│   └── useTimer.ts                  ← NEW
├── components/
│   ├── Layout/
│   │   ├── TopBar.tsx               ← NEW
│   │   ├── TopBar.css               ← NEW
│   │   ├── Footer.tsx               ← NEW
│   │   └── Footer.css               ← NEW
│   ├── Navigation/
│   │   ├── LevelNav.tsx             ← NEW
│   │   └── LevelNav.css             ← NEW
│   ├── Board/
│   │   ├── Board.tsx                ← NEW
│   │   └── Board.css                ← NEW
│   ├── HUD/
│   │   ├── InfoPanel.tsx            ← NEW
│   │   └── InfoPanel.css            ← NEW
│   ├── Controls/
│   │   ├── ControlsPanel.tsx        ← NEW
│   │   ├── ControlsPanel.css        ← NEW
│   │   ├── DPad.tsx                 ← MOVED from components/, restyled
│   │   └── KeyboardHint.tsx         ← NEW
│   ├── Congrats/                    ← keep as-is
│   └── ConnectionError/             ← keep as-is
Delete: frontend/src/components/DPad.tsx (moved into Controls/).