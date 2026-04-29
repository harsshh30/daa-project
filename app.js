const STORAGE_KEY = "influmatch_state_v1";

const categories = ["Food", "Fitness", "Fashion", "Travel", "Beauty", "Tech"];
const locations = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Chennai", "Hyderabad"];
const cityCoordinates = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.385, lng: 78.4867 }
};

// Seed data makes the prototype presentation-ready even before signup.
// The app stores later edits in localStorage so the demo flow feels persistent.
const seedData = {
  currentUserId: null,
  users: [
    {
      id: "biz-demo",
      name: "Bean Street Cafe",
      email: "business@demo.com",
      password: "demo123",
      role: "business",
      businessName: "Bean Street Cafe",
      location: "Mumbai",
      businessType: "Cafe",
      businessStory: "A cozy neighborhood cafe known for cold coffee, brunch plates, and student-friendly weekend offers.",
      businessHighlights: "Best sellers: hazelnut cold coffee, loaded fries, and Sunday brunch combos.",
      businessMedia: [
        {
          id: "media-1",
          type: "photo",
          title: "Cafe counter",
          url: "",
          caption: "Warm interiors for creator shoots"
        },
        {
          id: "media-2",
          type: "video",
          title: "Weekend promo reel",
          url: "",
          caption: "Demo video slot for campaign preview"
        }
      ]
    },
    {
      id: "inf-demo",
      name: "Aarav Rao",
      email: "influencer@demo.com",
      password: "demo123",
      role: "influencer",
      niche: "Food",
      followers: 24000,
      location: "Mumbai",
      availabilityRadiusKm: 180,
      bio: "Food creator covering cafes, desserts, and weekend places.",
      savedCampaigns: ["camp-2"],
      showcase: [
        {
          id: "work-1",
          title: "Cafe Reel Campaign",
          category: "Food",
          image: "",
          result: "18K views and 430 saves"
        },
        {
          id: "work-2",
          title: "Dessert Story Series",
          category: "Food",
          image: "",
          result: "92 link clicks in one day"
        }
      ]
    },
    {
      id: "inf-fashion",
      name: "Priya Sharma",
      email: "priya@demo.com",
      password: "demo123",
      role: "influencer",
      niche: "Fashion",
      followers: 56000,
      location: "Delhi",
      availabilityRadiusKm: 60,
      bio: "Fashion and lifestyle creator focused on budget-friendly styling.",
      savedCampaigns: [],
      showcase: [
        {
          id: "work-3",
          title: "Festive Outfit Reel",
          category: "Fashion",
          image: "",
          result: "41K views and 1.2K profile visits"
        }
      ]
    },
    {
      id: "inf-fitness",
      name: "Kabir Mehta",
      email: "kabir@demo.com",
      password: "demo123",
      role: "influencer",
      niche: "Fitness",
      followers: 18000,
      location: "Delhi",
      availabilityRadiusKm: 80,
      bio: "Fitness creator sharing gym routines, nutrition tips, and local studio reviews.",
      savedCampaigns: [],
      showcase: [
        {
          id: "work-4",
          title: "Gym Trial Review",
          category: "Fitness",
          image: "",
          result: "130 trial signups tracked"
        }
      ]
    }
  ],
  campaigns: [
    {
      id: "camp-1",
      businessId: "biz-demo",
      title: "Weekend Coffee Launch",
      description: "Promote our new cold coffee menu with one reel and two story posts.",
      category: "Food",
      budget: 8000,
      location: "Mumbai",
      status: "Open"
    },
    {
      id: "camp-2",
      businessId: "biz-demo",
      title: "Healthy Brunch Collaboration",
      description: "Invite lifestyle creators to review our new brunch menu.",
      category: "Food",
      budget: 6500,
      location: "Pune",
      status: "Open"
    },
    {
      id: "camp-3",
      businessId: "sample-gym",
      title: "Gym Trial Week Promotion",
      description: "Create local awareness for a seven-day trial membership offer.",
      category: "Fitness",
      budget: 10000,
      location: "Delhi",
      status: "Open"
    }
  ],
  applications: [
    {
      id: "app-1",
      campaignId: "camp-1",
      influencerId: "inf-demo",
      message: "I can create a cafe visit reel this weekend.",
      status: "Pending",
      rating: 0
    },
    {
      id: "app-2",
      campaignId: "camp-2",
      influencerId: "inf-demo",
      message: "I can cover the brunch menu with a reel and story poll.",
      status: "Completed",
      rating: 5
    },
    {
      id: "app-3",
      campaignId: "camp-3",
      influencerId: "inf-fitness",
      message: "I can make a gym trial transformation reel.",
      status: "Accepted",
      rating: 4
    }
  ]
};

let state = loadState();
let selectedRole = "business";
let filters = { category: "All", location: "All" };
let businessDirectoryFilters = { location: "Mumbai", range: "200" };

// Reads existing browser data, or creates the first demo dataset.
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return structuredClone(seedData);
  }
  const parsed = JSON.parse(saved);
  parsed.users = [
    ...parsed.users,
    ...seedData.users.filter((seedUser) => !parsed.users.some((user) => user.id === seedUser.id))
  ];
  parsed.campaigns = [
    ...parsed.campaigns,
    ...seedData.campaigns.filter((seedCampaign) => !parsed.campaigns.some((campaign) => campaign.id === seedCampaign.id))
  ];
  parsed.applications = [
    ...parsed.applications,
    ...seedData.applications.filter((seedApplication) => !parsed.applications.some((application) => application.id === seedApplication.id))
  ];
  parsed.users = parsed.users.map((user) => {
    const demoUser = seedData.users.find((item) => item.id === user.id);
    const demoShowcase = demoUser?.showcase ? structuredClone(demoUser.showcase) : [];
    const demoMedia = demoUser?.businessMedia ? structuredClone(demoUser.businessMedia) : [];
    return {
      ...user,
      businessType: user.role === "business" ? user.businessType || demoUser?.businessType || "" : user.businessType,
      businessStory: user.role === "business" ? user.businessStory || demoUser?.businessStory || "" : user.businessStory,
      businessHighlights: user.role === "business" ? user.businessHighlights || demoUser?.businessHighlights || "" : user.businessHighlights,
      businessMedia: user.role === "business" ? user.businessMedia || demoMedia : user.businessMedia,
      availabilityRadiusKm: user.role === "influencer" ? Number(user.availabilityRadiusKm || 50) : user.availabilityRadiusKm,
      savedCampaigns: user.role === "influencer" ? user.savedCampaigns || [] : user.savedCampaigns,
      showcase: user.role === "influencer" ? user.showcase || demoShowcase : user.showcase
    };
  });
  return parsed;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function byId(id) {
  return document.getElementById(id);
}

