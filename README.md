# Grassroots FC

An Expo React Native starter for a UK grassroots football mobile app.

## Product Direction

The first release should give grassroots coaches practical tools that make planning and running a team easier:

- even game-time planning across a squad
- quick rotation planning for substitutions and positions
- session planning, attendance, and equipment checklists
- simple coach-to-parent communication when needed

The current interface is only a visual starting point. The first purpose-built tools should be:

- `Game Time`: fair and explainable substitution allocations
- `Rotations`: position and substitute plans across periods
- `Sessions`: training plans and attendance
- `Coach Kit`: small, reusable pitch-side utilities

## Tech Choice

This project uses Expo with React Native and TypeScript because it is the fastest path to a cross-platform MVP for iPhone and Android.

The dependency versions are aligned to Expo's current official `create-expo-app` baseline for SDK 57.

## Local Setup

Node.js and npm are installed locally. Install dependencies and start the app with:

```bash
npm install
npx expo start
```

Useful follow-up commands:

```bash
npm run ios
npm run android
npm run web
npm run typecheck
```

If you want to test on a phone immediately with the App Store version of Expo Go, note that Expo's docs currently say Expo Go on the stores still matches SDK 54. This starter is on SDK 57, so local emulator/simulator use or a development build is the cleaner path.

## Suggested MVP Roadmap

1. Build the even game-time calculator as the first fully working tool.
2. Add position-aware rotations and a saved squad profile.
3. Build session planning and attendance tools.
4. Add sign-in and synced coach data once the core tools are proven.
5. Add optional parent communication and club features without making them the product centre.
