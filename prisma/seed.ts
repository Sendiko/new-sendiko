import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Mobile Engineering Portfolio database...');

  // Clean existing data
  await prisma.projectSkill.deleteMany();
  await prisma.projectFeature.deleteMany();
  await prisma.projectAsset.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.contactMessage.deleteMany();

  // 1. Create Profile
  const profile = await prisma.profile.create({
    data: {
      name: 'Rizky Sendiko',
      headline: 'Senior Mobile Engineer | iOS, Android & Flutter Architecture Specialist',
      bio: 'Mobile Software Engineer specializing in Clean Architecture, modern declarative UI frameworks (SwiftUI, Jetpack Compose), and robust CI/CD deployment pipelines.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600',
      location: 'Bandung, Indonesia',
      yearsExperience: 5,
      appsPublished: 12,
      totalDownloads: 250000,
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      twitterUrl: 'https://x.com',
      email: 'contact@sendiko.dev',
      availableForHire: true,
    },
  });

  console.log(`Created profile for ${profile.name}`);

  // 2. Create Skill Categories and Skills
  const langCategory = await prisma.skillCategory.create({
    data: {
      name: 'Languages',
      order: 1,
      skills: {
        create: [
          { name: 'Swift', yearsOfExp: 5.0, featured: true, order: 1 },
          { name: 'Kotlin', yearsOfExp: 4.5, featured: true, order: 2 },
          { name: 'Dart', yearsOfExp: 3.5, featured: true, order: 3 },
          { name: 'TypeScript', yearsOfExp: 4.0, featured: false, order: 4 },
        ],
      },
    },
    include: { skills: true },
  });

  const frameworkCategory = await prisma.skillCategory.create({
    data: {
      name: 'Mobile Frameworks & UI',
      order: 2,
      skills: {
        create: [
          { name: 'SwiftUI', yearsOfExp: 4.0, featured: true, order: 1 },
          { name: 'Jetpack Compose', yearsOfExp: 3.5, featured: true, order: 2 },
          { name: 'Flutter', yearsOfExp: 3.5, featured: true, order: 3 },
          { name: 'React Native', yearsOfExp: 2.5, featured: false, order: 4 },
        ],
      },
    },
    include: { skills: true },
  });

  const archCategory = await prisma.skillCategory.create({
    data: {
      name: 'Architecture & State',
      order: 3,
      skills: {
        create: [
          { name: 'Clean Architecture', yearsOfExp: 5.0, featured: true, order: 1 },
          { name: 'MVVM / MVI', yearsOfExp: 5.0, featured: true, order: 2 },
          { name: 'Combine & RxSwift', yearsOfExp: 4.0, featured: false, order: 3 },
          { name: 'Kotlin Coroutines & Flow', yearsOfExp: 4.0, featured: false, order: 4 },
        ],
      },
    },
    include: { skills: true },
  });

  const devopsCategory = await prisma.skillCategory.create({
    data: {
      name: 'DevOps & Testing',
      order: 4,
      skills: {
        create: [
          { name: 'CI/CD (Fastlane & GitHub Actions)', yearsOfExp: 3.5, featured: false, order: 1 },
          { name: 'XCTest & JUnit', yearsOfExp: 4.5, featured: false, order: 2 },
          { name: 'Firebase & App Center', yearsOfExp: 4.0, featured: false, order: 3 },
        ],
      },
    },
    include: { skills: true },
  });

  // Collect skills map for project tagging
  const allSkills = [
    ...langCategory.skills,
    ...frameworkCategory.skills,
    ...archCategory.skills,
    ...devopsCategory.skills,
  ];
  const skillMap = new Map(allSkills.map((s) => [s.name, s.id]));

  // 3. Create Projects
  const bandrosApp = await prisma.project.create({
    data: {
      slug: 'bandros-field-ops',
      title: 'Bandros Field Operations App',
      tagline: 'Real-time Android field ticketing & bus capacity management tool',
      description: 'Engineered for Bandung Tour on Bus staff to manage ticket verification, live fleet occupancy, and offline-first queue syncing.',
      longDescription: 'High-speed field operations app built with Kotlin and Jetpack Compose. Features CameraX hardware acceleration for instant QR scanning and a robust offline-first Room database engine.',
      challenge: 'Field ticketing staff operated in outdoor environments with spotty cellular connectivity, causing ticket validation failures and queue bottlenecks during peak bus operations.',
      solution: 'Architected an offline-first Android app using Room DB, CameraX with hardware acceleration for sub-100ms QR scanning, and background WebSocket synchronization when back online.',
      platform: 'ANDROID',
      status: 'COMPLETED',
      featured: true,
      featuredOrder: 1,
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
      architecture: 'Clean Architecture + MVI + Kotlin Coroutines',
      downloadsCount: 50000,
      rating: 4.8,
      testCoverage: 92.5,
      githubUrl: 'https://github.com',
      playStoreUrl: 'https://play.google.com',
      features: {
        create: [
          { title: 'Sub-100ms QR Verification', description: 'Custom CameraX integration for ultra-fast ticket scanning under glare.', order: 1 },
          { title: 'Offline-First Sync', description: 'Queues transactions locally and resolves network conflicts upon reconnection.', order: 2 },
          { title: 'Live Fleet Occupancy', description: 'WebSocket integration displaying real-time passenger loads across routes.', order: 3 },
        ],
      },
      assets: {
        create: [
          { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800', caption: 'Dashboard Overview', type: 'IMAGE', order: 1 },
          { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800', caption: 'Ticket Verification Flow', type: 'IMAGE', order: 2 },
        ],
      },
    },
  });

  const wishlistApp = await prisma.project.create({
    data: {
      slug: 'priority-wishlist-manager',
      title: 'Priority Wishlist Manager',
      tagline: 'Intentional budgeting & high-precision iOS wishlist curator',
      description: 'An elegant iOS application focused on intentional shopping, financial goals tracking, and multi-currency priority management.',
      longDescription: 'Built with iOS native SwiftUI and Combine. Implements soft tonal elevation design, CoreData local persistence with CloudKit synchronization, and custom budget velocity charts.',
      challenge: 'Users faced cognitive overload from impulsive shopping apps and needed a structured tool to prioritize financial goals across Apple devices without subscription lock-ins.',
      solution: 'Designed a native iOS app with SwiftUI and Combine implementing Tonal Layering, SwiftCharts velocity analytics, and silent zero-server CloudKit synchronization.',
      platform: 'IOS',
      status: 'COMPLETED',
      featured: true,
      featuredOrder: 2,
      coverImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800',
      architecture: 'Clean Architecture + MVVM + Combine + SwiftData',
      downloadsCount: 120000,
      rating: 4.9,
      testCoverage: 94.0,
      appStoreUrl: 'https://apps.apple.com',
      githubUrl: 'https://github.com',
      features: {
        create: [
          { title: 'Tonal Priority Matrix', description: 'Visual priority categorization to curb impulse purchasing decisions.', order: 1 },
          { title: 'CloudKit Cross-Device Sync', description: 'Instant, encrypted sync between iOS, iPadOS, and macOS.', order: 2 },
          { title: 'Interactive Budget Velocity', description: 'SwiftCharts visualizations tracking monthly savings progress.', order: 3 },
        ],
      },
      assets: {
        create: [
          { url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800', caption: 'Wishlist Grid View', type: 'IMAGE', order: 1 },
        ],
      },
    },
  });

  const sigmaCourtApp = await prisma.project.create({
    data: {
      slug: 'sigma-court-management',
      title: 'Sigma Court Management System',
      tagline: 'High-contrast real-time sports facility monitoring dashboard',
      description: 'Cross-platform mobile and tablet application for arena managers to control bookings, court timers, and athlete memberships.',
      longDescription: 'High-contrast Flutter application built for high-throughput sports complex management with live court status matrix, ambient shadow elevation, and instant booking schedules.',
      challenge: 'Facility marshals managing high-volume indoor arenas required an ultra-responsive interface to track live court availability, timer countdowns, and booking conflicts on handheld tablets.',
      solution: 'Engineered a high-contrast Flutter application powered by reactive BLoC state management and Firebase Realtime Database for instant state updates.',
      platform: 'CROSS_PLATFORM',
      status: 'COMPLETED',
      featured: true,
      featuredOrder: 3,
      coverImageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800',
      architecture: 'Clean Architecture + BLoC + Firebase',
      downloadsCount: 80000,
      rating: 4.7,
      testCoverage: 90.0,
      demoUrl: 'https://demo.sigmacourt.dev',
      features: {
        create: [
          { title: 'Live Court Matrix', description: 'Real-time court availability status and active session countdown timers.', order: 1 },
          { title: 'Multi-Role Staff Access', description: 'Granular permissions for marshals, referees, and facility administrators.', order: 2 },
        ],
      },
    },
  });

  // Attach skills to projects
  const projectSkillData = [
    { projectId: bandrosApp.id, skillName: 'Kotlin' },
    { projectId: bandrosApp.id, skillName: 'Jetpack Compose' },
    { projectId: bandrosApp.id, skillName: 'Clean Architecture' },
    { projectId: bandrosApp.id, skillName: 'Kotlin Coroutines & Flow' },

    { projectId: wishlistApp.id, skillName: 'Swift' },
    { projectId: wishlistApp.id, skillName: 'SwiftUI' },
    { projectId: wishlistApp.id, skillName: 'MVVM / MVI' },
    { projectId: wishlistApp.id, skillName: 'Combine & RxSwift' },

    { projectId: sigmaCourtApp.id, skillName: 'Dart' },
    { projectId: sigmaCourtApp.id, skillName: 'Flutter' },
    { projectId: sigmaCourtApp.id, skillName: 'Clean Architecture' },
    { projectId: sigmaCourtApp.id, skillName: 'Firebase & App Center' },
  ];

  for (const item of projectSkillData) {
    const skillId = skillMap.get(item.skillName);
    if (skillId) {
      await prisma.projectSkill.create({
        data: {
          projectId: item.projectId,
          skillId: skillId,
        },
      });
    }
  }

  // 4. Create Work Experience
  await prisma.workExperience.create({
    data: {
      company: 'Tech Mobile Inc.',
      role: 'Senior Mobile Software Engineer',
      employmentType: 'FULL_TIME',
      location: 'Bandung, Indonesia',
      startDate: new Date('2023-01-01'),
      isCurrent: true,
      description: 'Lead mobile architect overseeing iOS and Android core application engineering, UI design systems, and app release pipelines.',
      achievements: JSON.stringify([
        'Architected design system for SwiftUI and Compose.',
        'Reduced app launch latency by 45% via profiling.',
        'Mentored 6 engineers in Clean Architecture and testing.',
      ]),
      order: 1,
    },
  });

  await prisma.workExperience.create({
    data: {
      company: 'AppStudio Solutions',
      role: 'Mobile Application Developer',
      employmentType: 'FULL_TIME',
      location: 'Jakarta, Indonesia',
      startDate: new Date('2021-03-01'),
      endDate: new Date('2022-12-31'),
      isCurrent: false,
      description: 'Developed native iOS (Swift) and Flutter client applications for high-volume fintech and logistics enterprise clients.',
      achievements: JSON.stringify([
        'Shipped 5 production apps to App Store & Google Play.',
        'Integrated Fastlane CI/CD pipelines cutting build cycles.',
      ]),
      order: 2,
    },
  });

  // 5. Create Education Background
  await prisma.education.create({
    data: {
      institution: 'Telkom University',
      degree: 'Software Engineering Associate',
      fieldOfStudy: 'Applied Software Engineering',
      location: 'Bandung, Indonesia',
      startDate: new Date('2017-08-01'),
      endDate: new Date('2021-06-30'),
      isCurrent: false,
      grade: 'GPA 3.71 / 4.00',
      description: 'Specialized in Mobile Computing, Algorithms, Clean Software Architecture, and Distributed Systems.',
      order: 1,
    },
  });

  console.log('Mobile Engineering Portfolio database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
