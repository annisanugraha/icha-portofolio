import prisma from '../src/lib/db';

async function verifyPhase1() {
  console.log('--- Verifying Phase 1 Data Layer ---');
  
  // 1. Check Profile statsItem fields
  const profile = await prisma.profile.findFirst({ where: { id: 'singleton' } });
  console.log('Profile statsItem1-4:', {
    statsItem1: profile?.statsItem1,
    statsItem2: profile?.statsItem2,
    statsItem3: profile?.statsItem3,
    statsItem4: profile?.statsItem4,
  });

  // 2. Check Certificate highlighted field
  const highlightedCerts = await prisma.certificate.findMany({ where: { highlighted: true } });
  console.log('Highlighted Certificates count:', highlightedCerts.length);

  // 3. Create a dummy Activity and fetch highlighted activities
  const dummyActivity = await prisma.activity.create({
    data: {
      title: 'Dummy Activity for Phase 1 Test',
      event: 'Antigravity Verification',
      year: '2026',
      highlighted: true,
      order: 1,
    }
  });
  console.log('Created dummy activity ID:', dummyActivity.id);

  const activities = await prisma.activity.findMany({ where: { highlighted: true } });
  console.log('Highlighted Activities found:', activities.map(a => a.title));

  // 4. Create a dummy Skill and fetch
  const dummySkill = await prisma.skill.create({
    data: {
      name: 'Dummy Skill - Next.js 16',
      category: 'Frontend',
      order: 1,
    }
  });
  console.log('Created dummy skill ID:', dummySkill.id);

  const skills = await prisma.skill.findMany();
  console.log('Total Skills found:', skills.length);

  // Clean up dummy rows
  await prisma.activity.delete({ where: { id: dummyActivity.id } });
  await prisma.skill.delete({ where: { id: dummySkill.id } });
  console.log('--- Phase 1 Verification SUCCESS ---');
}

verifyPhase1().catch(e => {
  console.error('Phase 1 Verification FAILED:', e);
  process.exit(1);
});
