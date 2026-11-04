// Projects: used by the home page cards (featured ones only), the terminal's
// `projects` command, and the full write-ups on /myWork/ (all, in this order).
//
// Home page fields: featured, description, tags, image, action.
// My Work fields:   kind, status, writeup, facts, stack, links, and either
//                   an image or a `terminal` panel shown in its place.
import type { ImageMetadata } from 'astro'
import robotThumbnail from '../assets/images/robot.png'
import quizThumbnail from '../assets/images/wizards-quiz-app-store.png'
import websiteThumbnail from '../assets/images/website-screenshot.png'
import dashboardThumbnail from '../assets/images/homelab-dashboard.png'
import gitopsThumbnail from '../assets/images/homelab-gitops.png'

export type TerminalLine =
    | { type: 'cmd'; text: string }
    | { type: 'row'; key: string; text: string }
    | { type: 'ok'; text: string }

export type Project = {
    file: string
    title: string
    featured: boolean
    description: string
    tags: string[]
    image?: ImageMetadata
    imageAlt?: string
    imageClass?: string
    terminal?: { title: string; lines: TerminalLine[] }
    href: string
    action: string
    external: boolean
    metricId: string
    kind: string
    status: string
    writeup: string
    facts: { label: string; value: string }[]
    stack: string[]
    links: {
        label: string
        href: string
        external: boolean
        primary: boolean
        metricId: string
    }[]
}

