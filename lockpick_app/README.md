# Starfield Lockpicking Game

Welcome to the Starfield Lockpicking Game! This Flutter app game is inspired by Bethesda's Starfield and features a unique lockpicking minigame. In this game, players must pick locks using a series of radial keys with varying radii, all with the same binary N-length key. The goal is to rotate and align the binary keys to access the lock's layers, with locks potentially having multiple layers.

## Table of Contents

1. [Introduction](#introduction)
   - [Overview](#overview)
   - [Key Features](#key-features)

2. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Account Creation](#account-creation)
   - [Game Controls](#game-controls)

3. [Gameplay](#gameplay)
   - [Radial Lockpicking](#radial-lockpicking)
   - [Tutorial Levels](#tutorial-levels)
   - [Daily Challenges](#daily-challenges)
   - [Campaign/Provided Levels](#campaignprovided-levels)
   - [Lockpicking Tools](#lockpicking-tools)
   - [Scoring System](#scoring-system)

4. [Customization](#customization)
   - [Difficulty Settings](#difficulty-settings)
   - [Binary Key Length](#binary-key-length)
   - [Cosmetic Skins](#cosmetic-skins)
   - [Level Editor](#level-editor)
   - [Level Generator](#level-generator)

5. [Competitive Play](#competitive-play)
   - [Competitive Leaderboards](#competitive-leaderboards)
   - [Matchmaking Rating (MMR)](#matchmaking-rating-mmr)
   - [Competitive Challenges](#competitive-challenges)

6. [Daily Challenge Calendar](#daily-challenge-calendar)
   - [Calendar View](#calendar-view)
   - [Daily Challenge Rewards](#daily-challenge-rewards)
   - [Streaks and Achievements](#streaks-and-achievements)

7. [Items and Subscriptions](#items-and-subscriptions)
   - [Lockpicking Tools](#lockpicking-tools)
   - [Custom Lock Designs](#custom-lock-designs)
   - [In-Game Currency](#in-game-currency)
   - [Cosmetic Skins](#cosmetic-skins)
   - [Ad Removal](#ad-removal)
   - [Daily Challenge Booster](#daily-challenge-booster)
   - [Level Editor Pro](#level-editor-pro)
   - [Premium Membership](#premium-membership)
   - [Unlock All Levels](#unlock-all-levels)
   - [Competitive Play Pass](#competitive-play-pass)
   - [Weekly Challenges Club](#weekly-challenges-club)
   - [VIP Membership](#vip-membership)

8. [Shop and Payments](#shop-and-payments)
   - [In-Game Shop](#in-game-shop)
   - [Payment Options](#payment-options)
   - [Subscriptions](#subscriptions)
   - [Pricing Details](#pricing-details)

9. [Profile and Progress](#profile-and-progress)
   - [Player Stats](#player-stats)
   - [Match History](#match-history)
   - [MMR Rating](#mmr-rating)
   - [Achievements](#achievements)

10. [Settings](#settings)
    - [Audio Settings](#audio-settings)
    - [Controls](#controls)
    - [Graphics](#graphics)
    - [Account Preferences](#account-preferences)

11. [Help and Support](#help-and-support)
    - [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
    - [Contact Support](#contact-support)
    - [Community Forums](#community-forums)

12. [Development Roadmap](#development-roadmap)
    - [Milestones and Progress](#milestones-and-progress)
    - [Future Updates](#future-updates)

13. [Legal](#legal)
    - [Terms of Service](#terms-of-service)
    - [Privacy Policy](#privacy-policy)
    - [Licensing Information](#licensing-information)

14. [Acknowledgments](#acknowledgments)
    - [Credits and Thanks](#credits-and-thanks)

15. [Appendices](#appendices)
    - [Glossary](#glossary)
    - [Troubleshooting](#troubleshooting)
    - [Reporting Bugs](#reporting-bugs)

## Game Overview

Describe the game in more detail, including its objective, gameplay mechanics, and any unique features that set it apart from other lockpicking games.

## Game State

### Game Level State
- **Difficulty Type:** Describe the types of difficulty levels available.
- **MMR Rating Value:** Explain how the MMR rating system works in the game.
- **Locks Array:** An array of binary strings or numbers representing the lock configurations.
- **Keys Array:** The current level's available moves or keys.

## Tutorial Levels

The first 20 levels of the game serve as tutorials to help players learn the game mechanics and build their skills. The tutorial "level-map" is a UI view that shows a hexagonal grid where, starting at the outside, it runs counterclockwise to fill a hexagonal circle made of 20 nodes, with the center node representing the last level of the tutorial.

## Gameplay Mechanics

### MVP Gameplay Types
1. **Daily Challenge:** Includes Beginner/Novice/Advanced/Expert/Master/Elite levels or puzzles.
2. **Campaign/Provided Levels:** Various levels per difficulty that expand outside of the tutorial grid's radius.

### Board Level
- Display concentric "radial locks" and a limited list of "radial keys."
- A key can pick a lock if their binary representations sum up to the maximum value where every digit is 1.

### Key Rotation
- Keys can be "rotated" where every digit is shifted left or right with wrapping.
- Players can drag vertically or horizontally to rotate the currently selected key.

### Drawer UI
- Implement a grid view of all remaining moves.
- Emphasize the currently selected key.
- Allow players to swipe to access the drawer and tap a key to change the currently selected key.


The `HexagonBoard` starts with a center hexagon representing the initial levels, which we can denote as "0-1" to signify the starting point. As players progress through these levels, the board expands with additional layers, each containing hexagons representing higher difficulty levels.

- **Radius 1 Levels (1-1 to 1-6):**
  - When players complete the center level "0-1," they unlock the first layer of hexagons, which we refer to as "Radius 1 Levels." These levels are represented as "1-1," "1-2," "1-3," "1-4," "1-5," and "1-6," with each hexagon offering a unique lockpicking challenge.

- **Radius 2 Levels (2-1 to 2-12):**
  - As players conquer the Radius 1 Levels, they unlock the second layer of hexagons, known as "Radius 2 Levels." This layer includes 12 hexagons, representing levels "2-1" to "2-12."

- **Continued Growth:**
  - The growth of the `HexagonBoard` continues with each successive radius, introducing more complex and challenging lockpicking levels for players to complete. The campaign levels expand in a spiral pattern, creating an ever-increasing set of possibilities.

## Campaign Progression and Difficulty
- Players progress through campaign levels by successfully unlocking and completing each hexagon on the `HexagonBoard`.
- The difficulty of levels increases as players move away from the center hexagon, with higher radii representing greater challenges.
- The game's progression system encourages players to hone their lockpicking skills, adapt to more intricate puzzles, and ultimately become master lockpickers.

The dynamic growth of the `HexagonBoard` and the representation of campaign levels as hexagons create an engaging and ever-expanding gameplay experience for players in the Starfield Lockpicking Game.

## Difficulty

To assess the difficulty of a given level, we use a heuristic that takes into account several key factors:

- **Number of Locks:** The total number of locks in the level contributes to the base difficulty score. Each lock adds 10 points to the base difficulty.

- **Number of Keys:** The availability of keys in relation to the number of locks is considered. If there are fewer keys than locks, the difficulty increases, with each missing key adding 5 points.

- **Binary Key Length:** The length of the binary key for the level also influences the difficulty. Longer binary keys add 2 points for each digit.

The heuristic calculates a total difficulty rating by combining these factors. The higher the calculated difficulty rating, the more challenging the level is considered to be.

You can fine-tune the weights and factors in this heuristic to align with your game's design and balance.

## MMR Calculation

The player's MMR (Matchmaking Rating) is crucial for competitive gameplay and fair matchmaking. It is calculated based on several factors:

- **Completion Speed:** The time taken by the player to complete levels is considered. Faster completions indicate higher skill levels.

- **Level Difficulty:** The difficulty of the levels completed influences MMR. Successfully completing more challenging levels contributes more to MMR gain.

- **Win/Loss Ratio:** A player's win/loss ratio in multiplayer matches can be factored in. Consistently winning against opponents with similar MMR ratings results in MMR gain.

- **Streaks and Consistency:** Consistency in performance and win streaks can lead to higher MMR gains. On the other hand, losing streaks may result in MMR loss.

- **Performance Metrics:** Metrics such as accuracy, key rotations, and lockpicking efficiency can be tracked and factored into MMR calculation.

- **Dynamic Adjustment:** MMR should dynamically adjust over time as players improve or face different challenges.


## Level Editor (Administrative Feature)

Unlock the power of customization with our built-in Level Editor! This administrative feature empowers you to create, modify, and save your own unique lockpicking levels. Whether you're a game designer looking to craft intricate challenges or a player eager to share your creativity, the Level Editor provides the tools you need.

### Key Features
- **Create Custom Levels:** Design lockpicking levels with ease using our intuitive interface.
- **Edit Existing Levels:** Modify and fine-tune existing levels to suit your preferences or introduce new challenges.
- **Save and Share:** Save your custom levels for personal enjoyment or share them with the Starfield Lockpicking Game community.
- **Test Your Creations:** Playtest your custom levels to ensure they provide the desired level of challenge and enjoyment.
- **Community Contributions:** Discover and enjoy user-created levels, expanding your lockpicking experience beyond the core game.

The Level Editor opens up endless possibilities for creativity and innovation within the Starfield Lockpicking Game. Craft your own unique puzzles, share your creations, and explore the imaginative world of lockpicking challenges!

### How to Use the Level Editor
1. Access the Level Editor from the app's main menu.
2. Use the intuitive tools to create or modify lockpicking levels.
3. Save your custom levels for personal use or sharing with the community.
4. Test and refine your creations to perfection.
5. Enjoy playing and sharing custom levels from other players.

## Competitive Leaderboards

Join the competitive arena and showcase your lockpicking prowess on our Competitive Leaderboards! Compete with players from around the world and see how your results on specific levels or puzzles stack up against the rest of the community. Challenge yourself, climb the ranks, and earn recognition as a lockpicking master.

### Key Features
- **Global Leaderboards:** View global leaderboards to see where you stand among players worldwide.
- **Level-Based Rankings:** Compete on a per-level basis, allowing you to focus on specific challenges.
- **Difficulty Tiers:** Leaderboards are categorized by difficulty, ensuring fair competition against players with similar skill levels.
- **Real-Time Updates:** Results and rankings are updated in real-time, providing immediate feedback on your performance.
- **Historical Data:** Track your progress and compare your results over time to see your improvement.

### How to Compete
1. Complete levels or puzzles in the game to earn scores.
2. Your scores are automatically submitted to the corresponding leaderboards.
3. Check the leaderboards to see your ranking and compare your performance with others.
4. Challenge yourself to climb the ranks and aim for the top spot!

### Rewards and Recognition
- Earn in-game rewards and achievements for achieving top positions on the leaderboards.
- Gain recognition and respect within the Starfield Lockpicking Game community as you establish yourself as a lockpicking champion.

The Competitive Leaderboards add a competitive edge to the game, inviting players to test their skills and strive for greatness. Are you ready to rise through the ranks and become a lockpicking legend?

## Daily Challenge Calendar

Introducing the Daily Challenge Calendar, your gateway to daily lockpicking adventures! This dynamic feature presents a calendar view that offers a unique lockpicking challenge every day. Put your skills to the test, solve the daily puzzles, and earn rewards as you progress through the calendar.

### Key Features
- **Daily Puzzles:** A new lockpicking puzzle awaits you each day, providing fresh challenges to tackle.
- **Calendar View:** Visualize your daily challenges on a calendar grid, making it easy to plan and track your progress.
- **Progression Rewards:** Earn rewards as you complete daily challenges and advance through the calendar.
- **Difficulty Variations:** Daily puzzles span different difficulty levels, ensuring there's something for lockpickers of all skill levels.
- **Compete with the World:** Compare your daily challenge results with players worldwide and strive for the top spots.

### How It Works
1. Open the Daily Challenge Calendar from the main menu.
2. Explore the calendar grid to see the daily lockpicking challenges.
3. Select a challenge to begin.
4. Solve the puzzle and aim to achieve the best score possible.
5. Earn rewards based on your performance and daily progress.

### Rewards and Recognition
- Receive daily rewards for participating in challenges.
- Compete for top rankings on the global leaderboard and earn recognition as a daily lockpicking champion.
- Showcase your consistency and skill by maintaining a streak of daily challenge completions.

## Level Generator (Administrative Feature)

Unlock endless possibilities with our Level Generator! This administrative feature empowers you to create custom lockpicking levels effortlessly, whether you want to challenge players with unique puzzles, build levels based on specific criteria, or expand the campaign with sets of levels.

### Key Features
- **Custom Level Creation:** Create custom lockpicking levels from scratch with full control over lock configurations, key rotations, and more.
- **Criteria-Based Generation:** Generate levels based on specific criteria, including MMR rating, difficulty, binary key length, or the overall length of the solution.
- **Randomized Elements:** Add an element of surprise by incorporating randomization into level generation for dynamic gameplay experiences.
- **Test and Refine:** Playtest generated levels to ensure they provide the desired level of challenge and enjoyment.
- **Save and Publish:** Save and publish your custom or generated levels for personal use, sharing with the community, or inclusion in the Daily Challenge Calendar or campaign.

### How to Use the Level Generator
1. Access the Level Generator from the app's administrative tools.
2. Choose your generation criteria, such as MMR rating, difficulty, binary key length, or solution length.
3. Generate levels based on your selected criteria.
4. Review and modify generated levels as needed.
5. Save, publish, or share your custom or generated levels with the community.

## Development Roadmap

### Milestone 1: Basic Gameplay and UI
- [ ] Implement binary key rotation mechanics.
- [ ] Develop the tutorial level-map UI.
- [ ] Create the UI for the game board.
- [ ] Add initial lock and key mechanics.

### Milestone 2: Tutorial Levels
- [ ] Develop the first 20 tutorial levels with hexagonal locks.
- [ ] Introduce players to the basic lockpicking mechanics.
- [ ] Implement a basic scoring system for tutorial levels.

### Milestone 3: MVP Gameplay
- [ ] Implement Daily Challenge gameplay with multiple difficulty levels.
- [ ] Create Campaign/Provided Levels with expanding difficulty.
- [ ] Add UI for the Drawer to manage keys.
- [ ] Implement a Level Editor, allowing users to create custom levels.
- [ ] Add Competitive Leaderboards to compare results on levels.

### Milestone 4: Payment System and Subscription Options
- [ ] Implement payment and subscription options.
- [ ] Ensure a smooth transition from tutorials to the paid game.

### Milestone 5: Difficulty Settings
- [ ] Add the ability to adjust difficulty settings.
- [ ] Handle binary key length variations.
- [ ] Implement the Difficulty Heuristic for level generation.

### Milestone 6: Competitive Enhancements
- [ ] Expand Competitive Leaderboards with more features and real-time updates.
- [ ] Integrate the MMR rating system into the Competitive Leaderboards.

### Milestone 7: Daily Challenge Calendar
- [ ] Develop the Daily Challenge Calendar feature.
- [ ] Implement a calendar view for daily lockpicking challenges.
- [ ] Add rewards and progression based on daily challenge completions.

### Milestone 8: Level Generator
- [ ] Create the Level Generator administrative feature.
- [ ] Enable criteria-based level generation (e.g., build from rating, difficulty, binary length).
- [ ] Allow users to test and refine generated levels.
- [ ] Provide options to save, publish, and share custom or generated levels.

### Milestone 9: Polish and Bug Fixes
- [ ] Fine-tune gameplay elements.
- [ ] Address any reported bugs or issues.
- [ ] Optimize the game for performance.

### Milestone 10: Additional Features and Expansion
- [ ] Implement more lock types.
- [ ] Enhance the UI for better user experience.
- [ ] Continuously update the Daily Challenge Calendar with new puzzles.
- [ ] Expand the campaign with curated sets of levels.



# Payment Options

Explore the various payment options available in the Starfield Lockpicking Game to enhance your gaming experience and support the development of the game. Choose from a range of items and subscriptions to unlock exclusive features and benefits.

## Items

### 1. Lockpicking Tools
- Description: Unlock different types of lockpicking tools with unique abilities or advantages.
- Examples: "Master Key" that provides hints, shortcuts through difficult locks.
- Price Range: Varies by item.

### 2. Custom Lock Designs
- Description: Personalize your lockpicking experience with custom lock designs.
- Price Range: Varies by design.

### 3. In-Game Currency
- Description: Get in-game currency to purchase hints, power-ups, or skip difficult levels.
- Price Range: Varies by currency package.

### 4. Cosmetic Skins
- Description: Customize the look of keys, locks, and game elements with cosmetic skins.
- Price Range: Varies by skin.

### 5. Ad Removal
- Description: Remove ads from the game for uninterrupted gameplay.
- Price: One-time purchase.

## Subscriptions

### 1. Daily Challenge Booster
- Description: Enhance your daily challenge experience with additional attempts, increased rewards, or exclusive challenges.
- Subscription: Monthly, Yearly.
- Price Range: Varies by subscription duration.

### 2. Level Editor Pro
- Description: Unlock advanced features and tools in the Level Editor, such as complex level creation options or premium assets.
- Subscription: Monthly, Yearly.
- Price Range: Varies by subscription duration.

### 3. Premium Membership
- Description: Enjoy a premium gaming experience with ad removal, exclusive levels, early access to new features, and a monthly allowance of in-game currency.
- Subscription: Monthly, Yearly.
- Price Range: Varies by subscription duration.

### 4. Unlock All Levels
- Description: Unlock all campaign levels, removing the need to complete specific challenges to progress.
- Subscription: Monthly, Yearly.
- Price Range: Varies by subscription duration.

### 5. Competitive Play Pass
- Description: Access enhanced competitive play experiences, including priority access to competitive events, exclusive leaderboards, and additional rewards.
- Subscription: Monthly, Yearly.
- Price Range: Varies by subscription duration.

### 6. Weekly Challenges Club
- Description: Gain access to a set of exclusive weekly challenges with unique rewards.
- Subscription: Monthly, Yearly.
- Price Range: Varies by subscription duration.

### 7. VIP Membership
- Description: Elevate your gaming status with a VIP membership that combines premium benefits with priority customer support, special cosmetic items, and increased rewards.
- Subscription: Monthly, Yearly.
- Price Range: Varies by subscription duration.
