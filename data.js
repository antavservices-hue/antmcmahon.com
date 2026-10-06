/* ============================================================
   THE CLUB — content data
   ============================================================
   Edit this file to load in your real catalogue. Nothing in here
   requires touching app.js or index.html.

   PER BAND:
     id       - unique short slug, no spaces
     name     - display name
     years    - text shown under the name (e.g. "1994–1999")
     logo     - path to the logo image (or null for a text sign,
                used for "Latest Releases")
     color    - a hex colour used for that band's stage lighting
                and screen glow. Pick something that suits the era.
     performerLabel - short caption shown while that era's clip
                plays on stage (swap for real footage later)
     performerVideo - path/URL to a video file of you performing
                for this era, on a plain green (or blue) screen
                background. The green is keyed out live in the
                browser — no pre-baked alpha video needed, any
                plain-background clip just works. Leave null to
                keep the placeholder glow figure.
     performerVideoCrop - optional { left, top, right, bottom },
                each 0–1 fractions of the raw video frame, to trim
                off dead space (headroom, floor, air either side)
                so the figure fills the stage spot. Leave unset to
                use the default crop (suits a typical portrait
                performance clip framed head-to-boots).
     albums   - array of albums, each with:
         title  - album name
         year   - release year
         cover  - path to cover art (or null to fall back to the
                  band logo)
         tracks - array of { title, duration, url }
                  url is a path/link to an audio file (mp3/m4a/ogg).
                  Leave url as null until you have the file hosted
                  somewhere — the player will show the track but
                  won't be able to play it yet.
   ============================================================ */