export const projects: Project[] = [
    {
        file: 'robot-takeover.js',
        featured: true,
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
        kind: 'web game',
        status: 'playable',
        writeup:
            'This project is a complete JavaScript rewrite of an original text-based adventure game I built in Unity. The goal was to modernize the gameplay experience by creating a fast, responsive, and immersive web application with a stylized terminal interface, bringing a classic game format to the browser.',
        facts: [
            {
                label: 'origin',
                value: 'Unity (C#) original, rebuilt for the web',
            },
        ],
        stack: ['Unity', 'C#', 'JavaScript'],
        links: [
            {
                label: './play',
                href: '/robotGame/',
                external: false,
                primary: true,
                metricId: 'view-robot-game',
            },
        ],
    },
    {
        file: 'WizardsQuiz.swift',
        featured: true,
        title: "Wizard's Quiz",
        description:
            'A native iOS trivia app built in Swift and UIKit, published on the App Store.',
        tags: ['Swift', 'UIKit', 'App Store'],
        image: quizThumbnail,
        imageAlt:
            "Wizard's Quiz on the App Store, with screenshots of its quiz screens",
        imageClass: 'feature-card-thumb-left',
        href: 'https://apps.apple.com/us/app/wizards-quiz/id1502868673',
        action: 'open in App Store',
        external: true,
        metricId: 'view-ios-appstore',
        kind: 'iOS app',
        status: 'on the App Store',
        writeup:
            'A native iOS trivia application built entirely in Swift using Xcode and the UIKit framework, which is currently published on the App Store. This project demonstrates core iOS development principles, including programmatic UI and state management.',
        facts: [{ label: 'platform', value: 'iPhone · App Store' }],
        stack: ['Swift', 'Xcode', 'UIKit'],
        links: [
            {
                label: './app-store',
                href: 'https://apps.apple.com/us/app/wizards-quiz/id1502868673',
                external: true,
                primary: true,
                metricId: 'view-ios-appstore',
            },
            {
                label: './source',
                href: 'https://github.com/ssterling9928/HarryPotterTriviaQuiz',
                external: true,
                primary: false,
                metricId: 'view-ios-source-code',
            },
        ],
    },
    {
        file: 'sterling-dev.astro',
        featured: true,
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
        kind: 'website',
        status: 'live',
        writeup:
            "A showcase of modern web development in action. This portfolio was built from the ground up with Astro for maximum performance and a seamless user experience, styled with Tailwind CSS. It features a fully automated CI/CD pipeline, deploying directly from GitHub to Cloudflare's edge network.",
        facts: [
            {
                label: 'hosting',
                value: 'Cloudflare Workers · deploys on every push',
            },
        ],
        stack: ['Astro', 'HTML', 'Tailwind CSS', 'JavaScript'],
        links: [
            {
                label: './source',
                href: 'https://github.com/ssterling9928/sterlingdev-website',
                external: true,
                primary: false,
                metricId: 'view-website-source-code',
            },
        ],
    },
    {
        file: 'homelab-dashboard.tsx',
        title: 'Homelab Dashboard',
        featured: false,
        description:
            'A React dashboard for the containers, metrics, logs and hardware health of my homelab.',
        tags: ['React', 'TypeScript', 'Express'],
        image: dashboardThumbnail,
        imageAlt:
            'The Homelab Dashboard: CPU, memory, storage and network for two hosts, a CPU chart and system status',
        imageClass: 'feature-card-thumb-left',
        href: 'https://github.com/ssterling9928/dashboard',
        action: 'view source',
        external: true,
        metricId: 'view-dashboard-source-code',
        kind: 'web app',
        status: 'self-hosted',
        writeup:
            'A single-page dashboard for my homelab. It shows the containers, metrics, logs and hardware health of two very different hosts side by side: a Synology NAS monitored through SNMP and the DSM Web API, and an Ubuntu VM on Proxmox monitored through a small helper agent I wrote and through Loki. An Express backend combines every source into one consistent API, and the React frontend presents it as one responsive dashboard, with container controls, live alerts, monitoring charts and dark mode.',
        facts: [
            { label: 'hosts', value: 'Synology NAS · Ubuntu VM on Proxmox' },
        ],
        stack: [
            'React 19',
            'TypeScript',
            'Tailwind CSS',
            'Vite',
            'Node.js',
            'Express',
        ],
        links: [
            {
                label: './source',
                href: 'https://github.com/ssterling9928/dashboard',
                external: true,
                primary: true,
                metricId: 'view-dashboard-source-code',
            },
        ],
    },
    {
        file: 'homelab-showcase.md',
        title: 'Homelab, Run as GitOps',
        featured: false,
        description:
            'A self-hosted platform where every service is defined in Git, built by my own CI and kept current by a bot.',
        tags: ['Docker', 'k3s', 'GitOps'],
        image: gitopsThumbnail,
        imageAlt:
            'The homelab-gitops README: Docker, k3s, Portainer and Grafana badges above a diagram of the GitOps pipeline',
        imageClass: '',
        href: 'https://github.com/ssterling9928/homelab-showcase',
        action: 'read the design',
        external: true,
        metricId: 'view-homelab-showcase',
        kind: 'infrastructure',
        status: 'self-hosted',
        writeup:
            'A security-focused, self-hosted platform where every service is defined in Git. About a dozen Docker Compose stacks and a few apps on a k3s cluster live in one repository on my own Forgejo server, which mirrors every commit to GitHub. A self-hosted Forgejo Actions runner builds custom images, Renovate opens pull requests for updates, and Portainer deploys each stack from Git. Logs and metrics flow into Loki and Prometheus, with Grafana on top. The configuration stays private; the showcase explains how it is designed and why.',
        facts: [
            { label: 'config', value: 'Private repo · public design write-up' },
        ],
        stack: [
            'Docker',
            'k3s',
            'Portainer',
            'Forgejo Actions',
            'Renovate',
            'Grafana',
            'Loki',
            'Prometheus',
        ],
        links: [
            {
                label: './read-design',
                href: 'https://github.com/ssterling9928/homelab-showcase',
                external: true,
                primary: true,
                metricId: 'view-homelab-showcase',
            },
        ],
    },
    {
        file: 'DevJournal/',
        title: 'DevJournal',
        featured: false,
        description:
            'My personal dev journal, for keeping my skills sharp and my learning on track.',
        tags: ['Markdown', 'GitHub'],
        terminal: {
            title: 'DevJournal',
            lines: [
                { type: 'cmd', text: 'ls DevJournal/' },
                {
                    type: 'row',
                    key: 'Entry1',
                    text: 'Show Your Code, Even the Small Stuff',
                },
                {
                    type: 'row',
                    key: 'Entry2',
                    text: 'Reverse-Engineer Something Cool',
                },
                {
                    type: 'row',
                    key: 'Entry3',
                    text: 'Portfolio Polish Power-Up',
                },
                { type: 'row', key: 'Entry4', text: 'API Arcade!' },
                { type: 'row', key: 'Entry5', text: "Bug Hunter's Bounty" },
                {
                    type: 'row',
                    key: 'Entry7',
                    text: 'May 2026 · dashboard designs in Figma',
                },
                {
                    type: 'row',
                    key: 'Entry9',
                    text: 'Jun 2026 · dashboard backend APIs',
                },
                {
                    type: 'row',
                    key: 'Entry10',
                    text: 'Aug 2026 · new homelab hardware',
                },
            ],
        },
        href: 'https://github.com/ssterling9928/DevJournal',
        action: 'read the journal',
        external: true,
        metricId: 'view-devjournal',
        kind: 'journal',
        status: 'ongoing',
        writeup:
            "My personal dev journal, where I post about development and career building to keep my skills sharp and my learning on track. It started as a series of daily challenges, from reverse-engineering a project to building against an API and hunting bugs, and now follows my real work: the Figma designs and backend APIs behind my homelab dashboard, fixing a crash in Wizard's Quiz that Apple's review caught, and new hardware for my home lab.",
        facts: [{ label: 'entries', value: '10 so far, and counting' }],
        stack: ['Markdown', 'Git & GitHub'],
        links: [
            {
                label: './read',
                href: 'https://github.com/ssterling9928/DevJournal',
                external: true,
                primary: true,
                metricId: 'view-devjournal',
            },
        ],
    },
]
