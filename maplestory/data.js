/**
 * MapleStory Fish Market Bazaar — Market Data
 * 5 channels, ~23 vendors, 30+ unique items
 */
window.MARKET_DATA = {
  channels: [
    {
      id: 'tsukiji',
      name: 'Tsukiji Lane',
      vendors: [
        {
          name: 'Old Man Taro',
          stallType: 'wooden',
          greeting: 'Freshest tuna on the lane!',
          items: [
            { icon: '🐟', name: 'Bluefin Tuna', price: 4800, qty: 2, rarity: 'legendary' },
            { icon: '🍣', name: 'Otoro Sashimi', price: 2200, qty: 5, rarity: 'rare' },
            { icon: '🐟', name: 'Yellowtail Fillet', price: 680, qty: 12, rarity: 'uncommon' },
            { icon: '🦐', name: 'Botan Shrimp', price: 320, qty: 20, rarity: 'common' },
            { icon: '🍣', name: 'Salmon Nigiri', price: 150, qty: 30, rarity: 'common' },
            { icon: '🥢', name: 'Wasabi Paste', price: 80, qty: 50, rarity: 'common' }
          ]
        },
        {
          name: 'Yuki\'s Sushi Bar',
          stallType: 'bamboo',
          greeting: 'Irasshaimase! Welcome!',
          items: [
            { icon: '🍣', name: 'Dragon Roll', price: 1400, qty: 6, rarity: 'rare' },
            { icon: '🍣', name: 'Rainbow Roll', price: 980, qty: 8, rarity: 'uncommon' },
            { icon: '🍣', name: 'Spicy Tuna Roll', price: 450, qty: 15, rarity: 'common' },
            { icon: '🍣', name: 'Tamago Nigiri', price: 200, qty: 25, rarity: 'common' },
            { icon: '🥤', name: 'Green Tea', price: 60, qty: 40, rarity: 'common' },
            { icon: '🍶', name: 'Warm Sake', price: 350, qty: 10, rarity: 'uncommon' },
            { icon: '🍣', name: 'Uni Gunkan', price: 1800, qty: 3, rarity: 'rare' },
            { icon: '🥢', name: 'Soy Sauce', price: 40, qty: 60, rarity: 'common' }
          ]
        },
        {
          name: 'Captain Kuro',
          stallType: 'wooden',
          greeting: 'Straight off the boat!',
          items: [
            { icon: '🦀', name: 'King Crab', price: 3200, qty: 3, rarity: 'legendary' },
            { icon: '🦞', name: 'Spiny Lobster', price: 2600, qty: 4, rarity: 'rare' },
            { icon: '🐙', name: 'Fresh Octopus', price: 900, qty: 8, rarity: 'uncommon' },
            { icon: '🦑', name: 'Squid Bundle', price: 550, qty: 12, rarity: 'common' },
            { icon: '🐚', name: 'Scallops', price: 420, qty: 15, rarity: 'common' }
          ]
        },
        {
          name: 'Misaki\'s Pickles',
          stallType: 'bamboo',
          greeting: 'Crunchy and tangy~',
          items: [
            { icon: '🥒', name: 'Pickled Daikon', price: 120, qty: 30, rarity: 'common' },
            { icon: '🥬', name: 'Kimchi Batch', price: 200, qty: 20, rarity: 'common' },
            { icon: '🫚', name: 'Pickled Ginger', price: 90, qty: 40, rarity: 'common' },
            { icon: '🍆', name: 'Miso Eggplant', price: 280, qty: 15, rarity: 'uncommon' }
          ]
        },
        {
          name: 'Hoshi Dried Goods',
          stallType: 'premium',
          greeting: 'Aged to perfection.',
          items: [
            { icon: '🐡', name: 'Dried Pufferfish', price: 5200, qty: 1, rarity: 'legendary' },
            { icon: '🦈', name: 'Shark Fin (Faux)', price: 1600, qty: 4, rarity: 'rare' },
            { icon: '🌿', name: 'Kombu Kelp', price: 340, qty: 18, rarity: 'uncommon' },
            { icon: '🍄', name: 'Shiitake Bundle', price: 180, qty: 25, rarity: 'common' },
            { icon: '🧂', name: 'Sea Salt Flakes', price: 60, qty: 50, rarity: 'common' },
            { icon: '🐟', name: 'Bonito Flakes', price: 250, qty: 20, rarity: 'common' }
          ]
        }
      ]
    },
    {
      id: 'harbor',
      name: 'Harbor Row',
      vendors: [
        {
          name: 'Dock Master Ren',
          stallType: 'wooden',
          greeting: 'Haul came in this morning!',
          items: [
            { icon: '🐟', name: 'Mackerel Basket', price: 380, qty: 20, rarity: 'common' },
            { icon: '🐟', name: 'Sea Bass', price: 520, qty: 14, rarity: 'common' },
            { icon: '🐟', name: 'Red Snapper', price: 1100, qty: 6, rarity: 'uncommon' },
            { icon: '🦐', name: 'Tiger Prawns', price: 780, qty: 10, rarity: 'uncommon' },
            { icon: '🐙', name: 'Baby Octopus', price: 640, qty: 12, rarity: 'common' }
          ]
        },
        {
          name: 'Granny Mae\'s Stand',
          stallType: 'bamboo',
          greeting: 'Home-cooked goodness!',
          items: [
            { icon: '🍙', name: 'Salmon Onigiri', price: 180, qty: 30, rarity: 'common' },
            { icon: '🍙', name: 'Tuna Mayo Onigiri', price: 200, qty: 25, rarity: 'common' },
            { icon: '🍜', name: 'Fish Broth Bowl', price: 350, qty: 15, rarity: 'uncommon' },
            { icon: '🍘', name: 'Senbei Crackers', price: 80, qty: 50, rarity: 'common' },
            { icon: '🍵', name: 'Matcha Latte', price: 220, qty: 20, rarity: 'common' },
            { icon: '🍡', name: 'Dango Sticks', price: 160, qty: 25, rarity: 'common' }
          ]
        },
        {
          name: 'Forge-Fisher Jin',
          stallType: 'premium',
          greeting: 'Blades and bait!',
          items: [
            { icon: '🔪', name: 'Sashimi Knife', price: 3800, qty: 2, rarity: 'legendary' },
            { icon: '🪝', name: 'Titanium Hook Set', price: 1200, qty: 5, rarity: 'rare' },
            { icon: '🧵', name: 'Braided Line 100m', price: 450, qty: 12, rarity: 'uncommon' },
            { icon: '🪣', name: 'Bait Bucket', price: 120, qty: 30, rarity: 'common' }
          ]
        },
        {
          name: 'Nami\'s Net Shop',
          stallType: 'wooden',
          greeting: 'Catch more, spend less!',
          items: [
            { icon: '🪢', name: 'Cast Net (Large)', price: 960, qty: 6, rarity: 'uncommon' },
            { icon: '🪢', name: 'Cast Net (Small)', price: 380, qty: 15, rarity: 'common' },
            { icon: '🧤', name: 'Grip Gloves', price: 220, qty: 20, rarity: 'common' },
            { icon: '🎣', name: 'Carbon Rod', price: 2100, qty: 3, rarity: 'rare' },
            { icon: '🧊', name: 'Ice Pack x6', price: 90, qty: 40, rarity: 'common' }
          ]
        }
      ]
    },
    {
      id: 'pearl',
      name: 'Pearl Dock',
      vendors: [
        {
          name: 'Madame Perle',
          stallType: 'premium',
          greeting: 'Only the finest treasures.',
          items: [
            { icon: '🦪', name: 'Black Pearl', price: 9800, qty: 1, rarity: 'legendary' },
            { icon: '🦪', name: 'Akoya Pearl Pair', price: 4200, qty: 2, rarity: 'legendary' },
            { icon: '🐚', name: 'Abalone Shell', price: 1800, qty: 4, rarity: 'rare' },
            { icon: '🐚', name: 'Conch Horn', price: 1200, qty: 6, rarity: 'rare' },
            { icon: '💎', name: 'Sea Glass Set', price: 560, qty: 10, rarity: 'uncommon' }
          ]
        },
        {
          name: 'Shellfish Sato',
          stallType: 'wooden',
          greeting: 'Clams! Oysters! Mussels!',
          items: [
            { icon: '🦪', name: 'Oyster Dozen', price: 480, qty: 15, rarity: 'common' },
            { icon: '🐚', name: 'Clam Basket', price: 320, qty: 20, rarity: 'common' },
            { icon: '🦪', name: 'Mussel Pot', price: 260, qty: 18, rarity: 'common' },
            { icon: '🍋', name: 'Lemon Wedges', price: 40, qty: 60, rarity: 'common' },
            { icon: '🧈', name: 'Garlic Butter', price: 120, qty: 30, rarity: 'common' },
            { icon: '🌶️', name: 'Hot Sauce', price: 80, qty: 40, rarity: 'common' }
          ]
        },
        {
          name: 'Tide Pool Tama',
          stallType: 'bamboo',
          greeting: 'Curious creatures from the deep!',
          items: [
            { icon: '🪼', name: 'Moon Jellyfish', price: 2400, qty: 2, rarity: 'rare' },
            { icon: '🦑', name: 'Firefly Squid', price: 1600, qty: 4, rarity: 'rare' },
            { icon: '🐡', name: 'Baby Pufferfish', price: 900, qty: 6, rarity: 'uncommon' },
            { icon: '🦀', name: 'Hermit Crab', price: 340, qty: 14, rarity: 'common' },
            { icon: '⭐', name: 'Starfish', price: 180, qty: 20, rarity: 'common' }
          ]
        },
        {
          name: 'Coral\'s Cosmetics',
          stallType: 'bamboo',
          greeting: 'Beauty from the sea~',
          items: [
            { icon: '🧴', name: 'Seaweed Lotion', price: 680, qty: 8, rarity: 'uncommon' },
            { icon: '🧼', name: 'Pearl Soap', price: 240, qty: 20, rarity: 'common' },
            { icon: '🪸', name: 'Coral Powder', price: 1100, qty: 5, rarity: 'rare' },
            { icon: '🫧', name: 'Bubble Bath Salts', price: 180, qty: 25, rarity: 'common' }
          ]
        },
        {
          name: 'Anchor Al',
          stallType: 'wooden',
          greeting: 'Nautical needs, covered!',
          items: [
            { icon: '⚓', name: 'Mini Anchor', price: 1500, qty: 4, rarity: 'rare' },
            { icon: '🧭', name: 'Brass Compass', price: 2800, qty: 2, rarity: 'legendary' },
            { icon: '🪢', name: 'Sailor Rope 50m', price: 320, qty: 15, rarity: 'common' },
            { icon: '🏴‍☠️', name: 'Jolly Roger Flag', price: 750, qty: 6, rarity: 'uncommon' },
            { icon: '🔔', name: 'Ship Bell', price: 440, qty: 10, rarity: 'common' }
          ]
        }
      ]
    },
    {
      id: 'coral',
      name: 'Coral Market',
      vendors: [
        {
          name: 'Chef Hana',
          stallType: 'premium',
          greeting: 'Taste the ocean!',
          items: [
            { icon: '🍣', name: 'Omakase Box', price: 5500, qty: 2, rarity: 'legendary' },
            { icon: '🍱', name: 'Chirashi Bowl', price: 1800, qty: 5, rarity: 'rare' },
            { icon: '🍜', name: 'Seafood Ramen', price: 680, qty: 12, rarity: 'uncommon' },
            { icon: '🍤', name: 'Tempura Platter', price: 520, qty: 15, rarity: 'common' },
            { icon: '🥟', name: 'Shrimp Gyoza x8', price: 340, qty: 20, rarity: 'common' },
            { icon: '🍚', name: 'Sushi Rice Pack', price: 90, qty: 40, rarity: 'common' }
          ]
        },
        {
          name: 'Smoked by Kenji',
          stallType: 'wooden',
          greeting: 'Low and slow, friend.',
          items: [
            { icon: '🐟', name: 'Smoked Salmon Side', price: 1400, qty: 5, rarity: 'rare' },
            { icon: '🐟', name: 'Smoked Eel', price: 980, qty: 7, rarity: 'uncommon' },
            { icon: '🐟', name: 'Jerky Strips', price: 280, qty: 25, rarity: 'common' },
            { icon: '🪵', name: 'Cherry Wood Chips', price: 150, qty: 30, rarity: 'common' }
          ]
        },
        {
          name: 'Seaweed Sisters',
          stallType: 'bamboo',
          greeting: 'Green is good!',
          items: [
            { icon: '🌿', name: 'Nori Sheets x50', price: 220, qty: 20, rarity: 'common' },
            { icon: '🌿', name: 'Wakame Salad', price: 180, qty: 25, rarity: 'common' },
            { icon: '🌿', name: 'Kelp Noodles', price: 340, qty: 15, rarity: 'uncommon' },
            { icon: '🌿', name: 'Spirulina Powder', price: 780, qty: 8, rarity: 'uncommon' },
            { icon: '🌿', name: 'Sea Grapes', price: 1200, qty: 4, rarity: 'rare' }
          ]
        },
        {
          name: 'Ice Box Yuto',
          stallType: 'wooden',
          greeting: 'Keep it cool!',
          items: [
            { icon: '🧊', name: 'Block Ice', price: 60, qty: 50, rarity: 'common' },
            { icon: '🧊', name: 'Dry Ice 5kg', price: 380, qty: 12, rarity: 'uncommon' },
            { icon: '🥶', name: 'Cryo Cooler', price: 1800, qty: 3, rarity: 'rare' },
            { icon: '🫙', name: 'Vacuum Jar', price: 450, qty: 10, rarity: 'uncommon' }
          ]
        }
      ]
    },
    {
      id: 'dragon',
      name: 'Dragon Bay',
      vendors: [
        {
          name: 'Dragon Li',
          stallType: 'premium',
          greeting: 'Legendary catches only!',
          items: [
            { icon: '🐉', name: 'Dragon Koi', price: 12000, qty: 1, rarity: 'legendary' },
            { icon: '🐟', name: 'Golden Arowana', price: 6800, qty: 1, rarity: 'legendary' },
            { icon: '🐟', name: 'Emperor Snapper', price: 3200, qty: 3, rarity: 'rare' },
            { icon: '🐡', name: 'Tiger Pufferfish', price: 2400, qty: 4, rarity: 'rare' },
            { icon: '🦈', name: 'Bamboo Shark', price: 4500, qty: 2, rarity: 'legendary' }
          ]
        },
        {
          name: 'Spice Monk Zhi',
          stallType: 'bamboo',
          greeting: 'Flavor is enlightenment.',
          items: [
            { icon: '🌶️', name: 'Sichuan Peppercorn', price: 420, qty: 15, rarity: 'uncommon' },
            { icon: '🫚', name: 'Ginger Root 1kg', price: 180, qty: 25, rarity: 'common' },
            { icon: '🧄', name: 'Black Garlic', price: 680, qty: 8, rarity: 'uncommon' },
            { icon: '🌿', name: 'Five Spice Blend', price: 240, qty: 20, rarity: 'common' },
            { icon: '🍯', name: 'Truffle Honey', price: 2200, qty: 3, rarity: 'rare' },
            { icon: '🧂', name: 'Himalayan Pink Salt', price: 140, qty: 30, rarity: 'common' }
          ]
        },
        {
          name: 'Bay Dumpling Co.',
          stallType: 'wooden',
          greeting: 'Steaming hot!',
          items: [
            { icon: '🥟', name: 'Xiao Long Bao x8', price: 480, qty: 15, rarity: 'common' },
            { icon: '🥟', name: 'Crystal Shrimp Har Gow', price: 620, qty: 10, rarity: 'uncommon' },
            { icon: '🥟', name: 'Dragon Dumpling', price: 1400, qty: 4, rarity: 'rare' },
            { icon: '🫕', name: 'Hot Pot Base', price: 350, qty: 18, rarity: 'common' },
            { icon: '🍜', name: 'Dan Dan Noodles', price: 280, qty: 20, rarity: 'common' }
          ]
        },
        {
          name: 'Lantern Mei',
          stallType: 'bamboo',
          greeting: 'Light up the bay!',
          items: [
            { icon: '🏮', name: 'Paper Lantern', price: 160, qty: 30, rarity: 'common' },
            { icon: '🏮', name: 'Dragon Lantern', price: 1800, qty: 3, rarity: 'rare' },
            { icon: '🎋', name: 'Lucky Bamboo', price: 280, qty: 20, rarity: 'common' },
            { icon: '🧧', name: 'Red Envelope', price: 88, qty: 50, rarity: 'common' },
            { icon: '🎐', name: 'Wind Chime', price: 520, qty: 10, rarity: 'uncommon' }
          ]
        },
        {
          name: 'Master Wok Fang',
          stallType: 'premium',
          greeting: 'Fire and flavor!',
          items: [
            { icon: '🍳', name: 'Wok-Seared Lobster', price: 3800, qty: 2, rarity: 'legendary' },
            { icon: '🦀', name: 'Chili Crab', price: 2600, qty: 3, rarity: 'rare' },
            { icon: '🍤', name: 'Salt & Pepper Shrimp', price: 580, qty: 12, rarity: 'common' },
            { icon: '🥡', name: 'Fried Rice Box', price: 220, qty: 25, rarity: 'common' },
            { icon: '🍜', name: 'Wonton Soup', price: 180, qty: 30, rarity: 'common' },
            { icon: '🥢', name: 'Golden Chopsticks', price: 1200, qty: 5, rarity: 'rare' }
          ]
        }
      ]
    }
  ],

  stallStyles: {
    wooden: { width: 140, height: 110, roofColor: '#5c3a1e', frameColor: '#8b6914', counterColor: '#a07830' },
    bamboo: { width: 130, height: 105, roofColor: '#3a5c2e', frameColor: '#6b8f50', counterColor: '#8aaa60' },
    premium: { width: 155, height: 120, roofColor: '#3b2060', frameColor: '#6366f1', counterColor: '#818cf8' }
  },

  rarityColors: {
    common: '#e2e8f0',
    uncommon: '#4ade80',
    rare: '#6366f1',
    legendary: '#f59e0b'
  }
};
