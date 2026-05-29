/* ==========================================================================
   DMU Hackers maintainable site content

   Update this file when committee, Pwn2Play categories, prizes, rules, or
   results change. main.js renders the relevant sections from this object.
   ========================================================================== */

window.DMU_SITE_CONTENT = {
  site: {
    discordUrl: "https://discord.gg/Vvrk4kK",
    navigation: {
      default: [
        { text: "Home", href: "index.html" },
        { text: "About", href: "index.html#about" },
        { text: "Resources", href: "resources.html" },
        { text: "Pwn2Play", href: "P2P.html" },
        { text: "Committee", href: "committee.html" },
        { text: "Sponsors", href: "sponsors.html" },
        { text: "Join Us", href: "https://discord.gg/Vvrk4kK", icon: "fab fa-discord", cta: true, mobileOnly: true }
      ],
      "index.html": [
        { text: "Home", href: "#hero", section: "hero", active: true },
        { text: "About", href: "#about", section: "about" },
        { text: "Get Started", href: "#getting-started", section: "getting-started" },
        { text: "Resources", href: "#resources", section: "resources" },
        { text: "Pwn2Play", href: "#pwn2play", section: "pwn2play" },
        { text: "Facilities", href: "#facilities", section: "facilities" },
        { text: "Committee", href: "#committee", section: "committee" },
        { text: "Partners", href: "#partners", section: "partners" },
        { text: "Join Us", href: "https://discord.gg/Vvrk4kK", icon: "fab fa-discord", cta: true, mobileOnly: true }
      ],
      "P2P.html": [
        { text: "Home", href: "index.html" },
        { text: "Pwn2Play", href: "#p2p-hero", section: "p2p-hero", active: true },
        { text: "Pulse", href: "#event-pulse", section: "event-pulse" },
        { text: "Schedule", href: "#schedule", section: "schedule" },
        { text: "Categories", href: "#categories", section: "categories" },
        { text: "Breakdown", href: "#challenge-spread", section: "challenge-spread" },
        { text: "Rules", href: "#rules", section: "rules" },
        { text: "Sponsors", href: "#sponsors", section: "sponsors" }
      ],
      "committee.html": [
        { text: "Home", href: "index.html" },
        { text: "About", href: "index.html#about" },
        { text: "Facilities", href: "index.html#facilities" },
        { text: "Committee", href: "#timeline", section: "timeline", active: true },
        { text: "Join Us", href: "https://discord.gg/Vvrk4kK", icon: "fab fa-discord", cta: true, mobileOnly: true }
      ]
    },
    footer: {
      description: "De Montfort University's cyber security society. Hacking, learning, and competing since 2015.",
      socials: [
        { label: "Twitter", href: "https://twitter.com/dmuhackers", icon: "fab fa-x-twitter" },
        { label: "GitHub", href: "https://github.com/DMUHackers", icon: "fab fa-github" },
        { label: "Instagram", href: "https://www.instagram.com/hackers.dmu", icon: "fab fa-instagram" },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/dmu-hackers/", icon: "fab fa-linkedin-in" },
        { label: "Discord", href: "https://discord.gg/Vvrk4kK", icon: "fab fa-discord" }
      ],
      columns: [
        {
          heading: "Navigate",
          label: "Footer navigation",
          links: [
            { text: "Home", href: "index.html" },
            { text: "About", href: "index.html#about" },
            { text: "Resources", href: "resources.html" },
            { text: "Committee", href: "committee.html" }
          ]
        },
        {
          heading: "Events",
          label: "Events navigation",
          links: [
            { text: "Pwn2Play", href: "P2P.html" },
            { text: "Register", href: "register.html" },
            { text: "Results", href: "P2P.html#podium" },
            { text: "Sponsors", href: "sponsors.html" }
          ]
        },
        {
          heading: "Join",
          label: "Join navigation",
          links: [
            { text: "Discord Server", href: "https://discord.gg/Vvrk4kK" },
            { text: "DSU Page", href: "https://www.demontfortsu.com/organisation/dmuhackers/" }
          ]
        }
      ]
    }
  },
  committee: {
    currentYear: "2026/27",
    currentTag: "26/27 Committee",
    currentMembers: [
      {
        name: "Josh",
        fullName: "Josh Lloyd",
        role: "Chairman",
        icon: "fas fa-terminal",
        linkedin: "https://www.linkedin.com/in/josh-lloyd-227583366/"
      },
      {
        name: "Nikita",
        fullName: "Nikita Borodins",
        role: "Secretary",
        icon: "fas fa-keyboard"
      },
      {
        name: "Amara",
        fullName: "Amara Gouldbourne-Beckford",
        role: "Treasurer",
        icon: "fas fa-coins",
        linkedin: "https://www.linkedin.com/in/amara-g-98ab2a270/"
      },
      {
        name: "Deniz",
        fullName: "Deniz Turgut",
        role: "Wellbeing Officer",
        icon: "fas fa-heart-pulse"
      },
      {
        name: "Vacant",
        fullName: "Vacant",
        role: "CTF Officer",
        icon: "fas fa-user-plus",
        vacant: true
      },
      {
        name: "Ashley",
        fullName: "Ashley Ray",
        role: "CTF Mentor",
        icon: "fas fa-graduation-cap"
      }
    ],
    timeline: [
      {
        year: "2026/27",
        side: "left",
        chair: { name: "Josh Lloyd", role: "Chairman", icon: "fas fa-terminal" },
        roles: [
          { name: "Nikita Borodins", role: "Secretary", icon: "fas fa-keyboard" },
          { name: "Amara Gouldbourne-Beckford", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Deniz Turgut", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" },
          { name: "Vacant", role: "CTF Officer", icon: "fas fa-user-plus", vacant: true },
          { name: "Ashley Ray", role: "CTF Mentor", icon: "fas fa-graduation-cap" }
        ]
      },
      {
        year: "2025/26",
        side: "right",
        chair: { name: "Adam Welbourne", role: "Chairman", icon: "fas fa-user-secret" },
        roles: [
          { name: "Josh Lloyd", role: "Secretary", icon: "fas fa-terminal" },
          { name: "Amara Gouldbourne-Beckford", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Abbey Rhodes", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" },
          { name: "Charlie Burrows", role: "CTF Officer", icon: "fas fa-flag" },
          { name: "Ethan Bauer", role: "CTF Mentor", icon: "fas fa-graduation-cap" }
        ]
      },
      {
        year: "2024/25",
        side: "left",
        chair: { name: "Jack Wright", role: "Chairman", icon: "fas fa-user-shield" },
        roles: [
          { name: "Dilan Goodwin", role: "Secretary", icon: "fas fa-terminal" },
          { name: "Orlin Lyon", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Adam Welbourne", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" }
        ]
      },
      {
        year: "2023/24",
        side: "right",
        chair: { name: "Joey Turner", role: "Chairman", icon: "fas fa-skull-crossbones" },
        roles: [
          { name: "Matt Farmery", role: "Secretary", icon: "fas fa-terminal" },
          { name: "Orlin Lyon", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Rory Markham", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" },
          { name: "Izzy Boyce-Wythe", role: "Social Secretary", icon: "fas fa-champagne-glasses" }
        ]
      },
      {
        year: "2022/23",
        side: "left",
        chair: { name: "Joe McNally", role: "Chairman", icon: "fas fa-code" },
        roles: [
          { name: "Jordan Chapman", role: "Secretary", icon: "fas fa-terminal" },
          { name: "Rebecca Gibson", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Dilan Goodwin", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" }
        ]
      },
      {
        year: "2021/22",
        side: "right",
        chair: { name: "Brandon Harwood", role: "Chairman", icon: "fas fa-laptop-code" },
        roles: [
          { name: "Joe McDonnell", role: "Secretary", icon: "fas fa-terminal" },
          { name: "Brandon Jones", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Oliver Crowder", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" },
          { name: "Alecia Wallace", role: "Social Secretary", icon: "fas fa-champagne-glasses" }
        ]
      },
      {
        year: "2020/21",
        side: "left",
        chair: { name: "Jacob Wood", role: "Chairman", icon: "fas fa-bug" },
        roles: [
          { name: "Maximillian Ward", role: "Secretary", icon: "fas fa-terminal" },
          { name: "Matthew Ford", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Arnas Valteris", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" },
          { name: "Rebecca Gibson", role: "Social Secretary", icon: "fas fa-champagne-glasses" }
        ]
      },
      {
        year: "2019/20",
        side: "right",
        chair: { name: "Arron O'Neill", role: "Chairman", icon: "fas fa-network-wired" },
        roles: [
          { name: "Jacob Wood", role: "Secretary", icon: "fas fa-keyboard" },
          { name: "Derran Kyle", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Logan King", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" },
          { name: "Joe McDonnell", role: "Social Secretary", icon: "fas fa-champagne-glasses" }
        ]
      },
      {
        year: "2018/19",
        side: "left",
        chair: { name: "Chris Hatton", role: "Chairman", icon: "fas fa-shield-halved" },
        roles: [
          { name: "Harrison", role: "Secretary", icon: "fas fa-keyboard" },
          { name: "Arron O'Neill", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Derran Kyle", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" },
          { name: "Julian Nguyen", role: "Social Secretary", icon: "fas fa-champagne-glasses" }
        ]
      },
      {
        year: "2017/18",
        side: "right",
        chair: { name: "Derran Kyle", role: "Chairman", icon: "fas fa-microchip" },
        roles: [
          { name: "Chris Hatton", role: "Secretary", icon: "fas fa-keyboard" },
          { name: "Jamie Spencer", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Naim Maoun", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" }
        ]
      },
      {
        year: "2016/17",
        side: "left",
        chair: { name: "Harrison", role: "Chairman", icon: "fas fa-rocket" },
        roles: [
          { name: "Sam Mills", role: "Secretary", icon: "fas fa-keyboard" },
          { name: "Ciaran Kimberlin", role: "Treasurer", icon: "fas fa-coins" },
          { name: "Jamie Spencer", role: "Wellbeing Officer", icon: "fas fa-heart-pulse" }
        ]
      },
      {
        year: "2015/16",
        side: "right",
        chair: { name: "Jeszica Natasha", role: "Chairman", icon: "fas fa-star" },
        roles: [
          { name: "Barnaby Stewart", role: "Secretary", icon: "fas fa-keyboard" }
        ]
      }
    ]
  },
  p2p: {
    event: {
      name: "Pwn2Play: Core Incursion",
      start: "2026-05-30T09:00:00+01:00",
      end: "2026-05-30T18:00:00+01:00"
    },
    categories: [
      { title: "Web Exploitation", count: 12, color: "#c8102e", icon: "fas fa-globe", text: "SQL injection, XSS, SSRF, authentication bypasses and web logic flaws." },
      { title: "Miscellaneous", count: 8, color: "#00e4ff", icon: "fas fa-puzzle-piece", text: "Unexpected formats, strange clues and challenge ideas that refuse one label." },
      { title: "Forensics", count: 5, color: "#f4c95d", icon: "fas fa-fingerprint", text: "Recover evidence from captures, filesystems, memory, logs and hidden artefacts." },
      { title: "Full-Pwn", count: 5, color: "#e879f9", icon: "fas fa-skull-crossbones", text: "Chain attack paths from initial access to deeper compromise." },
      { title: "OSINT", count: 5, color: "#34d399", icon: "fas fa-magnifying-glass", text: "Track down answers through public records, digital footprints and careful research." },
      { title: "Reverse Engineering", count: 5, color: "#8b5cf6", icon: "fas fa-microchip", text: "Disassemble, decompile and decode binaries to uncover hidden logic." },
      { title: "Cryptography", count: 4, color: "#f97316", icon: "fas fa-lock", text: "Break ciphers, exploit weak implementations and reason about flawed secrecy." },
      { title: "Binary Exploitation", count: 3, color: "#f43f5e", icon: "fas fa-terminal", text: "Break compiled targets with memory corruption, control flow and exploit craft." },
      { title: "Scripting", count: 3, color: "#14b8a6", icon: "fas fa-scroll", text: "Automate parsing, brute force paths and transform data under time pressure." },
      { title: "Code", count: 1, color: "#a3e635", icon: "fas fa-code", text: "Solve a focused programming problem with clean logic and fast execution." },
      { title: "Intro", count: 1, color: "#38bdf8", icon: "fas fa-flag-checkered", text: "A first flag to get teams settled into the platform and event flow." },
      { title: "Linux", count: 1, color: "#94a3b8", icon: "fab fa-linux", text: "Navigate shells, permissions, processes and system clues like an operator." }
    ],
    difficultyBreakdown: [
      { title: "Easy", count: 24, color: "#34d399" },
      { title: "Medium", count: 15, color: "#00e4ff" },
      { title: "Hard", count: 9, color: "#f4c95d" },
      { title: "Extra Hard", count: 3, color: "#c8102e" },
      { title: "Trivial", count: 2, color: "#8b5cf6" }
    ],
    pulse: {
      tag: "Live Pulse",
      title: "Core Incursion at a Glance",
      subtitle: "Live as the event unfolds — updated by the committee on the day.",
      stats: [
        { key: "signups", label: "Signups", value: "300+", suffix: "members on Biterra" },
        { key: "teams", label: "Teams", value: "200+", suffix: "registered" },
        { key: "challenges", label: "Challenges", value: "50+", suffix: "across 12 categories" },
        { key: "flags", label: "Flags Pwned", value: "—", suffix: "Live on 30 May" }
      ]
    },
    rules: [
      {
        title: "General Conduct",
        icon: "fas fa-handshake",
        items: [
          "Respect all participants, organisers, and the integrity of the competition.",
          "No harassment, discrimination, or toxic behaviour will be tolerated.",
          "Follow all university IT policies and legal regulations."
        ]
      },
      {
        title: "AI Usage Policy",
        icon: "fas fa-triangle-exclamation",
        critical: true,
        items: [
          "AI usage is strictly forbidden in the main event.",
          "Teams found using AI in the main event will be disqualified.",
          "A separate AI-only scoreboard will be available on the Pwn2Play platform for teams who choose to use AI."
        ]
      },
      {
        title: "Server & Network Use",
        icon: "fas fa-server",
        items: [
          "Only interact with CTF challenges and infrastructure. Do not target other participants or university systems.",
          "Denial of Service (DoS/DDoS) attacks against the server, network, or participants are strictly prohibited.",
          "Scanning outside the designated CTF scope is forbidden."
        ]
      },
      {
        title: "Fair Play & Ethics",
        icon: "fas fa-scale-balanced",
        items: [
          "No brute-forcing challenge platforms, flag submission forms, or administrative panels unless explicitly part of a challenge.",
          "Do not share, trade, or leak flags, solutions, or hints to other participants.",
          "No automated tools/scripts that degrade server performance (e.g., aggressive scanning, spamming requests)."
        ]
      },
      {
        title: "Virtual Participants",
        icon: "fas fa-laptop",
        items: [
          "Maintain a stable internet connection and avoid using VPNs/proxies unless required for a challenge.",
          "Keep your credentials secure. Do not share your access keys or login information.",
          "Follow organiser instructions in the event of technical issues."
        ]
      },
      {
        title: "Challenge & Flag Submission",
        icon: "fas fa-flag",
        items: [
          "Flags must be submitted exactly as retrieved, in the expected format.",
          "If a challenge is broken, report it to an admin instead of exploiting it.",
          "The organisers' decisions on challenge validity, scoring, and disputes are final."
        ]
      },
      {
        title: "Prohibited Actions",
        icon: "fas fa-ban",
        items: [
          "No social engineering, phishing, or attacking other teams' setups.",
          "No modifying, deleting, or tampering with challenge infrastructure."
        ]
      },
      {
        title: "Penalties & Disqualification",
        icon: "fas fa-gavel",
        items: [
          "Violating these rules may result in a warning, score reduction, or disqualification.",
          "Severe infractions (e.g., damaging university systems, disrupting the event) may be reported to university authorities."
        ]
      },
      {
        title: "Support & Reporting Issues",
        icon: "fas fa-life-ring",
        items: [
          "Contact event staff on the designated CTF Discord/Slack channel or help-desk for any issues.",
          "If you encounter a security issue affecting the event, report it responsibly to the organisers."
        ]
      },
      {
        title: "Discord ToS",
        icon: "fab fa-discord",
        items: [
          "Follow the Discord Terms of Service (ToS) at all times when using the CTF Discord server."
        ]
      }
    ],
    results: {
      events: [
        {
          year: 2025,
          name: "Silicon Siege",
          subtitle: "Podium",
          places: [
            { rank: 1, team: "UK Lawnmowing Team" },
            { rank: 2, team: "AFNOM" },
            { rank: 3, team: "Cheese" }
          ]
        }
      ]
    },
    lastUpdated: "2026-04-20",
    links: {
      luma: "https://luma.com/embed/event/evt-9baefgwD4wSfcBc/simple",
      biterra: "https://pwn2play.biterra.co",
      biterraHome: "https://biterra.co",
      discord: "https://discord.gg/Vvrk4kK",
      attendanceForm: "https://forms.gle/YPQaL6gwLK24S6ms8",
      ics: "data/p2p-core-incursion.ics"
    },
    schedule: [
      { label: "Doors open", time: "08:20", icon: "fas fa-door-open", text: "Arrive early, connect to WiFi, and settle your team." },
      { label: "CTF live", time: "09:00 - 18:00", icon: "fas fa-flag-checkered", text: "Main no-AI scoreboard and separate AI-only scoreboard run on Pwn2Play." },
      { label: "Awards", time: "19:00 - 20:30", icon: "fas fa-trophy", text: "Podium, prizes, certificates, and sponsor recognition at DSU." },
      { label: "After party", time: "21:30 onwards", icon: "fas fa-champagne-glasses", text: "Social route across Leicester with other DMU societies." }
    ],
    venues: [
      {
        id: "ctf-venue",
        mapId: "mapGateway",
        title: "Gateway House: CTF Venue",
        shortTitle: "Gateway House",
        sub: "CTF Venue",
        time: "09:00 - 18:00",
        addressLines: ["Gateway House, Floor 5", "De Montfort University", "The Gateway, Leicester LE1 9BH"],
        lat: 52.6294,
        lng: -1.1381,
        zoom: 17,
        icon: "fa-flag-checkered",
        iconFull: "fas fa-flag-checkered",
        marker: "accent",
        color: "#c8102e",
        glow: "rgba(200,16,46,.4)",
        directions: "https://www.openstreetmap.org/?mlat=52.6294&mlon=-1.1381#map=18/52.6294/-1.1381",
        notes: [
          { icon: "fas fa-door-open", text: "Doors open at 08:20" },
          { icon: "fas fa-wifi", text: "Student & guest WiFi available" },
          { icon: "fas fa-laptop", text: "Bring your own machine" }
        ]
      },
      {
        id: "awards-venue",
        mapId: "mapDSU",
        title: "DSU: Awards Ceremony",
        shortTitle: "DSU",
        sub: "Awards Ceremony",
        time: "19:00 - 20:30",
        addressLines: ["De Montfort Students' Union", "Campus Centre Building", "Mill Ln, Leicester LE2 7DR"],
        lat: 52.6297,
        lng: -1.1383,
        zoom: 17,
        icon: "fa-trophy",
        iconFull: "fas fa-trophy",
        marker: "gold",
        color: "#ffd700",
        glow: "rgba(255,215,0,.35)",
        directions: "https://www.openstreetmap.org/?mlat=52.6297&mlon=-1.1383#map=18/52.6297/-1.1383",
        notes: [
          { icon: "fas fa-door-open", text: "Doors open at 18:40" },
          { icon: "fas fa-trophy", text: "Prizes & awards for top teams" },
          { icon: "fas fa-walking", text: "Right next door to Gateway House" }
        ]
      },
      {
        id: "afterparty-venue",
        mapId: "mapAfterParty",
        title: "After Party: Social Route",
        shortTitle: "After Party",
        sub: "Social Route",
        time: "21:30 onwards",
        addressLines: ["Various venues", "Leicester City Centre"],
        lat: 52.6364,
        lng: -1.1331,
        zoom: 16,
        icon: "fa-champagne-glasses",
        iconFull: "fas fa-champagne-glasses",
        marker: "cyan",
        color: "#6ab7c4",
        glow: "rgba(106,183,196,.35)",
        directions: "https://www.openstreetmap.org/?mlat=52.6364&mlon=-1.1331#map=17/52.6364/-1.1331",
        notes: [
          { icon: "fas fa-route", text: "Social route with multiple stops" },
          { icon: "fas fa-users", text: "Joint event with other DMU societies" },
          { icon: "fas fa-glass-cheers", text: "Everyone welcome, competitors or not" }
        ]
      }
    ],
    scoreboardTracks: [
      {
        title: "Main scoreboard",
        tag: "AI Prohibited",
        icon: "fas fa-shield-halved",
        text: "AI usage is forbidden. This is the official competitive track used for main event standing."
      },
      {
        title: "AI-only scoreboard",
        tag: "AI permitted",
        icon: "fas fa-robot",
        text: "Teams who want to use AI can compete on a separate scoreboard on Pwn2Play."
      },
      {
        title: "Prize eligibility",
        tag: "In-person podium",
        icon: "fas fa-trophy",
        text: "Challenge Coins and TryHackMe vouchers are awarded only to in-person podium teams."
      }
    ],
    sponsorCta: {
      eyebrow: "For Sponsors",
      title: "Meet Practical Cyber Talent",
      text: "Pwn2Play gives sponsors direct visibility with students proving real technical ability under pressure.",
      actions: [
        { text: "Sponsor Pwn2Play", href: "sponsors.html#get-involved", icon: "fas fa-handshake", style: "primary" },
        { text: "Email DMU Hackers", href: "mailto:dmuhackers@gmail.com", icon: "fas fa-envelope", style: "ghost" }
      ],
      points: [
        "Support hands-on challenge delivery",
        "Back certificates and prizes",
        "Connect with placement and graduate talent"
      ]
    }
  },
  sponsors: [
    {
      name: "Kit365",
      website: "https://kit365.co.uk/",
      logo: "img/branding/Kit365/kit365.png",
      alt: "Kit365",
      description: "Kit365 is the primary sponsor of Pwn2Play, providing prizes for the winning teams. Their support helps make our flagship CTF a stronger event for cybersecurity talent.",
      groups: ["prize"],
      featured: true,
      tags: [
        { icon: "fas fa-trophy", text: "Main Sponsor" },
        { icon: "fas fa-gift", text: "Prize Provider" }
      ]
    },
    {
      name: "TryHackMe",
      website: "https://tryhackme.com/",
      logo: "img/branding/THM/thm.png",
      alt: "TryHackMe",
      description: "TryHackMe is supporting Pwn2Play by providing prizes for our event, helping us reward standout performances and make the competition more exciting for participants.",
      groups: ["prize"],
      tags: [
        { icon: "fas fa-handshake", text: "Sponsor" },
        { icon: "fas fa-gift", text: "Prize Provider" }
      ]
    },
    {
      name: "Immersive Labs",
      website: "https://www.immersivelabs.com/",
      logo: "img/branding/ImmersiveLabs/immersive-logo.svg",
      alt: "Immersive Labs",
      description: "Immersive Labs is supporting Pwn2Play as a prize provider, helping us reward standout teams while backing practical cyber skills development through realistic, hands-on learning.",
      groups: ["prize"],
      tags: [
        { icon: "fas fa-handshake", text: "Sponsor" },
        { icon: "fas fa-gift", text: "Prize Provider" }
      ]
    },
    {
      name: "Biterra",
      website: "https://pwn2play.biterra.co",
      logo: "img/branding/biterra/biterra-main.png",
      alt: "Biterra",
      description: "Biterra is a gamified learning platform built by a DMU Hackers alumnus. It hosts every Pwn2Play challenge, scoreboard, and team. The CTF lives permanently at pwn2play.biterra.co.",
      groups: ["platform"],
      featured: true,
      logoStyle: "max-height:200px; width:auto",
      tags: [
        { icon: "fas fa-server", text: "Hosting Platform" },
        { icon: "fas fa-gift", text: "Merchandise" }
      ],
      cta: {
        text: "Open Pwn2Play on Biterra",
        href: "https://pwn2play.biterra.co",
        icon: "fas fa-arrow-up-right-from-square"
      }
    },
    {
      name: "North Quay Holdings",
      website: "https://www.northquayholdings.com/",
      logo: "img/branding/NQ/nq-logo-main.webp",
      alt: "North Quay Holdings",
      description: "North Quay Holdings is a private sector company specialising in all-source intelligence and OSINT. They create challenges for Pwn2Play, helping deliver realistic and engaging CTF experiences.",
      groups: ["challenge"],
      tags: [
        { icon: "fas fa-flag", text: "Challenge Creator" }
      ]
    },
    {
      name: "Redcentric",
      website: "https://www.redcentricplc.com/",
      logo: "img/branding/Redcentric/logo.png",
      alt: "Redcentric",
      description: "Redcentric is a managed IT services provider delivering network, cloud, and security solutions. They create challenges for Pwn2Play, bringing industry expertise and real-world scenarios.",
      groups: ["challenge"],
      logoStyle: "max-height:120px",
      tags: [
        { icon: "fas fa-flag", text: "Challenge Creator" }
      ]
    }
  ],
  resources: {
    platforms: [
      { name: "TryHackMe", href: "https://tryhackme.com/", icon: "fas fa-graduation-cap", tag: "Beginner Friendly", description: "Guided learning paths with browser-based VMs. Perfect for beginners. Start with the \"Pre-Security\" and \"Complete Beginner\" paths." },
      { name: "Hack The Box", href: "https://www.hackthebox.com/", icon: "fas fa-cube", tag: "Intermediate", description: "Realistic penetration testing labs and challenges. The \"Starting Point\" machines are great for beginners, then move to ranked boxes." },
      { name: "PicoCTF", href: "https://picoctf.org/", icon: "fas fa-flag", tag: "Beginner Friendly", description: "Free CTF platform by Carnegie Mellon. Excellent jeopardy-style challenges covering crypto, forensics, web, binary and more." },
      { name: "OverTheWire", href: "https://overthewire.org/wargames/", icon: "fas fa-terminal", tag: "Beginner Friendly", description: "SSH-based wargames that teach Linux, networking and security fundamentals. Start with \"Bandit\" to learn the command line." },
      { name: "CTFtime", href: "https://ctftime.org/", icon: "fas fa-trophy", tag: "All Levels", description: "The global CTF event calendar. Find upcoming competitions, team rankings and writeups from past events." },
      { name: "PortSwigger Web Academy", href: "https://portswigger.net/web-security", icon: "fas fa-globe", tag: "Web Security", description: "Free interactive labs for web security. Covers SQL injection, XSS, CSRF, SSRF and more. Industry-standard training from the makers of Burp Suite." },
      { name: "VulnHub", href: "https://www.vulnhub.com/", icon: "fas fa-server", tag: "Intermediate", description: "Downloadable vulnerable VMs to practice on your own machine. Great for offline practice and building your home lab." },
      { name: "pwn.college", href: "https://pwn.college/", icon: "fas fa-microchip", tag: "Binary Exploitation", description: "Free education platform from Arizona State University. Structured courses on binary exploitation, reverse engineering and program security." }
    ],
    tools: [
      { name: "Kali Linux", href: "https://www.kali.org/", label: "kali.org", icon: "fab fa-linux", description: "Debian-based distro pre-loaded with hundreds of security tools. The industry standard for penetration testing." },
      { name: "Burp Suite", href: "https://portswigger.net/burp", label: "portswigger.net", icon: "fas fa-spider", description: "Web application security testing toolkit. Intercept, modify and replay HTTP requests. Community edition is free." },
      { name: "Wireshark", href: "https://www.wireshark.org/", label: "wireshark.org", icon: "fas fa-network-wired", description: "Network protocol analyser. Capture and inspect traffic in real time. Essential for network forensics challenges." },
      { name: "Ghidra", href: "https://ghidra-sre.org/", label: "ghidra-sre.org", icon: "fas fa-bug", description: "NSA's open-source reverse engineering framework. Decompile binaries, analyse malware, solve RE challenges." },
      { name: "John the Ripper", href: "https://www.openwall.com/john/", label: "openwall.com/john", icon: "fas fa-key", description: "Password cracking tool supporting hundreds of hash formats. Pair with wordlists like rockyou.txt for CTF challenges." },
      { name: "CyberChef", href: "https://gchq.github.io/CyberChef/", label: "CyberChef", icon: "fas fa-database", description: "GCHQ's \"Cyber Swiss Army Knife\". Encode, decode, encrypt, hash and analyse data in the browser. A CTF essential." },
      { name: "Nmap", href: "https://nmap.org/", label: "nmap.org", icon: "fas fa-satellite-dish", description: "The gold standard network scanner. Discover hosts, open ports and running services. The first step in almost every pentest." },
      { name: "Metasploit", href: "https://www.metasploit.com/", label: "metasploit.com", icon: "fas fa-crosshairs", description: "The world's most used penetration testing framework. Exploit development, post-exploitation, and payload generation in one toolkit." },
      { name: "Hashcat", href: "https://hashcat.net/hashcat/", label: "hashcat.net", icon: "fas fa-bolt", description: "GPU-accelerated password recovery tool. Supports 300+ hash types with advanced rule-based and mask attacks." },
      { name: "Gobuster", href: "https://github.com/OJ/gobuster", label: "GitHub", icon: "fas fa-magnifying-glass", description: "Fast directory and DNS brute-forcing tool written in Go. Essential for web enumeration and finding hidden paths on targets." },
      { name: "pwntools", href: "https://docs.pwntools.com/", label: "docs.pwntools.com", icon: "fas fa-code", description: "Python library for writing exploits. Makes binary exploitation, shellcode crafting and CTF scripting much easier." }
    ],
    learning: [
      { name: "John Hammond", href: "https://www.youtube.com/@_JohnHammond", icon: "fab fa-youtube", tag: "YouTube", description: "CTF walkthroughs, malware analysis and security tutorials. One of the best cyber security YouTubers for hands-on learning." },
      { name: "LiveOverflow", href: "https://www.youtube.com/@LiveOverflow", icon: "fab fa-youtube", tag: "YouTube", description: "Deep dives into binary exploitation, web security and CTF techniques. Excellent for understanding the \"why\" behind vulnerabilities." },
      { name: "OWASP Top 10", href: "https://owasp.org/www-project-top-ten/", icon: "fas fa-shield-halved", tag: "Reference", description: "The definitive list of the most critical web application security risks. Essential reading for anyone interested in web security." },
      { name: "NetworkChuck", href: "https://www.youtube.com/@NetworkChuck", icon: "fab fa-youtube", tag: "YouTube", description: "Engaging tutorials on networking, Linux, hacking and IT careers. Great for beginners wanting an energetic introduction to cyber security." },
      { name: "HackTricks", href: "https://book.hacktricks.wiki/", icon: "fas fa-book", tag: "Reference", description: "Comprehensive pentesting wiki. Cheat sheets and methodology for privilege escalation, AD attacks, web exploits and more. Bookmark this one." },
      { name: "David Bombal", href: "https://www.youtube.com/@DavidBombal", icon: "fab fa-youtube", tag: "YouTube", description: "Networking and ethical hacking tutorials. Covers Cisco, Python for networking, and interviews with industry professionals." }
    ],
    certs: [
      { name: "Red Team Ops (CRTO)", href: "https://www.zeropointsecurity.co.uk/course/red-team-ops", icon: "fas fa-crosshairs", tag: "Advanced", description: "Hands-on red team certification from Zero Point Security. Covers Cobalt Strike, Active Directory attacks, evasion and C2 infrastructure. Highly practical." },
      { name: "HTB CPTS", href: "https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist", icon: "fas fa-cube", tag: "Advanced", description: "Hack The Box Certified Penetration Testing Specialist. Hands-on exam covering the full pentest lifecycle from recon to reporting. Respected practical certification." },
      { name: "Microsoft SC-200", href: "https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/", icon: "fab fa-microsoft", tag: "Intermediate", description: "Security Operations Analyst certification. Covers Microsoft Sentinel, Defender and threat hunting. Great for SOC analyst roles and blue team careers." },
      { name: "BTL1 - Blue Team Level 1", href: "https://www.securityblue.team/certifications/blue-team-level-1", icon: "fas fa-eye", tag: "Intermediate", description: "Practical blue team certification covering SIEM, incident response, threat intelligence and digital forensics. Great for defensive security roles." },
      { name: "ISC2 CC", href: "https://www.isc2.org/certifications/cc", icon: "fas fa-id-badge", tag: "Free / Entry Level", description: "Free entry-level certification from ISC2. Covers security principles, network security, and incident response. Free training and exam for the first million candidates." },
      { name: "IBM Cybersecurity Fundamentals", href: "https://www.ibm.com/training/badge/cybersecurity-fundamentals", icon: "fas fa-shield-halved", tag: "Free / Entry Level", description: "Free foundational badge from IBM covering security concepts, threats, incident response and compliance. A solid starting point for your CV." },
      { name: "Cisco Ethical Hacker", href: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/ethical-hacker/index.html", icon: "fas fa-network-wired", tag: "Free / Intermediate", description: "Cisco's free ethical hacking certification covering penetration testing methodology, network exploitation and vulnerability assessment with industry-recognised credentials." }
    ]
  }
};