function money(value) {
  return `Rs. ${Number(value).toLocaleString("en-IN")}`;
}

function currentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function setView(view, options = {}) {
  if (view === "landing") renderLanding();
  if (view === "login") renderAuth("login", options.role);
  if (view === "signup") renderAuth("signup", options.role);
  if (view === "dashboard") renderDashboard();
}

// Small feedback message used after major actions like apply, accept, or save.
function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function renderLanding() {
  byId("app").innerHTML = byId("landing-template").innerHTML;
}

// One reusable auth screen handles both signup and login.
function renderAuth(mode, role = selectedRole) {
  selectedRole = role || selectedRole;
  const isSignup = mode === "signup";

  byId("app").innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <button class="brand" data-view="landing" aria-label="Back to landing page">
          <span class="brand-mark">IM</span>
          <span>InfluMatch</span>
        </button>
        <h1>${isSignup ? "Create your account" : "Welcome back"}</h1>
        <p class="muted">
          ${isSignup ? "Choose your role and start the demo workflow." : "Use your account or demo login: business@demo.com / influencer@demo.com, password demo123."}
        </p>

        ${isSignup ? `
          <div class="role-options" aria-label="Choose account role">
            <button class="role-card ${selectedRole === "business" ? "active" : ""}" data-role-option="business">
              <strong>Business</strong>
              <span class="muted">Post campaigns</span>
            </button>
            <button class="role-card ${selectedRole === "influencer" ? "active" : ""}" data-role-option="influencer">
              <strong>Influencer</strong>
              <span class="muted">Apply to campaigns</span>
            </button>
          </div>
        ` : ""}

        <form class="form-grid" id="auth-form">
          ${isSignup ? `<label>Name<input required name="name" placeholder="${selectedRole === "business" ? "Business or owner name" : "Your creator name"}"></label>` : ""}
          <label>Email<input required type="email" name="email" placeholder="you@example.com"></label>
          <label>Password<input required type="password" name="password" placeholder="At least 4 characters"></label>
          <button class="primary-btn" type="submit">${isSignup ? "Create account" : "Login"}</button>
        </form>

        <p class="muted">
          ${isSignup ? "Already have an account?" : "New to InfluMatch?"}
          <button class="ghost-btn" data-view="${isSignup ? "login" : "signup"}">${isSignup ? "Login" : "Sign up"}</button>
        </p>
      </section>
    </main>
  `;
}

// Dashboard changes depending on the role saved on the current user.
function renderDashboard() {
  const user = currentUser();
  if (!user) {
    setView("landing");
    return;
  }

  byId("app").innerHTML = `
    <main class="app-shell">
      <header class="dashboard-header">
        <button class="brand" data-view="landing" aria-label="Go to landing page">
          <span class="brand-mark">IM</span>
          <span>InfluMatch</span>
        </button>
        <div class="topbar-actions">
          <div class="user-chip">
            <span class="avatar">${initials(user.name)}</span>
            <div>
              <strong>${user.name}</strong>
              <span>${capitalize(user.role)} dashboard</span>
            </div>
          </div>
          <button class="ghost-btn" id="logout-btn">Logout</button>
        </div>
      </header>
      ${user.role === "business" ? businessDashboard(user) : influencerDashboard(user)}
    </main>
  `;
}

function businessDashboard(user) {
  const ownCampaigns = state.campaigns.filter((campaign) => campaign.businessId === user.id);
  const ownApplications = state.applications.filter((application) =>
    ownCampaigns.some((campaign) => campaign.id === application.campaignId)
  );

  return `
    <section class="dashboard-hero">
      <div>
        <p class="eyebrow">Business workflow</p>
        <h2>Post campaigns and manage influencer applications.</h2>
        <p>Create a campaign, review applicants, accept a creator, and use the contact box for the demo.</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span class="muted">Campaigns</span><strong>${ownCampaigns.length}</strong></div>
        <div class="stat-card"><span class="muted">Applications</span><strong>${ownApplications.length}</strong></div>
      </div>
    </section>

    ${renderBusinessSections(user, ownCampaigns, ownApplications)}
    ${renderBusinessProfileMedia(user)}
    ${renderInfluencerRankings()}
    ${renderLocalInfluencerDirectory(user)}

    <section class="dashboard-grid">
      <aside class="panel">
        <h2>Create campaign</h2>
        <form class="form-grid" id="campaign-form">
          <label>Title<input required name="title" placeholder="New cafe launch"></label>
          <label>Description<textarea required name="description" placeholder="What should the influencer promote?"></textarea></label>
          <label>Category<select required name="category">${optionList(categories)}</select></label>
          <label>Budget<input required name="budget" type="number" min="500" placeholder="8000"></label>
          <label>Location<select required name="location">${optionList(locations, user.location || "Mumbai")}</select></label>
          <button class="primary-btn" type="submit">Post campaign</button>
        </form>
      </aside>

      <section class="panel">
        <h2>Your campaigns and applicants</h2>
        <div class="list">
          ${ownCampaigns.length ? ownCampaigns.map(renderBusinessCampaign).join("") : emptyState("Post your first campaign to receive applications.")}
        </div>
      </section>
    </section>
  `;
}

function renderBusinessProfileMedia(user) {
  return `
    <section class="business-profile-section">
      <div class="business-profile-card">
        <div>
          <p class="eyebrow">Business profile</p>
          <h2>Show what your business is about.</h2>
          <p class="muted">Add a short story, highlights, photos, and videos that influencers can understand before collaborating.</p>
        </div>
        <form class="form-grid" id="business-profile-form">
          <label>Business name<input required name="businessName" value="${escapeAttr(user.businessName || user.name)}"></label>
          <label>Business type<input required name="businessType" value="${escapeAttr(user.businessType || "")}" placeholder="Cafe, gym, restaurant, salon"></label>
          <label>Location<select required name="location">${optionList(locations, user.location || "Mumbai")}</select></label>
          <label>About your business<textarea required name="businessStory" placeholder="Tell influencers what your business is known for.">${user.businessStory || ""}</textarea></label>
          <label>Highlights<textarea name="businessHighlights" placeholder="Best sellers, offers, ambience, target customers">${user.businessHighlights || ""}</textarea></label>
          <button class="primary-btn" type="submit">Save business profile</button>
        </form>
      </div>
      <div class="business-media-card">
        <div class="campaign-top">
          <div>
            <h2>Photo and video gallery</h2>
            <p class="muted">Use image or video links for demo media. Empty links show stylish placeholders.</p>
          </div>
        </div>
        <form class="form-grid" id="business-media-form">
          <label>Media type<select required name="type"><option value="photo">Photo</option><option value="video">Video</option></select></label>
          <label>Title<input required name="title" placeholder="Cafe ambience photo"></label>
          <label>Media URL<input name="url" placeholder="Optional image/video URL"></label>
          <label>Caption<textarea required name="caption" placeholder="What should influencers notice?"></textarea></label>
          <button class="secondary-btn" type="submit">Add media</button>
        </form>
        ${renderBusinessMediaGallery(user)}
      </div>
    </section>
  `;
}

function renderBusinessMediaGallery(user) {
  const items = user.businessMedia || [];
  if (!items.length) return `<div class="showcase-block">${emptyState("Add photos or videos to show your business personality.")}</div>`;
  return `
    <div class="business-media-grid">
      ${items.map((item) => renderBusinessMediaItem(item)).join("")}
    </div>
  `;
}

function renderBusinessMediaItem(item) {
  return `
    <article class="business-media-item">
      <div class="business-media-preview ${item.type === "video" ? "video-preview" : ""}" style="${businessMediaStyle(item)}">
        ${item.url ? "" : `<span>${item.type === "video" ? "Play" : initials(item.title)}</span>`}
      </div>
      <div class="showcase-body">
        <div class="campaign-top">
          <div>
            <h3>${item.title}</h3>
            <p class="muted">${capitalize(item.type)}</p>
          </div>
          <button class="ghost-btn mini-btn" data-remove-media="${item.id}">Remove</button>
        </div>
        <p>${item.caption}</p>
      </div>
    </article>
  `;
}

function businessMediaStyle(item) {
  if (item.type === "photo" && item.url) {
    return `background-image: linear-gradient(rgba(23, 32, 51, 0.08), rgba(23, 32, 51, 0.08)), url('${escapeAttr(item.url)}');`;
  }
  if (item.type === "video" && item.url) {
    return `background: linear-gradient(135deg, rgba(23, 32, 51, 0.72), rgba(45, 108, 223, 0.62)), url('${escapeAttr(item.url)}');`;
  }
  return item.type === "video"
    ? "background: linear-gradient(135deg, #152033, #2d6cdf);"
    : "background: linear-gradient(135deg, #fff0ec, #eaf2ff);";
}

function renderBusinessSections(user, campaigns, applications) {
  const openCampaigns = campaigns.filter((campaign) => campaign.status === "Open").length;
  const totalBudget = campaigns.reduce((total, campaign) => total + Number(campaign.budget || 0), 0);
  const pending = applications.filter((application) => application.status === "Pending").length;
  const accepted = applications.filter((application) => application.status === "Accepted").length;
  const completed = applications.filter((application) => application.status === "Completed").length;
  const category = topCampaignField(campaigns, "category") || "No category";
  const location = topCampaignField(campaigns, "location") || user.location || "No city";
  const applicantReach = applications.reduce((total, application) => {
    const influencer = state.users.find((candidate) => candidate.id === application.influencerId);
    return total + Number(influencer?.followers || 0);
  }, 0);

  return `
    <section class="business-sections">
      <article class="insight-card business-overview-card">
        <span class="section-icon">01</span>
        <h2>Business overview</h2>
        <p>Your campaign workspace for planning, reviewing creators, and tracking collaboration interest.</p>
        <div class="meta-row">
          <span class="tag">${openCampaigns} open campaigns</span>
          <span class="tag">${money(totalBudget)} total budget</span>
        </div>
      </article>
      <article class="insight-card">
        <span class="section-icon">02</span>
        <h2>Application pipeline</h2>
        <div class="pipeline-list">
          <div><span>Pending</span><strong>${pending}</strong></div>
          <div><span>Accepted</span><strong>${accepted}</strong></div>
          <div><span>Completed</span><strong>${completed}</strong></div>
        </div>
      </article>
      <article class="insight-card">
        <span class="section-icon">03</span>
        <h2>Audience reach</h2>
        <div class="pipeline-list">
          <div><span>Applicant reach</span><strong>${applicantReach.toLocaleString("en-IN")}</strong></div>
          <div><span>Best city</span><strong>${location}</strong></div>
          <div><span>Top category</span><strong>${category}</strong></div>
        </div>
      </article>
      <article class="insight-card">
        <span class="section-icon">04</span>
        <h2>Launch checklist</h2>
        <ul class="checklist">
          <li>Post one clear campaign brief</li>
          <li>Compare ranked influencers</li>
          <li>Accept a creator and share contact</li>
        </ul>
      </article>
    </section>
    ${renderCampaignPlanner(campaigns, applications)}
  `;
}

function renderCampaignPlanner(campaigns, applications) {
  const newestCampaigns = [...campaigns].slice(0, 3);
  return `
    <section class="planner-section">
      <div class="campaign-top">
        <div>
          <p class="eyebrow">Campaign planning</p>
          <h2>Recent campaign board</h2>
          <p class="muted">A quick planning view for budget, city, category, and applicant count.</p>
        </div>
      </div>
      <div class="planner-grid">
        ${newestCampaigns.length ? newestCampaigns.map((campaign) => {
          const count = applications.filter((application) => application.campaignId === campaign.id).length;
          return `
            <article class="planner-card">
              <div class="campaign-top">
                <div>
                  <h3>${campaign.title}</h3>
                  <p class="muted">${campaign.category} / ${campaign.location}</p>
                </div>
                <span class="status accepted">${campaign.status}</span>
              </div>
              <div class="ranking-metrics">
                <div><span>Budget</span><strong>${money(campaign.budget)}</strong></div>
                <div><span>Applicants</span><strong>${count}</strong></div>
              </div>
            </article>
          `;
        }).join("") : emptyState("Create a campaign to see planning cards here.")}
      </div>
    </section>
  `;
}

function topCampaignField(campaigns, field) {
  const counts = campaigns.reduce((map, campaign) => {
    map[campaign[field]] = (map[campaign[field]] || 0) + 1;
    return map;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function renderLocalInfluencerDirectory(user) {
  if (!businessDirectoryFilters.location || businessDirectoryFilters.location === "Mumbai") {
    businessDirectoryFilters.location = user.location || "Mumbai";
  }
  const location = businessDirectoryFilters.location;
  const range = Number(businessDirectoryFilters.range);
  const influencers = getInfluencersByRange(location, range);

  return `
    <section class="directory-section">
      <div class="campaign-top">
        <div>
          <p class="eyebrow">Local creator discovery</p>
          <h2>Influencers available near your campaign location.</h2>
          <p class="muted">This demo uses city distance and each creator's limited availability range.</p>
        </div>
      </div>
      <div class="filter-row directory-filters">
        <label>Campaign city<select id="business-location-filter">${optionList(locations, location)}</select></label>
        <label>Search range<select id="business-range-filter">
          <option value="25" ${businessDirectoryFilters.range === "25" ? "selected" : ""}>25 km</option>
          <option value="75" ${businessDirectoryFilters.range === "75" ? "selected" : ""}>75 km</option>
          <option value="200" ${businessDirectoryFilters.range === "200" ? "selected" : ""}>200 km</option>
          <option value="1500" ${businessDirectoryFilters.range === "1500" ? "selected" : ""}>All major cities</option>
        </select></label>
      </div>
      <div class="directory-grid">
        ${influencers.length ? influencers.map(renderDirectoryInfluencer).join("") : emptyState("No influencers are available in this range. Increase the range or choose another city.")}
      </div>
    </section>
  `;
}

function getInfluencersByRange(location, range) {
  return state.users
    .filter((user) => user.role === "influencer")
    .map((user) => ({
      user,
      distance: distanceBetweenCities(location, user.location || location)
    }))
    .filter((item) => item.distance <= range && item.distance <= Number(item.user.availabilityRadiusKm || 50))
    .sort((a, b) => a.distance - b.distance || Number(b.user.followers || 0) - Number(a.user.followers || 0));
}

function renderDirectoryInfluencer(item) {
  const { user, distance } = item;
  const applications = state.applications.filter((application) => application.influencerId === user.id);
  const accepted = applications.filter((application) => application.status === "Accepted" || application.status === "Completed").length;
  return `
    <article class="directory-card">
      <div class="ranking-head">
        <span class="avatar">${initials(user.name)}</span>
        <div>
          <h3>${user.name}</h3>
          <p class="muted">${user.niche || "Creator"} / ${user.location || "No location"}</p>
        </div>
      </div>
      <div class="availability-line">
        <span>Available within ${Number(user.availabilityRadiusKm || 50)} km</span>
        <strong>${distance} km away</strong>
      </div>
      <div class="ranking-metrics">
        <div><span>Reach</span><strong>${Number(user.followers || 0).toLocaleString("en-IN")}</strong></div>
        <div><span>Accepted</span><strong>${accepted}</strong></div>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" data-contact="${user.name}">Contact</button>
      </div>
    </article>
  `;
}

function renderInfluencerRankings() {
  const rankings = getInfluencerRankings();
  return `
    <section class="ranking-section">
      <div class="campaign-top">
        <div>
          <p class="eyebrow">Influencer ranking</p>
          <h2>Compare creators by paid value, reach, and campaign performance.</h2>
          <p class="muted">Demo ranking score combines follower reach, accepted campaign value, collaboration count, and rating.</p>
        </div>
      </div>
      <div class="ranking-grid">
        ${rankings.map((item, index) => renderRankingCard(item, index)).join("")}
      </div>
    </section>
  `;
}

function getInfluencerRankings() {
  return state.users
    .filter((user) => user.role === "influencer")
    .map((user) => {
      const applications = state.applications.filter((application) => application.influencerId === user.id);
      const paidApplications = applications.filter((application) => application.status === "Accepted" || application.status === "Completed");
      const paidValue = paidApplications.reduce((total, application) => {
        const campaign = state.campaigns.find((item) => item.id === application.campaignId);
        return total + Number(campaign?.budget || 0);
      }, 0);
      const ratings = applications.map((application) => Number(application.rating || 0)).filter(Boolean);
      const averageRating = ratings.length
        ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
        : 0;
      const reach = Number(user.followers || 0);
      const score = Math.round(
        Math.min(reach / 1000, 70) +
        Math.min(paidValue / 1000, 35) +
        paidApplications.length * 8 +
        averageRating * 5
      );

      return {
        user,
        reach,
        paidValue,
        paidCount: paidApplications.length,
        averageRating,
        score
      };
    })
    .sort((a, b) => b.score - a.score);
}

function renderRankingCard(item, index) {
  const labels = [];
  if (item.paidValue > 0) labels.push("Paid");
  if (item.reach >= 50000) labels.push("High reach");
  if (item.averageRating >= 4.5) labels.push("Top rated");
  if (!labels.length) labels.push("Rising");

  return `
    <article class="ranking-card ${index === 0 ? "top-rank" : ""}">
      <div class="ranking-head">
        <span class="rank-number">#${index + 1}</span>
        <span class="avatar">${initials(item.user.name)}</span>
        <div>
          <h3>${item.user.name}</h3>
          <p class="muted">${item.user.niche || "Creator"} / ${item.user.location || "No location"}</p>
        </div>
      </div>
      <div class="meta-row">
        ${labels.map((label) => `<span class="tag">${label}</span>`).join("")}
      </div>
      <div class="ranking-metrics">
        <div><span>Reach</span><strong>${item.reach.toLocaleString("en-IN")}</strong></div>
        <div><span>Range</span><strong>${Number(item.user.availabilityRadiusKm || 50)} km</strong></div>
        <div><span>Paid value</span><strong>${money(item.paidValue)}</strong></div>
        <div><span>Paid collabs</span><strong>${item.paidCount}</strong></div>
        <div><span>Rating</span><strong>${item.averageRating ? item.averageRating.toFixed(1) : "New"}</strong></div>
      </div>
      <div class="rank-score">
        <span>Ranking score</span>
        <strong>${item.score}</strong>
      </div>
    </article>
  `;
}

function influencerDashboard(user) {
  const applications = state.applications.filter((application) => application.influencerId === user.id);
  const filteredCampaigns = state.campaigns.filter((campaign) => {
    const categoryMatch = filters.category === "All" || campaign.category === filters.category;
    const locationMatch = filters.location === "All" || campaign.location === filters.location;
    return categoryMatch && locationMatch;
  });

  return `
    <section class="dashboard-hero">
      <div>
        <p class="eyebrow">Influencer workflow</p>
        <h2>Build your profile, find campaigns, and track application status.</h2>
        <p>Matching score uses your niche and location against campaign category and city.</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span class="muted">Followers</span><strong>${Number(user.followers || 0).toLocaleString("en-IN")}</strong></div>
        <div class="stat-card"><span class="muted">Applications</span><strong>${applications.length}</strong></div>
      </div>
    </section>

    ${renderInfluencerSections(user, applications)}

    <section class="dashboard-grid">
      <aside class="panel">
        <h2>Creator profile</h2>
        <form class="form-grid" id="profile-form">
          <label>Name<input required name="name" value="${escapeAttr(user.name)}"></label>
          <label>Niche<select required name="niche">${optionList(categories, user.niche || "Food")}</select></label>
          <label>Followers<input required type="number" min="0" name="followers" value="${user.followers || 0}"></label>
          <label>Location<select required name="location">${optionList(locations, user.location || "Mumbai")}</select></label>
          <label>Available range (km)<input required type="number" min="5" max="1500" name="availabilityRadiusKm" value="${user.availabilityRadiusKm || 50}"></label>
          <label>Short bio<textarea name="bio">${user.bio || ""}</textarea></label>
          <button class="primary-btn" type="submit">Save profile</button>
        </form>

        <h2 style="margin-top:24px">Work showcase</h2>
        <p class="muted">Add past collaborations so businesses can review your style.</p>
        <form class="form-grid" id="showcase-form">
          <label>Project title<input required name="title" placeholder="Cafe launch reel"></label>
          <label>Category<select required name="category">${optionList(categories, user.niche || "Food")}</select></label>
          <label>Image URL<input name="image" placeholder="Optional image link"></label>
          <label>Result<textarea required name="result" placeholder="Example: 20K views, 500 saves, 35 leads"></textarea></label>
          <button class="secondary-btn" type="submit">Add showcase item</button>
        </form>
        ${renderShowcaseGallery(user, true)}

        <h2 style="margin-top:24px">Application status</h2>
        <div class="list">
          ${applications.length ? applications.map(renderInfluencerApplication).join("") : emptyState("Apply to a campaign to see status here.")}
        </div>
      </aside>

      <section class="panel">
        ${renderSavedCampaigns(user)}

        <div class="campaign-top">
          <div>
            <h2>Available campaigns</h2>
            <p class="muted">Filter by category and location for basic matching.</p>
          </div>
        </div>
        <div class="filter-row">
          <label>Category<select id="category-filter"><option>All</option>${optionList(categories, filters.category)}</select></label>
          <label>Location<select id="location-filter"><option>All</option>${optionList(locations, filters.location)}</select></label>
        </div>
        <div class="list">
          ${filteredCampaigns.length ? filteredCampaigns.map((campaign) => renderCampaignForInfluencer(campaign, user)).join("") : emptyState("No campaigns match these filters.")}
        </div>
      </section>
    </section>
  `;
}

function renderBusinessCampaign(campaign) {
  const applications = state.applications.filter((application) => application.campaignId === campaign.id);
  return `
    <article class="campaign-card">
      <div class="campaign-top">
        <div>
          <h3>${campaign.title}</h3>
          <p class="muted">${campaign.description}</p>
        </div>
        <span class="status accepted">${campaign.status}</span>
      </div>
      <div class="meta-row">
        <span class="tag">${campaign.category}</span>
        <span class="tag">${campaign.location}</span>
        <span class="tag">${money(campaign.budget)}</span>
      </div>
      <h3>Applicants</h3>
      <div class="list">
        ${applications.length ? applications.map((application) => renderApplicant(application, campaign)).join("") : emptyState("No influencers have applied yet.")}
      </div>
    </article>
  `;
}

function renderApplicant(application, campaign) {
  const influencer = state.users.find((user) => user.id === application.influencerId);
  if (!influencer) return "";
  return `
    <article class="application-card">
      <div class="campaign-top">
        <div>
          <h3>${influencer.name}</h3>
          <p class="muted">${influencer.niche || "Creator"} / ${Number(influencer.followers || 0).toLocaleString("en-IN")} followers / ${influencer.location || "No location"}</p>
        </div>
        <span class="status ${application.status.toLowerCase()}">${application.status}</span>
      </div>
      <p>${application.message}</p>
      ${renderShowcaseGallery(influencer, false)}
      <div class="card-actions">
        <button class="success-btn" data-status="${application.id}:Accepted">Accept</button>
        <button class="danger-btn" data-status="${application.id}:Rejected">Reject</button>
        <button class="secondary-btn" data-contact="${influencer.name}">Contact</button>
      </div>
      ${application.status === "Accepted" ? ratingUi(application) : ""}
    </article>
  `;
}

function renderCampaignForInfluencer(campaign, user) {
  const hasApplied = state.applications.some((application) =>
    application.campaignId === campaign.id && application.influencerId === user.id
  );
  const business = state.users.find((candidate) => candidate.id === campaign.businessId);
  const score = matchScore(campaign, user);
  const isSaved = (user.savedCampaigns || []).includes(campaign.id);

  return `
    <article class="campaign-card">
      <div class="campaign-top">
        <div>
          <h3>${campaign.title}</h3>
          <p class="muted">${business?.businessName || business?.name || "Local business"}</p>
        </div>
        <span class="match-score">${score}%</span>
      </div>
      <p>${campaign.description}</p>
      <div class="meta-row">
        <span class="tag">${campaign.category}</span>
        <span class="tag">${campaign.location}</span>
        <span class="tag">${money(campaign.budget)}</span>
      </div>
      <div class="card-actions">
        <button class="ghost-btn" data-save-campaign="${campaign.id}">${isSaved ? "Saved" : "Save"}</button>
      </div>
      <form class="form-grid apply-form" data-campaign-id="${campaign.id}">
        <label>Application note<textarea name="message" ${hasApplied ? "disabled" : ""}>${hasApplied ? "Already applied to this campaign." : ""}</textarea></label>
        <button class="${hasApplied ? "ghost-btn" : "primary-btn"}" ${hasApplied ? "disabled" : ""} type="submit">${hasApplied ? "Applied" : "Apply now"}</button>
      </form>
    </article>
  `;
}

function renderInfluencerSections(user, applications) {
  const pending = applications.filter((application) => application.status === "Pending").length;
  const accepted = applications.filter((application) => application.status === "Accepted" || application.status === "Completed").length;
  const avgMatch = state.campaigns.length
    ? Math.round(state.campaigns.reduce((total, campaign) => total + matchScore(campaign, user), 0) / state.campaigns.length)
    : 0;
  const estimatedValue = applications.reduce((total, application) => {
    const campaign = state.campaigns.find((item) => item.id === application.campaignId);
    return total + (application.status === "Accepted" || application.status === "Completed" ? Number(campaign?.budget || 0) : 0);
  }, 0);

  return `
    <section class="influencer-sections">
      <article class="insight-card profile-snapshot">
        <span class="section-icon">01</span>
        <h2>Profile snapshot</h2>
        <p>${user.bio || "Add a short bio so businesses understand your creator style."}</p>
        <div class="meta-row">
          <span class="tag">${user.niche || "Niche not set"}</span>
          <span class="tag">${user.location || "Location not set"}</span>
          <span class="tag">${Number(user.followers || 0).toLocaleString("en-IN")} followers</span>
        </div>
      </article>
      <article class="insight-card">
        <span class="section-icon">02</span>
        <h2>Campaign pipeline</h2>
        <div class="pipeline-list">
          <div><span>Pending</span><strong>${pending}</strong></div>
          <div><span>Accepted</span><strong>${accepted}</strong></div>
          <div><span>Saved</span><strong>${(user.savedCampaigns || []).length}</strong></div>
        </div>
      </article>
      <article class="insight-card">
        <span class="section-icon">03</span>
        <h2>Creator insights</h2>
        <div class="pipeline-list">
          <div><span>Avg. match</span><strong>${avgMatch}%</strong></div>
          <div><span>Accepted value</span><strong>${money(estimatedValue)}</strong></div>
        </div>
      </article>
      <article class="insight-card">
        <span class="section-icon">04</span>
        <h2>Pitch checklist</h2>
        <ul class="checklist">
          <li>Complete profile details</li>
          <li>Add at least two work samples</li>
          <li>Apply with a custom campaign note</li>
        </ul>
      </article>
    </section>
  `;
}

function renderSavedCampaigns(user) {
  const savedCampaigns = state.campaigns.filter((campaign) => (user.savedCampaigns || []).includes(campaign.id));
  return `
    <section class="saved-section">
      <div class="campaign-top">
        <div>
          <h2>Saved opportunities</h2>
          <p class="muted">Shortlist campaigns you want to revisit before applying.</p>
        </div>
      </div>
      <div class="saved-strip">
        ${savedCampaigns.length ? savedCampaigns.map((campaign) => `
          <article class="saved-card">
            <strong>${campaign.title}</strong>
            <span>${campaign.category} / ${campaign.location}</span>
            <button class="ghost-btn mini-btn" data-save-campaign="${campaign.id}">Remove</button>
          </article>
        `).join("") : emptyState("No saved campaigns yet. Use Save on any campaign below.")}
      </div>
    </section>
  `;
}

function renderInfluencerApplication(application) {
  const campaign = state.campaigns.find((item) => item.id === application.campaignId);
  if (!campaign) return "";
  return `
    <article class="application-card">
      <div class="campaign-top">
        <div>
          <h3>${campaign.title}</h3>
          <p class="muted">${campaign.category} / ${campaign.location}</p>
        </div>
        <span class="status ${application.status.toLowerCase()}">${application.status}</span>
      </div>
      ${application.status === "Accepted" ? `<div class="contact-box">Contact shared: collab@influmatch.demo</div>${ratingUi(application)}` : ""}
    </article>
  `;
}

function renderShowcaseGallery(user, editable = false) {
  const items = user.showcase || [];
  if (!items.length) {
    return `<div class="showcase-block">${emptyState(editable ? "Add work samples to build your creator portfolio." : "No showcase items added yet.")}</div>`;
  }

  return `
    <div class="showcase-block">
      <div class="showcase-grid ${editable ? "" : "compact"}">
        ${items.map((item) => renderShowcaseItem(item, editable)).join("")}
      </div>
    </div>
  `;
}

function renderShowcaseItem(item, editable) {
  return `
    <article class="showcase-card">
      <div class="showcase-media" style="${showcaseImageStyle(item)}">
        ${item.image ? "" : `<span>${initials(item.title)}</span>`}
      </div>
      <div class="showcase-body">
        <div class="campaign-top">
          <div>
            <h3>${item.title}</h3>
            <p class="muted">${item.category}</p>
          </div>
          ${editable ? `<button class="ghost-btn mini-btn" data-remove-work="${item.id}">Remove</button>` : ""}
        </div>
        <p>${item.result}</p>
      </div>
    </article>
  `;
}

function showcaseImageStyle(item) {
  if (item.image) {
    return `background-image: linear-gradient(rgba(23, 32, 51, 0.05), rgba(23, 32, 51, 0.05)), url('${escapeAttr(item.image)}');`;
  }
  const themes = {
    Food: "linear-gradient(135deg, #ffefe9, #ffd8ad)",
    Fitness: "linear-gradient(135deg, #e7f8f2, #b8ecd8)",
    Fashion: "linear-gradient(135deg, #f1ecff, #d7c9ff)",
    Travel: "linear-gradient(135deg, #eaf2ff, #bcd7ff)",
    Beauty: "linear-gradient(135deg, #fff0ec, #ffc7dd)",
    Tech: "linear-gradient(135deg, #eaf2ff, #d2f2ff)"
  };
  return `background: ${themes[item.category] || themes.Food};`;
}

function ratingUi(application) {
  const current = Number(application.rating || 0);
  return `
    <div class="rating-row" aria-label="Rate collaboration">
      <span class="muted">Rating:</span>
      ${[1, 2, 3, 4, 5].map((star) => `
        <button class="star-btn" data-rate="${application.id}:${star}" aria-label="Rate ${star} stars">${star <= current ? "&#9733;" : "&#9734;"}</button>
      `).join("")}
    </div>
  `;
}

function optionList(values, selected = "") {
  return values.map((value) => `<option ${value === selected ? "selected" : ""}>${value}</option>`).join("");
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function initials(name = "IM") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeAttr(value = "") {
  return String(value).replaceAll('"', "&quot;");
}

// Basic matching logic for the college prototype:
// category match + location match + follower boost.
function matchScore(campaign, user) {
  let score = 40;
  if (campaign.category === user.niche) score += 35;
  if (campaign.location === user.location) score += 20;
  if (Number(user.followers || 0) >= 10000) score += 5;
  return Math.min(score, 100);
}

function distanceBetweenCities(from, to) {
  if (from === to) return 0;
  const start = cityCoordinates[from];
  const end = cityCoordinates[to];
  if (!start || !end) return 9999;
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(end.lat - start.lat);
  const dLng = degreesToRadians(end.lng - start.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(start.lat)) *
      Math.cos(degreesToRadians(end.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusKm * c);
}

function degreesToRadians(value) {
  return value * (Math.PI / 180);
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const email = form.get("email").trim().toLowerCase();
  const password = form.get("password").trim();
  const isSignup = event.target.closest(".auth-card").querySelector("h1").textContent.includes("Create");

  if (isSignup) {
    if (state.users.some((user) => user.email === email)) {
      showToast("This email already exists. Try login instead.");
      return;
    }
    const user = {
      id: `user-${Date.now()}`,
      name: form.get("name").trim(),
      email,
      password,
      role: selectedRole,
      location: "Mumbai"
    };
    if (selectedRole === "business") {
      user.businessName = user.name;
      user.businessType = "";
      user.businessStory = "";
      user.businessHighlights = "";
      user.businessMedia = [];
    }
    if (selectedRole === "influencer") {
      user.niche = "Food";
      user.followers = 0;
      user.availabilityRadiusKm = 50;
      user.bio = "";
      user.savedCampaigns = [];
      user.showcase = [];
    }
    state.users.push(user);
    state.currentUserId = user.id;
    saveState();
    setView("dashboard");
    showToast("Account created. You are ready to demo.");
    return;
  }

  const user = state.users.find((candidate) => candidate.email === email && candidate.password === password);
  if (!user) {
    showToast("Invalid login. Try demo123 as password.");
    return;
  }
  state.currentUserId = user.id;
  saveState();
  setView("dashboard");
}

// Business users create campaigns that immediately become visible to influencers.
function handleCampaignSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  const form = new FormData(event.target);
  state.campaigns.unshift({
    id: `camp-${Date.now()}`,
    businessId: user.id,
    title: form.get("title").trim(),
    description: form.get("description").trim(),
    category: form.get("category"),
    budget: Number(form.get("budget")),
    location: form.get("location"),
    status: "Open"
  });
  saveState();
  renderDashboard();
  showToast("Campaign posted. Influencers can now apply.");
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  const form = new FormData(event.target);
  Object.assign(user, {
    name: form.get("name").trim(),
    niche: form.get("niche"),
    followers: Number(form.get("followers")),
    location: form.get("location"),
    availabilityRadiusKm: Number(form.get("availabilityRadiusKm")),
    bio: form.get("bio").trim()
  });
  saveState();
  renderDashboard();
  showToast("Profile saved. Match scores updated.");
}

function handleBusinessProfileSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  const form = new FormData(event.target);
  Object.assign(user, {
    name: form.get("businessName").trim(),
    businessName: form.get("businessName").trim(),
    businessType: form.get("businessType").trim(),
    location: form.get("location"),
    businessStory: form.get("businessStory").trim(),
    businessHighlights: form.get("businessHighlights").trim()
  });
  saveState();
  renderDashboard();
  showToast("Business profile saved.");
}

function handleBusinessMediaSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  const form = new FormData(event.target);
  user.businessMedia = user.businessMedia || [];
  user.businessMedia.unshift({
    id: `media-${Date.now()}`,
    type: form.get("type"),
    title: form.get("title").trim(),
    url: form.get("url").trim(),
    caption: form.get("caption").trim()
  });
  saveState();
  renderDashboard();
  showToast("Business media added.");
}

function handleShowcaseSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  const form = new FormData(event.target);
  user.showcase = user.showcase || [];
  user.showcase.unshift({
    id: `work-${Date.now()}`,
    title: form.get("title").trim(),
    category: form.get("category"),
    image: form.get("image").trim(),
    result: form.get("result").trim()
  });
  saveState();
  renderDashboard();
  showToast("Showcase item added to your profile.");
}

// Influencer applications are connected by campaignId and influencerId.
function handleApplySubmit(event) {
  event.preventDefault();
  const user = currentUser();
  const campaignId = event.target.dataset.campaignId;
  const form = new FormData(event.target);
  state.applications.unshift({
    id: `app-${Date.now()}`,
    campaignId,
    influencerId: user.id,
    message: form.get("message").trim() || "I am interested in this collaboration.",
    status: "Pending",
    rating: 0
  });
  saveState();
  renderDashboard();
  showToast("Application sent to the business.");
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) setView(viewButton.dataset.view);

  const roleButton = event.target.closest("[data-auth-role]");
  if (roleButton) setView("signup", { role: roleButton.dataset.authRole });

  const roleOption = event.target.closest("[data-role-option]");
  if (roleOption) renderAuth("signup", roleOption.dataset.roleOption);

  const logoutButton = event.target.closest("#logout-btn");
  if (logoutButton) {
    state.currentUserId = null;
    saveState();
    setView("landing");
  }

  const statusButton = event.target.closest("[data-status]");
  if (statusButton) {
    const [id, status] = statusButton.dataset.status.split(":");
    const application = state.applications.find((item) => item.id === id);
    application.status = status;
    saveState();
    renderDashboard();
    showToast(`Application marked as ${status}.`);
  }

  const contactButton = event.target.closest("[data-contact]");
  if (contactButton) showToast(`Message box demo: contact ${contactButton.dataset.contact} at collab@influmatch.demo`);

  const rateButton = event.target.closest("[data-rate]");
  if (rateButton) {
    const [id, rating] = rateButton.dataset.rate.split(":");
    const application = state.applications.find((item) => item.id === id);
    application.rating = Number(rating);
    application.status = "Completed";
    saveState();
    renderDashboard();
    showToast("Rating saved for demo.");
  }

  const removeWorkButton = event.target.closest("[data-remove-work]");
  if (removeWorkButton) {
    const user = currentUser();
    user.showcase = (user.showcase || []).filter((item) => item.id !== removeWorkButton.dataset.removeWork);
    saveState();
    renderDashboard();
    showToast("Showcase item removed.");
  }

  const saveCampaignButton = event.target.closest("[data-save-campaign]");
  if (saveCampaignButton) {
    const user = currentUser();
    user.savedCampaigns = user.savedCampaigns || [];
    const campaignId = saveCampaignButton.dataset.saveCampaign;
    const alreadySaved = user.savedCampaigns.includes(campaignId);
    user.savedCampaigns = alreadySaved
      ? user.savedCampaigns.filter((id) => id !== campaignId)
      : [...user.savedCampaigns, campaignId];
    saveState();
    renderDashboard();
    showToast(alreadySaved ? "Campaign removed from saved." : "Campaign saved.");
  }

  const removeMediaButton = event.target.closest("[data-remove-media]");
  if (removeMediaButton) {
    const user = currentUser();
    user.businessMedia = (user.businessMedia || []).filter((item) => item.id !== removeMediaButton.dataset.removeMedia);
    saveState();
    renderDashboard();
    showToast("Business media removed.");
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "auth-form") handleAuthSubmit(event);
  if (event.target.id === "campaign-form") handleCampaignSubmit(event);
  if (event.target.id === "business-profile-form") handleBusinessProfileSubmit(event);
  if (event.target.id === "business-media-form") handleBusinessMediaSubmit(event);
  if (event.target.id === "profile-form") handleProfileSubmit(event);
  if (event.target.id === "showcase-form") handleShowcaseSubmit(event);
  if (event.target.classList.contains("apply-form")) handleApplySubmit(event);
});

document.addEventListener("change", (event) => {
  if (event.target.id === "category-filter") {
    filters.category = event.target.value;
    renderDashboard();
  }
  if (event.target.id === "location-filter") {
    filters.location = event.target.value;
    renderDashboard();
  }
  if (event.target.id === "business-location-filter") {
    businessDirectoryFilters.location = event.target.value;
    renderDashboard();
  }
  if (event.target.id === "business-range-filter") {
    businessDirectoryFilters.range = event.target.value;
    renderDashboard();
  }
});

setView(currentUser() ? "dashboard" : "landing");
