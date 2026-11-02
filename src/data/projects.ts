// Featured projects: used by the home page cards and the terminal's
// `projects` command. Full write-ups live on /myWork/.
import robotThumbnail from '../assets/images/robot.png'
import quizThumbnail from '../assets/images/hp.png'
import websiteThumbnail from '../assets/images/website-screenshot.png'

export const projects = [
    {
        file: 'robot-takeover.js',
        title: 'Robot Takeover',
        description:
            'A text adventure I first built in Unity, rewritten in JavaScript. Playable right here.',
        tags: ['JavaScript', 'Unity port', 'playable'],
        image: robotThumbnail,
        imageAlt: 'Robot Takeover cover art',
        imageClass: '',
        href: '/robotGame/',
        action: 'play',
        external: false,
        metricId: 'view-robot-game',
    },
    {
        file: 'WizardsQuiz.swift',
        title: "Wizard's Quiz",
        description:
            'A native iOS trivia app built in Swift and UIKit, published on the App Store.',
        tags: ['Swift', 'UIKit', 'App Store'],
        image: quizThumbnail,
        imageAlt: "Wizard's Quiz app icon",
        imageClass: 'feature-card-thumb-icon',
        href: 'https://apps.apple.com/us/app/wizards-quiz/id1502868673',
        action: 'open in App Store',
        external: true,
        metricId: 'view-ios-appstore',
    },
    {
        file: 'sterling-dev.astro',
        title: 'This Portfolio',
        description:
            "Built with Astro and Tailwind, deployed from GitHub to Cloudflare's edge.",
        tags: ['Astro', 'Tailwind', 'Cloudflare'],
        image: websiteThumbnail,
        imageAlt: 'Screenshot of this portfolio site',
        imageClass: 'feature-card-thumb-left',
        href: 'https://github.com/ssterling9928/sterlingdev-website',
        action: 'view source',
        external: true,
        metricId: 'view-website-source-code',
    },
]