const BANDS = [
  {
    id: 'rockitts',
    name: 'The Rockitts',
    years: '1990s',
    logo: 'assets/the-rockitts.webp',
    color: '#ffcc00',
    performerLabel: '90s — The Rockitts',
    performerVideo: null,
    albums: [
      {
        title: 'Placeholder album',
        year: '199X',
        cover: null,
        tracks: [
          { title: 'Track 1 — replace with real title', duration: '--:--', url: null },
          { title: 'Track 2 — replace with real title', duration: '--:--', url: null },
          { title: 'Track 3 — replace with real title', duration: '--:--', url: null }
        ]
      }
    ]
  },
  {
    id: 'pittstops',
    name: 'The Pittstops',
    years: '2000 – 2003',
    logo: 'assets/the-pittstops.webp',
    color: '#e0392b',
    performerLabel: '2000–03 — The Pittstops',
    performerVideo: 'assets/performers/pittstops.mp4',
    // this clip has a lot of movement (wide stance, crouching) — a bit
    // more side and bottom margin than the default so hands/feet never
    // clip out during the biggest moves
    performerVideoCrop: { left: 0.04, top: 0.055, right: 0.96, bottom: 0.985 },
    albums: [
      {
        title: 'Better Late Than Never, The Missing Tracks',
        year: '2024',
        cover: 'assets/pittstops-better-late-than-never.jpg',
        tracks: [
          { title: 'The Key', duration: '3:53', url: 'assets/audio/pittstops/01-the-key.mp3' },
          { title: 'Go', duration: '2:55', url: 'assets/audio/pittstops/02-go.mp3' },
          { title: "Don't Let Me Down", duration: '2:07', url: 'assets/audio/pittstops/03-dont-let-me-down.mp3' },
          { title: 'If I Told You', duration: '1:52', url: 'assets/audio/pittstops/04-if-i-told-you.mp3' },
          { title: 'Blame It On The Weatherman', duration: '2:21', url: 'assets/audio/pittstops/05-blame-it-on-the-weatherman.mp3' },
          { title: 'The Only Person', duration: '1:42', url: 'assets/audio/pittstops/06-the-only-person.mp3' },
          { title: 'Oh Boy', duration: '1:32', url: 'assets/audio/pittstops/07-oh-boy.mp3' },
          { title: 'One Day', duration: '2:30', url: 'assets/audio/pittstops/08-one-day.mp3' },
          { title: 'SMS', duration: '2:14', url: 'assets/audio/pittstops/09-sms.mp3' },
          { title: 'Belong', duration: '3:11', url: 'assets/audio/pittstops/10-belong.mp3' },
          { title: 'Going North', duration: '3:47', url: 'assets/audio/pittstops/11-going-north.mp3' },
          { title: 'Almost There', duration: '3:10', url: 'assets/audio/pittstops/12-almost-there.mp3' },
          { title: 'Do You Remember', duration: '3:07', url: 'assets/audio/pittstops/13-do-you-remember.mp3' }
        ]
      }
    ]
  },
  {
    id: 'bare-necessities',
    name: 'Bare Necessities',
    years: '2004 – 2007',
    logo: 'assets/bare-necessities.webp',
    color: '#e8a23a',
    performerLabel: '2004–07 — Bare Necessities',
    performerVideo: null,
    albums: [
      {
        title: 'Bare Necessities',
        year: '2005',
        cover: 'assets/bare-necessities.webp', // same image as the wall logo
        tracks: [
          { title: 'Without You', duration: '2:10', url: 'assets/audio/bare-necessities/01-without-you.mp3' },
          { title: 'Dead Flowers', duration: '3:57', url: 'assets/audio/bare-necessities/02-dead-flowers.mp3' },
          { title: 'Pills', duration: '1:51', url: 'assets/audio/bare-necessities/03-pills.mp3' },
          { title: 'Last Night', duration: '1:41', url: 'assets/audio/bare-necessities/04-last-night.mp3' },
          { title: 'Without You (Acoustic)', duration: '1:58', url: 'assets/audio/bare-necessities/05-without-you-acoustic.mp3' },
          { title: 'Solitary Man (Acoustic)', duration: '2:05', url: 'assets/audio/bare-necessities/06-solitary-man-acoustic.mp3' },
          { title: "Can't Be Arsed (Version 1)", duration: '2:00', url: 'assets/audio/bare-necessities/07-cant-be-arsed-v1.mp3' },
          { title: 'Do You Hate Me', duration: '4:48', url: 'assets/audio/bare-necessities/08-do-you-hate-me.mp3' },
          { title: 'Scandinavian Girl', duration: '2:09', url: 'assets/audio/bare-necessities/09-scandinavian-girl.mp3' },
          { title: 'Number 1', duration: '1:38', url: 'assets/audio/bare-necessities/10-number-1.mp3' },
          { title: "That's What I'm Talking About", duration: '1:46', url: 'assets/audio/bare-necessities/11-thats-what-im-talking-about.mp3' },
          { title: 'Young', duration: '3:00', url: 'assets/audio/bare-necessities/12-young.mp3' }
        ]
      }
    ]
  },
  {
    id: 'scarecaows',
    name: 'Scarecaows',
    years: '2009',
    logo: 'assets/scarecaows.webp',
    color: '#e11d2e',
    performerLabel: '2009 — Scarecaows',
    performerVideo: null,
    albums: [
      {
        title: 'Scarecaows',
        year: '2009',
        cover: 'assets/scarecaows.webp', // same image as the wall logo
        tracks: [
          { title: 'Ghost From The Shadows', duration: '3:32', url: 'assets/audio/scarecaows/01-ghost-from-the-shadows.mp3' },
          { title: 'The Dark Knight Returns', duration: '3:18', url: 'assets/audio/scarecaows/02-the-dark-knight-returns.mp3' },
          { title: 'Queensta By Night', duration: '3:04', url: 'assets/audio/scarecaows/03-queensta-by-night.mp3' }
        ]
      },
      {
        title: 'Live',
        year: '2009',
        cover: null,
        tracks: [
          { title: 'Scarecaows Live', duration: '3:58', video: 'assets/videos/scarecaows-live.mp4' }
        ]
      }
    ]
  },
  {
    id: 'trailerpark-rejects',
    name: 'Trailerpark Rejects',
    years: '2010 – 2014',
    logo: 'assets/trailerpark-rejects.webp',
    color: '#e63946',
    performerLabel: '2010–14 — Trailerpark Rejects',
    performerVideo: 'assets/performers/trailerpark-rejects.mp4',
    // full-height green set (floor is keyed too, not just the backdrop) —
    // crop is close to the true body bounding box, top to bottom
    performerVideoCrop: { left: 0.22, top: 0.06, right: 0.67, bottom: 0.97 },
    albums: [
      {
        title: 'Trailerpark Rejects',
        year: '2012',
        cover: 'assets/trailerpark-rejects.webp', // same image as the wall logo
        tracks: [
          { title: 'Ooby Dooby', duration: '1:37', url: 'assets/audio/trailerpark-rejects/01-ooby-dooby.mp3' },
          { title: 'Blue Moon of Kentucky', duration: '1:53', url: 'assets/audio/trailerpark-rejects/02-blue-moon-of-kentucky.mp3' },
          { title: 'Wild Little Willie', duration: '2:12', url: 'assets/audio/trailerpark-rejects/03-wild-little-willie.mp3' },
          { title: 'Cadillac', duration: '2:16', url: 'assets/audio/trailerpark-rejects/04-cadillac.mp3' },
          { title: 'Little Sister', duration: '2:31', url: 'assets/audio/trailerpark-rejects/05-little-sister.mp3' },
          { title: 'Hippy Hippy Shake', duration: '1:41', url: 'assets/audio/trailerpark-rejects/06-hippy-hippy-shake.mp3' },
          { title: 'Half Your Heart', duration: '1:56', url: 'assets/audio/trailerpark-rejects/07-half-your-heart.mp3' },
          { title: 'Bony Moronie', duration: '2:01', url: 'assets/audio/trailerpark-rejects/08-bony-moronie.mp3' }
        ]
      }
    ]
  },
  {
    id: 'intolerants',
    name: 'The Intolerants',
    years: '2014 – 2024',
    logo: 'assets/the-intolerants.webp',
    spotify: 'https://open.spotify.com/artist/5q5CxE9AQzK8BtqpeJCTuy',
    color: '#c9c9c9',
    performerLabel: '2014–24 — The Intolerants',
    performerVideo: null,
    albums: [
      {
        title: 'Debut',
        year: '2014',
        cover: null,
        tracks: [
          { title: 'Heart Shaped Lips', duration: '2:21', url: 'assets/audio/intolerants/01-heart-shaped-lips.mp3' },
          { title: "Please Don't Touch", duration: '2:54', url: 'assets/audio/intolerants/02-please-dont-touch.mp3' }
        ]
      },
      {
        title: "100% Of Nothin'",
        year: '2015',
        cover: null,
        tracks: [
          { title: 'Number One', duration: '2:10', url: 'assets/audio/intolerants/03-number-one.mp3' },
          { title: "Crawlin' Back", duration: '2:51', url: 'assets/audio/intolerants/04-crawlin-back.mp3' },
          { title: 'The Bitterness That Lasts', duration: '2:57', url: 'assets/audio/intolerants/05-the-bitterness-that-lasts.mp3' },
          { title: 'Ten To Two', duration: '3:23', url: 'assets/audio/intolerants/06-ten-to-two.mp3' },
          { title: "Can't Be Arsed", duration: '1:37', url: 'assets/audio/intolerants/07-cant-be-arsed.mp3' },
          { title: 'Red Dress', duration: '2:18', url: 'assets/audio/intolerants/08-red-dress.mp3' },
          { title: 'So Long Baby Goodbye', duration: '2:27', url: 'assets/audio/intolerants/09-so-long-baby-goodbye.mp3' },
          { title: 'Do You Hate Me', duration: '2:12', url: 'assets/audio/intolerants/10-do-you-hate-me.mp3' },
          { title: 'Number One... Live (Bonus Track)', duration: '1:44', url: 'assets/audio/intolerants/11-number-one-live-bonus.mp3' },
          { title: 'Why Do I Do It... Live (Bonus Track)', duration: '2:54', url: 'assets/audio/intolerants/12-why-do-i-do-it-live-bonus.mp3' }
        ]
      },
      {
        title: 'More Rock N Roll (Than Rock N Roll Itself)',
        year: '2024',
        cover: null,
        tracks: [
          { title: "I Wish I Wasn't A Dick", duration: '2:47', url: 'assets/audio/intolerants/13-i-wish-i-wasnt-a-dick.mp3' },
          { title: 'More Rock N Roll Than Rock N Roll Itself', duration: '2:30', url: 'assets/audio/intolerants/14-more-rock-n-roll-than-itself.mp3' },
          { title: 'Red Dress (EP Version)', duration: '1:33', url: 'assets/audio/intolerants/15-red-dress-ep-version.mp3' }
        ]
      },
      {
        title: 'Live',
        year: '2016',
        cover: null,
        tracks: [
          // Full live clip (its own audio) rather than a plain audio file —
          // plays on the big screen behind the stage when tapped, same as
          // the solo lyric video below.
          { title: 'Number One (Live at Psychobilly Meeting, Pineda de Mar, Spain, 2016)', duration: '1:44', video: 'assets/videos/intolerants-number-one-live.mp4' }
        ]
      }
    ]
  },
  {
    id: 'suburban-drugdealers',
    name: 'Suburban Drugdealers',
    years: '2017 – 2020',
    logo: 'assets/suburban-drugdealers.webp',
    spotify: 'https://open.spotify.com/artist/4ESaSN9m2gH8jQAKF15u57',
    color: '#3fae5c',
    performerLabel: '2017–20 — Suburban Drugdealers',
    performerVideo: 'assets/performers/suburban-drugdealers.mp4',
    // landscape source clip (mic-stand swung out wide to the right) — crop
    // is close to the true head-to-boots bounding box across the whole
    // clip, with a bit of right-side margin for the tilted mic stand
    performerVideoCrop: { left: 0.28, top: 0.045, right: 0.71, bottom: 0.995 },
    albums: [
      {
        title: 'Belong — 7" Single',
        year: '2026',
        cover: null,
        tracks: [
          { side: 'A', title: 'Belong (feat. Gipsy Rufina)', duration: '2:38', url: 'assets/audio/suburban-drugdealers/20-belong.mp3' },
          { side: 'B', title: 'Number One (feat. Nancy Byrd)', duration: '2:28', url: 'assets/audio/suburban-drugdealers/21-number-one.mp3' }
        ]
      },
      {
        title: 'Happiness And Poverty',
        year: '2019',
        cover: null,
        tracks: [
          { title: 'Intro', duration: '0:50', url: 'assets/audio/suburban-drugdealers/01-intro.mp3' },
          { title: 'All My Dreams Corrode', duration: '2:20', url: 'assets/audio/suburban-drugdealers/02-all-my-dreams-crumble.mp3' },
          { title: 'Staring Back At Me', duration: '2:46', url: 'assets/audio/suburban-drugdealers/03-staring-back-at-me.mp3' },
          { title: 'Gentlemen', duration: '1:52', url: 'assets/audio/suburban-drugdealers/04-gentlemen.mp3' },
          { title: 'Getting On That Line', duration: '3:08', video: 'assets/videos/suburban-drugdealers-getting-on-that-line.mp4' },
          { title: 'Diplomatic Immunity', duration: '2:04', url: 'assets/audio/suburban-drugdealers/06-diplomatic-immunity.mp3' },
          { title: "Don't Sleep With The Problem", duration: '2:46', url: 'assets/audio/suburban-drugdealers/07-problem.mp3' },
          { title: 'Fucked Up Over You', duration: '3:16', url: 'assets/audio/suburban-drugdealers/08-fucked-up.mp3' },
          { title: 'What Was I Thinking', duration: '2:56', url: 'assets/audio/suburban-drugdealers/09-thinking.mp3' },
          { title: 'Happiness And Poverty', duration: '1:59', url: 'assets/audio/suburban-drugdealers/10-happiness.mp3' },
          { title: 'Devil', duration: '2:10', url: 'assets/audio/suburban-drugdealers/11-devil.mp3' },
          { title: 'If The Kids Are United', duration: '3:53', url: 'assets/audio/suburban-drugdealers/12-if-the-kids.mp3' }
        ]
      },
      {
        title: 'Garage Sessions',
        year: '2018',
        cover: null,
        tracks: [
          // Early rough versions of some of these songs predate "Happiness
          // And Poverty" by years — same titles, different (earlier)
          // recordings, kept distinct with "(Garage Version)".
          { title: "Don't Sleep With The Problem (Garage Version)", duration: '2:47', url: 'assets/audio/suburban-drugdealers/13-dont-sleep-with-the-problem-garage.mp3' },
          { title: 'Getting On That Line (Garage Version)', duration: '3:03', url: 'assets/audio/suburban-drugdealers/14-getting-on-that-line-garage.mp3' },
          { title: 'Gotta Get Some Action', duration: '3:07', url: 'assets/audio/suburban-drugdealers/15-gotta-get-some-action.mp3' },
          { title: 'I Got Erection', duration: '3:05', url: 'assets/audio/suburban-drugdealers/16-i-got-erection.mp3' },
          { title: 'No.1', duration: '2:07', url: 'assets/audio/suburban-drugdealers/17-no-1.mp3' },
          { title: 'Outskirts Of Life', duration: '3:51', url: 'assets/audio/suburban-drugdealers/18-outskirts-of-life.mp3' },
          { title: 'What Was I Thinking (Garage Version)', duration: '2:47', url: 'assets/audio/suburban-drugdealers/19-what-was-i-thinking-garage.mp3' }
        ]
      },
      {
        title: 'Live',
        year: '2020',
        cover: null,
        tracks: [
          { title: 'Live At Blackbox', duration: '26:59', video: 'assets/videos/suburban-drugdealers-live-at-blackbox.mp4' },
          { title: 'Live At Moonrunners', duration: '28:25', video: 'assets/videos/suburban-drugdealers-live-at-moonrunners.mp4' }
        ]
      }
    ]
  }
];

