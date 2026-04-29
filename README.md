# InfluMatch

InfluMatch is a simple college project prototype that connects local businesses with influencers for promotion campaigns.

## Features

- Landing page with Business and Influencer signup paths
- Mock login/signup using browser localStorage
- Business dashboard to create campaigns
- Influencer dashboard to create profile, filter campaigns, and apply
- Business application review with accept/reject actions
- Simple match score based on niche, location, and follower count
- Demo contact message and rating UI
- Seeded dummy data for quick presentation

## Demo Accounts

- Business: `business@demo.com` / `demo123`
- Influencer: `influencer@demo.com` / `demo123`

## How To Run

Open `index.html` in a browser.

For a local server, run one of these commands from this folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Suggested Demo Flow

1. Sign up or login as a Business.
2. Create a campaign with title, category, budget, and location.
3. Logout and login as an Influencer.
4. Complete the influencer profile.
5. Filter campaigns and apply to one.
6. Logout and login as Business again.
7. Accept or reject the application.
8. Use the contact/rating demo UI.

## Data Storage

All users, campaigns, and applications are stored in browser localStorage under:

```text
influmatch_state_v1
```

To reset the demo, clear localStorage for this page and refresh.