const SOLO = {
  id: 'solo',
  name: 'Ant McMahon',
  years: 'Solo',
  logo: 'assets/ant-mcmahon.webp',
  spotify: 'https://open.spotify.com/artist/3apBBz1UUSTmIY03Jn5xP6',
  color: '#d99a3f',
  performerLabel: 'Solo — Ant McMahon',
  performerVideo: 'assets/performers/solo.mp4',
  // source clip is landscape (vintage-mic performance, wide gestures with the
  // mic stand) rather than the portrait framing used elsewhere — crop is
  // wider than the default to keep the whole gesture in frame. The camera
  // framed this one tight at the bottom too (his shoes sit right at the
  // very edge of the raw frame, almost no floor margin below them), so
  // bottom is pulled almost all the way to 1 rather than the more typical
  // ~0.83-0.985 used elsewhere.
  performerVideoCrop: { left: 0.24, top: 0.055, right: 0.76, bottom: 0.99 },
  albums: [
    {
      title: 'Singles',
      year: '2026',
      cover: null,
      tracks: [
        // This one has a full lyric video (its own baked-in audio) rather
        // than a plain audio file — set `video` instead of `url` and it
        // takes over the big screen behind the stage, sound and all, when
        // tapped. (Working title from the opening line — rename freely.)
        { title: 'Did You Get What You Wanted From Brexit', duration: '1:28', video: 'assets/videos/brexit-lyric-video.mp4' },
        // Vertical (9:16) source clip — the big screen letterboxes it to the
        // correct aspect rather than stretching it, so it plays as a tall
        // strip in the middle of the widescreen picture. Working title —
        // rename freely.
        { title: 'Blanket On The Ground', duration: '2:49', video: 'assets/videos/ant-blanket-on-the-ground.mp4' },
        { title: 'Blanket On The Ground (Studio Version)', duration: '3:40', url: 'assets/audio/solo/01-blanket-on-the-ground-studio.mp3' },
        { title: "Casey's Last Ride", duration: '3:21', url: 'assets/audio/solo/02-caseys-last-ride.mp3' },
        { title: "Coalminer's Son", duration: '2:01', url: 'assets/audio/solo/03-coalminers-son.mp3' },
        { title: 'Deep Fake', duration: '2:09', url: 'assets/audio/solo/04-deep-fake.mp3' },
        { title: "Don't Stop The Dinghy", duration: '1:38', url: 'assets/audio/solo/05-dont-stop-the-dinghy.mp3' },
        { title: 'El Paso', duration: '5:01', url: 'assets/audio/solo/06-el-paso.mp3' },
        { title: 'Flag Song', duration: '1:23', url: 'assets/audio/solo/07-flag-song.mp3' },
        { title: 'Getting Me By', duration: '3:24', url: 'assets/audio/solo/08-getting-me-by.mp3' },
        { title: 'Not A Symbol Of Hate', duration: '1:22', url: 'assets/audio/solo/09-not-a-symbol-of-hate.mp3' },
        { title: 'Palestine Action', duration: '3:46', url: 'assets/audio/solo/10-palestine-action.mp3' },
        { title: 'Six Ribbons', duration: '3:39', url: 'assets/audio/solo/11-six-ribbons.mp3' },
        { title: 'Strive To Survive', duration: '3:36', url: 'assets/audio/solo/12-strive-to-survive.mp3' },
        { title: 'The Day That Thatcher Died', duration: '1:39', url: 'assets/audio/solo/13-the-day-that-thatcher-died.mp3' },
        { title: 'The Girl And The Crow', duration: '4:36', url: 'assets/audio/solo/14-the-girl-and-the-crow.mp3' },
        { title: "This Place Won't Function", duration: '2:01', url: 'assets/audio/solo/15-this-place-wont-function.mp3' },
        { title: "World's First Trillionaire", duration: '1:55', url: 'assets/audio/solo/16-worlds-first-trillionaire.mp3' },
        { title: "Are You The Straw (That Broke The Camel's Back)", duration: '4:13', url: 'assets/audio/solo/17-are-you-the-straw.mp3' }
      ]
    }
  ]
};

// Order the wall walks through, chronologically, entrance to stage.
// SOLO isn't on the wall — its sign is the stage fascia itself (see app.js),
// so it reads as the headline act rather than one more wall panel.
const WALL_ORDER = [...BANDS];

// Real gig posters and flyers, scattered at random across the side walls
// and the ceiling alongside the generated placeholder posters. Just add
// more image paths here — no app.js changes needed.
const POSTER_IMAGES = [
  'assets/posters/poster-01.jpg',
  'assets/posters/poster-02.jpg',
  'assets/posters/poster-03.jpg',
  'assets/posters/poster-04.jpg',
  'assets/posters/poster-05.jpg',
  'assets/posters/poster-06.jpg',
  'assets/posters/poster-07.jpg',
  'assets/posters/poster-08.jpg',
  'assets/posters/poster-09.jpg',
  'assets/posters/poster-10.jpg',
  'assets/posters/poster-11.jpg',
  'assets/posters/poster-12.jpg',
  'assets/posters/poster-13.jpg',
  'assets/posters/poster-14.jpg',
  'assets/posters/poster-15.jpg',
  'assets/posters/poster-16.jpg',
  'assets/posters/poster-17.jpg',
  'assets/posters/poster-18.jpg',
  'assets/posters/poster-19.jpg',
  'assets/posters/poster-20.jpg',
  'assets/posters/poster-21.jpg',
  'assets/posters/poster-22.jpg',
  'assets/posters/poster-23.jpg',
  'assets/posters/poster-24.jpg',
  'assets/posters/poster-25.jpg',
  'assets/posters/poster-26.jpg',
  'assets/posters/poster-27.jpg',
  'assets/posters/poster-28.jpg',
  'assets/posters/poster-29.jpg',
  'assets/posters/poster-30.jpg',
  'assets/posters/poster-31.jpg',
  'assets/posters/poster-32.jpg',
  'assets/posters/poster-33.jpg',
  'assets/posters/poster-34.jpg',
  'assets/posters/poster-35.jpg',
  'assets/posters/poster-36.jpg',
  'assets/posters/poster-37.jpg',
  'assets/posters/poster-38.jpg',
  'assets/posters/poster-39.jpg',
  'assets/posters/poster-40.jpg',
  'assets/posters/poster-41.jpg',
  'assets/posters/poster-42.jpg',
  'assets/posters/poster-43.jpg',
  'assets/posters/poster-44.jpg'
];
